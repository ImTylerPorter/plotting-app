<!-- src/lib/components/Controls.svelte -->
<script lang="ts">
	import type { FilterEventDetail, SimulateEventDetail } from '$lib/types';

	interface Props {
		materialTypes: string[];
		environments: string[];
		onFilter: (detail: FilterEventDetail) => void;
		onSimulate: (detail: SimulateEventDetail) => void;
	}

	let {
		materialTypes,
		environments,
		onFilter,
		onSimulate
	}: Props = $props();

	let selectedMaterial = $state('');
	let selectedEnvironment = $state('');
	let simulationDays = $state(30);

	function handleFilter() {
		onFilter({ material: selectedMaterial, environment: selectedEnvironment });
	}

	function handleSimulation() {
		onSimulate({ time_days: simulationDays });
	}
</script>

<div class="bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
	<h2 class="text-2xl font-semibold">Controls</h2>

	<!-- Filter Controls -->
	<div class="space-y-4">
		<label class="block text-lg font-medium">Material</label>
		<select
			bind:value={selectedMaterial}
			class="w-full p-2 bg-gray-700 rounded-md focus:ring focus:ring-blue-500"
		>
			<option value="">Select Material</option>
			{#each materialTypes as material}
				<option value={material}>{material}</option>
			{/each}
		</select>

		<label class="block text-lg font-medium">Environment</label>
		<select
			bind:value={selectedEnvironment}
			class="w-full p-2 bg-gray-700 rounded-md focus:ring focus:ring-blue-500"
		>
			<option value="">Select Environment</option>
			{#each environments as environment}
				<option value={environment}>{environment}</option>
			{/each}
		</select>

		<button
			onclick={handleFilter}
			class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium p-2 rounded-md"
		>
			Apply Filters
		</button>
	</div>

	<!-- Simulation Slider -->
	<div class="space-y-4">
		<label for="simulation-slider" class="block text-lg font-medium">Simulation Time (Days)</label>
		<div class="flex items-center justify-between">
			<span class="text-sm text-gray-400">1 Day</span>
			<span class="text-sm text-gray-400">{simulationDays} Days</span>
			<span class="text-sm text-gray-400">200 Days</span>
		</div>
		<input
			id="simulation-slider"
			type="range"
			min="1"
			max="200"
			step="1"
			bind:value={simulationDays}
			onchange={handleSimulation}
			class="w-full appearance-none h-2 bg-gray-700 rounded-lg focus:outline-none focus:ring focus:ring-green-500"
		/>

		<button
			onclick={handleSimulation}
			class="w-full bg-green-500 hover:bg-green-600 text-white font-medium p-2 rounded-md"
		>
			Run Simulation
		</button>
	</div>
</div>
