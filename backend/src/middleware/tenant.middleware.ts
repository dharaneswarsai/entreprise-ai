import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  orgId?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function tenantMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Extract tenant ID from header or query, fallback to primary demo organization
  const headerOrgId = req.headers['x-org-id'] as string;
  req.orgId = headerOrgId || 'org-apex-001';
  next();
}
