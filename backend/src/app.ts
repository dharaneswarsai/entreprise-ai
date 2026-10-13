import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { tenantMiddleware } from './middleware/tenant.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';

import { healthRouter } from './routes/health.routes';
import { dashboardRouter } from './routes/dashboard.routes';
import { projectsRouter } from './routes/projects.routes';
import { tasksRouter } from './routes/tasks.routes';
import { approvalsRouter } from './routes/approvals.routes';
import { workflowsRouter } from './routes/workflows.routes';
import { insightsRouter } from './routes/insights.routes';
import { aiRouter } from './routes/ai.routes';
import { notificationsRouter, activityRouter } from './routes/notifications.routes';
import { organizationsRouter } from './routes/organizations.routes';
import { supabaseRouter } from './routes/supabase.routes';

export function createApp(): Express {
  const app = express();

  // CORS Configuration
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    env.FRONTEND_URL,
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman) or matching allowed origins
        if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
          return callback(null, true);
        }
        return callback(null, true); // Permissive fallback for preview deployments
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-org-id'],
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Root Health & API Health
  app.use('/api', healthRouter);
  app.use('/api', organizationsRouter);
  app.use('/api', supabaseRouter);

  // Authenticated & Tenant-isolated Operations API
  app.use('/api', tenantMiddleware, authMiddleware, dashboardRouter);
  app.use('/api', tenantMiddleware, authMiddleware, projectsRouter);
  app.use('/api', tenantMiddleware, authMiddleware, tasksRouter);
  app.use('/api', tenantMiddleware, authMiddleware, approvalsRouter);
  app.use('/api', tenantMiddleware, authMiddleware, workflowsRouter);
  app.use('/api', tenantMiddleware, authMiddleware, insightsRouter);
  app.use('/api', tenantMiddleware, authMiddleware, aiRouter);
  app.use('/api', tenantMiddleware, authMiddleware, notificationsRouter);
  app.use('/api', tenantMiddleware, authMiddleware, activityRouter);

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
