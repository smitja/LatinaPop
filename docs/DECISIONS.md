# Decisioni

Scelte non coperte da SPEC o PLAN, con data e motivo. Le più recenti in fondo.

| Data | Decisione | Motivo |
| --- | --- | --- |
| 2026-10-11 | Branch: `main` contiene i documenti di progetto; ogni milestone ha il suo branch (`m0-fondamenta`, …). | Indicazione di CLAUDE.md; il repository era vuoto. |
| 2026-10-11 | Next.js 16.4 con `cacheComponents` e `partialPrefetching` attivi (default di `create-next-app`). | Pagine pubbliche prerenderizzate per N5; le parti dinamiche andranno in `<Suspense>` o `"use cache"`. |
| 2026-10-11 | TypeScript 5.9, non 7.0. | La 7.0 è uscita da poco: Next e typescript-eslint dichiarano compatibilità con la 5.x. Da rivalutare. |
| 2026-10-11 | Tailwind 4 con i token in `src/styles/tokens.css` (`@theme static`, così tutte le variabili sono disponibili anche in CSS e negli stili inline). | Un solo file da sostituire quando arriva l'identità visiva. |
| 2026-10-11 | Tipografia provvisoria: Archivo variabile (asse di larghezza: espanso per i titoli, condensato per etichette) e Atkinson Hyperlegible Next per il testo. Caricati con `next/font`, quindi serviti dal nostro dominio. | Carattere deciso con un solo font display; testo pensato per la leggibilità (pubblici adulti e anziani, testo al 200%). Nessuna richiesta a Google dal browser (§7). |
| 2026-10-11 | Palette provvisoria: carta `#f2f4f6`, inchiostro `#141a2e`; cluster A magenta, B blu, C giallo, D verde, E arancio. Ogni cluster ha anche il colore del testo sopra (bianco o inchiostro) e il "bollino" ha sempre bordo e lettera. | Contrasto AA verificato da un test unitario; i cluster non si distinguono mai solo dal colore. |
| 2026-10-11 | Ombre "da stampa" senza sfocatura e bollini leggermente ruotati come firma visiva. | Richiamo a figurine e adesivi (Pop Cards); unico elemento decorativo, il resto resta sobrio. |
| 2026-10-11 | Focus visibile: contorno inchiostro + alone giallo. | Resta visibile su tutti i fondi della palette, compresi i colori dei cluster. |
| 2026-10-11 | Solo tema chiaro. | Il contrasto AA è verificato su un tema; il tema scuro si valuta con l'identità definitiva. |
| 2026-10-11 | Impostazioni pubbliche lette da `getPublicSettings()`: nella M0 restituisce i default (`popcoin_enabled = false`, dicitura ufficiale); dalla M1 legge la tabella `settings`. La dicitura non può mai essere vuota. | Regola 13 e N9. |
| 2026-10-11 | `/popcoin` risponde 404 con PopCoin spento (controllo lato server); la quarta voce della navigazione diventa "Percorsi". | CLAUDE.md, Design; PLAN M5. |
| 2026-10-11 | Supabase locale senza edge runtime, analytics, vector, imgproxy, pooler. | Non usati dal progetto; avvio più leggero. Le notifiche push useranno `web-push` lato Next (M7). |
| 2026-10-11 | Nelle sessioni cloud le immagini Supabase si scaricano da Docker Hub (`SUPABASE_INTERNAL_IMAGE_REGISTRY=docker.io`, script `scripts/cloud-services.sh`). Lo shim PostgreSQL non è servito. | Il registro ECR è bloccato dal proxy ("Data limit exceeded"); Docker Hub funziona. |
| 2026-10-11 | Dipendenza di sviluppo `pg` per i test sul database. | Servono connessioni parallele reali per i test di concorrenza (N2); i client Supabase passano da HTTP. |
| 2026-10-11 | I test sul database accettano solo host locali. | Evita di lanciare test distruttivi su un database cloud per errore. |
| 2026-10-11 | Playwright: progetti `iphone` (viewport iPhone su Chromium), `android`, `desktop`. Variabile `PLAYWRIGHT_CHROMIUM_EXECUTABLE` per usare il Chromium preinstallato nelle sessioni cloud. | WebKit non è disponibile nell'ambiente cloud. |
| 2026-10-11 | Tipi generati in `src/lib/supabase/database.types.ts` (script `pnpm db:types`). | La struttura di CLAUDE.md mette i tipi generati in `src/lib/supabase/`; il comando in CLAUDE.md indica `src/lib/database.types.ts`. Da allineare in CLAUDE.md. |
| 2026-10-11 | Icone PWA segnaposto generate (bollino giallo con "P"); service worker rimandato alla M2 (U14, N6). | La M0 chiede manifest e icone; la cache va progettata con le pagine pubbliche reali. |
