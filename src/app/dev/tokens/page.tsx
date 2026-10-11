import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { ClusterBadge } from "@/components/ui/cluster-badge";
import { CLUSTER_CODES, CLUSTERS } from "@/lib/domain/clusters";
import { contrastRatio, parseTokens, tokenMap } from "@/lib/design/tokens";

export const metadata: Metadata = {
  title: "Design token",
  robots: { index: false, follow: false },
};

// Letto al build: la pagina viene prerenderizzata.
async function loadTokens() {
  "use cache";
  const css = await readFile(path.join(process.cwd(), "src/styles/tokens.css"), "utf8");
  return { all: parseTokens(css), map: tokenMap(css) };
}

function Ratio({ fg, bg }: { fg: string; bg: string }) {
  const ratio = contrastRatio(fg, bg);
  const verdict =
    ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA testo grande" : "insufficiente";
  return (
    <span className="tabular-nums">
      {ratio.toFixed(2)}:1 · {verdict}
    </span>
  );
}

export default async function TokensPage() {
  const { all, map } = await loadTokens();
  const colors = all.filter((t) => t.name.startsWith("--color-") && t.value.startsWith("#"));
  const textSizes = all.filter((t) => /^--text-[a-z0-9]+$/.test(t.name));
  const radii = all.filter((t) => t.name.startsWith("--radius-"));
  const shadows = all.filter((t) => t.name.startsWith("--shadow-"));
  const spacing = all.filter((t) => t.name.startsWith("--spacing"));
  const paper = map.get("--color-paper")!;

  return (
    <main className="mx-auto grid max-w-4xl gap-12 px-gutter py-10">
      <header>
        <p className="font-display-narrow text-sm uppercase tracking-widest text-muted">
          src/styles/tokens.css
        </p>
        <h1 className="text-3xl">Design token</h1>
        <p className="mt-2 max-w-prose text-sm text-muted">
          Token provvisori: l&apos;identità visiva del distretto arriva dall&apos;azione 1.1. I
          valori sono letti direttamente dal file dei token.
        </p>
      </header>

      <section aria-labelledby="cluster" className="grid gap-4">
        <h2 id="cluster" className="text-xl">
          Cluster
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {CLUSTER_CODES.map((code) => {
            const key = code.toLowerCase();
            const fill = map.get(`--color-cluster-${key}`)!;
            const ink = map.get(`--color-cluster-${key}-ink`)!;
            return (
              <li
                key={code}
                className="flex items-center gap-4 rounded-card border-2 border-line bg-surface p-4"
              >
                <ClusterBadge code={code} size="lg" />
                <div className="text-sm">
                  <p className="font-semibold">{CLUSTERS[code].label}</p>
                  <p className="text-muted">
                    {fill} · testo {ink}
                  </p>
                  <p>
                    Testo sul colore: <Ratio fg={ink} bg={fill} />
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="colori" className="grid gap-4">
        <h2 id="colori" className="text-xl">
          Colori
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {colors.map((t) => (
            <li key={t.name} className="flex items-center gap-3 text-sm">
              <span
                className="size-12 shrink-0 rounded-sticker border-2 border-line"
                style={{ background: t.value }}
              />
              <span>
                <code className="block font-semibold">{t.name}</code>
                <span className="text-muted">{t.value}</span>
                <span className="block text-xs">
                  su paper: <Ratio fg={t.value} bg={paper} />
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tipografia" className="grid gap-4">
        <h2 id="tipografia" className="text-xl">
          Tipografia
        </h2>
        <div className="grid gap-2 rounded-card border-2 border-line bg-surface p-5">
          <p className="font-display-wide text-2xl">Archivo espanso — titoli</p>
          <p className="font-display-narrow text-xl uppercase">Archivo condensato — etichette</p>
          <p>Atkinson Hyperlegible Next — testo corrente, pensato per la leggibilità.</p>
        </div>
        <ul className="grid gap-3">
          {textSizes.map((t) => (
            <li key={t.name} className="flex items-baseline gap-4">
              <code className="w-28 shrink-0 text-xs text-muted">
                {t.name} {t.value}
              </code>
              <span style={{ fontSize: `var(${t.name})`, lineHeight: 1.1 }}>Pop District</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="spazi" className="grid gap-4">
        <h2 id="spazi" className="text-xl">
          Spaziature, raggi, ombre
        </h2>
        <ul className="grid gap-2 text-sm">
          {spacing.map((t) => (
            <li key={t.name} className="flex items-center gap-3">
              <code className="w-40 shrink-0 text-xs">{t.name}</code>
              <span className="h-3 bg-ink" style={{ width: t.value }} />
              <span className="text-muted">{t.value}</span>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-6">
          {radii.map((t) => (
            <li key={t.name} className="grid justify-items-center gap-2 text-xs">
              <span
                className="size-16 border-2 border-line bg-surface"
                style={{ borderRadius: t.value }}
              />
              <code>{t.name}</code>
            </li>
          ))}
          {shadows.map((t) => (
            <li key={t.name} className="grid justify-items-center gap-2 text-xs">
              <span
                className="size-16 rounded-card border-2 border-line bg-surface"
                style={{ boxShadow: t.value }}
              />
              <code>{t.name}</code>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
