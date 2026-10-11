# SPEC — Latina Pop District · WebApp e PopCoin

Versione 2.0 · 11 ottobre 2026. Allineata ai documenti depositati per il bando (relazione illustrativa e scheda finanziaria del 30/09/2026) e alla nota funzionale PopCoin della Manager di Rete.

## 0. Contesto — leggere prima di tutto

**La rete.** "Latina Pop District" è una rete costituenda di **44 attività economiche su strada** del Comune di Latina, sostenuta da Confesercenti Latina e candidata con il Comune all'Avviso della Regione Lazio "Reti di imprese tra attività economiche su strada" (Det. G07030 del 22/05/2026, mod. G10627 del 29/07/2026; D.G.R. 1254/2025). Finanziamento richiesto: 100.000 €, durata massima del programma 21 mesi. Referente della rete: Mauro Maretto (MM Color). Manager di Rete: Patrizia Scifo. Project manager della WebApp: Simone Mitjans.

**Il concetto.** "Pop" ha due sensi: la cultura pop (gaming, tecnologia, fumetto, illustrazione, musica) che **attira** il pubblico, e il commercio popolare (bar, pizzeria, bottega, servizio sotto casa) che lo **accoglie e lo fa tornare**. La maggior parte delle attività non è "nerd": sono bar, ristoranti, servizi. Pubblico: 16–45 anni, famiglie, pubblico degli eventi pop cittadini (tra cui il Latina Nerd Fest), residenti.

**I cinque cluster** (sono la classificazione principale dell'app):

| Codice | Cluster | Ruolo | Attività |
|---|---|---|---|
| A | Pop, Gaming & Computer Shop | Attrattori: tornei, demo, esperienze | 5 |
| B | Creatività, Stampa & Cultura visiva | Laboratori: workshop, contest, mostre | 8 |
| C | Food & Socialità | Luoghi d'incontro: serate a tema, principali luoghi dove si spendono i PopCoin | 18 |
| D | Gusto & Filiera locale | Prodotti dell'Agro Pontino | 4 |
| E | Servizi alla persona e alla comunità | Vita di quartiere, pubblici adulti e anziani | 9 |

L'elenco reale è in `data/imprese_aderenti.csv` (vedi §5.3, A2).

**Cosa è stato promesso nel bando** (vincola il prodotto):
- **Azione 2.1 – District WebApp (19.500 €).** Progressive Web App usabile da smartphone **senza passare dagli store**: mappa interattiva filtrabile per cluster, scheda per ogni attività, calendario unico degli eventi aperto a tutti, notifiche push, percorsi tematici **"Pop Trails"**, area riservata in cui ogni attività **pubblica in autonomia offerte ed eventi**. Accessibile, conforme al GDPR, **di proprietà della Rete**, con la dicitura del finanziamento regionale. Sviluppo T1–T3, esercizio T3–T7 (trimestri dall'avvio).
- **Azione 2.2 – PopCoin (19.500 €).** Fidelizzazione integrata nella WebApp: il cliente accumula PopCoin **inquadrando il QR code dell'attività** e li spende nelle attività del distretto. Due livelli: ricompense non monetarie (accesso prioritario agli eventi, badge, visibilità nella community) e vantaggi commerciali oltre una soglia di spesa, secondo un regolamento della Rete. Premia chi compra in un'attività e spende in un'altra. A costo zero per le imprese. Sviluppo T4–T5, esercizio T5–T7.
- **Azione 1.1** prevede un espositore con QR code PopCoin per ogni attività e le **"Pop Cards"**, figurine collezionabili delle attività da raccogliere passando di negozio in negozio (T5).
- **Azione 1.4 / Pop Quest**: caccia al tesoro diffusa con mappa e indizi nella WebApp (fase successiva, vedi §10).
- **Azione 3.2 – Pop Point**: mappatura dell'accessibilità delle 44 attività (ingressi, barriere, servizi) **pubblicata nella WebApp**.
- **Monitoraggio con il Comune**: attività presenti nella WebApp e attive nel PopCoin, utenti registrati, eventi realizzati. Obiettivi dichiarati: 3.000+ utenti registrati, 30%+ transazioni tra cluster diversi.
- **Dicitura obbligatoria** nell'interfaccia: "Spesa finanziata dalla Regione Lazio ai sensi della D.G.R. 1254/2025 e s.m.i."
- Visibilità di un eventuale **partner/sponsor** nella WebApp e nel circuito PopCoin.

**Due fasi di rilascio.** Fase 1: WebApp (scoperta, eventi, offerte, area attività). Fase 2: PopCoin, Pop Cards, percorsi con premi. Il codice si sviluppa tutto, ma il PopCoin si accende con un'impostazione (`settings.popcoin_enabled`), così la rete può lanciare la fase 1 senza mostrarlo.

## 1. Obiettivo del prodotto

Far muovere i clienti tra le attività della rete, e tra cluster diversi, e farli tornare. Scoperta (mappa, schede, eventi, offerte) per portarli; PopCoin, percorsi e Pop Cards per farli girare e ritornare; dati aggregati per dimostrarlo a esercenti, rete e Comune.

## 2. Ruoli

Una persona può avere più ruoli. I permessi dipendono da ruolo e attività, mai dal dispositivo.

| Ruolo | Dove vive | Può fare | Non può fare |
|---|---|---|---|
| Visitatore | — | Consultare mappa, schede, eventi, offerte, premi, percorsi; segnalare un evento | Usare i PopCoin |
| Utente | `profiles` | Chiedere PopCoin e riscatti al banco, vedere movimenti, album, percorsi, preferiti; gestire i propri dati | Vedere dati di altri |
| Staff | `merchant_members.role='staff'` | Confermare o rifiutare le richieste del cliente nella propria attività; vedere le operazioni di oggi | Modificare scheda, premi, offerte, staff |
| Titolare | `merchant_members.role='owner'` | Come lo staff + scheda, orari, accessibilità dichiarata, offerte, eventi, premi, staff, report; chiedere storni | Vedere l'elenco nominativo dei clienti; modificare coin |
| Editor | `platform_roles.role='editor'` | Moderare eventi, offerte e segnalazioni; correggere schede e accessibilità | Coin, regole, ruoli |
| Admin (Manager di Rete) | `platform_roles.role='admin'` | Tutto: attività, ruoli, regole, percorsi, premi di rete, partner, impostazioni, storni, indicatori, export | Modificare o cancellare movimenti esistenti |

La **Rete stessa** è un'attività speciale (`merchants.kind='network'`, non mostrata sulla mappa): il suo staff (es. al Pop Point durante i Pop Weekend) conferma i riscatti dei **premi di rete** (accesso prioritario, gadget).

Il titolare entra solo su invito dell'admin, lo staff solo su invito del titolare. Uno staff non può confermare richieste fatte da sé stesso.

## 3. PopCoin — regole

### 3.1 Natura
Punti di un programma fedeltà condiviso. Non si comprano, non si trasferiscono tra utenti, non si convertono in denaro. Nessun valore in euro mostrato all'utente. Il regolamento definitivo lo approva la Rete (con verifica sul DPR 430/2001): il codice rende configurabili i parametri, non li fissa.

### 3.2 Regola di emissione (`coin_rules`, versionata, unica per la rete)
- `mode`: `'visit'` (default: coin fissi per acquisto confermato) | `'amount'` (coin proporzionali alla spesa dichiarata dallo staff)
- `coins_per_visit` (default 10), `coins_per_euro` (default 1), `min_amount_cents`, `max_coins_per_tx` (default 50)
- `max_earns_per_user_per_merchant_per_day` (default 1)
- `request_ttl_seconds` (default 300)
- `expiry_days` (default `null`: nessuna scadenza)
- `valid_from`, `version`, `created_by`

Solo INSERT: ogni movimento resta collegato alla versione con cui è nato. In modalità `amount`: `coins = min(floor(amount_cents/100) * coins_per_euro, max_coins_per_tx)`, zero sotto la soglia.

### 3.3 Limiti
- Massimo `max_earns_per_user_per_merchant_per_day` accrediti per utente per attività per giorno (Europe/Rome).
- Il saldo non diventa negativo per un riscatto. Può diventarlo solo per uno storno admin di coin già spesi; in quel caso i riscatti sono bloccati finché torna ≥ 0.
- Attività sospesa o uscita: niente nuove richieste; i suoi premi vanno in pausa.

### 3.4 Premi (`rewards`) — i quattro modelli della nota funzionale
La nota della Manager di Rete descrive quattro modelli non esclusivi. La v1 li supporta con i campi del premio, senza movimenti di denaro:

| Modello | Come si configura |
|---|---|
| 1. Sconto autofinanziato dal venditore | Premio dell'attività, `funding='merchant'` |
| 2. Cross-spesa con soglia minima | Premio dell'attività con `min_spend_cents` (lo staff conferma che la spesa minima è raggiunta) |
| 3. Fondo cashback centralizzato | Premio con `funding='network_fund'`: l'attività lo eroga, la rete lo rimborsa fuori dall'app. L'app produce il **report di compensazione** (A9) con quanti riscatti e quale costo dichiarato rimborsare a chi |
| 4. Reward non monetari | `kind='non_monetary'` o `'experience'`; spesso premi **di rete** (`merchant_id` = attività-Rete) |

Campi: `merchant_id`, `title`, `description`, `conditions` (obbligatorio), `kind` (`discount_percent | discount_fixed | free_item | experience | non_monetary`), `value_percent`, `value_cents`, `min_spend_cents`, `cost_coins` (> 0), `funding` (`merchant | network_fund`), `merchant_cost_cents` (costo interno dichiarato, mai mostrato al cliente, serve al report), `stock_total` (null = illimitato), `stock_used`, `per_user_limit`, `first_visit_only`, `valid_from`, `valid_to`, `status` (`draft | active | paused | archived`), `image_path`.

**Premio di benvenuto** (`first_visit_only`): valido solo se l'utente non ha movimenti presso quell'attività in un giorno precedente a oggi. È la leva più diretta per lo scambio di clienti: l'attività "paga" solo per clienti nuovi.

Ogni titolare sceglie quali premi offrire (pannello premi, M5). Pubblicare richiede titolo, condizioni, tipo, costo, data d'inizio; i premi `network_fund` richiedono approvazione admin.

### 3.5 Pop Trails (percorsi) e missioni
Un'unica entità `trails` copre i "Pop Trails" del bando e le "missioni a tempo" della nota funzionale.
- `kind='list'`: un percorso curato su attività precise (`trail_stops`, con ordine di visualizzazione), mostrato sulla mappa. Completato quando l'utente ha **visitato** tutte le tappe (o `required_count` di esse).
- `kind='any'`: missione aperta, es. "visita tre attività del cluster A in un weekend". Campi: `required_count`, `cluster_filter` (array, opzionale), `required_distinct_clusters` (opzionale).
- Comuni: `title`, `description`, `cover_path`, `valid_from`, `valid_to`, `bonus_coins` (0 = nessun bonus), `badge_id` (opzionale), `status`.

**Visita** = una richiesta confermata (accredito o riscatto) presso l'attività. Al completamento, nella stessa transazione: movimento `trail_bonus` e/o badge, riga in `trail_completions` (unica per utente e percorso). Un percorso si può consultare anche senza PopCoin attivo (fase 1: percorsi solo come itinerari sulla mappa, senza bonus).

### 3.6 Pop Cards (album digitale) e badge
- Ogni attività attiva ha una **Pop Card** (immagine `card_image_path`, con segnaposto generato dal colore del cluster finché non arrivano le illustrazioni).
- L'utente sblocca la card di un'attività alla prima **visita** confermata lì. L'album mostra carte sbloccate e coperte, per cluster, con il conteggio ("12 di 44").
- **Badge** (`badges`, `user_badges`): assegnati da percorsi completati o manualmente dall'admin (es. "Presente al lancio"). Visibili nel profilo.
- Le Pop Cards fisiche dell'azione 1.1 possono riportare un QR che apre la card nell'app: previsto come link `/card/[merchant-slug]`, nessuna logica extra.

## 4. Flussi al banco — "il cliente chiede, lo staff conferma"

Ogni attività ha un **QR fisso** sull'espositore del kit (azione 1.1), che apre `https://<dominio>/p/<qr_id>` (`qr_id` casuale e rigenerabile dall'admin se abusato). Il QR da solo non accredita nulla: ogni operazione richiede la **conferma di uno staff autenticato** sul proprio telefono. Così una foto dell'espositore non serve a niente, e lo staff non deve scansionare nulla.

### 4.1 Accumulare PopCoin
1. Il cliente inquadra l'espositore con la fotocamera → pagina dell'attività con il pulsante "Ricevi PopCoin". Se non è autenticato: login (email + codice OTP) e ritorno alla stessa pagina.
2. `request_earn(qr_id)` crea una richiesta `pending` con scadenza (TTL) e un **codice di abbinamento** di tre caratteri. Lo schermo del cliente mostra in grande codice, nome visualizzato e conto alla rovescia: "Mostralo alla cassa".
3. La console dello staff mostra in tempo reale le richieste aperte (codice, nome abbreviato, ora). Lo staff tocca quella giusta, inserisce l'importo se `mode='amount'`, e conferma (`approve_request`) oppure rifiuta.
4. Il server, in un'unica transazione, ricontrolla stato, scadenza, ruolo, limiti; scrive il movimento `earn`; sblocca la Pop Card se è la prima visita; valuta i percorsi.
5. Il cliente vede "+10 PopCoin da …", eventuale card sbloccata e progresso dei percorsi. Lo staff vede "Confermato".

### 4.2 Riscattare un premio
1. Dalla pagina dell'attività (via espositore o via app) il cliente sceglie un premio, legge condizioni e soglia minima, vede saldo attuale e saldo dopo → "Usa al banco".
2. `request_redemption(reward_id)` verifica in anticipo saldo, stato, limiti (senza bloccare nulla) e crea una richiesta `pending` con codice di abbinamento.
3. Lo staff vede la richiesta con il nome del premio; se c'è una soglia minima spunta "Spesa minima verificata"; conferma.
4. `approve_request` in un'unica transazione: lock per utente; richiesta aperta e non scaduta; premio attivo e valido; saldo ≥ costo e non negativo; limite per utente; regola benvenuto; UPDATE condizionale dello stock. Poi movimento `redeem` (negativo), riga `redemptions` con fotografia delle condizioni (`reward_snapshot`), Pop Card e percorsi come sopra.
5. Il cliente vede la ricevuta; lo staff "Consegna il premio".

Se la conferma si ripete (doppio tocco, rete instabile) il risultato è lo stesso della prima volta: `approve_request` è idempotente sulla richiesta. Nessuna operazione si conferma offline. Se il premio non può essere consegnato dopo la conferma, il titolare apre una contestazione e l'admin fa lo storno.

### 4.3 Storni e rettifiche
- Staff: "Segnala errore" su un'operazione di oggi. Titolare: "Chiedi storno" su qualsiasi operazione della propria attività. Entrambi creano un `report` di tipo `transaction_dispute`.
- Solo l'admin esegue `reverse_entry(entry_id, reason)`: movimento `reversal` collegato (uno per movimento); se era un riscatto libera lo stock.
- `adjust_balance(user_id, amount, reason)`: rettifica admin motivata.
- Tutto in `audit_log`.

### 4.4 Ingresso delle attività
1. L'admin importa le 44 attività da CSV (A2) in stato `draft`, le posiziona sulla mappa, le attiva.
2. Invita il titolare via email; il titolare accetta (login OTP con la stessa email) e completa scheda, orari, accessibilità dichiarata.
3. Il titolare invita lo staff; la revoca è immediata (il controllo è nelle funzioni server, non nella sessione).
4. Dall'admin si scarica il QR dell'espositore di ogni attività (PNG e PDF in formato stampa) per il kit.

## 5. Funzioni per area

### 5.1 Cittadini (PWA, mobile-first)

| ID | Funzione | Criterio di accettazione |
|---|---|---|
| U1 | Consultazione libera | Tutto il catalogo (mappa, schede, eventi, offerte, percorsi, premi) visibile senza account. Link diretti a scheda, evento, offerta, percorso si aprono senza passaggi. |
| U2 | Accesso | Email + codice OTP. Ritorno alla pagina di partenza (compresa `/p/<qr_id>`). Primo accesso: nome visualizzato facoltativo, termini, consenso marketing separato e spento, consenso notifiche separato. |
| U3 | Home | Ricerca; eventi in arrivo; offerte del distretto; percorsi in evidenza; attività a rotazione; slot partner (se attivo). Logo solo qui. Se PopCoin attivo e utente autenticato: saldo e progresso album come scorciatoia. |
| U4 | Mappa ed elenco | Mappa e lista equivalenti e sincronizzate. Filtro per **cluster** (colore per cluster, mai solo colore: anche icona/lettera), tipo di attività, "con offerte", "ingresso senza gradini". Posizione facoltativa e non salvata. |
| U5 | Scheda attività | Nome, cluster, tipo, indirizzo, orari dichiarati (con chiusure eccezionali; "Aperto ora" solo con orari completi), contatti presenti, descrizione, foto, **accessibilità** (solo campi verificati, altrimenti "non ancora verificato"), offerte attive, premi PopCoin, eventi, Pop Card, percorsi che la includono, "Indicazioni". |
| U6 | Eventi | Agenda (§5.4). |
| U7 | Offerte | Elenco offerte attive di tutte le attività, filtrabile per cluster; dettaglio con condizioni e validità. |
| U8 | Pop Trails | Elenco percorsi; dettaglio con mappa delle tappe, descrizione, finestra temporale, bonus/badge; progresso personale se autenticato. |
| U9 | PopCoin | Saldo, movimenti, premi (filtro "posso permettermelo", per cluster), album Pop Cards, badge. Nascosto se `popcoin_enabled = false`. |
| U10 | Pagina `/p/<qr_id>` e schermata richiesta | Flussi §4.1 e §4.2. Stati chiari: in attesa (codice grande + conto alla rovescia), confermato, rifiutato, scaduto, limite raggiunto, saldo insufficiente, offline. Aggiornamento in tempo reale. |
| U11 | Preferiti | Attività, eventi, percorsi salvati. |
| U12 | Profilo e dati | Nome, consensi (marketing, notifiche) con revoca, esporta i miei dati (JSON), elimina account (§7). |
| U13 | Segnalazioni | "Segnala un errore" da scheda, evento, offerta; "Contesta" da un movimento. |
| U14 | Installazione PWA | Manifest, icone, avvio a schermo intero; guida "Aggiungi alla schermata Home" per iOS (necessaria anche per le notifiche su iPhone). |
| U15 | Dicitura e info | Footer su tutte le pagine pubbliche e pagina "Il progetto" con la dicitura del finanziamento regionale, i loghi richiesti (segnaposto `[DA FORNIRE]`) e i riferimenti alla Rete. |

### 5.2 Attività (`/merchant`)

| ID | Funzione | Criterio di accettazione |
|---|---|---|
| M1 | Selezione attività | Scelta se membro di più attività; nessun accesso senza membership attiva. |
| M2 | Banco | Schermata principale: richieste aperte in tempo reale con codice di abbinamento grande, tipo (accredito / premio), nome abbreviato, scadenza; "Conferma" e "Rifiuta" con target ≥ 48px. Sotto: operazioni di oggi. Con PopCoin spento la schermata mostra solo i link di gestione. |
| M3 | Scheda e orari (titolare) | Descrizione, foto, contatti, orari, chiusure eccezionali, **accessibilità dichiarata** (diventa "verificata" solo dopo controllo dell'editor/Pop Point). Nome, cluster, indirizzo e posizione li cambia l'admin. |
| M4 | Offerte (titolare) | Crea, modifica, duplica, pausa, archivia. Titolo, descrizione, condizioni, validità, immagine. Pubblicazione diretta; l'editor può sospendere. |
| M5 | Premi PopCoin (titolare) | Campi §3.4, modelli 1/2/4 in autonomia; modello 3 (`network_fund`) richiede approvazione admin. Anteprima della card premio come la vede il cliente. |
| M6 | Eventi (titolare) | Crea, modifica, duplica, annulla eventi ospitati dalla propria attività. Pubblicazione diretta; l'editor può sospendere. |
| M7 | Staff (titolare) | Invito per email, elenco, revoca immediata. |
| M8 | Report (titolare) | Per periodo: PopCoin emessi, premi riscattati, visite, clienti distinti, **clienti nuovi**, **clienti arrivati dalla rete** (prima della prima visita qui avevano visite altrove), clienti di ritorno, provenienza per cluster. Definizione accanto a ogni numero. Mai dati di altre attività né nominativi. |
| M9 | Errori | Staff: segnala errore su un'operazione di oggi. Titolare: chiedi storno motivato. |
| M10 | Kit | Il titolare scarica il proprio QR espositore (PNG/PDF). |

### 5.3 Admin — Manager di Rete (`/admin`)

| ID | Funzione | Criterio di accettazione |
|---|---|---|
| A1 | Attività | Elenco con stato e completezza della scheda; crea, modifica, attiva, sospendi, segna uscita (con data). Posizione cliccando sulla mappa o inserendo lat/lng; nessun geocoding automatico. Invito titolare. Rigenera `qr_id`. |
| A2 | Import CSV | Formato di `data/imprese_aderenti.csv`: `name, legal_name, cluster, activity_type, address, city, zone, lat, lng, phone, website, instagram, source`. Anteprima con errori per riga; campi vuoti restano vuoti; righe senza `name` o `cluster` scartate; attività importate in `draft`; reimport idempotente su `legal_name`. |
| A3 | Ruoli | Assegna/revoca editor e admin; audit. |
| A4 | Impostazioni | `popcoin_enabled`, testo della dicitura, link a termini e informativa, contatti della Rete. |
| A5 | Regole PopCoin | Regola vigente, storico, nuova versione con anteprima dell'effetto. |
| A6 | Pop Trails e badge | Crea/modifica percorsi (`list` e `any`) con tappe dalla mappa; badge; completamenti. |
| A7 | Premi di rete e approvazioni | Premi dell'attività-Rete; approvazione dei premi `network_fund`. |
| A8 | Moderazione | Coda unica: eventi segnalati dal pubblico, offerte/eventi sospesi, segnalazioni di contenuto, accessibilità da verificare. Approva, chiedi modifiche, rifiuta con motivo; cronologia. |
| A9 | PopCoin: transazioni e compensazione | Ricerca movimenti (ID, email, attività, periodo); dettaglio; storno e rettifica motivati; coda contestazioni. **Report di compensazione**: per attività e periodo, premi `network_fund` riscattati e costo dichiarato; PopCoin emessi e spesi per attività e per cluster (matrice cluster di accumulo × cluster di spesa). |
| A10 | Indicatori | Dashboard §9 con filtri temporali e definizioni; export CSV per la rendicontazione. |
| A11 | Partner | Partner/sponsor con logo, link, posizione (`home`, `popcoin`), finestra di validità; etichetta "Partner" sempre visibile. |
| A12 | Anomalie | Staff con molte conferme ravvicinate, utenti con molte richieste rifiutate, storni frequenti. Segnali da valutare, nessuna azione automatica. |
| A13 | Audit ed export | Audit log filtrabile; export di dati personali solo admin e registrato. |
| A14 | Kit QR | Download massivo dei QR espositore (un PDF con una pagina per attività: nome, cluster, QR). |

### 5.4 Eventi

Un evento = una data (le serie si fanno con "Duplica"). Campi: `title`, `description`, `event_type` (lookup modificabile: serata a tema, torneo, retro-gaming, Boardgame & Beer, contest, firmacopie, Pop Food Night, workshop, Pop Weekend, altro), `cluster` (opzionale), `starts_at`, `ends_at`, `time_unknown`, `all_day`, `merchant_id` (attività ospitante, opzionale), `venue_name`, `address`, `lat`, `lng`, `price_text`, `is_free` (null = non comunicato), `official_url`, `image_path`, `organizer_name`, `is_network_event` (organizzato dalla Rete: palinsesto "Pop Events"), `source` (`merchant | admin | public_submission`), `status` (`pending | published | cancelled | rejected`), `last_verified_at`.

| ID | Funzione | Criterio |
|---|---|---|
| E1 | Agenda | Filtri Oggi, Weekend, data, tipo, cluster, "Eventi della Rete". Ordine cronologico. Eventi conclusi fuori dall'agenda, pagina raggiungibile. |
| E2 | Dettaglio | Data, orario o "da confermare", luogo, prezzo o "da confermare", organizzatore, link ufficiale, attività ospitante, stato. Condividi (Web Share + copia link), aggiungi al calendario (.ics), indicazioni. |
| E3 | Segnala un evento | Form pubblico senza account (titolo, data, luogo, link, email facoltativa, testo) → `pending`. Honeypot + rate limit per IP. Nessun ruolo concesso. |
| E4 | Annullamenti | Stato "Annullato" ben visibile fino alla data, poi fuori dall'agenda. |

### 5.5 Notifiche push (milestone dedicata)
Web Push con consenso esplicito e categorie (eventi della Rete, offerte, PopCoin). Su iPhone funzionano solo con la PWA aggiunta alla schermata Home: l'interfaccia lo spiega. L'admin invia notifiche per categoria con anteprima e limite di frequenza. Nessuna notifica geolocalizzata nella v1.

## 6. Modello dati

Postgres (Supabase), RLS su tutte le tabelle, `id uuid`, `created_at timestamptz`.

```
settings            key, value jsonb                                   (popcoin_enabled, testi, contatti)
clusters            code ('A'..'E'), label, color_token, sort
zones               slug, label, sort
event_types         slug, label, sort
profiles            id (= auth.users.id), display_name, marketing_consent, marketing_consent_at,
                    push_consent, terms_version, deleted_at
platform_roles      user_id, role ('admin'|'editor')
merchants           kind ('shop'|'network'), slug, name, legal_name, cluster, activity_type, zone,
                    address, city, lat, lng, phone, website, instagram, description, image_path,
                    card_image_path, opening_hours jsonb, accessibility jsonb, accessibility_verified_at,
                    qr_id unique, status ('draft'|'active'|'suspended'|'left'), left_at, source
merchant_closures   merchant_id, date, note
merchant_members    merchant_id, user_id, role ('owner'|'staff'), revoked_at
invites             merchant_id, email, role, token_hash, expires_at, accepted_at, created_by
offers              merchant_id, title, description, conditions, image_path, valid_from, valid_to,
                    status ('active'|'paused'|'archived'|'suspended')
coin_rules          (§3.2)                                              solo INSERT
rewards             (§3.4)
requests            type ('earn'|'redeem'), user_id, merchant_id, reward_id, match_code,
                    status ('pending'|'approved'|'rejected'|'expired'|'cancelled'), expires_at,
                    amount_cents, min_spend_confirmed, decided_by, decided_at, ledger_entry_id
redemptions         user_id, reward_id, merchant_id, request_id unique, ledger_entry_id, reward_snapshot jsonb
ledger_entries      user_id, merchant_id, staff_user_id, type ('earn'|'redeem'|'trail_bonus'|
                    'reversal'|'adjustment'|'expire'), amount int, rule_id, request_id, redemption_id,
                    trail_id, reverses_entry_id unique, reason, created_by           solo INSERT
visits              user_id, merchant_id, first_at                     PK (user_id, merchant_id)
                    (= Pop Card sbloccata; scritta dalle funzioni)
trails              (§3.5)       trail_stops: trail_id, merchant_id, position
trail_completions   trail_id, user_id, ledger_entry_id, completed_at  PK (trail_id, user_id)
badges              slug, title, description, image_path
user_badges         user_id, badge_id, source ('trail'|'admin'), awarded_at
events              (§5.4) + submitter_email, created_by, moderation_note
event_stats         event_id, date, views, outbound_clicks              (contatori anonimi)
favorites           user_id, target_type ('merchant'|'event'|'trail'), target_id
partners            name, logo_path, url, placement, valid_from, valid_to, status
push_subscriptions  user_id, endpoint, keys jsonb, categories text[]
reports             type ('content_error'|'transaction_dispute'|'staff_error'|'accessibility'|'other'),
                    merchant_id, event_id, offer_id, ledger_entry_id, message, status, created_by,
                    resolved_by, resolution
audit_log           actor_id, action, entity, entity_id, data jsonb    solo INSERT
```

Valori iniziali di `zones` (modificabili dall'admin): Centro, Q4, Q5, Nascosa, Latina Scalo, Latina Lido, Borgo Piave, Borgo Faiti, Borgo Sabotino, Borgo Podgora, Borgo San Michele, Borgo Grappa, Borgo Montello. La zona di ogni attività la assegna l'admin: l'import la lascia vuota.

`accessibility` (jsonb, ogni campo `true | false | null` dove null = non verificato): `step_free_entrance`, `ramp_available`, `accessible_toilet`, `wide_interior`, `notes`.

Viste: `user_balances`, `merchant_period_stats`, `cross_cluster_transactions`, viste per §9.

Funzioni RPC (`SECURITY DEFINER`, `search_path` fissato, controllo di `auth.uid()` e ruolo):

| Funzione | Chi | Note |
|---|---|---|
| `request_earn(qr_id)` | utente | PopCoin attivo, attività attiva, limiti preverificati; una sola richiesta aperta per utente e attività |
| `request_redemption(reward_id)` | utente | Preverifica saldo, stato, limiti |
| `cancel_request(request_id)` | utente proprietario | Solo `pending` |
| `approve_request(request_id, amount_cents?, min_spend_confirmed?)` | staff/owner dell'attività | Transazione unica; idempotente; vieta l'auto-conferma |
| `reject_request(request_id, reason?)` | staff/owner | |
| `reverse_entry(entry_id, reason)` | admin | Uno per movimento; libera stock |
| `adjust_balance(user_id, amount, reason)` | admin | |
| `expire_requests()` | cron ogni minuto | Le richieste scadute sono comunque rifiutate da `approve_request` in base a `expires_at` |
| `delete_my_account()` | utente | §7 |

Codice di abbinamento: tre caratteri da `ABCDEFGHJKMNPQRSTUVWXYZ23456789`, unico tra le richieste aperte della stessa attività. Rate limit: massimo dieci richieste per utente in dieci minuti.

## 7. Privacy

- Dati raccolti: email, nome visualizzato facoltativo, consensi (versione e data), movimenti, iscrizioni push. Nient'altro. La posizione non si salva.
- Termini, informativa e regolamento PopCoin: pagine con versione, testi `[DA FORNIRE]` dalla Rete. Titolare del trattamento: la Rete.
- Eliminazione account: utente auth eliminato, `profiles` anonimizzato, movimenti conservati sul profilo anonimo per coerenza contabile e rendicontazione; preferiti e iscrizioni push cancellati. Conferma esplicita.
- Export dei miei dati: JSON.
- L'admin vede l'email di un utente solo nell'assistenza transazioni, con registrazione in audit. I titolari vedono solo aggregati.
- Nessun tracciamento di terze parti. Il "database di clienti fidelizzati" della rete è solo quello con consenso marketing esplicito.

## 8. Requisiti non funzionali

| ID | Requisito | Criterio |
|---|---|---|
| N1 | Isolamento | Test: A non legge i movimenti di B; lo staff di X non conferma, non legge e non modifica nulla di Y; un titolare non legge `profiles` dei clienti. |
| N2 | Ledger | Test: idempotenza di `approve_request`; due conferme concorrenti dello stesso riscatto → un solo movimento; due riscatti concorrenti sull'ultima unità → uno solo; saldo = somma movimenti dopo ogni scenario; staff revocato rifiutato con sessione aperta; auto-conferma rifiutata; richiesta scaduta rifiutata anche se il cron non è passato. |
| N3 | Sicurezza | HTTPS, service key solo server, CSP di base, upload solo jpg/png/webp ≤ 5 MB in bucket dedicati, MFA TOTP per l'admin. |
| N4 | Accessibilità | WCAG 2.2 AA su tutti i flussi pubblici e sul banco. Mappa sempre con lista equivalente; cluster mai distinti solo dal colore; `aria-live` per gli stati delle richieste. |
| N5 | Prestazioni | Mobile 4G simulato: LCP ≤ 2,5 s, INP ≤ 200 ms sulle pagine pubbliche, renderizzate sul server, con metadata e Open Graph. |
| N6 | PWA | Installabile; service worker che mette in cache solo la shell e le pagine pubbliche già visitate; nessuna operazione PopCoin offline. |
| N7 | Lingua e tempo | Italiano; Europe/Rome con ora legale; "giorno" = giorno solare di Roma. |
| N8 | Proprietà della Rete | Codice, dominio, account Supabase/Vercel e dati intestati alla Rete; migrazioni riproducibili; README di subentro. |
| N9 | Dicitura | Presente nel footer di ogni pagina pubblica e nella pagina "Il progetto"; testo da `settings`. |

## 9. Indicatori (dashboard admin)

Ogni numero con definizione visibile, filtro temporale, confronto col periodo precedente, export CSV.

**Indicatori del bando (monitoraggio con il Comune)**

| Indicatore | Definizione | Obiettivo dichiarato |
|---|---|---|
| Attività presenti nella WebApp | Attività `active` con scheda pubblicata (descrizione, orari, posizione) / 44 | tutte |
| Attività attive nel PopCoin | Attività con ≥ 1 richiesta confermata nel periodo | tutte |
| Utenti registrati | Profili non eliminati | 3.000+ |
| Eventi realizzati | Eventi `published`, non annullati, conclusi nel periodo; separati per "della Rete" e altri | lancio, 4 Pop Weekend, 12+ micro-eventi |
| Transazioni tra cluster diversi | Richieste confermate in cui il cluster dell'attività è diverso da quello della visita precedente dello stesso utente / richieste confermate con una visita precedente | 30%+ |
| Schede di accessibilità | Attività con accessibilità verificata / 44 | 44 |

**Indicatori operativi**: utenti con visite in ≥ 2 attività; utenti con ≥ 1 riscatto; clienti arrivati dalla rete per attività; percorsi completati; Pop Cards sbloccate (media per utente); ritorno (utenti con visite in ≥ 2 settimane diverse); tempo mediano tra richiesta e conferma al banco; richieste scadute; visualizzazioni e click in uscita degli eventi.

La definizione di "transazione tra cluster diversi" va confermata con la Manager di Rete: tienila in una sola vista SQL, facile da cambiare.

## 10. Fuori dalla v1

App negli store (il bando prevede una PWA), notifiche geolocalizzate, classifica/leaderboard, **Pop Quest** (caccia al tesoro con indizi e prove: si appoggerà su percorsi, visite e badge già presenti), movimenti di denaro e cashback automatici, aggregazione automatica o scraping di eventi, account organizzatori esterni, più sedi per attività, scadenza dei coin a lotti, prenotazioni, ticketing, pagamenti, integrazioni con le casse, chat, recensioni, acquisto/trasferimento di coin.

## 11. Modalità demo

Serve a Simone e alla Rete per provare interfaccia e flussi con dati finti, da soli e da un solo dispositivo, e per mostrare l'app agli esercenti.

### 11.1 Attivazione e isolamento
- Si attiva con `DEMO_MODE=true` (variabile server). Nessun interruttore nell'interfaccia: la demo è un **ambiente separato** con il proprio database, mai quello di produzione.
- Doppia sicura: se `DEMO_MODE=true` e l'URL Supabase coincide con `PRODUCTION_SUPABASE_URL`, l'app non parte.
- Codice demo in `src/demo/` e route `/demo/*`, che rispondono 404 a flag spento (controllo server).
- Fascia fissa "DEMO — dati finti" su ogni pagina, con persona corrente e comandi.

### 11.2 Dati finti (`pnpm demo:seed`, idempotente, seed fisso)
- 12 attività **dichiaratamente fittizie** ("… Demo") distribuite sui cinque cluster, in proporzione simile alla rete reale, con descrizione, orari, accessibilità mista (anche "non verificato"), immagini e Pop Cards segnaposto generate. Nessun telefono, partita IVA o indirizzo reale.
- Offerte, premi di tutti i tipi e modelli (almeno quattro di benvenuto, uno `network_fund`, uno esaurito, uno in pausa, uno scaduto), premi di rete.
- Percorsi: uno `list`, uno `any` con filtro cluster, uno concluso; due badge.
- 15 eventi (passati, futuri, annullati, della Rete, con orario o prezzo da confermare) e 3 segnalazioni in moderazione.
- 40 utenti finti con **otto settimane di storico** plausibile (visite, riscatti, card sbloccate, percorsi completati, due storni, una contestazione), così che report e indicatori mostrino numeri sensati.
- Un partner finto. Email demo su `@demo.invalid`.

### 11.3 Persona e simulazione
- **Cambia persona** in un tocco: Visitatore, Cliente nuovo, Cliente abituale, Staff, Titolare, Editor, Admin. Sessione creata lato server, solo con `DEMO_MODE`. L'admin demo non richiede MFA.
- **Simula cliente**: nella schermata Banco, "Simula richiesta" crea una richiesta di un cliente demo (accredito o premio) usando le stesse RPC reali; così si prova il flusso completo da un solo telefono. Nella pagina `/p/<qr_id>` un selettore permette di scegliere quale cliente demo fa la richiesta.
- **Interruttore PopCoin** nella fascia demo, per mostrare la fase 1 e la fase 2.
- **Ripristina demo**: torna allo stato del seed, con conferma.

### 11.4 Vincolo
Stesse funzioni, RLS e regole della produzione. Cambiano solo come si ottiene la sessione e da dove arrivano i dati.

## 12. Decisioni aperte (con default già applicato)

| Tema | Default v1 | Chi decide |
|---|---|---|
| Emissione | A visita, 10 PopCoin, una volta al giorno per attività | Rete (regolamento) |
| Modelli di premio ammessi | Tutti e quattro; `network_fund` con approvazione admin | Rete |
| Esistenza e gestione del fondo cashback | Solo report, nessun movimento di denaro nell'app | Rete con commercialista |
| Scadenza coin | Nessuna | Rete con supporto legale/fiscale |
| Qualificazione DPR 430/2001 | Coin non monetari; nessun lancio del PopCoin prima della verifica | Rete con consulente |
| Definizione "transazione tra cluster diversi" | §9 | Manager di Rete |
| Primi percorsi | Un percorso per cluster + una missione "tre attività di tre cluster diversi" | Rete e referenti di cluster |
| Identità visiva e illustrazioni Pop Cards | Token e segnaposto (l'identità nasce dall'azione 1.1) | Rete / cluster B |
| Testi legali e loghi della dicitura | Segnaposto `[DA FORNIRE]` | Rete |
| Dominio e account cloud | Intestati alla Rete | Rete |
