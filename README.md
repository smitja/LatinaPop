# Latina Pop District — WebApp e PopCoin

PWA della rete Latina Pop District: mappa per cluster, schede delle attività, eventi, offerte,
Pop Trails e, nella fase 2, il programma di fidelizzazione PopCoin.

- Cosa costruire: [`docs/SPEC.md`](docs/SPEC.md) (parti dalla §0 Contesto)
- In che ordine: [`docs/PLAN.md`](docs/PLAN.md)
- Regole di lavoro e vincoli non negoziabili: [`CLAUDE.md`](CLAUDE.md)
- Decisioni prese strada facendo: [`docs/DECISIONS.md`](docs/DECISIONS.md)

## Requisiti

| Strumento | Versione                                                                   |
| --------- | -------------------------------------------------------------------------- |
| Node.js   | 22 o successivo                                                            |
| pnpm      | 10 (`corepack enable` lo attiva dalla versione indicata in `package.json`) |
| Docker    | Docker Desktop o Docker Engine, avviato                                    |

La Supabase CLI è una dipendenza di sviluppo del progetto: non serve installarla a parte.

## Setup da zero

```bash
git clone https://github.com/smitja/LatinaPop.git
cd LatinaPop
corepack enable
pnpm install

# Database, Auth, Storage, Realtime e Mailpit in locale (la prima volta scarica le immagini)
pnpm db:start

# Variabili d'ambiente
cp .env.example .env.local
pnpm exec supabase status -o env   # copia API_URL e PUBLISHABLE_KEY in .env.local

pnpm dev                           # http://localhost:3000
```

Pagine utili in locale:

| Indirizzo                        | Cosa c'è                                         |
| -------------------------------- | ------------------------------------------------ |
| http://localhost:3000            | Area pubblica (Home, Mappa, Eventi, Percorsi)    |
| http://localhost:3000/merchant   | Console delle attività (Banco)                   |
| http://localhost:3000/admin      | Console della Manager di Rete                    |
| http://localhost:3000/dev/tokens | Design token provvisori                          |
| http://127.0.0.1:54323           | Supabase Studio                                  |
| http://127.0.0.1:54324           | Mailpit: le email (codici OTP) inviate in locale |

## Comandi

```bash
pnpm dev                 # app in locale
pnpm build && pnpm start # build di produzione
pnpm lint                # ESLint
pnpm typecheck           # tipi delle route + tsc
pnpm format              # Prettier (format:check per la sola verifica)
pnpm test                # test unitari (Vitest, progetto "unit")
pnpm test:db             # test sul database locale (Vitest, progetto "db")
pnpm e2e                 # Playwright: viewport iPhone, Android, desktop
pnpm db:start            # avvia Supabase locale
pnpm db:stop             # lo ferma
pnpm db:reset            # riapplica migrazioni e seed
pnpm db:types            # rigenera src/lib/supabase/database.types.ts
```

Prima di ogni push: `pnpm lint && pnpm typecheck && pnpm test && pnpm test:db`.

### Test

- **unit**: logica pura, nessun servizio esterno.
- **db**: girano contro Postgres locale reale (`DATABASE_URL`, default Supabase locale sulla
  porta 54322). Se il database è spento falliscono subito con un messaggio esplicito: i test del
  ledger non si sostituiscono con mock. Rifiutano qualsiasi host non locale.
- **e2e**: Playwright avvia da solo `next dev` sulla porta 3100. La prima volta in locale:
  `pnpm exec playwright install chromium`.

## Sessioni cloud di Claude Code

Ogni sessione parte da una macchina pulita con Docker spento.

```bash
pnpm install
bash scripts/cloud-services.sh   # avvia Docker e Supabase (immagini da Docker Hub)
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/opt/pw-browsers/chromium pnpm e2e
```

Lo script scarica le immagini Supabase da Docker Hub perché il registro predefinito (AWS ECR) è
bloccato dal proxy delle sessioni. Se lo stack Supabase non parte, il ripiego previsto da
`CLAUDE.md` è il PostgreSQL 16 preinstallato con uno shim dello schema `auth`, da documentare in
`docs/DECISIONS.md` quando serve.

## Struttura

```
src/app/(public)/       area cittadini (navigazione in basso, dicitura del finanziamento)
src/app/merchant/       console delle attività
src/app/admin/          console della Manager di Rete
src/app/dev/tokens/     anteprima dei design token
src/components/         componenti (ui/ = primitive)
src/lib/copy/           testi dell'interfaccia (aree attività e admin)
src/lib/domain/         tipi e schemi condivisi (riusabili da un futuro client mobile)
src/lib/supabase/       client e tipi generati (dalla M1)
src/styles/tokens.css   unico punto per colori, tipografia, spaziature, raggi, ombre
supabase/               configurazione locale, migrazioni, seed
tests/unit|db|e2e       test
```

## Proprietà

Codice, dominio, account Supabase e Vercel e dati sono intestati alla Rete Latina Pop District.
Spesa finanziata dalla Regione Lazio ai sensi della D.G.R. 1254/2025 e s.m.i.
