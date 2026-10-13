import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Checks whether valid Supabase configuration is present in frontend environment variables.
 */
export function isFrontendSupabaseConfigured(): boolean {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return false;
  if (SUPABASE_URL.includes('your-project.supabase.co') || SUPABASE_ANON_KEY.includes('your-supabase-')) return false;
  return true;
}

let clientInstance: SupabaseClient | null = null;

/**
 * Returns the Supabase browser client singleton or null if not configured.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isFrontendSupabaseConfigured()) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createClient(SUPABASE_URL.trim(), SUPABASE_ANON_KEY.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return clientInstance;
}

export const supabase = getSupabaseBrowserClient();

/**
 * Tests direct browser connection to Supabase database.
 */
export async function testFrontendSupabase(): Promise<{
  connected: boolean;
  latencyMs?: number;
  message: string;
}> {
  if (!isFrontendSupabaseConfigured()) {
    return {
      connected: false,
      message: 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY not set in frontend/.env',
    };
  }

  const client = getSupabaseBrowserClient();
  if (!client) {
    return {
      connected: false,
      message: 'Failed to initialize Supabase browser client',
    };
  }

  const start = Date.now();
  try {
    const { error } = await client.from('organizations').select('id', { count: 'exact', head: true });
    const latencyMs = Date.now() - start;

    if (error) {
      if (error.code === '42P01') {
        return {
          connected: true,
          latencyMs,
          message: 'Connected to Supabase! (Tables pending: run schema.sql in Supabase SQL editor)',
        };
      }
      return {
        connected: false,
        latencyMs,
        message: error.message,
      };
    }

    return {
      connected: true,
      latencyMs,
      message: 'Connected to Supabase from frontend client!',
    };
  } catch (err: any) {
    return {
      connected: false,
      latencyMs: Date.now() - start,
      message: err.message || 'Browser network connection error',
    };
  }
}

/**
 * Subscribes to real-time changes on a specific Supabase table.
 */
export function subscribeToSupabaseTable(
  tableName: string,
  onEvent: (payload: any) => void
): RealtimeChannel | null {
  const client = getSupabaseBrowserClient();
  if (!client) return null;

  return client
    .channel(`public:${tableName}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, onEvent)
    .subscribe();
}
