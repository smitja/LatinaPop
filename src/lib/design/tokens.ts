// Lettura di src/styles/tokens.css e calcolo dei contrasti WCAG.
// Usato dalla pagina /dev/tokens e dai test: i valori restano in un solo file.

export type Token = { name: string; value: string };

export function parseTokens(css: string): Token[] {
  const tokens: Token[] = [];
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  for (const match of css.matchAll(re)) {
    tokens.push({ name: match[1], value: match[2].trim() });
  }
  return tokens;
}

export function tokenMap(css: string): Map<string, string> {
  return new Map(parseTokens(css).map((t) => [t.name, t.value]));
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`Colore non esadecimale a 6 cifre: ${hex}`);
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
