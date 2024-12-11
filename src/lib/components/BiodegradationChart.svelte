<!-- src/lib/components/BiodegradationChart.svelte -->
<script lang="ts">
	import type { BiodegradationSample } from '$lib/types';

	// Props
	export let data: BiodegradationSample[] = [];
	export let onPointClick: (sample: BiodegradationSample) => void;
	export let onHover: (sample: BiodegradationSample | null) => void; // New callback prop

	// SVG dimensions and margins
	const width = 800;
	const height = 600;
	const margin = { top: 50, right: 50, bottom: 50, left: 70 };

	// Data ranges
	const xValues = data.map((d) => d.time_days);
	const yValues = data.map((d) => d.degradation_pct);

	const xMin = Math.min(...xValues) - 5;
	const xMax = Math.max(...xValues) + 5;
	const yMin = Math.min(...yValues) - 5;
	const yMax = Math.max(...yValues) + 5;

	// Scaling functions
	const scaleX = (value: number) =>
		((value - xMin) / (xMax - xMin)) * (width - margin.left - margin.right) + margin.left;

	const scaleY = (value: number) =>
		height -
		margin.bottom -
		((value - yMin) / (yMax - yMin)) * (height - margin.top - margin.bottom);

	// Track the currently hovered sample
	let currentHoveredSample: BiodegradationSample | null = null;

	// Handle mouse events
	function handleMouseOver(sample: BiodegradationSample) {
		currentHoveredSample = sample;
		onHover(sample); // Emit the hovered sample
	}

	function handleMouseOut() {
		currentHoveredSample = null;
		onHover(null); // Emit null when not hovering
	}
</script>

<svg {width} {height} style="border: 1px solid #ccc; background-color: #f9f9f9;">
	<!-- X Axis -->
	<line
		x1={margin.left}
		y1={height - margin.bottom}
		x2={width - margin.right}
		y2={height - margin.bottom}
		stroke="black"
	/>
	<!-- Y Axis -->
	<line
		x1={margin.left}
		y1={margin.top}
		x2={margin.left}
		y2={height - margin.bottom}
		stroke="black"
	/>

	<!-- X Axis Label -->
	<text
		x={(width - margin.left - margin.right) / 2 + margin.left}
		y={height - margin.bottom + 40}
		text-anchor="middle"
		font-size="16"
		font-weight="bold"
	>
		Time (Days)
	</text>

	<!-- Y Axis Label -->
	<text
		transform={`translate(${margin.left - 50}, ${(height - margin.top - margin.bottom) / 2 + margin.top}) rotate(-90)`}
		text-anchor="middle"
		font-size="16"
		font-weight="bold"
	>
		Degradation (%)
	</text>

	<!-- X Grid Lines and Ticks -->
	{#each Array.from({ length: 6 }, (_, i) => xMin + (i * (xMax - xMin)) / 5) as tick}
		<line
			x1={scaleX(tick)}
			y1={margin.top}
			x2={scaleX(tick)}
			y2={height - margin.bottom}
			stroke="#e0e0e0"
			stroke-dasharray="4 2"
		/>
		<text x={scaleX(tick)} y={height - margin.bottom + 20} text-anchor="middle" font-size="12">
			{tick}
		</text>
	{/each}

	<!-- Y Grid Lines and Ticks -->
	{#each Array.from({ length: 6 }, (_, i) => yMin + (i * (yMax - yMin)) / 5) as tick}
		<line
			x1={margin.left}
			y1={scaleY(tick)}
			x2={width - margin.right}
			y2={scaleY(tick)}
			stroke="#e0e0e0"
			stroke-dasharray="4 2"
		/>
		<text x={margin.left - 10} y={scaleY(tick) + 4} text-anchor="end" font-size="12">
			{tick.toFixed(2)}
		</text>
	{/each}

	<!-- Data Points -->
	{#each data as sample}
		<circle
			cx={scaleX(sample.time_days)}
			cy={scaleY(sample.degradation_pct)}
			r={currentHoveredSample && currentHoveredSample.sample_id === sample.sample_id ? 10 : 8}
			fill={currentHoveredSample && currentHoveredSample.sample_id === sample.sample_id
				? 'orange'
				: 'steelblue'}
			stroke="black"
			stroke-width="1"
			on:click={() => onPointClick(sample)}
			on:mouseover={() => handleMouseOver(sample)}
			on:mouseout={handleMouseOut}
			style="cursor: pointer; transition: r 0.2s, fill 0.2s;"
		/>
	{/each}
</svg>
