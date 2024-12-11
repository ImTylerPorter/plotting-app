<script lang="ts">
	import type { BiodegradationSample } from '$lib/types';

	interface Props {
		sample?: BiodegradationSample | null;
	}

	let { sample = null }: Props = $props();
</script>

{#if sample}
	<div class="bg-gray-800 rounded-lg shadow-lg p-6">
		<h2 class="text-2xl font-semibold mb-4">Sample Details</h2>
		<div class="space-y-2">
			<p><strong>Sample ID:</strong> {sample.sample_id}</p>
			<p><strong>Material Type:</strong> {sample.material_type}</p>
			<p><strong>Environment:</strong> {sample.environment}</p>
			<p><strong>Time (Days):</strong> {sample.time_days}</p>
			<p><strong>Degradation (%):</strong> {sample.degradation_pct.toFixed(2)}%</p>
			<p><strong>Temperature:</strong> {sample.temperature_c.toFixed(2)}°C</p>
			<p><strong>Humidity:</strong> {sample.humidity_pct.toFixed(2)}%</p>
		</div>
	</div>
{/if}
