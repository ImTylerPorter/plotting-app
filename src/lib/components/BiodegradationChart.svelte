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
				size: window.innerWidth < 768 ? 6 : 10, // Dynamically adjust marker size for small screens
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
			font: { color: '#fff', size: window.innerWidth < 768 ? 10 : 12 }, // Adjust font size for smaller screens
			margin: { l: 40, r: 20, t: 40, b: 40 } // Compact margins for responsiveness
		};

		const config = {
			responsive: true, // Enable responsiveness
			scrollZoom: true, // Allow pinch-to-zoom
			displayModeBar: false, // Optional: Hide mode bar for a cleaner look on mobile
			doubleClick: 'reset' // Reset zoom on double-tap
		};

		// Create or update the chart
		Plotly.newPlot(chartDiv, [trace], layout, config).then(() => {
			// Add click event listener
			(chartDiv as any).on('plotly_click', (event: any) => {
				if (event.points && event.points.length > 0) {
					const point = event.points[0];
					const sample = data[point.pointIndex];
					onPointClick(sample);
				}
			});

			// Add hover event listener
			(chartDiv as any).on('plotly_hover', (event: any) => {
				if (event.points && event.points.length > 0) {
					const point = event.points[0];
					const sample = data[point.pointIndex];
					onHover(sample);
				}
			});

			// Add unhover event listener
			(chartDiv as any).on('plotly_unhover', () => {
				onHover(null);
			});
		});

		// Ensure the chart updates dynamically on window resize
		window.addEventListener('resize', () => {
			Plotly.Plots.resize(chartDiv);
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
