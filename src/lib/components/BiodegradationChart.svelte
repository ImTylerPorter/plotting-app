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
				size: 10,
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
			font: { color: '#fff' }
		};

		// Create or update the chart
		Plotly.newPlot(chartDiv, [trace], layout, { responsive: true }).then(() => {
			// Use Plotly's graph instance for event listeners
			(chartDiv as any).on('plotly_click', (event: any) => {
				if (event.points && event.points.length > 0) {
					const point = event.points[0];
					const sample = data[point.pointIndex];
					onPointClick(sample);
				}
			});

			(chartDiv as any).on('plotly_hover', (event: any) => {
				if (event.points && event.points.length > 0) {
					const point = event.points[0];
					const sample = data[point.pointIndex];
					onHover(sample);
				}
			});

			(chartDiv as any).on('plotly_unhover', () => {
				onHover(null);
			});
		});
	}

	onMount(() => {
		let cleanup: (() => void) | undefined;

		(async () => {
			await loadPlotly();
			if (chartDiv && data && Plotly) {
				updateChart();
				cleanup = () => {
					if (Plotly && chartDiv) {
						Plotly.purge(chartDiv);
					}
				};
			}
		})();

		// Return cleanup function synchronously
		return () => {
			if (cleanup) {
				cleanup();
			}
		};
	});
</script>

<div bind:this={chartDiv} class="w-full h-[600px]"></div>
