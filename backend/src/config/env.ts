import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 10000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // AI Provider configuration
  AI_PROVIDER: (process.env.AI_PROVIDER || 'grounded_engine') as string,
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || 'gpt-4o-mini',
  AI_BASE_URL: process.env.AI_BASE_URL || '',

  // Optional Supabase PostgreSQL Configuration
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || '',

  DEFAULT_ORG_ID: 'org-apex-001',
};

export const env = ENV;
