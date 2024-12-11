export interface BiodegradationSample {
  sample_id: number;
  material_type: string;
  environment: string;
  time_days: number;
  degradation_pct: number;
  temperature_c: number;
  humidity_pct: number;
}

export interface SimulationParams {
  time_days: number;
}

export interface SimulationResultData {
  sample_id: number;
  predicted_degradation_pct: number;
  simulation_time_days: number;
}

export interface FilterEventDetail {
  material: string | null;
  environment: string | null;
}

export interface SimulateEventDetail {
  time_days: number;
}
