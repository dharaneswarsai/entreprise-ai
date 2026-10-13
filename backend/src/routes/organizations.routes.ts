import { Router, Request, Response } from 'express';
import { EnterpriseRepository } from '../repositories/enterprise.repository';

export const organizationsRouter = Router();
const repo = EnterpriseRepository.getInstance();

organizationsRouter.get('/organizations', (req: Request, res: Response) => {
  const orgs = repo.getOrganizations();
  const orgsWithProfiles = orgs.map(org => ({
    ...org,
    departments: repo.getDepartments(org.id),
    employees: repo.getProfiles(org.id),
  }));

  res.json({ success: true, count: orgs.length, data: orgsWithProfiles });
});

organizationsRouter.post('/organizations', async (req: Request, res: Response) => {
  try {
    const { name, slug, plan, industry, color, admin } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Organization name is required' });
    }

    const adminName = admin?.fullName?.trim() || 'Admin User';
    const adminEmail = admin?.email?.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@enterprise.local`;

    const result = await repo.createOrganization({
      name: name.trim(),
      slug,
      plan: plan || 'Enterprise Tier',
      industry: industry || 'Enterprise Operations',
      color: color || '#0F4C3A',
      admin: {
        fullName: adminName,
        email: adminEmail,
        role: admin?.role || 'owner',
        departmentName: admin?.departmentName || 'Operations & Leadership',
        title: admin?.title || 'Organization Owner',
      },
    });

    res.status(201).json({
      success: true,
      message: `Organization "${result.organization.name}" provisioned successfully`,
      data: {
        organization: result.organization,
        department: result.department,
        profile: result.profile,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to create organization',
    });
  }
});
