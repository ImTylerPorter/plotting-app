<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import BiodegradationChart from '$lib/components/BiodegradationChart.svelte';
	import Controls from '$lib/components/Controls.svelte';
	import type {
		BiodegradationSample,
		SimulationResult,
		FilterEventDetail,
		SimulateEventDetail
	} from '$lib/types';

	export let data: {
		points: BiodegradationSample[];
		materialTypes: string[];
		environments: string[];
	};

	let points: BiodegradationSample[] = data.points;
	let filteredPoints: BiodegradationSample[] = points;
	let materialTypes: string[] = data.materialTypes;
	let environments: string[] = data.environments;

	let selectedSample: BiodegradationSample | null = null;
	let hoveredSample: BiodegradationSample | null = null; // New variable for hovered sample
	let isLoading: boolean = false;
	let simulationResult: SimulationResult | null = null;

	let eventSource: EventSource | null = null;

	// Handle filter callbacks with correct type
	function handleFilter(eventDetail: FilterEventDetail) {
		const { material, environment } = eventDetail;
		filteredPoints = points.filter(
			(d) =>
				(material ? d.material_type === material : true) &&
				(environment ? d.environment === environment : true)
		);
	}

	// Handle simulate callbacks with correct type
	async function handleSimulation(eventDetail: SimulateEventDetail) {
		if (!selectedSample) {
			alert('Please select a sample by clicking on a data point.');
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
				const data: SimulationResult = await res.json();
				simulationResult = data;
			} else {
				console.error('Failed to run simulation');
				alert('Simulation failed. Please try again.');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('An error occurred while running the simulation.');
		} finally {
			isLoading = false;
		}
	}

	// Handle pointClick callbacks with correct type
	function handlePointClick(sample: BiodegradationSample) {
		selectedSample = sample;
		simulationResult = null;
	}

	// Handle hover callbacks with correct type
	function handleHover(sample: BiodegradationSample | null) {
		hoveredSample = sample;
	}

	// Initialize EventSource on mount
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

				// Re-apply filters after data change
				filteredPoints = points.filter(
					(d) =>
						(materialTypes.includes(d.material_type) || materialTypes.length === 0) &&
						(environments.includes(d.environment) || environments.length === 0)
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

	// Clean up EventSource on component destroy
	onDestroy(() => {
		eventSource?.close();
	});
</script>

<main>
	<h1>Biodegradation Testing</h1>
	<p>
		Interactive visualization of biodegradable materials degradation over time under various
		conditions.
	</p>

	<Controls onFilter={handleFilter} onSimulate={handleSimulation} />

	<div class="chart-and-tooltip">
		<BiodegradationChart
			data={filteredPoints}
			onPointClick={handlePointClick}
			onHover={handleHover}
		/>

		<!-- Dedicated Tooltip Area -->
		<div class="tooltip-area">
			{#if hoveredSample}
				<h3>Sample Details</h3>
				<p><strong>Sample ID:</strong> {hoveredSample.sample_id}</p>
				<p><strong>Material Type:</strong> {hoveredSample.material_type}</p>
				<p><strong>Environment:</strong> {hoveredSample.environment}</p>
				<p><strong>Time (Days):</strong> {hoveredSample.time_days}</p>
				<p><strong>Degradation (%):</strong> {hoveredSample.degradation_pct}%</p>
				<p><strong>Temperature:</strong> {hoveredSample.temperature_c}°C</p>
				<p><strong>Humidity:</strong> {hoveredSample.humidity_pct}%</p>
			{/if}
		</div>
	</div>

	{#if selectedSample}
		<section class="details">
			<h2>Selected Sample Details</h2>
			<p><strong>Sample ID:</strong> {selectedSample.sample_id}</p>
			<p><strong>Material Type:</strong> {selectedSample.material_type}</p>
			<p><strong>Environment:</strong> {selectedSample.environment}</p>
			<p><strong>Time (Days):</strong> {selectedSample.time_days}</p>
			<p><strong>Degradation (%):</strong> {selectedSample.degradation_pct}%</p>
			<p><strong>Temperature:</strong> {selectedSample.temperature_c}°C</p>
			<p><strong>Humidity:</strong> {selectedSample.humidity_pct}%</p>

			{#if isLoading}
				<p>Running simulation...</p>
			{/if}

			{#if simulationResult}
				<h3>Simulation Result</h3>
				<p>
					<strong>Predicted Degradation (%):</strong>
					{simulationResult.predicted_degradation_pct}%
				</p>
				<p><strong>Simulation Time (Days):</strong> {simulationResult.simulation_time_days}</p>
			{/if}
		</section>
	{/if}
</main>

<style>
	main {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		text-align: center;
	}

	h1 {
		margin-bottom: 1rem;
	}

	p {
		margin-bottom: 2rem;
	}

	.chart-and-tooltip {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;
		gap: 2rem;
		margin-top: 2rem;
	}

	.tooltip-area {
		width: 250px;
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background: linear-gradient(135deg, #f9f9f9, #ffffff);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		text-align: left;
		transition: opacity 0.3s ease-in-out;
	}

	.tooltip-area h3 {
		margin-top: 0;
		color: #333;
		font-size: 18px;
		border-bottom: 1px solid #ccc;
		padding-bottom: 0.5rem;
	}

	.tooltip-area p {
		margin: 0.3rem 0;
		font-size: 14px;
		color: #555;
	}

	.details {
		margin-top: 2rem;
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		text-align: left;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.details h2,
	.details h3 {
		margin-bottom: 0.5rem;
	}

	.details p {
		margin: 0.3rem 0;
	}

	/* Responsive Design */
	@media (max-width: 1000px) {
		.chart-and-tooltip {
			flex-direction: column;
			align-items: center;
		}

		.tooltip-area {
			width: 90%;
		}
	}
</style>
