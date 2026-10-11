import pg from "pg";

// Database locale: Supabase CLI (porta 54322) oppure lo shim su PostgreSQL
// descritto in docs/DECISIONS.md. Mai un database cloud.
export const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

export function assertLocal(url: string): void {
  const host = new URL(url).hostname;
  if (!["127.0.0.1", "localhost", "::1"].includes(host)) {
    throw new Error(`I test sul database girano solo in locale (host: ${host}).`);
  }
}

export function createPool(max = 10): pg.Pool {
  assertLocal(DATABASE_URL);
  return new pg.Pool({ connectionString: DATABASE_URL, max });
}
