import { Router, Request, Response } from 'express';
import { isSupabaseConfigured } from '../config/supabase';

export const healthRouter = Router();

healthRouter.get('/health', (req: Request, res: Response) => {
  const supabaseConfigured = isSupabaseConfigured();

  res.status(200).json({
    status: 'healthy',
    service: 'Entreprise AI Backend Operations Engine',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: {
      type: supabaseConfigured ? 'supabase_postgresql' : 'in_memory_engine',
      configured: supabaseConfigured,
      mode: supabaseConfigured ? 'live_persistence' : 'demo_cache',
    },
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});
