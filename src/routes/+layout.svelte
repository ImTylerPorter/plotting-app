<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { invalidate } from '$app/navigation';

	interface SupabaseSession {
		expires_at?: number;
	}

	interface Props {
		children?: Snippet;
		data?: {
			session?: SupabaseSession;
			supabase: {
				auth: {
					onAuthStateChange: (
						callback: (event: string, session: SupabaseSession | null) => void
					) => {
						data: {
							subscription: {
								unsubscribe: () => void;
							};
						};
					};
				};
			};
		};
	}

	let { children, data: propsData }: Props = $props();

	$effect(() => {
		if (propsData?.supabase) {
			const { data } = propsData.supabase.auth.onAuthStateChange((_, newSession) => {
				if (newSession?.expires_at !== propsData?.session?.expires_at) {
					invalidate('supabase:auth');
				}
			});

			return () => data.subscription.unsubscribe();
		}
	});
</script>

{@render children?.()}
