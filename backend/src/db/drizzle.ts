
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";


const queryClient = postgres("postgresql://admin:admin12345@localhost:5432/chat-app");
export const dbClient = drizzle(queryClient);
