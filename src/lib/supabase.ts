import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// Standard singleton (public data)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client Factory for Authenticated Requests (Submitting JWT)
// Using a cache to avoid multiple client instances for the same token
const authenticatedClientCache: Record<string, any> = {};

export const getSupabase = (token?: string | null) => {
  if (!token) return supabase;
  
  if (authenticatedClientCache[token]) {
    return authenticatedClientCache[token];
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    auth: {
      persistSession: false, // Prevents "Multiple GoTrueClient instances" warning
      autoRefreshToken: false
    }
  });

  authenticatedClientCache[token] = client;
  return client;
};

// Administrative Client (Bypass RLS)
// This is only available on the server. Do NOT import this in client components.
export const supabaseAdmin = 
  typeof window === 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    : null;
