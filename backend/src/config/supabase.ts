import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Checks whether valid Supabase configuration is present in environment variables.
 */
export function isSupabaseConfigured(): boolean {
  const url = env.SUPABASE_URL?.trim();
  const key = (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY)?.trim();

  if (!url || !key) return false;
  if (url.includes('your-project.supabase.co') || key.includes('your-supabase-')) return false;

  return true;
}

/**
 * Returns the singleton Supabase client instance, or null if not configured.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseInstance) {
    const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim() || env.SUPABASE_ANON_KEY?.trim() || '';
    supabaseInstance = createClient(env.SUPABASE_URL.trim(), key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return supabaseInstance;
}

export interface SupabaseHealthResult {
  configured: boolean;
  connected: boolean;
  url: string;
  message: string;
  latencyMs?: number;
  tableCounts?: Record<string, number>;
}

/**
 * Tests connection to the configured Supabase database.
 */
export async function testSupabaseConnection(): Promise<SupabaseHealthResult> {
  const configured = isSupabaseConfigured();
  const url = env.SUPABASE_URL || '';

  if (!configured) {
    return {
      configured: false,
      connected: false,
      url,
      message: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      configured: true,
      connected: false,
      url,
      message: 'Could not initialize Supabase client.',
    };
  }

  const startTime = Date.now();
  try {
    // Try pinging organizations table
    const { data, count, error } = await client
      .from('organizations')
      .select('id, name', { count: 'exact' })
      .limit(5);

    const latencyMs = Date.now() - startTime;

    if (error) {
      // If table doesn't exist yet, it is reachable but schema is uninitialized
      if (error.code === '42P01') {
        return {
          configured: true,
          connected: true,
          url,
          latencyMs,
          message: 'Connected to Supabase! Note: Database schema tables have not been created yet. Run backend/src/config/schema.sql in Supabase SQL editor.',
        };
      }
      return {
        configured: true,
        connected: false,
        url,
        latencyMs,
        message: `Supabase query error: ${error.message} (Code: ${error.code})`,
      };
    }

    // Attempt to gather table counts
    const tableCounts: Record<string, number> = {
      organizations: count || (data ? data.length : 0),
    };

    // Quick checks on other tables if possible
    try {
      const { count: projCount } = await client.from('projects').select('*', { count: 'exact', head: true });
      if (typeof projCount === 'number') tableCounts.projects = projCount;

      const { count: taskCount } = await client.from('tasks').select('*', { count: 'exact', head: true });
      if (typeof taskCount === 'number') tableCounts.tasks = taskCount;

      const { count: apprCount } = await client.from('approvals').select('*', { count: 'exact', head: true });
      if (typeof apprCount === 'number') tableCounts.approvals = apprCount;

      const { count: wfCount } = await client.from('workflows').select('*', { count: 'exact', head: true });
      if (typeof wfCount === 'number') tableCounts.workflows = wfCount;
    } catch (e) {
      // optional counts
    }

    return {
      configured: true,
      connected: true,
      url,
      latencyMs,
      message: 'Connected successfully to Supabase PostgreSQL database!',
      tableCounts,
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      url,
      latencyMs: Date.now() - startTime,
      message: `Failed to connect to Supabase: ${err.message || String(err)}`,
    };
  }
}
