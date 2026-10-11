import pg from "pg";
import { DATABASE_URL, assertLocal } from "./helpers/db";

// Fallisce subito, con un messaggio chiaro, se il database locale è spento:
// i test del ledger non si sostituiscono con mock.
export default async function setup(): Promise<void> {
  assertLocal(DATABASE_URL);
  const client = new pg.Client({ connectionString: DATABASE_URL });
  try {
    await client.connect();
    await client.query("select 1");
  } catch (error) {
    throw new Error(
      `Database locale non raggiungibile su ${DATABASE_URL}.\n` +
        "Avvialo con `pnpm db:start` (Supabase CLI, richiede Docker) " +
        "oppure con lo shim PostgreSQL descritto nel README.\n" +
        `Dettaglio: ${(error as Error).message}`,
    );
  } finally {
    await client.end().catch(() => undefined);
  }
}
