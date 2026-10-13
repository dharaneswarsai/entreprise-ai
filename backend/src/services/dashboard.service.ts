import { EnterpriseRepository } from '../repositories/enterprise.repository';

export class DashboardService {
  private repo = EnterpriseRepository.getInstance();

  public getSummary(orgId: string) {
    const projects = this.repo.getProjects(orgId);
    const tasks = this.repo.getTasks(orgId);
    const approvals = this.repo.getApprovals(orgId);
    const workflowRuns = this.repo.getWorkflowRuns(orgId);
    const insights = this.repo.getInsights(orgId);

    const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'at_risk');
    const projectsAtRisk = projects.filter(p => p.status === 'at_risk');
    const openTasks = tasks.filter(t => t.status !== 'done');
    const overdueTasks = tasks.filter(t => t.isOverdue || (t.status !== 'done' && new Date(t.dueDate) < new Date()));
    const completedTasks = tasks.filter(t => t.status === 'done');
    const pendingApprovals = approvals.filter(a => a.status === 'pending');
    const activeInsights = insights.filter(i => i.status !== 'resolved');

    // Department breakdown
    const departmentBreakdown = this.repo.getDepartments(orgId).map(dept => {
      const deptTasks = tasks.filter(t => t.departmentId === dept.id);
      const deptOverdue = deptTasks.filter(t => t.isOverdue || (t.status !== 'done' && new Date(t.dueDate) < new Date())).length;
      return {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        color: dept.color,
        totalTasks: deptTasks.length,
        openTasks: deptTasks.filter(t => t.status !== 'done').length,
        overdueTasks: deptOverdue,
      };
    });

    // Team Workload Distribution
    const workloadDistribution = this.repo.getProfiles(orgId).map(profile => {
      const assigned = tasks.filter(t => t.assigneeId === profile.id && t.status !== 'done');
      return {
        profileId: profile.id,
        fullName: profile.fullName,
        role: profile.role,
        taskCount: assigned.length,
        urgentCount: assigned.filter(t => t.priority === 'urgent' || t.priority === 'high').length,
      };
    });

    return {
      metrics: {
        totalActiveProjects: activeProjects.length,
        projectsAtRisk: projectsAtRisk.length,
        openTasks: openTasks.length,
        overdueTasks: overdueTasks.length,
        completedTasks: completedTasks.length,
        pendingApprovals: pendingApprovals.length,
        activeInsights: activeInsights.length,
        workflowRunsCount: workflowRuns.length,
      },
      departmentBreakdown,
      workloadDistribution,
    };
  }

  public getPriorities(orgId: string) {
    const tasks = this.repo.getTasks(orgId);
    const approvals = this.repo.getApprovals(orgId);
    const projects = this.repo.getProjects(orgId);

    const urgentItems: Array<{
      id: string;
      title: string;
      type: 'task' | 'approval' | 'project';
      urgencyReason: string;
      dueDate?: string;
      owner?: string;
    }> = [];

    // Overdue or urgent tasks
    tasks
      .filter(t => (t.isOverdue || t.priority === 'urgent') && t.status !== 'done')
      .forEach(t => {
        urgentItems.push({
          id: t.id,
          title: t.title,
          type: 'task',
          urgencyReason: t.isOverdue
            ? `Task is OVERDUE (Escalation level ${t.escalationLevel})`
            : `Priority is ${t.priority.toUpperCase()}`,
          dueDate: t.dueDate,
        });
      });

    // Pending approvals
    approvals
      .filter(a => a.status === 'pending')
      .forEach(a => {
        urgentItems.push({
          id: a.id,
          title: a.title,
          type: 'approval',
          urgencyReason: `Pending executive sign-off (${a.category.toUpperCase()})`,
          dueDate: a.submittedAt,
        });
      });

    // At risk projects
    projects
      .filter(p => p.status === 'at_risk')
      .forEach(p => {
        urgentItems.push({
          id: p.id,
          title: p.name,
          type: 'project',
          urgencyReason: `Approaching deadline (${p.dueDate}) with uncompleted deliverables`,
          dueDate: p.dueDate,
        });
      });

    return urgentItems;
  }
}
