import { Archivo, Atkinson_Hyperlegible_Next } from "next/font/google";

// Display: Archivo variabile con asse di larghezza (espanso per i titoli,
// condensato per etichette e codici). Body: Atkinson Hyperlegible Next,
// progettato per la leggibilità (pubblico ampio, testo al 200%).
// I file vengono scaricati al build e serviti dal nostro dominio:
// nessuna richiesta a Google dal browser.
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  variable: "--font-atkinson",
  display: "swap",
  // Next non ha le metriche per generare il fallback calibrato di questo font.
  adjustFontFallback: false,
  fallback: ["system-ui", "Arial", "sans-serif"],
});
