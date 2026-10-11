# Latina Pop District — WebApp e PopCoin

Leggi questo file per intero prima di scrivere codice. Poi leggi `docs/SPEC.md` (cosa costruire, a partire dalla §0 Contesto) e `docs/PLAN.md` (in che ordine).

## Il progetto in breve

Latina Pop District è una rete costituenda di **44 attività su strada** di Latina, candidata con il Comune a un bando della Regione Lazio (100.000 €, programma di 21 mesi). Le attività sono divise in cinque cluster: A Pop, Gaming & Computer Shop · B Creatività, Stampa & Cultura visiva · C Food & Socialità · D Gusto & Filiera locale · E Servizi alla persona e alla comunità. Il tema pop **attira** il pubblico, il commercio di quartiere (soprattutto bar e ristorazione) lo **accoglie e lo fa tornare**.

Questa applicazione realizza due azioni del bando:
- **District WebApp**: PWA (niente store) con mappa per cluster, schede delle attività, calendario eventi, offerte pubblicate in autonomia dalle attività, Pop Trails, accessibilità, notifiche push.
- **PopCoin**: fidelizzazione condivisa. Il cliente inquadra il QR sull'espositore dell'attività, lo staff conferma dal proprio telefono, i punti si spendono in altre attività. Con Pop Cards (album digitale delle attività visitate), percorsi e badge.

Tre aree nella stessa applicazione:
- **Cittadini** (mobile-first, PWA).
- **Attività** (console da telefono dietro al banco + gestione di scheda, offerte, eventi, premi, staff).
- **Admin / Manager di Rete** (desktop): attività, moderazione, regole, percorsi, indicatori per il Comune, export per la rendicontazione.

La WebApp è **di proprietà della Rete** e deve riportare la dicitura del finanziamento regionale. Si rilascia in due fasi: prima la WebApp, poi il PopCoin, che si accende con un'impostazione (`settings.popcoin_enabled`).

## Stack (deciso)

- **Next.js** (App Router, ultima versione stabile) + **TypeScript** strict, PWA (manifest + service worker minimale)
- **Supabase**: Postgres, Auth (email OTP, niente password), Storage, Realtime, Row Level Security
- **Tailwind CSS** con design token centralizzati in un solo file
- **react-leaflet** + tile OpenStreetMap (attribuzione obbligatoria)
- **qrcode** per generare i QR degli espositori; **nessuna lettura QR** nell'app: il cliente usa la fotocamera del telefono
- **Zod** per validare ogni input lato server
- **Vitest** (unit + test sul database), **Playwright** (e2e sui flussi critici)
- **web-push** solo nella milestone delle notifiche
- Package manager **pnpm**. Deploy: Vercel + Supabase (account intestati alla Rete)

Non introdurre altre dipendenze senza motivarlo nel commit. Niente microservizi, niente ORM sopra Supabase, niente state manager globale se non serve.

## Comandi

```bash
pnpm dev                     # app in locale
supabase start               # Postgres/Auth/Storage/Realtime locali (Docker)
supabase db reset            # riapplica migrazioni + seed
supabase gen types typescript --local > src/lib/database.types.ts
pnpm test                    # unit
pnpm test:db                 # test su DB: RLS, ledger, concorrenza
pnpm e2e                     # Playwright
pnpm lint && pnpm typecheck
pnpm demo:seed               # dati finti della modalità demo (con DEMO_MODE=true)
```

### Ambiente di lavoro
Il progetto si sviluppa in sessioni cloud di Claude Code: ogni sessione parte da una macchina pulita che clona il repo da GitHub.
- Docker e PostgreSQL 16 sono preinstallati ma spenti. Avvia Docker, poi `supabase start` (la prima volta scarica le immagini e ci mette qualche minuto).
- Se `supabase start` non parte (spazio disco, immagini non scaricabili), ripiega sul PostgreSQL 16 preinstallato (`service postgresql start`) con uno shim minimo dello schema `auth` (`auth.users`, `auth.uid()` letto da `request.jwt.claims`, ruoli `anon` e `authenticated`), così migrazioni, RLS e test del ledger girano lo stesso. Documenta lo shim in `docs/DECISIONS.md`.
- In nessun caso simulare il database con mock per i test del ledger.
- La rete della sessione raggiunge npm e GitHub, non `*.supabase.co`: non collegarti a progetti Supabase cloud finché Simone non lo abilita.
- Un branch per milestone (`m0-fondamenta`, `m1-schema`, …), push alla fine: Simone vede l'anteprima dal deploy collegato al repo.

## Regole non negoziabili

Valgono più di qualsiasi scorciatoia. Se una richiesta futura le contraddice, segnalalo prima di procedere.

1. **Il saldo non si scrive mai.** Esiste solo `ledger_entries` (solo INSERT). Il saldo è la somma dei movimenti. Correzioni = nuovi movimenti `reversal` o `adjustment` collegati all'originale.
2. **Ogni scrittura economica passa da una funzione Postgres** (`SECURITY DEFINER`, `search_path` fissato) che verifica ruolo, stato, scadenza, limiti e duplicati **nella stessa transazione**. Il browser non scrive mai in `ledger_entries`, `requests` (se non tramite le RPC), `redemptions`, `visits`, `trail_completions`, né modifica `stock_used`.
3. **Il QR non accredita nulla da solo.** Ogni accredito e ogni riscatto richiede la conferma di uno staff autenticato e attivo dell'attività. Nessuno può confermare una propria richiesta.
4. **Idempotenza.** Confermare due volte la stessa richiesta restituisce l'esito originale, mai un secondo movimento.
5. **Concorrenza.** Due conferme simultanee sull'ultima unità di un premio, o sullo stesso saldo, producono un solo successo. Serializza per utente (`pg_advisory_xact_lock`) e decrementa lo stock con un UPDATE condizionale. Ci deve essere un test che lo dimostra.
6. **Autorizzazioni sul server.** Nascondere un pulsante non è un controllo. RLS su tutte le tabelle; ruoli verificati nelle funzioni e nelle route server.
7. **Isolamento.** Un utente vede solo il proprio portafoglio. Lo staff dell'attività A non legge né modifica nulla dell'attività B. I titolari vedono solo aggregati, mai nominativi dei clienti.
8. **Mai dati inventati.** Niente telefoni, indirizzi, partite IVA, orari o dati di accessibilità inventati o completati per analogia. Accessibilità sconosciuta = "non ancora verificato". Prezzo assente ≠ "gratis"; orario assente ≠ "00:00". I dati reali entrano solo da `data/imprese_aderenti.csv` (fonte: elenco ufficiale depositato) e dalle schede compilate dalle attività; il seed demo usa attività dichiaratamente fittizie.
9. **I PopCoin non sono denaro.** Nessun acquisto, trasferimento tra utenti, conversione in euro o valore monetario mostrato al cliente. Nessun movimento di denaro nell'app, nemmeno per il fondo cashback (solo report).
10. **Privacy minima.** Email, nome visualizzato facoltativo, consensi separati (marketing, notifiche) spenti di default. La posizione non si salva.
11. **Demo isolata.** La modalità demo (SPEC §11) esiste solo con `DEMO_MODE=true` lato server, su un database separato; le sue route rispondono 404 altrimenti; la logica PopCoin è identica a quella reale.
12. **Segreti.** La service role key di Supabase e le chiavi VAPID esistono solo sul server e nelle variabili d'ambiente.
13. **Dicitura del finanziamento** presente su ogni pagina pubblica (SPEC N9). Non va rimossa per ragioni estetiche.

## Convenzioni

- Codice, tabelle, variabili in **inglese**. Interfaccia in **italiano**, testi delle aree attività e admin centralizzati in `src/lib/copy/`.
- Date in UTC (`timestamptz`), mostrate in `Europe/Rome` con `Intl.DateTimeFormat('it-IT')`. Importi in centesimi (`integer`).
- Migrazioni in `supabase/migrations/`, una per argomento; mai modificare una migrazione già applicata.
- Struttura:
  ```
  src/app/(public)/...      # cittadini
  src/app/p/[qrId]/         # atterraggio dal QR dell'espositore
  src/app/merchant/...      # console attività (banco + gestione)
  src/app/admin/...         # Manager di Rete
  src/app/demo/             # solo modalità demo (404 altrimenti)
  src/demo/                 # seed demo, generatore storico, persona, simulazioni
  src/lib/supabase/         # client server/browser, tipi generati
  src/lib/domain/           # tipi e schemi Zod condivisi
  src/components/ui/        # primitive
  src/styles/tokens.css     # unico punto per colori (compresi i 5 colori cluster), tipografia, spaziature
  data/imprese_aderenti.csv # elenco reale delle 44 attività, per l'import admin
  ```
- Server Actions o Route Handlers che chiamano le RPC; la logica di business **non** si duplica in TypeScript.
- Ogni migrazione che tocca ledger, richieste o RLS arriva con i suoi test in `tests/db/`.

## Design

- **Cittadini**: navigazione in basso con quattro voci — **Home**, **Mappa** (mappa + elenco), **Eventi**, **PopCoin** (saldo, premi, album, percorsi). Con PopCoin spento la quarta voce diventa **Percorsi**. Logo solo nella Home. Safe area reali, leggibile con testo al 200%, effetti vetro solo dove il contrasto resta AA.
- **Cluster**: ognuno ha un colore e un segno (lettera o icona). Mai distinguere i cluster solo con il colore.
- **Banco**: si usa con una mano, in piedi, con il cliente davanti. La schermata mostra le richieste in arrivo con il codice di abbinamento enorme e due pulsanti: Conferma / Rifiuta. Tutto il resto è secondario.
- **Admin**: densa, tabellare, desktop.
- **Pubblico**: 16–45 anni e famiglie; tema pop come attrattore ma tanti utenti verranno per il bar o la pizzeria sotto casa. L'interfaccia deve essere giocosa ma immediata anche per chi non è "nerd".
- L'identità visiva del distretto non esiste ancora (la produce un'altra azione del bando): lavora su token in `tokens.css` facili da sostituire e su segnaposto per le Pop Cards. Evita l'aspetto da template generico (gradienti viola, card tutte uguali, emoji come icone, hero da SaaS). Se nell'ambiente sono disponibili skill di design frontend (`design-taste-frontend`, `frontend-design`, `ui-ux-pro-max`), usale.

## Come lavorare

- Segui le milestone di `docs/PLAN.md` in ordine. **Alla fine di ogni milestone**: lint, typecheck e test, poi fermati e riporta cosa è stato fatto, cosa manca e quali decisioni hai preso. Non iniziare la milestone successiva senza conferma.
- Se una scelta di prodotto non è coperta da SPEC, applica il default più semplice, annotalo in `docs/DECISIONS.md` (data, scelta, motivo) e segnalalo nel riepilogo.
- Valori economici e regole (coin per visita, limiti, bonus, TTL) sono **configurazione**, non costanti nel codice.
- Commit piccoli, messaggi in inglese, un argomento per commit.
