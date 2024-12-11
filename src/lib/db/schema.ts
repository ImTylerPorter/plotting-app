import { pgTable, serial, varchar, integer, numeric } from 'drizzle-orm/pg-core';

export const biodegradation = pgTable('biodegradation', {
  sample_id: serial('sample_id').primaryKey(),
  material_type: varchar('material_type', { length: 50 }).notNull(),
  environment: varchar('environment', { length: 50 }).notNull(),
  time_days: integer('time_days').notNull(),
  degradation_pct: numeric('degradation_pct', { precision: 5, scale: 2 }).notNull(),
  temperature_c: numeric('temperature_c', { precision: 5, scale: 2 }).notNull(),
  humidity_pct: numeric('humidity_pct', { precision: 5, scale: 2 }).notNull(),
});