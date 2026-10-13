import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/tenant.middleware';
import { EnterpriseRepository } from '../repositories/enterprise.repository';
import { Task } from '../types';

export const tasksRouter = Router();
const repo = EnterpriseRepository.getInstance();

tasksRouter.get('/tasks', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const { projectId, status, priority, departmentId } = req.query;

  let tasks = repo.getTasks(orgId);
  if (projectId) tasks = tasks.filter((t: Task) => t.projectId === projectId);
  if (status) tasks = tasks.filter((t: Task) => t.status === status);
  if (priority) tasks = tasks.filter((t: Task) => t.priority === priority);
  if (departmentId) tasks = tasks.filter((t: Task) => t.departmentId === departmentId);

  res.json({ success: true, count: tasks.length, data: tasks });
});

tasksRouter.get('/tasks/:id', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const task = repo.getTaskById(orgId, req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }
  res.json({ success: true, data: task });
});

tasksRouter.post('/tasks', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const { projectId, departmentId, title, description, assigneeId, priority, status, dueDate } = req.body;
  if (!title || !projectId) {
    return res.status(400).json({ success: false, error: 'Title and projectId are required' });
  }

  const created = repo.createTask({
    orgId,
    projectId,
    departmentId,
    title,
    description: description || '',
    assigneeId: assigneeId || req.user?.id,
    creatorId: req.user?.id || 'usr-1',
    status: status || 'todo',
    priority: priority || 'medium',
    dueDate: dueDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
  });

  repo.addActivity({
    orgId,
    userName: req.user?.email || 'Operations Admin',
    action: 'CREATED_TASK',
    target: created.title,
    department: 'Operations',
  });

  res.status(201).json({ success: true, data: created });
});

tasksRouter.patch('/tasks/:id', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const updated = repo.updateTask(orgId, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Task not found' });
  }

  if (req.body.status) {
    repo.addActivity({
      orgId,
      userName: req.user?.email || 'Operations User',
      action: 'UPDATED_TASK_STATUS',
      target: `${updated.title} -> ${req.body.status}`,
      department: 'Operations',
    });
  }

  res.json({ success: true, data: updated });
});
