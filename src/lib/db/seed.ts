import { db } from './index';
import { biodegradation } from './schema';

type BiodegradationSampleInput = {
  sample_id?: number;
  material_type: string;
  environment: string;
  time_days: number;
  degradation_pct: string;
  temperature_c: string;
  humidity_pct: string;
}

// Utility function to format numbers to two decimal places
function formatTwoDecimals(value: number): string {
  return value.toFixed(2); // Always returns a string
}

async function seed() {
  try {
    // Clear existing data
    await db.delete(biodegradation);

    // Extended biodegradable testing data with two decimal precision
    const data: BiodegradationSampleInput[] = [
      // Existing 5 Entries
      {
        material_type: 'PLA',
        environment: 'Compost',
        time_days: 10,
        degradation_pct: formatTwoDecimals(15.20),
        temperature_c: formatTwoDecimals(25.00),
        humidity_pct: formatTwoDecimals(60.00)
      },
      {
        material_type: 'PHA',
        environment: 'Soil',
        time_days: 15,
        degradation_pct: formatTwoDecimals(22.50),
        temperature_c: formatTwoDecimals(20.00),
        humidity_pct: formatTwoDecimals(55.00)
      },
      {
        material_type: 'PLA',
        environment: 'Marine',
        time_days: 20,
        degradation_pct: formatTwoDecimals(10.80),
        temperature_c: formatTwoDecimals(18.00),
        humidity_pct: formatTwoDecimals(70.00)
      },
      {
        material_type: 'PBAT',
        environment: 'Compost',
        time_days: 10,
        degradation_pct: formatTwoDecimals(18.40),
        temperature_c: formatTwoDecimals(25.00),
        humidity_pct: formatTwoDecimals(60.00)
      },
      {
        material_type: 'PLA',
        environment: 'Soil',
        time_days: 25,
        degradation_pct: formatTwoDecimals(35.60),
        temperature_c: formatTwoDecimals(22.00),
        humidity_pct: formatTwoDecimals(50.00)
      },

      // Additional 25 Entries
      {
        material_type: 'PET',
        environment: 'Aquatic',
        time_days: 30,
        degradation_pct: formatTwoDecimals(12.00),
        temperature_c: formatTwoDecimals(24.00),
        humidity_pct: formatTwoDecimals(65.00)
      },
      {
        material_type: 'PHB',
        environment: 'Compost',
        time_days: 35,
        degradation_pct: formatTwoDecimals(28.50),
        temperature_c: formatTwoDecimals(26.00),
        humidity_pct: formatTwoDecimals(70.00)
      },
      {
        material_type: 'PLA',
        environment: 'Industrial',
        time_days: 40,
        degradation_pct: formatTwoDecimals(20.30),
        temperature_c: formatTwoDecimals(27.00),
        humidity_pct: formatTwoDecimals(58.00)
      },
      {
        material_type: 'PHA',
        environment: 'Marine',
        time_days: 45,
        degradation_pct: formatTwoDecimals(15.70),
        temperature_c: formatTwoDecimals(19.00),
        humidity_pct: formatTwoDecimals(72.00)
      },
      {
        material_type: 'PBAT',
        environment: 'Soil',
        time_days: 50,
        degradation_pct: formatTwoDecimals(30.00),
        temperature_c: formatTwoDecimals(23.00),
        humidity_pct: formatTwoDecimals(60.00)
      },
      {
        material_type: 'PLA',
        environment: 'Aquatic',
        time_days: 55,
        degradation_pct: formatTwoDecimals(25.40),
        temperature_c: formatTwoDecimals(21.00),
        humidity_pct: formatTwoDecimals(68.00)
      },
      {
        material_type: 'PET',
        environment: 'Compost',
        time_days: 60,
        degradation_pct: formatTwoDecimals(40.10),
        temperature_c: formatTwoDecimals(28.00),
        humidity_pct: formatTwoDecimals(75.00)
      },
      {
        material_type: 'PHB',
        environment: 'Industrial',
        time_days: 65,
        degradation_pct: formatTwoDecimals(18.90),
        temperature_c: formatTwoDecimals(29.00),
        humidity_pct: formatTwoDecimals(55.00)
      },
      {
        material_type: 'PLA',
        environment: 'Soil',
        time_days: 70,
        degradation_pct: formatTwoDecimals(32.80),
        temperature_c: formatTwoDecimals(22.00),
        humidity_pct: formatTwoDecimals(62.00)
      },
      {
        material_type: 'PBAT',
        environment: 'Aquatic',
        time_days: 75,
        degradation_pct: formatTwoDecimals(14.50),
        temperature_c: formatTwoDecimals(20.00),
        humidity_pct: formatTwoDecimals(60.00)
      },
      {
        material_type: 'PET',
        environment: 'Marine',
        time_days: 80,
        degradation_pct: formatTwoDecimals(19.30),
        temperature_c: formatTwoDecimals(25.00),
        humidity_pct: formatTwoDecimals(70.00)
      },
      {
        material_type: 'PHB',
        environment: 'Soil',
        time_days: 85,
        degradation_pct: formatTwoDecimals(27.60),
        temperature_c: formatTwoDecimals(24.00),
        humidity_pct: formatTwoDecimals(65.00)
      },
      {
        material_type: 'PLA',
        environment: 'Compost',
        time_days: 90,
        degradation_pct: formatTwoDecimals(38.20),
        temperature_c: formatTwoDecimals(26.00),
        humidity_pct: formatTwoDecimals(72.00)
      },
      {
        material_type: 'PBAT',
        environment: 'Industrial',
        time_days: 95,
        degradation_pct: formatTwoDecimals(22.90),
        temperature_c: formatTwoDecimals(28.00),
        humidity_pct: formatTwoDecimals(58.00)
      },
      {
        material_type: 'PET',
        environment: 'Soil',
        time_days: 100,
        degradation_pct: formatTwoDecimals(34.00),
        temperature_c: formatTwoDecimals(23.00),
        humidity_pct: formatTwoDecimals(65.00)
      },
      {
        material_type: 'PHB',
        environment: 'Aquatic',
        time_days: 105,
        degradation_pct: formatTwoDecimals(17.80),
        temperature_c: formatTwoDecimals(20.00),
        humidity_pct: formatTwoDecimals(60.00)
      },
      {
        material_type: 'PLA',
        environment: 'Marine',
        time_days: 110,
        degradation_pct: formatTwoDecimals(29.50),
        temperature_c: formatTwoDecimals(19.00),
        humidity_pct: formatTwoDecimals(70.00)
      },
      {
        material_type: 'PBAT',
        environment: 'Compost',
        time_days: 115,
        degradation_pct: formatTwoDecimals(25.20),
        temperature_c: formatTwoDecimals(27.00),
        humidity_pct: formatTwoDecimals(68.00)
      },
      {
        material_type: 'PET',
        environment: 'Industrial',
        time_days: 120,
        degradation_pct: formatTwoDecimals(31.70),
        temperature_c: formatTwoDecimals(30.00),
        humidity_pct: formatTwoDecimals(55.00)
      },
      {
        material_type: 'PHB',
        environment: 'Soil',
        time_days: 125,
        degradation_pct: formatTwoDecimals(24.40),
        temperature_c: formatTwoDecimals(22.00),
        humidity_pct: formatTwoDecimals(63.00)
      },
      {
        material_type: 'PLA',
        environment: 'Aquatic',
        time_days: 130,
        degradation_pct: formatTwoDecimals(20.90),
        temperature_c: formatTwoDecimals(21.00),
        humidity_pct: formatTwoDecimals(66.00)
      },
      {
        material_type: 'PBAT',
        environment: 'Marine',
        time_days: 135,
        degradation_pct: formatTwoDecimals(13.60),
        temperature_c: formatTwoDecimals(18.00),
        humidity_pct: formatTwoDecimals(70.00)
      },
      {
        material_type: 'PET',
        environment: 'Soil',
        time_days: 140,
        degradation_pct: formatTwoDecimals(36.50),
        temperature_c: formatTwoDecimals(24.00),
        humidity_pct: formatTwoDecimals(67.00)
      },
      {
        material_type: 'PHB',
        environment: 'Compost',
        time_days: 145,
        degradation_pct: formatTwoDecimals(19.80),
        temperature_c: formatTwoDecimals(26.00),
        humidity_pct: formatTwoDecimals(72.00)
      },
      {
        material_type: 'PLA',
        environment: 'Industrial',
        time_days: 150,
        degradation_pct: formatTwoDecimals(34.70),
        temperature_c: formatTwoDecimals(28.00),
        humidity_pct: formatTwoDecimals(60.00)
      },
      {
        material_type: 'PBAT',
        environment: 'Soil',
        time_days: 155,
        degradation_pct: formatTwoDecimals(21.30),
        temperature_c: formatTwoDecimals(23.00),
        humidity_pct: formatTwoDecimals(65.00)
      },
      {
        material_type: 'PET',
        environment: 'Aquatic',
        time_days: 160,
        degradation_pct: formatTwoDecimals(16.40),
        temperature_c: formatTwoDecimals(20.00),
        humidity_pct: formatTwoDecimals(62.00)
      },
      {
        material_type: 'PHB',
        environment: 'Marine',
        time_days: 165,
        degradation_pct: formatTwoDecimals(29.10),
        temperature_c: formatTwoDecimals(19.00),
        humidity_pct: formatTwoDecimals(68.00)
      },
      {
        material_type: 'PLA',
        environment: 'Soil',
        time_days: 170,
        degradation_pct: formatTwoDecimals(40.00),
        temperature_c: formatTwoDecimals(25.00),
        humidity_pct: formatTwoDecimals(70.00)
      },
      {
        material_type: 'PBAT',
        environment: 'Aquatic',
        time_days: 175,
        degradation_pct: formatTwoDecimals(17.50),
        temperature_c: formatTwoDecimals(21.00),
        humidity_pct: formatTwoDecimals(63.00)
      },
      {
        material_type: 'PET',
        environment: 'Compost',
        time_days: 180,
        degradation_pct: formatTwoDecimals(33.30),
        temperature_c: formatTwoDecimals(27.00),
        humidity_pct: formatTwoDecimals(75.00)
      },
      {
        material_type: 'PHB',
        environment: 'Industrial',
        time_days: 185,
        degradation_pct: formatTwoDecimals(23.70),
        temperature_c: formatTwoDecimals(29.00),
        humidity_pct: formatTwoDecimals(55.00)
      },
      {
        material_type: 'PLA',
        environment: 'Aquatic',
        time_days: 190,
        degradation_pct: formatTwoDecimals(26.80),
        temperature_c: formatTwoDecimals(22.00),
        humidity_pct: formatTwoDecimals(64.00)
      },
      {
        material_type: 'PBAT',
        environment: 'Soil',
        time_days: 195,
        degradation_pct: formatTwoDecimals(19.90),
        temperature_c: formatTwoDecimals(24.00),
        humidity_pct: formatTwoDecimals(66.00)
      },
      {
        material_type: 'PET',
        environment: 'Marine',
        time_days: 200,
        degradation_pct: formatTwoDecimals(28.20),
        temperature_c: formatTwoDecimals(18.00),
        humidity_pct: formatTwoDecimals(70.00)
      }
    ];

    // Insert data
    await db.insert(biodegradation).values(data);
    console.log('Seeded database with biodegradable testing data!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit();
  }
}

seed();
