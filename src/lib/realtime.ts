// src/lib/realtime.ts
import type { BiodegradationSample } from './types';
import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

// Simple PubSub class to manage subscribers
class PubSub {
  private subscribers: Set<ReadableStreamDefaultController<string>> = new Set();

  // Subscribe a new controller
  subscribe(controller: ReadableStreamDefaultController<string>) {
    this.subscribers.add(controller);
  }

  // Unsubscribe a controller
  unsubscribe(controller: ReadableStreamDefaultController<string>) {
    this.subscribers.delete(controller);
  }

  // Broadcast a message to all subscribers
  broadcast(message: string) {
    for (const controller of this.subscribers) {
      controller.enqueue(message);
    }
  }
}

const pubsub = new PubSub();
let channel: RealtimeChannel | null = null;

// Initialize the Supabase Realtime subscription and set up broadcasting
export function setupRealtimeStream(supabase: SupabaseClient) {
  if (channel) return; // Prevent multiple initializations

  channel = supabase
    .channel('public:biodegradation')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all event types (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'biodegradation'
      },
      (payload) => {
        let data: BiodegradationSample | null = null;

        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          data = payload.new as BiodegradationSample;
        } else if (payload.eventType === 'DELETE') {
          data = payload.old as BiodegradationSample;
        }

        if (data) {
          const event = {
            type: payload.eventType,
            data,
          };
          // Enqueue the event in SSE format
          const message = `data: ${JSON.stringify(event)}\n\n`;
          pubsub.broadcast(message);
        }
      }
    )
    .subscribe();
}

// Function to get the pubsub instance
export function getPubSub(): PubSub {
  return pubsub;
}
