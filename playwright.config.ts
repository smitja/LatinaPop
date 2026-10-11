import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

// Nelle sessioni cloud Chromium è preinstallato: si usa quello invece di
// scaricarne un altro (vedi README). In locale vale `pnpm exec playwright install chromium`.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined;
const launchOptions = executablePath ? { executablePath } : {};

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    locale: "it-IT",
    timezoneId: "Europe/Rome",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "iphone",
      // Viewport e user agent di iPhone, motore Chromium (WebKit non è
      // disponibile nell'ambiente cloud).
      use: { ...devices["iPhone 15"], browserName: "chromium", launchOptions },
    },
    {
      name: "android",
      use: { ...devices["Pixel 7"], launchOptions },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], launchOptions },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `pnpm exec next dev --port ${PORT}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
