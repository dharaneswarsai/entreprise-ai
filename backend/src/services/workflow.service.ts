import { EnterpriseRepository } from '../repositories/enterprise.repository';
import { WorkflowDefinition, WorkflowRun } from '../types';

export class WorkflowService {
  private repo = EnterpriseRepository.getInstance();

  public getWorkflows(orgId: string): WorkflowDefinition[] {
    return this.repo.getWorkflows(orgId);
  }

  public getRuns(orgId: string, workflowId?: string): WorkflowRun[] {
    return this.repo.getWorkflowRuns(orgId, workflowId);
  }

  public createWorkflow(orgId: string, data: Omit<WorkflowDefinition, 'id' | 'orgId' | 'executionCount' | 'lastRunAt' | 'createdAt'>): WorkflowDefinition {
    const wf: WorkflowDefinition = {
      ...data,
      id: `wf-${Date.now()}`,
      orgId,
      executionCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.repo.workflows.push(wf);
    return wf;
  }

  public toggleWorkflow(orgId: string, workflowId: string, isActive: boolean): WorkflowDefinition | undefined {
    const wf = this.repo.workflows.find(w => w.orgId === orgId && w.id === workflowId);
    if (wf) {
      wf.isActive = isActive;
    }
    return wf;
  }

  /**
   * Execute a workflow manually or event-driven with full execution record and action side effects
   */
  public async executeWorkflow(
    orgId: string,
    workflowId: string,
    eventPayload: { triggeringEvent?: string; taskId?: string; projectId?: string; approvalId?: string } = {}
  ): Promise<WorkflowRun> {
    const wf = this.repo.getWorkflowById(orgId, workflowId);
    if (!wf) {
      throw new Error(`Workflow with ID ${workflowId} not found`);
    }

    const run = this.repo.createWorkflowRun({
      orgId,
      workflowId,
      triggeringEvent: eventPayload.triggeringEvent || `manual_execution:${workflowId}`,
      status: 'running',
      actionsAttempted: wf.actions.length,
      actionsCompleted: 0,
      details: { ...eventPayload },
    });

    let completedCount = 0;
    const executionDetails: Record<string, any> = { ...eventPayload };

    try {
      for (const action of wf.actions) {
        if (action.type === 'escalate_task') {
          // Find target task (from payload or first overdue task)
          const targetTask = eventPayload.taskId
            ? this.repo.getTaskById(orgId, eventPayload.taskId)
            : this.repo.tasks.find(t => t.orgId === orgId && (t.isOverdue || t.priority === 'urgent'));

          if (targetTask) {
            targetTask.escalationLevel = (targetTask.escalationLevel || 0) + (action.config?.incrementLevel || 1);
            targetTask.priority = 'urgent';
            targetTask.updatedAt = new Date().toISOString();
            executionDetails['taskEscalated'] = {
              id: targetTask.id,
              title: targetTask.title,
              newEscalationLevel: targetTask.escalationLevel,
            };
            completedCount++;
          }
        } else if (action.type === 'send_notification') {
          this.repo.addNotification({
            orgId,
            userId: action.config?.recipientId || 'usr-1',
            title: `Workflow Action: ${wf.name}`,
            message: action.config?.message || `Automated workflow execution for ${wf.name}`,
            type: 'urgent',
            entityType: 'workflow',
            entityId: wf.id,
            isRead: false,
          });
          executionDetails['notificationSent'] = true;
          completedCount++;
        } else if (action.type === 'record_activity') {
          this.repo.addActivity({
            orgId,
            userName: 'Workflow Engine',
            action: action.config?.actionName || 'AUTOMATED_EXECUTION',
            target: `Workflow "${wf.name}" triggered successfully`,
            department: 'Operations',
          });
          executionDetails['activityLogged'] = true;
          completedCount++;
        } else if (action.type === 'change_project_status') {
          const targetProject = eventPayload.projectId
            ? this.repo.getProjectById(orgId, eventPayload.projectId)
            : this.repo.projects.find(p => p.orgId === orgId && p.status === 'active');
          if (targetProject && action.config?.targetStatus) {
            targetProject.status = action.config.targetStatus;
            targetProject.updatedAt = new Date().toISOString();
            executionDetails['projectUpdated'] = { id: targetProject.id, status: targetProject.status };
            completedCount++;
          }
        } else {
          completedCount++;
        }
      }

      run.status = 'completed';
      run.actionsCompleted = completedCount;
      run.completedAt = new Date().toISOString();
      run.details = executionDetails;

      // Update workflow metadata
      wf.executionCount += 1;
      wf.lastRunAt = run.completedAt;
    } catch (err: any) {
      run.status = 'failed';
      run.completedAt = new Date().toISOString();
      run.details = { ...executionDetails, error: err.message };
    }

    return run;
  }
}
