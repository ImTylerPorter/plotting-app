import type { RequestHandler } from '@sveltejs/kit';
import type { SimulationParams, SimulationResultData } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { sample_id, simulation_params } = (await request.json()) as { sample_id: number; simulation_params: SimulationParams };

    // Mock simulation logic: Replace with real simulation integration
    const predicted_degradation_pct = Math.min(100, 35.6 + 1.5 * simulation_params.time_days);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const simulationResult: SimulationResultData = {
      sample_id,
      predicted_degradation_pct: parseFloat(predicted_degradation_pct.toFixed(2)),
      simulation_time_days: simulation_params.time_days,
    };

    return new Response(JSON.stringify(simulationResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error running simulation:', error);
    return new Response(JSON.stringify({ error: 'Failed to run simulation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
