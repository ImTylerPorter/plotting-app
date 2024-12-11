// src/hooks.server.ts
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { setupRealtimeStream } from '$lib/realtime'; // Ensure this path is correct

// Handle Server Errors
export const handleError: HandleServerError = ({ error }) => {
  console.error('Server Error:', error);
};

// Supabase Handle
const supabaseHandle: Handle = async ({ event, resolve }) => {
  // Initialize Supabase client with server-side credentials
  event.locals.supabase = createSupabaseServerClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: SUPABASE_SERVICE_ROLE_KEY, // Use service role key server-side
    event // Crucial: Pass the event object here
  });

  // Initialize real-time subscriptions
  setupRealtimeStream(event.locals.supabase);

  // Safe session retrieval using auth helpers
  event.locals.safeGetSession = async () => {
    const { data: { session }, error } = await event.locals.supabase.auth.getSession();

    if (error) {
      console.error('Error retrieving session:', error);
      return { session: null, user: null };
    }

    if (!session) {
      return { session: null, user: null };
    }

    const { data: { user }, error: userError } = await event.locals.supabase.auth.getUser();

    if (userError) {
      console.error('Error retrieving user:', userError);
      return { session: null, user: null };
    }

    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      // Pass through necessary Supabase headers
      return name === 'content-range' || name === 'x-supabase-api-version';
    },
  });
};

// Authentication Guard Handle
const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;

  // Define protected routes
  const protectedRoutes = ['/account', '/dashboard', '/edit'];

  // Redirect unauthenticated users to /auth for protected routes
  if (!session && protectedRoutes.some((route) => event.url.pathname.startsWith(route))) {
    throw redirect(303, '/auth');
  }

  // Redirect authenticated users away from auth pages
  if (session && event.url.pathname.startsWith('/auth')) {
    throw redirect(303, '/');
  }

  return resolve(event);
};

// Export the sequence of handles
export const handle: Handle = sequence(supabaseHandle, authGuard);
