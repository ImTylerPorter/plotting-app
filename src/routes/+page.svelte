<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import BiodegradationChart from '$lib/components/BiodegradationChart.svelte';
	import Controls from '$lib/components/Controls.svelte';
	import SampleDetails from '$lib/components/SampleDetails.svelte';
	import SimulationResult from '$lib/components/SimulationResult.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import type {
		BiodegradationSample,
		SimulationResultData,
		FilterEventDetail,
		SimulateEventDetail
	} from '$lib/types';

	// Props from parent
	interface Props {
		data: {
			points: BiodegradationSample[];
			materialTypes: string[];
			environments: string[];
		};
	}

	let { data }: Props = $props();

	// State variables
	let points = $state(data.points);
	let filteredPoints = $state(data.points);
	let materialTypes = $state(data.materialTypes);
	let environments = $state(data.environments);
	let selectedSample = $state<BiodegradationSample | null>(null);
	let hoveredSample = $state<BiodegradationSample | null>(null);
	let isLoading = $state(false);
	let simulationResult = $state<SimulationResultData | null>(null);
	let toastMessage = $state<string | null>(null);

	let eventSource: EventSource | null = null;

	// Filtering logic
	function handleFilter(eventDetail: FilterEventDetail) {
		const { material, environment } = eventDetail;
		filteredPoints = points.filter(
			(d) =>
				(!material || d.material_type === material) &&
				(!environment || d.environment === environment)
		);
		console.log('Filtered Points:', filteredPoints); // Debugging
	}

	// Simulation logic
	async function handleSimulation(eventDetail: SimulateEventDetail) {
		if (!selectedSample) {
			toastMessage = 'Please select a sample by clicking on a data point.';
			return;
		}

		const { time_days } = eventDetail;
		isLoading = true;
		simulationResult = null;

		try {
			const res = await fetch('/api/simulate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					sample_id: selectedSample.sample_id,
					simulation_params: { time_days }
				})
			});

			if (res.ok) {
				simulationResult = await res.json();
			} else {
				console.error('Failed to run simulation');
				toastMessage = 'Simulation failed. Please try again.';
			}
		} catch (error) {
			console.error('Error:', error);
			toastMessage = 'An error occurred while running the simulation.';
		} finally {
			isLoading = false;
		}
	}

	// Click and hover events
	function handlePointClick(sample: BiodegradationSample) {
		selectedSample = sample;
		simulationResult = null;
	}

	function handleHover(sample: BiodegradationSample | null) {
		hoveredSample = sample;
	}

	// Realtime updates via EventSource
	onMount(() => {
		eventSource = new EventSource('/api/realtime');

		eventSource.onmessage = (e) => {
			try {
				const event = JSON.parse(e.data);
				const { type, data: sample } = event;

				if (type === 'INSERT') {
					points = [...points, sample];
				} else if (type === 'UPDATE') {
					points = points.map((p) => (p.sample_id === sample.sample_id ? sample : p));
				} else if (type === 'DELETE') {
					points = points.filter((p) => p.sample_id !== sample.sample_id);
				}

				// Update filteredPoints based on new data
				filteredPoints = points.filter(
					(d) =>
						(!materialTypes.length || materialTypes.includes(d.material_type)) &&
						(!environments.length || environments.includes(d.environment))
				);
			} catch (err) {
				console.error('Error parsing SSE data:', err);
			}
		};

		eventSource.onerror = (err) => {
			console.error('EventSource failed:', err);
			eventSource?.close();
		};
	});

	onDestroy(() => {
		eventSource?.close();
	});
</script>

<main class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
	<h1
		class="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400"
	>
		Biodegradation Testing
	</h1>
	<p class="text-center text-gray-300 mb-8">
		Interactive visualization of biodegradable materials degradation over time under various
		conditions.
	</p>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<div class="lg:col-span-2">
			<div class="bg-gray-800 rounded-lg shadow-lg p-6">
				<BiodegradationChart
					data={filteredPoints}
					onPointClick={handlePointClick}
					onHover={handleHover}
				/>
			</div>
		</div>
		<div class="space-y-8">
			<Controls
				{materialTypes}
				{environments}
				onFilter={handleFilter}
				onSimulate={handleSimulation}
			/>
			{#if isLoading}
				<div class="bg-gray-800 rounded-lg shadow-lg p-6">
					<p class="text-center">Running simulation...</p>
				</div>
			{/if}
			{#if simulationResult}
				<SimulationResult result={simulationResult} />
			{/if}
			<SampleDetails sample={selectedSample || hoveredSample} />
		</div>
	</div>
	{#if toastMessage}
		<Toast message={toastMessage} onClose={() => (toastMessage = null)} />
	{/if}
</main>
