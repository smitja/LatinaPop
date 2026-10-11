import { expect, test } from "@playwright/test";

const FUNDING = "Spesa finanziata dalla Regione Lazio ai sensi della D.G.R. 1254/2025 e s.m.i.";

test.describe("area pubblica", () => {
  test("Home con logo, navigazione in basso e dicitura del finanziamento", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Pop");

    const nav = page.getByRole("navigation", { name: "Navigazione principale" });
    await expect(nav.getByRole("link")).toHaveText(["Home", "Mappa", "Eventi", "Percorsi"]);
    await expect(nav.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");

    await expect(page.getByText(FUNDING)).toBeVisible();
  });

  test("le altre voci aprono la propria pagina con la dicitura", async ({ page }) => {
    for (const [label, heading] of [
      ["Mappa", "Mappa"],
      ["Eventi", "Eventi"],
      ["Percorsi", "Pop Trails"],
    ] as const) {
      await page.goto("/");
      await page
        .getByRole("navigation", { name: "Navigazione principale" })
        .getByRole("link", { name: label })
        .click();
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await expect(page.getByText(FUNDING)).toBeVisible();
    }
  });

  test("con PopCoin spento la sezione PopCoin non esiste", async ({ page }) => {
    const response = await page.goto("/popcoin");
    expect(response?.status()).toBe(404);
  });

  test("i cluster hanno sempre la lettera, non solo il colore", async ({ page }) => {
    await page.goto("/mappa");
    for (const code of ["A", "B", "C", "D", "E"]) {
      await expect(page.getByText(code, { exact: true }).first()).toBeVisible();
    }
  });

  test("il manifest della PWA è servito", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.ok()).toBe(true);
    const manifest = await response.json();
    expect(manifest.display).toBe("standalone");
    expect(manifest.lang).toBe("it");
  });
});

test.describe("console", () => {
  test("area attività con il Banco", async ({ page }) => {
    await page.goto("/merchant");
    await expect(page.getByRole("heading", { level: 1, name: "Banco" })).toBeVisible();
  });

  test("area Manager di Rete", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { level: 1, name: "Panoramica" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Sezioni amministrazione" })).toBeVisible();
  });

  test("pagina dei design token", async ({ page }) => {
    await page.goto("/dev/tokens");
    await expect(page.getByRole("heading", { level: 1, name: "Design token" })).toBeVisible();
  });
});
