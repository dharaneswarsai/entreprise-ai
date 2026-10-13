import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/tenant.middleware';
import { InsightsService } from '../services/insights.service';

export const insightsRouter = Router();
const insightsService = new InsightsService();

insightsRouter.get('/ai/insights', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const insights = insightsService.getInsights(orgId);
  res.json({ success: true, count: insights.length, data: insights });
});

insightsRouter.post('/ai/insights/:id/status', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const { status } = req.body;
  if (!status || (status !== 'acknowledged' && status !== 'resolved')) {
    return res.status(400).json({ success: false, error: 'Status must be "acknowledged" or "resolved"' });
  }

  const updated = insightsService.updateStatus(orgId, req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Insight not found' });
  }

  res.json({ success: true, data: updated });
});
