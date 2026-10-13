import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/tenant.middleware';
import { WorkflowService } from '../services/workflow.service';

export const workflowsRouter = Router();
const workflowService = new WorkflowService();

workflowsRouter.get('/workflows', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const workflows = workflowService.getWorkflows(orgId);
  res.json({ success: true, count: workflows.length, data: workflows });
});

workflowsRouter.post('/workflows', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const { name, description, triggerType, triggerConfig, conditions, actions } = req.body;
  if (!name || !triggerType) {
    return res.status(400).json({ success: false, error: 'Name and triggerType are required' });
  }

  const created = workflowService.createWorkflow(orgId, {
    name,
    description: description || '',
    isActive: true,
    triggerType,
    triggerConfig: triggerConfig || {},
    conditions: conditions || [],
    actions: actions || [],
  });

  res.status(201).json({ success: true, data: created });
});

workflowsRouter.patch('/workflows/:id/toggle', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const { isActive } = req.body;
  const updated = workflowService.toggleWorkflow(orgId, req.params.id, Boolean(isActive));
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Workflow not found' });
  }
  res.json({ success: true, data: updated });
});

// Live Hackathon execution trigger
workflowsRouter.post('/workflows/:id/trigger', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const orgId = req.orgId || 'org-apex-001';
    const run = await workflowService.executeWorkflow(orgId, req.params.id, req.body || {});
    res.json({ success: true, message: 'Workflow executed successfully', data: run });
  } catch (err) {
    next(err);
  }
});

workflowsRouter.get('/workflows/runs', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const runs = workflowService.getRuns(orgId);
  res.json({ success: true, count: runs.length, data: runs });
});

workflowsRouter.get('/workflows/:id/runs', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const runs = workflowService.getRuns(orgId, req.params.id);
  res.json({ success: true, count: runs.length, data: runs });
});
