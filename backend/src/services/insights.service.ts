import { EnterpriseRepository } from '../repositories/enterprise.repository';
import { OperationalInsight } from '../types';

export class InsightsService {
  private repo = EnterpriseRepository.getInstance();

  public getInsights(orgId: string): OperationalInsight[] {
    this.refreshDynamicInsights(orgId);
    return this.repo.getInsights(orgId);
  }

  public updateStatus(orgId: string, id: string, status: 'acknowledged' | 'resolved'): OperationalInsight | undefined {
    const updated = this.repo.updateInsightStatus(orgId, id, status);
    if (updated) {
      this.repo.addActivity({
        orgId,
        userName: 'Operations Lead',
        action: status === 'resolved' ? 'RESOLVED_INSIGHT' : 'ACKNOWLEDGED_INSIGHT',
        target: `Insight: ${updated.title}`,
        department: 'Operations',
      });
    }
    return updated;
  }

  private refreshDynamicInsights(orgId: string): void {
    const projects = this.repo.getProjects(orgId);
    const tasks = this.repo.getTasks(orgId);
    const approvals = this.repo.getApprovals(orgId);

    // 1. Check for approaching projects with overdue tasks
    const atRiskProjects = projects.filter(p => p.status === 'at_risk');
    atRiskProjects.forEach(proj => {
      const projTasks = tasks.filter(t => t.projectId === proj.id && t.isOverdue);
      if (projTasks.length > 0) {
        const existing = this.repo.operationalInsights.find(i => i.orgId === orgId && i.title.includes(proj.name));
        if (!existing) {
          this.repo.operationalInsights.push({
            id: `ins-proj-${proj.id}`,
            orgId,
            title: `Deadline Vulnerability: ${proj.name}`,
            severity: 'critical',
            description: `Project is scheduled for delivery on ${proj.dueDate} with ${projTasks.length} overdue blocking tasks.`,
            evidence: projTasks.map(t => `Task "${t.title}" is overdue (Priority: ${t.priority.toUpperCase()})`),
            recommendedAction: 'Reallocate available operations engineers and review unresolved dependencies.',
            suggestedOwner: 'Project Owner',
            status: 'new',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    });

    // 2. Check for stagnant approvals > 24 hours
    const staleApprovals = approvals.filter(a => a.status === 'pending');
    staleApprovals.forEach(appr => {
      const hoursPending = (Date.now() - new Date(appr.submittedAt).getTime()) / (1000 * 60 * 60);
      if (hoursPending > 24) {
        const existing = this.repo.operationalInsights.find(i => i.orgId === orgId && i.title.includes(appr.title));
        if (!existing) {
          this.repo.operationalInsights.push({
            id: `ins-appr-${appr.id}`,
            orgId,
            title: `Approval Bottleneck: ${appr.title}`,
            severity: 'high',
            description: `Approval request has been pending for over ${Math.floor(hoursPending)} hours, blocking downstream deliverables.`,
            evidence: [`Submitted on ${appr.submittedAt}`, `Category: ${appr.category}`],
            recommendedAction: 'Expedite executive sign-off or assign an authorized deputy.',
            suggestedOwner: 'Designated Approver',
            status: 'new',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    });
  }
}
