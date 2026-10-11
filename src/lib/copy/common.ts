// Testo ufficiale della dicitura del finanziamento (SPEC §0, N9).
// Dalla M1 si legge da `settings`; questo valore resta come ripiego e non
// può essere sostituito da un testo vuoto.
export const FUNDING_NOTICE_DEFAULT =
  "Spesa finanziata dalla Regione Lazio ai sensi della D.G.R. 1254/2025 e s.m.i.";

export const common = {
  appName: "Latina Pop District",
  appShortName: "Pop District",
  appDescription:
    "Le attività del distretto pop di Latina: mappa, eventi, offerte, percorsi e PopCoin.",
  projectLink: "Il progetto",
  placeholder: "[DA FORNIRE]",
  comingSoon: "In arrivo",
} as const;

export const publicNav = {
  label: "Navigazione principale",
  home: "Home",
  map: "Mappa",
  events: "Eventi",
  popcoin: "PopCoin",
  trails: "Percorsi",
} as const;
