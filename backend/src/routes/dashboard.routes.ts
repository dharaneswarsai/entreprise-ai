import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/tenant.middleware';
import { DashboardService } from '../services/dashboard.service';

export const dashboardRouter = Router();
const dashboardService = new DashboardService();

dashboardRouter.get('/dashboard/summary', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const summary = dashboardService.getSummary(orgId);
  res.json({ success: true, data: summary });
});

dashboardRouter.get('/dashboard/priorities', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const priorities = dashboardService.getPriorities(orgId);
  res.json({ success: true, data: priorities });
});
