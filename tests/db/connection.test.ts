import { afterAll, describe, expect, it } from "vitest";
import { createPool } from "./helpers/db";

const pool = createPool(5);

afterAll(async () => {
  await pool.end();
});

describe("database locale", () => {
  it("è Postgres 15 o successivo", async () => {
    const { rows } = await pool.query<{ v: number }>(
      "select current_setting('server_version_num')::int as v",
    );
    expect(rows[0].v).toBeGreaterThanOrEqual(150000);
  });

  it("espone lo schema auth con auth.uid() e i ruoli anon/authenticated", async () => {
    const fn = await pool.query(
      "select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'auth' and p.proname = 'uid'",
    );
    expect(fn.rowCount).toBe(1);

    const roles = await pool.query<{ rolname: string }>(
      "select rolname from pg_roles where rolname in ('anon', 'authenticated') order by rolname",
    );
    expect(roles.rows.map((r) => r.rolname)).toEqual(["anon", "authenticated"]);
  });

  it("accetta connessioni parallele reali (servono ai test di concorrenza)", async () => {
    const pids = await Promise.all(
      Array.from({ length: 4 }, async () => {
        const client = await pool.connect();
        try {
          await client.query("begin");
          const { rows } = await client.query<{ pid: number }>(
            "select pg_backend_pid() as pid from pg_sleep(0.2)",
          );
          await client.query("commit");
          return rows[0].pid;
        } finally {
          client.release();
        }
      }),
    );
    expect(new Set(pids).size).toBe(4);
  });
});
