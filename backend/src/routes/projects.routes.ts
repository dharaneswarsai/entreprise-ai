import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/tenant.middleware';
import { EnterpriseRepository } from '../repositories/enterprise.repository';

export const projectsRouter = Router();
const repo = EnterpriseRepository.getInstance();

projectsRouter.get('/projects', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const projects = repo.getProjects(orgId);
  res.json({ success: true, count: projects.length, data: projects });
});

projectsRouter.get('/projects/:id', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const project = repo.getProjectById(orgId, req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }
  res.json({ success: true, data: project });
});

projectsRouter.post('/projects', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const { name, description, departmentId, status, priority, progress, startDate, dueDate, budget } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Project name is required' });
  }
  const created = repo.createProject({
    orgId,
    name,
    description: description || '',
    departmentId,
    ownerId: req.user?.id || 'usr-1',
    status: status || 'active',
    priority: priority || 'medium',
    progress: progress || 0,
    startDate,
    dueDate,
    budget: budget || 0,
  });

  repo.addActivity({
    orgId,
    userName: req.user?.email || 'Admin',
    action: 'CREATED_PROJECT',
    target: created.name,
    department: 'Operations',
  });

  res.status(201).json({ success: true, data: created });
});

projectsRouter.patch('/projects/:id', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const updated = repo.updateProject(orgId, req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }
  res.json({ success: true, data: updated });
});
