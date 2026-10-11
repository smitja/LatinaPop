import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CLUSTER_CODES } from "@/lib/domain/clusters";
import { contrastRatio, tokenMap } from "@/lib/design/tokens";

const css = readFileSync(path.join(process.cwd(), "src/styles/tokens.css"), "utf8");
const tokens = tokenMap(css);

describe("contrastRatio", () => {
  it("calcola i valori WCAG noti", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contrastRatio("#777777", "#ffffff")).toBeCloseTo(4.48, 1);
    expect(contrastRatio("#ffffff", "#ffffff")).toBe(1);
  });

  it("rifiuta colori non esadecimali", () => {
    expect(() => contrastRatio("red", "#ffffff")).toThrow();
  });
});

// Guardia per chi sostituirà i token provvisori con l'identità definitiva.
describe("design token", () => {
  it("definisce colore e colore del testo per ogni cluster, con contrasto AA", () => {
    for (const code of CLUSTER_CODES) {
      const key = code.toLowerCase();
      const fill = tokens.get(`--color-cluster-${key}`);
      const ink = tokens.get(`--color-cluster-${key}-ink`);
      expect(fill, `--color-cluster-${key}`).toBeDefined();
      expect(ink, `--color-cluster-${key}-ink`).toBeDefined();
      expect(contrastRatio(fill!, ink!), `cluster ${code}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("mantiene il testo principale e secondario leggibili sulla carta", () => {
    const paper = tokens.get("--color-paper")!;
    expect(contrastRatio(tokens.get("--color-ink")!, paper)).toBeGreaterThanOrEqual(7);
    expect(contrastRatio(tokens.get("--color-muted")!, paper)).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(tokens.get("--color-muted")!, tokens.get("--color-surface")!),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("ha un target touch di almeno 48px", () => {
    expect(tokens.get("--spacing-touch")).toBe("3rem");
  });
});
