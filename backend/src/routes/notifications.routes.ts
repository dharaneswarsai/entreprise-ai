import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/tenant.middleware';
import { EnterpriseRepository } from '../repositories/enterprise.repository';

export const notificationsRouter = Router();
export const activityRouter = Router();
const repo = EnterpriseRepository.getInstance();

notificationsRouter.get('/notifications', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const userId = req.user?.id || 'usr-1';
  const notifications = repo.getNotifications(orgId, userId);
  res.json({ success: true, count: notifications.length, data: notifications });
});

notificationsRouter.patch('/notifications/:id/read', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const updated = repo.markNotificationAsRead(orgId, req.params.id);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Notification not found' });
  }
  res.json({ success: true, data: updated });
});

activityRouter.get('/activity', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const activity = repo.getActivity(orgId);
  res.json({ success: true, count: activity.length, data: activity });
});
