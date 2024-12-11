// src/routes/api/realtime/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { getPubSub } from '$lib/realtime';

export const GET: RequestHandler = async ({ locals }) => {
  // Ensure the Supabase client is initialized
  if (!locals.supabase) {
    return new Response('Supabase client not initialized', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  const pubsub = getPubSub();

  let controller: ReadableStreamDefaultController<string> | null = null;

  // Create a new ReadableStream for this connection
  const stream = new ReadableStream<string>({
    start(c) {
      controller = c;
      pubsub.subscribe(controller);
    },
    cancel() {
      if (controller) {
        pubsub.unsubscribe(controller);
        controller = null;
      }
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
};
