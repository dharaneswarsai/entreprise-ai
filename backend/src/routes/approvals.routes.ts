import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/tenant.middleware';
import { EnterpriseRepository } from '../repositories/enterprise.repository';

export const approvalsRouter = Router();
const repo = EnterpriseRepository.getInstance();

approvalsRouter.get('/approvals', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const approvals = repo.getApprovals(orgId);
  res.json({ success: true, count: approvals.length, data: approvals });
});

approvalsRouter.post('/approvals', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const { title, description, category, relatedProjectId, relatedTaskId, approverId } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, error: 'Approval title is required' });
  }

  const created = repo.createApproval({
    orgId,
    title,
    description: description || '',
    category: category || 'operational',
    requesterId: req.user?.id || 'usr-1',
    approverId: approverId || 'usr-1',
    relatedProjectId,
    relatedTaskId,
  });

  repo.addActivity({
    orgId,
    userName: req.user?.email || 'Operations User',
    action: 'REQUESTED_APPROVAL',
    target: created.title,
    department: 'Operations',
  });

  repo.addNotification({
    orgId,
    userId: created.approverId || 'usr-1',
    title: 'New Approval Request',
    message: `${created.title} submitted for your review.`,
    type: 'warning',
    entityType: 'approval',
    entityId: created.id,
    isRead: false,
  });

  res.status(201).json({ success: true, data: created });
});

approvalsRouter.post('/approvals/:id/decision', (req: AuthenticatedRequest, res: Response) => {
  const orgId = req.orgId || 'org-apex-001';
  const { decision, notes } = req.body;
  if (!decision || (decision !== 'approved' && decision !== 'rejected')) {
    return res.status(400).json({ success: false, error: 'Valid decision ("approved" or "rejected") is required' });
  }

  const updated = repo.decideApproval(orgId, req.params.id, decision, notes);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Approval request not found' });
  }

  repo.addActivity({
    orgId,
    userName: req.user?.email || 'Authorized Executive',
    action: decision === 'approved' ? 'APPROVED' : 'REJECTED',
    target: `Approval: ${updated.title}`,
    department: 'Operations',
  });

  repo.addNotification({
    orgId,
    userId: updated.requesterId || 'usr-1',
    title: `Approval ${decision === 'approved' ? 'Granted' : 'Declined'}`,
    message: `${updated.title} was ${decision} by executive decision.`,
    type: decision === 'approved' ? 'success' : 'urgent',
    entityType: 'approval',
    entityId: updated.id,
    isRead: false,
  });

  res.json({ success: true, data: updated });
});
