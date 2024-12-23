import { drizzle } from "drizzle-orm/postgres-js";
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in the environment variables.");
}

const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });
