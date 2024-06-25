import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";

dotenv.config();

const queryClient = postgres(process.env.DATABASE_URL!);
export const dbClient = drizzle(queryClient);

// dbClient.(personalMessagesTable)
// console.log("Deleted personalMessagesTable")
