import { db } from '$lib/db';
import { biodegradation } from '$lib/db/schema';
import type { BiodegradationSample } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  try {
    // Fetch data from the database
    const rawData = await db.select().from(biodegradation);

    // Transform data to match the BiodegradationSample interface
    const data: BiodegradationSample[] = rawData.map((row) => ({
      sample_id: row.sample_id,
      material_type: row.material_type,
      environment: row.environment,
      time_days: row.time_days,
      degradation_pct: Number(row.degradation_pct), // Cast to number
      temperature_c: Number(row.temperature_c),     // Cast to number
      humidity_pct: Number(row.humidity_pct),       // Cast to number
    }));

    const materialTypes = Array.from(new Set(data.map((d) => d.material_type)));
    const environments = Array.from(new Set(data.map((d) => d.environment)));

    return {
      points: data,
      materialTypes,
      environments,
      session: locals.session,
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      points: [],
      materialTypes: [],
      environments: [],
      session: locals.session,
    };
  }
};
