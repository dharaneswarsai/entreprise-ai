import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './tenant.middleware';
import { EnterpriseRepository } from '../repositories/enterprise.repository';

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const repo = EnterpriseRepository.getInstance();
  const orgProfiles = req.orgId ? repo.getProfiles(req.orgId) : [];
  const owner = orgProfiles.find(p => p.role === 'owner') || orgProfiles[0];

  req.user = owner
    ? { id: owner.id, email: owner.email, role: owner.role }
    : { id: 'usr-1', email: 'dharaneswar@entreprise.ai', role: 'owner' };

  next();
}

export function roleGuard(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Insufficient role permissions for this operation',
      });
    }
    next();
  };
}
