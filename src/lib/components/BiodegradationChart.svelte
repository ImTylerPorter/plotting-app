<script lang="ts">
	import { onMount } from 'svelte';
	import type { BiodegradationSample } from '$lib/types';
	import { browser } from '$app/environment';

	interface Props {
		data?: BiodegradationSample[];
		onPointClick: (sample: BiodegradationSample) => void;
		onHover: (sample: BiodegradationSample | null) => void;
	}

	let { data = [], onPointClick, onHover }: Props = $props();

	let chartDiv: HTMLDivElement | undefined = $state();
	let Plotly: any = $state();

	async function loadPlotly() {
		if (browser) {
			Plotly = await import('plotly.js-dist-min');
		}
	}

	function updateChart() {
		if (!Plotly || !chartDiv) return;

		const trace: Partial<Plotly.ScatterData> = {
			x: data.map((d) => d.time_days),
			y: data.map((d) => d.degradation_pct),
			mode: 'markers',
			type: 'scatter',
			marker: {
				size: window.innerWidth < 768 ? 6 : 10, // Adjust marker size for small screens
				color: data.map((d) => d.temperature_c),
				colorscale: 'Viridis',
				showscale: true,
				colorbar: { title: 'Temperature (°C)' }
			},
			text: data.map(
				(d) =>
					`Sample ID: ${d.sample_id}<br>Material: ${d.material_type}<br>Environment: ${d.environment}`
			),
			hoverinfo: 'text'
		};

		const layout: Partial<Plotly.Layout> = {
			title: 'Biodegradation Over Time',
			xaxis: { title: 'Time (Days)' },
			yaxis: { title: 'Degradation (%)' },
			plot_bgcolor: 'rgba(0,0,0,0)',
			paper_bgcolor: 'rgba(0,0,0,0)',
			font: { color: '#fff', size: window.innerWidth < 768 ? 10 : 12 },
			margin: { l: 40, r: 20, t: 40, b: 40 }
		};

		const config = {
			responsive: true // Add this here
		};

		Plotly.newPlot(chartDiv, [trace], layout, config); // Pass config as the fourth argument
	}

	onMount(() => {
		(async () => {
			await loadPlotly();
			if (chartDiv && data && Plotly) {
				updateChart();
				window.addEventListener('resize', updateChart); // Re-render on resize
			}
		})();

		return () => {
			if (chartDiv && Plotly) {
				Plotly.purge(chartDiv);
			}
			window.removeEventListener('resize', updateChart);
		};
	});
</script>

<div bind:this={chartDiv} class="w-full h-[300px] sm:h-[600px]"></div>
