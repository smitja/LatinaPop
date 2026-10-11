# PLAN — milestone

Regola: una milestone alla volta. Alla fine di ognuna esegui `pnpm lint && pnpm typecheck && pnpm test && pnpm test:db`, fai push del branch, riporta il riepilogo (fatto / non fatto / decisioni prese, con riferimento agli ID di SPEC) e **aspetta conferma** prima di proseguire.

L'ordine segue le due fasi del bando: **fase 1 = WebApp** (M0–M3, rilasciabile da sola), **fase 2 = PopCoin** (M4–M6). Il ledger (M4) si scrive e si testa a fondo prima di qualsiasi interfaccia PopCoin.

---

## M0 — Fondamenta

- Next.js + TypeScript strict + Tailwind + ESLint + Prettier, pnpm.
- Supabase CLI inizializzato; ambiente locale funzionante (o shim su PostgreSQL, vedi CLAUDE.md).
- Vitest (progetti `unit` e `db`), Playwright.
- `src/styles/tokens.css` con token provvisori, compresi i cinque colori dei cluster; pagina `/dev/tokens` che li mostra.
- Tre layout: area pubblica con la navigazione in basso, `/merchant`, `/admin`. Footer con la dicitura del finanziamento.
- Manifest PWA e icone segnaposto.
- `README.md` (setup da zero), `.env.example`, `docs/DECISIONS.md`.

**Fatto quando:** `pnpm dev` mostra i tre layout; i comandi di test girano; il README basta a un'altra persona.

## M1 — Schema, ruoli, accesso, demo (parte uno)

- Migrazioni di tutte le tabelle di SPEC §6 con vincoli, indici, RLS; lookup `clusters`, `zones`, `event_types` popolate; `settings` con `popcoin_enabled = false`.
- Permessi: nessuna scrittura diretta dal client sulle tabelle della regola 2 di CLAUDE.md.
- Helper SQL: `is_admin()`, `is_editor()`, `is_member(merchant_id, roles[])`.
- Login email OTP con `@supabase/ssr`, ritorno alla pagina di partenza, onboarding con consensi separati.
- Guardie server per `/merchant` e `/admin`; inviti titolare (da admin) e staff (da titolare).
- Test N1 (isolamento).
- **Demo, parte uno** (SPEC §11): `DEMO_MODE` con doppia sicura, fascia DEMO, `/demo` con cambio persona, "Ripristina demo", interruttore PopCoin, 404 a flag spento (con test). Seed demo minimo: 12 attività fittizie sui cinque cluster, utenti per ogni ruolo.

**Fatto quando:** test di isolamento verdi; ogni ruolo entra solo dove deve; in demo si passa da una persona all'altra in un tocco; senza flag `/demo` risponde 404.

## M2 — WebApp pubblica (fase 1)

- U1–U8, U11, U13–U15: Home, Mappa+elenco con filtri per cluster/tipo/offerte/accessibilità, scheda attività (con accessibilità e Pop Card in anteprima), offerte, Pop Trails come itinerari sulla mappa (senza bonus), preferiti, segnalazioni, installazione PWA, pagina "Il progetto".
- Eventi E1–E4: agenda, dettaglio con .ics e condivisione, segnalazione pubblica con anti-spam, annullamenti.
- Metadata e Open Graph per schede, eventi, offerte, percorsi.
- E2e: visitatore trova un'attività del cluster C con ingresso senza gradini, apre la scheda, salva un evento dopo il login.

**Fatto quando:** l'e2e passa su viewport iPhone e Android; un evento con orario e prezzo non comunicati mostra "da confermare" ovunque.

## M3 — Area attività e gestione rete (fase 1)

- M1, M3, M4, M6, M7, M10: selezione attività, scheda e orari con chiusure e accessibilità dichiarata, offerte, eventi, staff, download QR espositore.
- Admin: A1 attività con posizionamento su mappa, A2 import CSV da `data/imprese_aderenti.csv`, A3 ruoli, A4 impostazioni, A6 Pop Trails (solo itinerari), A8 moderazione, A11 partner, A13 audit, A14 kit QR in PDF.
- Upload immagini nei bucket con policy.

**Fatto quando:** l'import del CSV reale crea 44 attività in bozza senza errori e senza campi inventati; un titolare invitato pubblica un'offerta e un evento che compaiono subito nell'area pubblica. **La fase 1 è rilasciabile.**

## M4 — Ledger PopCoin (solo database + test)

- RPC di SPEC §6: `request_earn`, `request_redemption`, `cancel_request`, `approve_request`, `reject_request`, `reverse_entry`, `adjust_balance`, `expire_requests`.
- Calcolo coin dalla regola vigente (entrambe le modalità), limiti giornalieri, regola benvenuto, soglia minima, limite per utente, stock condizionale, `visits` (Pop Cards), valutazione percorsi con bonus e badge nella stessa transazione, divieto di auto-conferma.
- Codici di abbinamento, rate limit, `audit_log`.
- Test N2 completi, con connessioni parallele reali.

**Fatto quando:** tutti i test N2 passano dieci volte di fila.

## M5 — PopCoin: cliente e banco (fase 2)

- `/p/[qrId]` e schermata richiesta (U10) con aggiornamento in tempo reale (Supabase Realtime; polling ogni due secondi come ripiego).
- Banco (M2) con richieste live, conferma/rifiuto, importo se `mode='amount'`, spunta della soglia minima.
- U9: saldo, movimenti, premi, album Pop Cards, badge. M5: gestione premi con i quattro modelli. M8 report attività. M9 errori e storni.
- **Demo:** "Simula richiesta" sul banco e selettore del cliente demo su `/p/[qrId]`.
- E2e: utente nuovo inquadra il QR → si registra → chiede PopCoin → lo staff conferma → card sbloccata → riscatta un premio di benvenuto in un'altra attività.

**Fatto quando:** l'e2e passa; con `popcoin_enabled = false` nessuna parte del PopCoin è visibile né invocabile.

## M6 — Percorsi con premi, compensazione, indicatori, demo (parte due)

- Percorsi `list` e `any` con bonus e badge nell'interfaccia (U8 completo, A6 completo), premi di rete e approvazioni (A7).
- A5 regole, A9 transazioni e report di compensazione, A10 indicatori del bando e operativi con export CSV, A12 anomalie.
- MFA TOTP per l'admin (non per l'admin demo).
- **Demo, parte due:** dati completi di SPEC §11.2 con otto settimane di storico a seed fisso.

**Fatto quando:** gli indicatori sul seed demo coincidono con un conteggio fatto a mano su almeno tre casi, compresa la percentuale di transazioni tra cluster diversi.

## M7 — Notifiche push

- §5.5: iscrizione con consenso e categorie, guida per iPhone, invio da admin con anteprima e limite di frequenza, disiscrizione.

**Fatto quando:** una notifica di prova arriva su Android (browser) e su iPhone con la PWA installata.

## M8 — Rifinitura

- Accessibilità (N4) e prestazioni (N5) con Lighthouse mobile; correzioni.
- Pagine termini, informativa e regolamento PopCoin con segnaposto `[DA FORNIRE]`.
- Monitoraggio errori (se approvato) e alert sugli errori delle RPC PopCoin.
- `docs/RUNBOOK.md`: attivare un'attività, stampare il kit QR, gestire una contestazione, fare uno storno, backup e ripristino, rotazione chiavi, export per la rendicontazione.
- `docs/LAUNCH_CHECKLIST.md`: fase 1 (schede complete, eventi, dicitura, dominio, account della Rete) e fase 2 (regolamento approvato, verifica DPR 430, premi reali, percorsi, kit QR distribuiti, formazione "Retisti Digitali").

**Fatto quando:** le due checklist sono complete e un'attività fittizia si attiva da zero seguendo il runbook.
