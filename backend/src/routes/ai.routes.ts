import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/tenant.middleware';
import { AIService } from '../services/ai.service';

export const aiRouter = Router();
const aiService = new AIService();

aiRouter.post('/ai/chat', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const orgId = req.orgId || 'org-apex-001';
    const userId = req.user?.id || 'usr-1';
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'A valid "message" string is required' });
    }

    const response = await aiService.handleChat(orgId, message, userId);
    res.json({ success: true, data: response });
  } catch (err) {
    next(err);
  }
});

aiRouter.post('/ai/tools/:name', (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const orgId = req.orgId || 'org-apex-001';
    const result = aiService.executeTool(orgId, req.params.name, req.body || {});
    res.json({ success: true, tool: req.params.name, data: result });
  } catch (err) {
    next(err);
  }
});

// Human-in-the-loop action approval execution
aiRouter.post('/ai/execute-action', async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const orgId = req.orgId || 'org-apex-001';
    const userId = req.user?.id || 'usr-1';
    const { action } = req.body;

    if (!action || !action.actionType) {
      return res.status(400).json({ success: false, error: 'Valid proposed action object is required' });
    }

    const result = await aiService.executeProposedAction(orgId, action, userId);
    res.json({ success: true, message: 'Action authorized and executed successfully', data: result });
  } catch (err) {
    next(err);
  }
});
