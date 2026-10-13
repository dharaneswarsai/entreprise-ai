import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { isSupabaseConfigured, testSupabaseConnection, getSupabaseClient } from '../config/supabase';
import { EnterpriseRepository } from '../repositories/enterprise.repository';

export const supabaseRouter = Router();
const repo = EnterpriseRepository.getInstance();

/**
 * GET /api/supabase/status
 * Returns health, configuration, latency, and table counts
 */
supabaseRouter.get('/supabase/status', async (_req: Request, res: Response) => {
  try {
    const health = await testSupabaseConnection();
    res.json({
      success: true,
      data: {
        ...health,
        memoryCachedRecords: {
          organizations: repo.organizations.length,
          projects: repo.projects.length,
          tasks: repo.tasks.length,
          approvals: repo.approvals.length,
          workflows: repo.workflows.length,
          insights: repo.operationalInsights.length,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to check Supabase status',
    });
  }
});

/**
 * POST /api/supabase/test
 * Triggers an immediate connection ping test against Supabase
 */
supabaseRouter.post('/supabase/test', async (_req: Request, res: Response) => {
  try {
    const health = await testSupabaseConnection();
    res.json({
      success: health.connected,
      data: health,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Supabase test execution failed',
    });
  }
});

/**
 * POST /api/supabase/seed
 * Programmatically seeds the 4 enterprise businesses into connected Supabase database
 */
supabaseRouter.post('/supabase/seed', async (_req: Request, res: Response) => {
  if (!isSupabaseConfigured()) {
    return res.status(400).json({
      success: false,
      error: 'Cannot seed database: Supabase credentials are not configured in backend/.env.',
    });
  }

  try {
    const result = await repo.seedSupabase();
    res.json({
      success: true,
      message: 'Successfully seeded 4 enterprise businesses into Supabase database!',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to seed Supabase database',
    });
  }
});

/**
 * POST /api/supabase/clean-reset
 * Completely empties existing tables and seeds the pristine 4 businesses
 */
supabaseRouter.post('/supabase/clean-reset', async (_req: Request, res: Response) => {
  if (!isSupabaseConfigured()) {
    return res.status(400).json({
      success: false,
      error: 'Supabase credentials are not configured in backend/.env.',
    });
  }

  try {
    const result = await repo.resetAndSeedDatabase();
    res.json({
      success: true,
      message: 'Clean reset successful! Emptied old records and provisioned the 4 enterprise businesses.',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to reset and seed Supabase database',
    });
  }
});

/**
 * GET /api/supabase/schema
 * Returns the raw SQL schema so users can view or copy it directly
 */
supabaseRouter.get('/supabase/schema', (_req: Request, res: Response) => {
  try {
    const schemaPath = path.join(__dirname, '../config/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf-8');
      return res.json({ success: true, schemaSql: sql });
    }
    res.status(404).json({ success: false, error: 'schema.sql not found' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Could not read schema.sql' });
  }
});
