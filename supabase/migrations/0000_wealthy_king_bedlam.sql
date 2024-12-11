CREATE TABLE "biodegradation" (
	"sample_id" serial PRIMARY KEY NOT NULL,
	"material_type" varchar(50) NOT NULL,
	"environment" varchar(50) NOT NULL,
	"time_days" integer NOT NULL,
	"degradation_pct" numeric(5, 2) NOT NULL,
	"temperature_c" numeric(5, 2) NOT NULL,
	"humidity_pct" numeric(5, 2) NOT NULL
);
