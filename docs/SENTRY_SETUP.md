# Sentry Setup - Error Monitoring

Sentry è stato configurato per monitorare errori e performance dell'applicazione in produzione.

## Setup Iniziale

### 1. Crea Account Sentry

1. Vai su [sentry.io](https://sentry.io/) e crea un account gratuito
2. Crea una nuova organization (es. "alm-infissi")
3. Crea un nuovo progetto:
   - Platform: **Next.js**
   - Nome progetto: **alm-rmi**
   - Alert frequency: **On every new issue** (consigliato)

### 2. Ottieni le Credenziali

Dopo aver creato il progetto:

1. **DSN (Data Source Name)**:
   - Vai su `Settings > Projects > alm-rmi > Client Keys (DSN)`
   - Copia il DSN (formato: `https://xxx@sentry.io/xxx`)

2. **Auth Token**:
   - Vai su `Settings > Account > API > Auth Tokens`
   - Click "Create New Token"
   - Nome: "ALM-RMI Deploy"
   - Scopes: seleziona:
     - `project:read`
     - `project:releases`
     - `org:read`
   - Copia il token generato

3. **Organization Slug**:
   - Visibile nell'URL: `https://sentry.io/organizations/[YOUR-ORG-SLUG]/`
   - Oppure in `Settings > General Settings > Organization Slug`

### 3. Configura Environment Variables

Aggiungi al file `.env` (locale) e su Vercel:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/your-project-id
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=alm-rmi
SENTRY_AUTH_TOKEN=your-auth-token
```

**IMPORTANTE**:
- `NEXT_PUBLIC_SENTRY_DSN` è pubblico e viene esposto al client
- `SENTRY_AUTH_TOKEN` è segreto, NON committarlo su git (già protetto da .gitignore)

### 4. Deploy su Vercel

Su Vercel dashboard:

1. Vai su `Project Settings > Environment Variables`
2. Aggiungi le 4 variabili Sentry:
   - `NEXT_PUBLIC_SENTRY_DSN` (Production + Preview + Development)
   - `SENTRY_ORG` (Production + Preview)
   - `SENTRY_PROJECT` (Production + Preview)
   - `SENTRY_AUTH_TOKEN` (Production + Preview)
3. Redeploy il progetto

## Test dell'Integrazione

### In Locale (Development)

Gli errori vengono loggati in console ma **NON inviati a Sentry** (vedi `beforeSend` in config).

Per testare:

```bash
npm run dev
# Visita http://localhost:3000/sentry-test
# Clicca sui pulsanti per generare errori
```

### In Produzione

Dopo il deploy, visita:
- `https://your-app.vercel.app/sentry-test`
- Clicca "Trigger Client Error" e "Trigger Server Error"
- Vai su Sentry dashboard per vedere gli errori catturati

**Dopo aver verificato, elimina la pagina di test**:

```bash
rm app/sentry-test/page.tsx
rm app/api/sentry-example-api/route.ts
```

## Configurazione Avanzata

### Performance Monitoring

Nel file `sentry.client.config.ts`, riduci il sample rate in produzione:

```typescript
tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% in prod
```

Questo riduce costi e rumore, tracciando solo 10% delle transazioni.

### Session Replay

Configurato per catturare:
- 100% delle sessioni con errori (`replaysOnErrorSampleRate: 1.0`)
- 10% delle sessioni normali (`replaysSessionSampleRate: 0.1`)

Per disabilitare completamente:

```typescript
replaysOnErrorSampleRate: 0,
replaysSessionSampleRate: 0,
```

### Filtri Custom

Aggiungi pattern di errori da ignorare in `sentry.client.config.ts`:

```typescript
ignoreErrors: [
  "ResizeObserver loop limit exceeded",
  "Non-Error promise rejection captured",
  // Aggiungi altri pattern qui
],
```

### Source Maps

Le source maps vengono automaticamente caricate su Sentry durante il build di produzione.

Per disabilitare (sconsigliato):

```typescript
// next.config.ts
hideSourceMaps: false,
```

## Monitoring in Produzione

### Dashboard Sentry

1. **Issues**: Tutti gli errori catturati con stack traces
2. **Performance**: Transaction traces, bottleneck identificati
3. **Releases**: Tracciamento versioni deploy
4. **Alerts**: Notifiche via email/Slack quando ci sono nuovi errori

### Alert Rules Consigliate

Su Sentry dashboard:

1. Vai su `Alerts > Create Alert Rule`
2. Crea alert per:
   - **New Issue**: Quando appare un nuovo tipo di errore
   - **High Frequency**: Quando un errore si ripete >10 volte/ora
   - **Regression**: Quando un errore risolto riappare

### Budget Gratuito

Sentry free tier include:
- 5,000 errori/mese
- 10,000 performance transactions/mese
- 50 replay sessions/mese
- 1 utente

Se superi i limiti, considera upgrade a Team plan (~$26/mese).

## Integrazioni Opzionali

### Prisma Integration (già configurato)

Traccia query Prisma automaticamente:

```typescript
// lib/prisma.ts
import { prisma } from '@sentry/integrations';

Sentry.init({
  integrations: [new Sentry.Integrations.Prisma({ client: prismaClient })],
});
```

### Slack Notifications

Su Sentry:
1. `Settings > Integrations > Slack`
2. Connect workspace
3. Configure alert routing

## Troubleshooting

### Errori non appaiono su Sentry

1. Verifica che `NEXT_PUBLIC_SENTRY_DSN` sia impostato correttamente
2. Verifica che sei in produzione (non in development locale)
3. Controlla browser console per errori di caricamento Sentry SDK
4. Verifica quota non superata su Sentry dashboard

### Source Maps non funzionano

1. Verifica `SENTRY_AUTH_TOKEN` sia impostato su Vercel
2. Verifica `SENTRY_ORG` e `SENTRY_PROJECT` siano corretti
3. Guarda build logs su Vercel per errori upload

### Performance troppo lento

Riduci sample rate:

```typescript
tracesSampleRate: 0.01, // 1% delle transazioni
```

## File Configurazione

- `sentry.client.config.ts` - Client-side init
- `sentry.server.config.ts` - Server-side init
- `sentry.edge.config.ts` - Edge runtime init
- `next.config.ts` - Webpack plugin config
- `.sentryclirc` - Sentry CLI config (gitignored)

## Rimozione Sentry (se necessario)

```bash
npm uninstall @sentry/nextjs
rm sentry.*.config.ts
rm .sentryclirc
# Rimuovi withSentryConfig da next.config.ts
# Rimuovi variabili SENTRY_* da .env e Vercel
```

## Risorse

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/guides/nextjs/performance/)
- [Session Replay](https://docs.sentry.io/platforms/javascript/guides/nextjs/session-replay/)
- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/nextjs/sourcemaps/)
