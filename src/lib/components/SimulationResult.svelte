<!-- src/lib/components/SimulationResult.svelte -->
<script lang="ts">
	import type { SimulationResultData } from '$lib/types';

	interface Props {
		result: SimulationResultData;
	}

	let { result }: Props = $props();
</script>

<div class="bg-gray-800 rounded-lg shadow-lg p-6">
	<h2 class="text-2xl font-semibold mb-4">Simulation Result</h2>
	<div class="space-y-2">
		<p>
			<strong>Predicted Degradation (%):</strong>
			{result.predicted_degradation_pct.toFixed(2)}%
		</p>
		<p><strong>Simulation Time (Days):</strong> {result.simulation_time_days}</p>
	</div>
</div>
