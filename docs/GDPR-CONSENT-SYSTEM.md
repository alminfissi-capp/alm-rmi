# Sistema di Consenso Informato GDPR per Sincronizzazione Google Contacts

**Data implementazione**: 16 Dicembre 2025
**Versione**: 1.0
**Autore**: Claude Sonnet 4.5 (ALM RMI Development Team)

---

## 📋 Indice

1. [Panoramica](#panoramica)
2. [Contesto GDPR](#contesto-gdpr)
3. [Architettura Tecnica](#architettura-tecnica)
4. [Componenti Implementati](#componenti-implementati)
5. [Flusso Operativo](#flusso-operativo)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Tracciabilità e Compliance](#tracciabilità-e-compliance)
9. [Istruzioni per il Committente](#istruzioni-per-il-committente)
10. [Testing](#testing)

---

## Panoramica

Il sistema di consenso informato è stato implementato per garantire la compliance GDPR (Regolamento UE 2016/679) nella funzionalità di sincronizzazione dei contatti Google all'interno dell'applicazione RMI.

### Problema Identificato

Quando un utente affiliato (es. Ingegnere Pippo Franco) sincronizza i propri contatti Google nella rubrica RMI:
- I dati dei contatti vengono salvati nel database centralizzato di A.L.M. Infissi
- A.L.M. Infissi diventa co-titolare del trattamento dei dati
- Gli interessati (clienti dell'affiliato) non sono informati del trattamento
- Manca una base giuridica valida per il trasferimento dei dati

### Soluzione Implementata

Prima della sincronizzazione, l'utente DEVE:
1. Leggere un'informativa GDPR completa
2. Accettare espressamente il trasferimento dei dati
3. Confermare la propria responsabilità sulla legittimità del trattamento

Il consenso viene tracciato e registrato nel database con tutti i dettagli richiesti dalla normativa.

---

## Contesto GDPR

### Base Normativa

- **Regolamento**: UE 2016/679 (GDPR)
- **Base giuridica**: Art. 6, par. 1, lett. a) - Consenso esplicito dell'interessato
- **Tracciabilità**: Art. 5, par. 2 - Principio di accountability
- **Informativa**: Art. 13-14 - Informazioni da fornire

### Responsabilità

#### A.L.M. Infissi (Titolare/Co-titolare)
- P.IVA: 06365120820
- Sede: Palermo, Sicilia, Italia
- Ruolo: Co-titolare del trattamento dei dati sincronizzati
- Responsabilità: Gestione database, sicurezza dati, rispetto diritti interessati

#### Utenti Affiliati (Utilizzatori)
- Ruolo: Responsabili della legittimità del trattamento dei propri clienti
- Obblighi:
  - Informare i propri clienti del trattamento
  - Ottenere consenso valido dai propri clienti
  - Verificare di avere titolo per trasferire i dati

---

## Architettura Tecnica

### Stack Tecnologico

- **Frontend**: React 19.2.0, Next.js 16.0.10
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.19.0
- **UI Components**: Radix UI, Tailwind CSS

### Diagramma del Flusso

```
┌─────────────────┐
│     Utente      │
│   (Affiliato)   │
└────────┬────────┘
         │
         │ 1. Click "Sincronizza Contatti"
         ▼
┌─────────────────────┐
│  Check Consenso     │◄──────┐
│  API: /consent/check│       │
└────────┬────────────┘       │
         │                    │
         │ 2a. Consenso già dato? NO
         ▼                    │
┌─────────────────────┐       │
│  Mostra Dialog GDPR │       │
│  + Informativa      │       │
└────────┬────────────┘       │
         │                    │
         │ 3. Utente legge e accetta
         ▼                    │
┌─────────────────────┐       │
│  Salva Consenso     │       │
│  API: /consent/save │       │
│  + IP + User Agent  │       │
└────────┬────────────┘       │
         │                    │
         │ 2b. Consenso già dato? SI
         ▼                    │
┌─────────────────────┐       │
│  Sincronizzazione   │◄──────┘
│  Google Contacts    │
│  API: /sync-google  │
└────────┬────────────┘
         │
         │ 4. Salva contatti in DB
         ▼
┌─────────────────────┐
│  Tabella Clienti    │
│  + user_id          │
└─────────────────────┘
```

---

## Componenti Implementati

### 1. Database Schema

**File**: `prisma/schema.prisma` (linee 197-222)

```prisma
model UserConsent {
  id                   String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id              String   @db.Uuid

  consent_type         String   // es: "google_contacts_sync"
  consent_given        Boolean  @default(false)
  consent_date         DateTime @db.Timestamptz(6)

  ip_address           String?
  user_agent           String?
  consent_text_version String   @default("1.0")

  created_at DateTime @default(now()) @db.Timestamptz(6)
  updated_at DateTime @default(now()) @updatedAt @db.Timestamptz(6)

  @@unique([user_id, consent_type])
  @@index([user_id])
  @@index([consent_type])
  @@map("user_consents")
}
```

**Caratteristiche**:
- Unique constraint su `(user_id, consent_type)` - un consenso per tipo per utente
- Tracciamento IP e User Agent per accountability GDPR
- Versioning dell'informativa consenso
- Timestamp di creazione e aggiornamento

### 2. Componente React Dialog

**File**: `components/google-contacts-consent-dialog.tsx`

**Funzionalità**:
- Dialog modale con scroll area per informativa completa
- Sezioni informativa GDPR:
  - Titolare del trattamento
  - Finalità del trattamento
  - Base giuridica
  - Condivisione dei dati (IMPORTANTE)
  - Durata conservazione
  - Diritti dell'interessato
  - Responsabilità dell'utente
- Checkbox obbligatoria per accettazione esplicita
- Pulsante "Accetta e Procedi" disabilitato fino a checkbox spuntato
- Loading state durante salvataggio
- Non dismissibile durante il processo

**Props**:
```typescript
interface GoogleContactsConsentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
  isLoading?: boolean
}
```

### 3. Integrazione Pagina Rubrica

**File**: `app/rubrica/rubrica-client.tsx`

**Modifiche**:
- Aggiunto state `consentDialogOpen` e `hasConsent`
- Funzione `checkConsent()`: verifica consenso esistente all'avvio
- Modificata `handleSyncGoogle()`: blocca sync se manca consenso
- Funzione `handleConsentAccept()`: salva consenso e avvia sync
- Funzione `performSync()`: esegue sincronizzazione contatti

**Flusso**:
1. All'avvio pagina: `checkConsent()` verifica stato
2. Click "Sincronizza": controlla `hasConsent`
3. Se NO → mostra dialog
4. Se SI → procede direttamente con sync

### 4. API Routes

#### `/api/consent/check` (GET)

**Scopo**: Verifica se l'utente ha già dato il consenso

**Query Params**:
- `type` (required): tipo di consenso (es: "google_contacts_sync")

**Response**:
```json
{
  "hasConsent": true,
  "consentDate": "2025-12-16T10:30:00Z",
  "version": "1.0"
}
```

**Status Codes**:
- `200`: Success
- `400`: Missing consent type
- `401`: Non autorizzato
- `500`: Server error

#### `/api/consent/save` (POST)

**Scopo**: Salva o aggiorna il consenso dell'utente

**Request Body**:
```json
{
  "consentType": "google_contacts_sync",
  "consentGiven": true
}
```

**Response**:
```json
{
  "success": true,
  "consent": {
    "id": "uuid",
    "consentGiven": true,
    "consentDate": "2025-12-16T10:30:00Z"
  }
}
```

**Tracciabilità automatica**:
- IP Address: estratto da headers `x-forwarded-for`, `x-real-ip`
- User Agent: estratto da header `user-agent`
- Timestamp: auto-generato

**Status Codes**:
- `200`: Success
- `400`: Missing required fields
- `401`: Non autorizzato
- `500`: Server error

### 5. Rimozione Login con Google

**File**: `app/login/page.tsx`

**Modifiche**:
- Rimossi import: `createClient`, `toast`
- Rimosso state: `isGoogleLoading`
- Rimossa funzione: `handleGoogleSignIn()`
- Rimosso UI: separatore "oppure" e pulsante "Continua con Google"

**Motivazione**: Il sistema è multi-tenant con gestione accessi centralizzata dall'amministratore. Gli utenti non si registrano autonomamente.

---

## Flusso Operativo

### Scenario 1: Primo Accesso - Consenso NON Dato

```
1. Utente naviga in /rubrica
2. Sistema chiama checkConsent() → hasConsent = false
3. Utente clicca "Sincronizza Contatti"
4. Sistema mostra GoogleContactsConsentDialog
5. Utente legge informativa completa
6. Utente spunta checkbox "Ho letto e accetto"
7. Utente clicca "Accetto e Procedi"
8. Sistema:
   a. Chiama /api/consent/save
   b. Salva consenso con IP, User Agent, timestamp
   c. Chiude dialog
   d. Avvia performSync()
9. Sincronizzazione procede normalmente
```

### Scenario 2: Accesso Successivo - Consenso GIÀ Dato

```
1. Utente naviga in /rubrica
2. Sistema chiama checkConsent() → hasConsent = true
3. Utente clicca "Sincronizza Contatti"
4. Sistema procede direttamente con performSync()
5. Nessun dialog mostrato
6. Sincronizzazione procede normalmente
```

### Scenario 3: Revoca Consenso (Futuro)

```
[DA IMPLEMENTARE]
- Funzionalità in /profile o /privacy-settings
- Pulsante "Revoca Consenso Sincronizzazione Google"
- Chiamata API per update consent_given = false
- Blocco future sincronizzazioni
- Opzione cancellazione dati già sincronizzati
```

---

## Database Schema

### Tabella `user_consents`

| Colonna | Tipo | Nullable | Default | Descrizione |
|---------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `user_id` | UUID | NO | - | FK utente (Supabase Auth) |
| `consent_type` | VARCHAR | NO | - | Tipo consenso |
| `consent_given` | BOOLEAN | NO | false | Stato consenso |
| `consent_date` | TIMESTAMPTZ | NO | - | Data/ora consenso |
| `ip_address` | VARCHAR | YES | NULL | IP address utente |
| `user_agent` | VARCHAR | YES | NULL | User agent browser |
| `consent_text_version` | VARCHAR | NO | '1.0' | Versione testo informativa |
| `created_at` | TIMESTAMPTZ | NO | now() | Timestamp creazione |
| `updated_at` | TIMESTAMPTZ | NO | now() | Timestamp aggiornamento |

**Constraints**:
- `PRIMARY KEY (id)`
- `UNIQUE (user_id, consent_type)`
- `INDEX (user_id)`
- `INDEX (consent_type)`

**Query Comuni**:

```sql
-- Verifica consenso utente
SELECT consent_given, consent_date
FROM user_consents
WHERE user_id = $1 AND consent_type = 'google_contacts_sync';

-- Conta consensi dati
SELECT COUNT(*)
FROM user_consents
WHERE consent_type = 'google_contacts_sync'
  AND consent_given = true;

-- Storico consensi utente
SELECT consent_type, consent_given, consent_date, ip_address
FROM user_consents
WHERE user_id = $1
ORDER BY consent_date DESC;
```

---

## API Endpoints

### Autenticazione

Tutti gli endpoint richiedono autenticazione Supabase valida:
- Header: `Authorization: Bearer <access_token>`
- Cookie: `sb-access-token`

### Rate Limiting

**Consiglio**: Implementare rate limiting su `/api/consent/save`:
- Max 10 richieste/minuto per utente
- Previene spam/abuse

### Error Handling

Tutti gli endpoint seguono lo stesso pattern di errore:

```json
{
  "error": "Messaggio errore descrittivo",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## Tracciabilità e Compliance

### Dati Tracciati (Art. 5 GDPR - Accountability)

Per ogni consenso, il sistema registra:
1. **Chi**: `user_id` (identificativo utente)
2. **Cosa**: `consent_type` + `consent_given` (tipo e stato consenso)
3. **Quando**: `consent_date` (timestamp preciso)
4. **Dove**: `ip_address` (localizzazione geografica)
5. **Come**: `user_agent` (browser/device utilizzato)
6. **Quale versione**: `consent_text_version` (versione informativa)

### Retention Policy

**Durata conservazione consenso**:
- Consensi attivi: conservati fino a revoca
- Consensi revocati: conservati per 5 anni (obblighi legali)
- Dopo 5 anni dalla revoca: cancellazione automatica (da implementare)

### Audit Log

**Raccomandazione**: Implementare audit log separato per:
- Creazione consenso
- Modifica consenso
- Revoca consenso
- Tentativi di sincronizzazione bloccati

---

## Istruzioni per il Committente

### Adempimenti Legali Necessari

Questa implementazione tecnica è SOLO una parte della compliance GDPR completa. Il committente (A.L.M. Infissi) DEVE:

#### 1. Privacy Policy Aziendale
- ✅ Aggiornare la Privacy Policy esistente
- ✅ Includere sezione su "Sincronizzazione Contatti Google"
- ✅ Specificare ruolo co-titolare del trattamento
- ✅ Elencare finalità, base giuridica, durata conservazione
- ✅ Pubblicare su sito web aziendale

#### 2. Accordi di Affiliazione
- ✅ Redigere contratti con clausole GDPR
- ✅ Definire responsabilità tra A.L.M. e affiliati
- ✅ Specificare obblighi di informativa agli interessati
- ✅ Prevedere indennizzo in caso di violazioni
- ✅ Far firmare a tutti gli affiliati esistenti e futuri

#### 3. Registro dei Trattamenti
- ✅ Aggiornare registro (Art. 30 GDPR)
- ✅ Aggiungere voce "Gestione contatti clienti affiliati"
- ✅ Documentare finalità, categorie dati, categorie interessati
- ✅ Indicare misure sicurezza adottate

#### 4. Formazione Affiliati
- ✅ Organizzare sessione formativa GDPR
- ✅ Spiegare obblighi di informativa ai propri clienti
- ✅ Fornire template informativa privacy da dare ai clienti
- ✅ Verificare comprensione con test/quiz

#### 5. DPO (Data Protection Officer)
- ✅ Valutare necessità nomina DPO
- ✅ Se obbligatorio: nominare DPO e comunicare a Garante
- ✅ Se facoltativo: valutare comunque consulenza privacy

#### 6. DPIA (Data Protection Impact Assessment)
- ✅ Valutare se trattamento richiede DPIA
- ✅ Se necessario: redigere DPIA completa
- ✅ Identificare rischi per diritti interessati
- ✅ Implementare misure mitigazione rischi

### Modello Informativa per Affiliati

Gli affiliati dovrebbero fornire ai propri clienti un'informativa simile:

```
INFORMATIVA PRIVACY - TRATTAMENTO DATI CONTATTI

Io sottoscritto [Nome Affiliato], in qualità di [ruolo],
La informo che i Suoi dati di contatto (nome, telefono, email, indirizzo)
verranno inseriti nel sistema gestionale RMI di A.L.M. Infissi
(P.IVA 06365120820) per le seguenti finalità:

- Gestione preventivi e ordini
- Organizzazione rilievi e installazioni
- Comunicazioni relative al servizio

I Suoi dati saranno conservati presso i server di A.L.M. Infissi.
Lei ha diritto di accedere ai dati, rettificarli, cancellarli e opporsi
al trattamento contattando [contatti affiliato] o [contatti ALM].

Acconsente al trattamento dei Suoi dati come descritto?
□ SI    □ NO

Firma: ________________  Data: __________
```

### Sanzioni Potenziali (in caso di non conformità)

**Violazioni GDPR Art. 83**:
- Mancanza consenso valido: fino a €20.000.000 o 4% fatturato annuo
- Informativa inadeguata: fino a €10.000.000 o 2% fatturato annuo
- Mancata tracciabilità: fino a €10.000.000 o 2% fatturato annuo

**Raccomandazione**: Consultare avvocato specializzato in privacy/GDPR.

---

## Testing

### Test Manuali

#### Test 1: Primo Consenso
```
1. Login come nuovo utente
2. Naviga in /rubrica
3. Click "Sincronizza Contatti"
4. Verifica: Dialog GDPR appare
5. Verifica: Checkbox non spuntata, pulsante disabilitato
6. Spunta checkbox
7. Verifica: Pulsante abilitato
8. Click "Accetto e Procedi"
9. Verifica: Dialog si chiude, sincronizzazione avvia
10. Verifica database: record in user_consents con consent_given=true
```

#### Test 2: Consenso Già Dato
```
1. Login come utente che ha già dato consenso
2. Naviga in /rubrica
3. Click "Sincronizza Contatti"
4. Verifica: Dialog NON appare
5. Verifica: Sincronizzazione avvia direttamente
```

#### Test 3: Annullamento Dialog
```
1. Login come nuovo utente
2. Naviga in /rubrica
3. Click "Sincronizza Contatti"
4. Dialog appare
5. Click "Annulla" o X
6. Verifica: Dialog si chiude
7. Verifica: Sincronizzazione NON avvia
8. Verifica database: nessun record creato
```

#### Test 4: Tracciabilità GDPR
```
1. Esegui Test 1
2. Query database:
   SELECT ip_address, user_agent, consent_date
   FROM user_consents
   WHERE user_id = '<user_id_test>';
3. Verifica: IP address != NULL e != 'unknown'
4. Verifica: User agent contiene info browser
5. Verifica: consent_date è corretto
```

### Test API

#### `/api/consent/check`
```bash
# Test senza autenticazione
curl http://localhost:3000/api/consent/check?type=google_contacts_sync
# Expected: 401 Unauthorized

# Test senza tipo
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/consent/check
# Expected: 400 Bad Request

# Test successo
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/consent/check?type=google_contacts_sync
# Expected: 200 + { hasConsent: false/true, ... }
```

#### `/api/consent/save`
```bash
# Test senza autenticazione
curl -X POST http://localhost:3000/api/consent/save \
  -H "Content-Type: application/json" \
  -d '{"consentType":"google_contacts_sync","consentGiven":true}'
# Expected: 401 Unauthorized

# Test dati mancanti
curl -X POST http://localhost:3000/api/consent/save \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{}'
# Expected: 400 Bad Request

# Test successo
curl -X POST http://localhost:3000/api/consent/save \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"consentType":"google_contacts_sync","consentGiven":true}'
# Expected: 200 + { success: true, consent: {...} }
```

### Test Database

```sql
-- Verifica tabella creata
\dt user_consents

-- Verifica constraints
\d user_consents

-- Test insert manuale
INSERT INTO user_consents (user_id, consent_type, consent_given, consent_date)
VALUES ('test-uuid', 'google_contacts_sync', true, NOW());

-- Test unique constraint (dovrebbe fallire)
INSERT INTO user_consents (user_id, consent_type, consent_given, consent_date)
VALUES ('test-uuid', 'google_contacts_sync', true, NOW());

-- Cleanup
DELETE FROM user_consents WHERE user_id = 'test-uuid';
```

---

## Manutenzione e Aggiornamenti

### Aggiornamento Testo Informativa

Quando si modifica il testo dell'informativa GDPR:

1. Aggiornare file: `components/google-contacts-consent-dialog.tsx`
2. Incrementare versione:
   ```typescript
   consent_text_version: String   @default("1.1")  // o 2.0 per major
   ```
3. Valutare se richiedere nuovo consenso agli utenti esistenti
4. Se necessario, implementare:
   ```typescript
   // Verifica versione consenso
   if (consent.consent_text_version < CURRENT_VERSION) {
     // Mostra dialog anche se consenso già dato
     setConsentDialogOpen(true)
   }
   ```

### Estensione Sistema ad Altri Consensi

Per aggiungere altri tipi di consenso (es: newsletter, marketing):

1. Creare nuovo dialog specifico (es: `marketing-consent-dialog.tsx`)
2. Utilizzare stesse API con `consentType` diverso
3. Esempio:
   ```typescript
   await fetch('/api/consent/check?type=newsletter_subscription')
   await fetch('/api/consent/save', {
     body: JSON.stringify({
       consentType: 'newsletter_subscription',
       consentGiven: true
     })
   })
   ```

### Backup e Disaster Recovery

**Critico**: Tabella `user_consents` contiene dati sensibili per compliance GDPR.

- ✅ Backup giornaliero automatico
- ✅ Retention backup: minimo 30 giorni
- ✅ Test restore mensile
- ✅ Disaster recovery plan documentato

---

## FAQ

### Q: Un utente può revocare il consenso?
**R**: Attualmente NO. Feature da implementare. Priorità: ALTA.

### Q: Cosa succede ai dati se un utente revoca il consenso?
**R**: Da definire con committente. Opzioni:
- A) Blocco future sincronizzazioni, dati esistenti mantenuti
- B) Cancellazione tutti i dati sincronizzati (richiede cascade delete complesso)
- C) Anonimizzazione dati

### Q: Il consenso ha scadenza?
**R**: No, valido fino a revoca. Valutare scadenza annuale per re-consenso.

### Q: Un amministratore può vedere i consensi degli utenti?
**R**: Attualmente NO. Implementare dashboard admin per audit.

### Q: IP address è dato personale?
**R**: SI secondo GDPR. Ma tracciamento è legittimo per accountability (Art. 5 par. 2).

### Q: Serve informativa cookie per questo sistema?
**R**: NO, non utilizza cookie di tracciamento. Usa solo cookie autenticazione Supabase (necessari per servizio).

---

## Changelog

### Versione 1.0 - 16/12/2025
- ✅ Implementazione iniziale sistema consenso GDPR
- ✅ Database schema `user_consents`
- ✅ Componente `GoogleContactsConsentDialog`
- ✅ Integrazione pagina rubrica
- ✅ API `/consent/check` e `/consent/save`
- ✅ Rimozione login Google da pagina login
- ✅ Tracciabilità IP e User Agent
- ✅ Documentazione completa

### Prossime Feature (Roadmap)
- [ ] Dashboard admin per visualizzazione consensi
- [ ] Funzionalità revoca consenso
- [ ] Export dati consensi per audit
- [ ] Scadenza automatica consenso (opzionale)
- [ ] Notifiche email all'utente post-consenso
- [ ] Audit log completo
- [ ] GDPR compliance report automatico

---

## Supporto e Contatti

Per domande tecniche su questa implementazione:
- **Repository**: [Link GitHub/GitLab se disponibile]
- **Documentazione API**: Vedere sezione API Endpoints
- **Issue Tracker**: [Link se disponibile]

Per domande legali/GDPR:
- Consultare avvocato specializzato in Data Protection
- Contattare DPO se nominato
- Riferimento: Garante Privacy Italia (www.garanteprivacy.it)

---

**IMPORTANTE**: Questo documento è una guida tecnica. Non costituisce consulenza legale. Per garantire piena conformità GDPR, consultare un professionista legale qualificato.

---

_Documento generato automaticamente da Claude Sonnet 4.5 - ALM RMI Development Team_
_Ultima revisione: 16 Dicembre 2025_
