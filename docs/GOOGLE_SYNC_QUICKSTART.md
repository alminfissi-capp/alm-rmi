# 🚀 Google Contacts Sync - Quick Start

## ✅ Implementazione Completata!

Ho implementato con successo l'integrazione Google Contacts nella tua applicazione RMI. Ecco cosa è stato fatto:

---

## 📦 MODIFICHE AL CODICE

### 1. Componente Login (`app/login/page.tsx`) ✅
- ✅ Aggiunto pulsante "Continua con Google"
- ✅ Integrato OAuth flow con Supabase Auth
- ✅ Richiesti scopes per Google Contacts (`contacts.readonly`)
- ✅ Gestione errori e loading states
- ✅ Icona Google ufficiale

### 2. Auth Callback Route (`app/auth/callback/route.ts`) ✅
- ✅ Nuova route per gestire il redirect OAuth
- ✅ Scambio code per session Supabase
- ✅ Redirect automatico alla dashboard

### 3. Rubrica UI (`app/rubrica/rubrica-client.tsx`) ✅
- ✅ Pulsante "Sincronizza Google" con icona ufficiale
- ✅ Loading state con spinner
- ✅ Toast notifications per feedback
- ✅ Gestione errori (401, token mancante, ecc.)
- ✅ Conferma utente prima della sincronizzazione
- ✅ Auto-refresh tabella dopo sync

### 4. API Endpoint (`app/api/clienti/sync-google/route.ts`) ✅
- ✅ Già implementato in precedenza
- ✅ Connessione Google People API
- ✅ Import contatti da Google Contacts
- ✅ Merge intelligente (evita duplicati per email/nome)
- ✅ Creazione nuovi clienti
- ✅ Aggiornamento clienti esistenti

### 5. Documentazione (`docs/GOOGLE_OAUTH_SETUP.md`) ✅
- ✅ Guida completa step-by-step
- ✅ Configurazione Google Cloud Console
- ✅ Setup OAuth Consent Screen
- ✅ Configurazione Supabase Provider
- ✅ Troubleshooting guide
- ✅ Checklist configurazione

---

## 🔧 PROSSIMI STEP (DA FARE MANUALMENTE)

Per completare l'integrazione, devi seguire questi passaggi:

### STEP 1: Configurazione Google Cloud Console (15 min)

1. **Crea progetto Google Cloud**
   - Vai su https://console.cloud.google.com/
   - Crea nuovo progetto "ALM-RMI"

2. **Abilita Google People API**
   - APIs & Services → Library
   - Cerca "Google People API"
   - Click ENABLE

3. **Configura OAuth Consent Screen**
   - APIs & Services → OAuth consent screen
   - Tipo: "External"
   - App name: "ALM-RMI"
   - User support email: `servizio@alminfissi.it`
   - Scopes: aggiungi `contacts.readonly`

4. **Crea OAuth2 Credentials**
   - APIs & Services → Credentials
   - CREATE CREDENTIALS → OAuth client ID
   - Type: "Web application"
   - Name: "ALM-RMI Web Client"

   **Authorized redirect URIs (IMPORTANTE!):**
   ```
   https://mfuxhdvsvqcthyeqsjin.supabase.co/auth/v1/callback
   ```

   - Click CREATE
   - **COPIA E SALVA:**
     - Client ID: `xxxxxxxxxxxx-yyyyyyyyyyyy.apps.googleusercontent.com`
     - Client secret: `GOCSPX-zzzzzzzzzzzzzzzzzzzz`

📄 **Guida dettagliata:** `docs/GOOGLE_OAUTH_SETUP.md`

---

### STEP 2: Configurazione Supabase Dashboard (5 min)

1. **Vai su Supabase Dashboard**
   - https://app.supabase.com/
   - Seleziona progetto RMI

2. **Abilita Google Provider**
   - Authentication → Providers
   - Cerca "Google"
   - Toggle: **ON** ✅

3. **Inserisci Credentials**
   - **Client ID:** Incolla da Google Cloud Console
   - **Client secret:** Incolla da Google Cloud Console

4. **Verifica Redirect URL**
   - Copia: `https://mfuxhdvsvqcthyeqsjin.supabase.co/auth/v1/callback`
   - Assicurati che sia in "Authorized redirect URIs" su Google

5. **SAVE**

---

### STEP 3: Test Completo (5 min)

#### Test 1: Login con Google

1. Vai su: http://localhost:3000/login
2. Clicca **"Continua con Google"**
3. Dovresti vedere popup Google OAuth
4. Seleziona account Google
5. Google chiederà permessi:
   - ✅ Vedere email e profilo
   - ✅ Vedere i tuoi contatti
6. Clicca **"Consenti"**
7. Dovresti essere reindirizzato a `/dashboard`

✅ **Login OK!**

#### Test 2: Verifica Provider Token

Apri console browser (F12) e testa:

```javascript
// Nella console del browser
const { createClient } = await import('@supabase/supabase-js')
const supabase = createClient(
  'https://mfuxhdvsvqcthyeqsjin.supabase.co',
  'sb_publishable_Qafw1jx0w18MAQO2pzF8Ww_e3Kd1vxr'
)
const { data: { session } } = await supabase.auth.getSession()
console.log('Provider Token:', session?.provider_token)
```

Dovresti vedere un token tipo: `ya29.a0AfB_byA...`

✅ **Token OK!**

#### Test 3: Sincronizzazione Google Contacts

1. Vai su: http://localhost:3000/rubrica
2. Clicca **"Sincronizza Google"**
3. Conferma nel dialog
4. Dovresti vedere toast: "Sincronizzazione Google Contacts in corso..."
5. Dopo pochi secondi: "Sincronizzazione completata: X nuovi, Y aggiornati"
6. La tabella si ricarica con i nuovi contatti

✅ **Sync OK!**

---

## 🎯 COME FUNZIONA IL FLUSSO

### Flusso OAuth + Sincronizzazione

```
┌──────────────┐
│   Utente     │
│  /login      │
└──────┬───────┘
       │ 1. Click "Continua con Google"
       ▼
┌──────────────────────────┐
│  Supabase Auth           │
│  signInWithOAuth()       │
│  + scopes contacts       │
└──────┬───────────────────┘
       │ 2. Redirect a Google OAuth
       ▼
┌──────────────────────────┐
│  Google OAuth Popup      │
│  - Seleziona account     │
│  - Consenti permessi     │
└──────┬───────────────────┘
       │ 3. Redirect callback con code
       ▼
┌──────────────────────────┐
│  /auth/callback          │
│  exchangeCodeForSession  │
│  → session.provider_token│
└──────┬───────────────────┘
       │ 4. Redirect /dashboard
       ▼
┌──────────────────────────┐
│  Utente loggato          │
│  Token Google salvato    │
└──────┬───────────────────┘
       │ 5. Vai /rubrica
       ▼
┌──────────────────────────┐
│  /rubrica                │
│  Click "Sincronizza"     │
└──────┬───────────────────┘
       │ 6. POST /api/clienti/sync-google
       ▼
┌──────────────────────────┐
│  Legge provider_token    │
│  → Google People API     │
│  → people.connections    │
└──────┬───────────────────┘
       │ 7. Import contatti
       ▼
┌──────────────────────────┐
│  Merge con DB Prisma     │
│  - Crea nuovi            │
│  - Aggiorna esistenti    │
└──────┬───────────────────┘
       │ 8. Response + stats
       ▼
┌──────────────────────────┐
│  Toast success           │
│  Tabella aggiornata      │
└──────────────────────────┘
```

---

## 📁 FILE MODIFICATI/CREATI

```
✅ app/login/page.tsx                    (MODIFICATO)
✅ app/auth/callback/route.ts            (NUOVO)
✅ app/rubrica/rubrica-client.tsx        (MODIFICATO)
✅ app/api/clienti/sync-google/route.ts  (ESISTENTE - già OK)
✅ docs/GOOGLE_OAUTH_SETUP.md            (NUOVO)
✅ docs/GOOGLE_SYNC_QUICKSTART.md        (QUESTO FILE)
```

---

## 🐛 TROUBLESHOOTING

### Errore: "redirect_uri_mismatch"

**Soluzione:**
1. Vai su Google Cloud Console → Credentials
2. Modifica OAuth client
3. Aggiungi esattamente: `https://mfuxhdvsvqcthyeqsjin.supabase.co/auth/v1/callback`
4. SAVE e aspetta 5 minuti (cache Google)

---

### Errore: "Token Google non trovato"

**Causa:** L'utente ha fatto login con email/password, non con Google.

**Soluzione:**
1. Logout dall'app
2. Login nuovamente con "Continua con Google"
3. Verifica che `provider_token` esista nella sessione

---

### Errore: "Access Not Configured"

**Causa:** Google People API non abilitata.

**Soluzione:**
1. Google Cloud Console → APIs & Services → Library
2. Cerca "Google People API"
3. ENABLE

---

### Contatti non importati

**Verifica:**
1. Controlla console browser per errori
2. Verifica che il token sia valido
3. Controlla che l'utente abbia dato permessi Contacts
4. Prova a revocare accesso su https://myaccount.google.com/permissions e rifare login

---

## 📊 STATISTICHE SYNC

L'endpoint `/api/clienti/sync-google` restituisce:

```json
{
  "success": true,
  "message": "Sincronizzazione completata: 15 nuovi, 3 aggiornati",
  "stats": {
    "imported": 15,  // Contatti nuovi creati
    "updated": 3     // Contatti esistenti aggiornati
  }
}
```

**Logica Merge:**
- Se esiste cliente con stessa **email** → UPDATE
- Altrimenti, se esiste cliente con stesso **nome** → UPDATE
- Altrimenti → INSERT nuovo cliente

---

## 🔐 SICUREZZA

### Scopes Richiesti (READ ONLY)
```
https://www.googleapis.com/auth/contacts.readonly
```

✅ **Solo lettura** - Non modifichiamo mai i contatti Google!

### Token Storage
- `provider_token` salvato in sessione Supabase (JWT)
- Token non salvato nel database
- Token expire automaticamente (refresh gestito da Supabase)

### RLS (Row Level Security)
- Ogni utente vede solo i propri clienti
- Query filtrate per `user_id`

---

## ✅ CHECKLIST FINALE

Prima di andare in produzione:

- [ ] Configurato Google Cloud Console
- [ ] Abilitato Google People API
- [ ] Configurato OAuth Consent Screen
- [ ] Creato OAuth2 Credentials
- [ ] Configurato Supabase Google Provider
- [ ] Testato login con Google in locale
- [ ] Testato sincronizzazione contatti
- [ ] Verificato import contatti nel DB
- [ ] Aggiornato redirect URIs per produzione
- [ ] Pubblicato app Google (se necessario per 100+ utenti)

---

## 🚀 DEPLOY IN PRODUZIONE

### Update Authorized URIs

Quando deploi su Vercel, aggiungi questi URI in Google Cloud Console:

**Authorized JavaScript origins:**
```
https://alm-rmi.vercel.app
```

**Authorized redirect URIs:**
```
https://mfuxhdvsvqcthyeqsjin.supabase.co/auth/v1/callback
```

(Il redirect URI Supabase rimane lo stesso anche in produzione!)

---

## 📚 RISORSE

- **Guida dettagliata:** `docs/GOOGLE_OAUTH_SETUP.md`
- **Google People API:** https://developers.google.com/people
- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth/social-login/auth-google
- **Google Cloud Console:** https://console.cloud.google.com/

---

## 🎉 FATTO!

L'implementazione è completa. Segui gli step manuali sopra per configurare Google Cloud Console e Supabase, poi testa il flusso completo.

**Domande?** Consulta `docs/GOOGLE_OAUTH_SETUP.md` per dettagli o il Troubleshooting sopra.

Buona sincronizzazione! 🚀
