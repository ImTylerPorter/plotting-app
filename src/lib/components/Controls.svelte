<script lang="ts">
	import type { FilterEventDetail, SimulateEventDetail } from '$lib/types';

	// Define the props with callback functions
	export let onFilter: (detail: FilterEventDetail) => void;
	export let onSimulate: (detail: SimulateEventDetail) => void;

	// Example functions to handle button clicks
	function handleFilter() {
		// Replace with actual logic to retrieve selected filters
		const selectedMaterial = 'Material A';
		const selectedEnvironment = 'Environment X';
		onFilter({ material: selectedMaterial, environment: selectedEnvironment });
	}

	function handleSimulate() {
		// Replace with actual logic to retrieve simulation parameters
		const simulationDays = 30;
		onSimulate({ time_days: simulationDays });
	}
</script>

<!-- Your component's markup -->
<div>
	<button onclick={handleFilter}>Filter</button>
	<button onclick={handleSimulate}>Simulate</button>
</div>
