# 🔐 Configurazione Google OAuth & People API

## Guida Step-by-Step per Sincronizzazione Google Contacts

---

## FASE 1: Google Cloud Console Setup

### 1.1 Crea/Seleziona Progetto Google Cloud

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Clicca su **"Select a project"** (in alto a sinistra)
3. Clicca su **"NEW PROJECT"**
4. Nome progetto: `ALM-RMI` o `ALM-Infissi-RMI`
5. Clicca **"CREATE"**
6. Aspetta che il progetto venga creato (pochi secondi)
7. Seleziona il nuovo progetto dal dropdown

---

### 1.2 Abilita Google People API

1. Nel menu laterale, vai su **"APIs & Services"** → **"Library"**
2. Cerca: `Google People API`
3. Clicca su **"Google People API"**
4. Clicca **"ENABLE"**
5. Aspetta l'abilitazione (pochi secondi)

✅ Verifica: Dovresti vedere "API enabled" con un segno di spunta verde

---

### 1.3 Configura OAuth Consent Screen

**IMPORTANTE:** Questo è obbligatorio prima di creare le credenziali!

1. Vai su **"APIs & Services"** → **"OAuth consent screen"**
2. Seleziona **"External"** (per uso pubblico) o **"Internal"** (se hai Google Workspace)
   - Consiglio: **"External"** per più flessibilità
3. Clicca **"CREATE"**

#### Configurazione Consent Screen:

**App information:**
- **App name:** `ALM-RMI`
- **User support email:** `servizio@alminfissi.it` (o tua email)
- **App logo:** (opzionale) Carica logo A.L.M. Infissi

**App domain:**
- **Application home page:** `https://alm-rmi.vercel.app`
- **Application privacy policy link:** `https://alm-rmi.vercel.app/privacy` (crea se necessario)
- **Application terms of service link:** `https://alm-rmi.vercel.app/terms` (crea se necessario)

**Authorized domains:**
- Clicca **"ADD DOMAIN"**
- Aggiungi: `vercel.app`
- Aggiungi: `supabase.co`
- Se hai dominio custom: aggiungi `alminfissi.it` (o il tuo dominio)

**Developer contact information:**
- Email: `servizio@alminfissi.it` (o tua email)

4. Clicca **"SAVE AND CONTINUE"**

#### Scopes (Permessi):

1. Clicca **"ADD OR REMOVE SCOPES"**
2. Cerca e seleziona questi scope:
   - ✅ `.../auth/userinfo.email` - Vedere l'indirizzo email
   - ✅ `.../auth/userinfo.profile` - Vedere le info del profilo
   - ✅ `.../auth/contacts.readonly` - Vedere i contatti (READ ONLY)

   **IMPORTANTE:** Usa `.readonly` per sicurezza! Non serve scrivere sui contatti.

3. Clicca **"UPDATE"**
4. Clicca **"SAVE AND CONTINUE"**

#### Test users (solo per External "Testing" mode):

Se l'app è in modalità "Testing", aggiungi gli utenti che possono testare:
1. Clicca **"ADD USERS"**
2. Aggiungi email degli utenti A.L.M. che testeranno (max 100)
   - Esempio: `mario.rossi@gmail.com`, `luca.bianchi@gmail.com`
3. Clicca **"SAVE AND CONTINUE"**

5. Review e clicca **"BACK TO DASHBOARD"**

✅ Status dovrebbe essere: **"Testing"** (per ora va bene)

**NOTA:** Per uso in produzione con tutti gli utenti, dovrai pubblicare l'app (richiede verifica Google).

---

### 1.4 Crea OAuth2 Credentials

1. Vai su **"APIs & Services"** → **"Credentials"**
2. Clicca **"+ CREATE CREDENTIALS"** (in alto)
3. Seleziona **"OAuth client ID"**

#### Configurazione OAuth Client:

**Application type:**
- Seleziona: **"Web application"**

**Name:**
- Nome: `ALM-RMI Web Client`

**Authorized JavaScript origins:**
- Clicca **"+ ADD URI"**
- Development: `http://localhost:3000`
- Development: `http://localhost:3001` (se usi altre porte)
- Production: `https://alm-rmi.vercel.app`
- Se hai dominio custom: `https://app.alminfissi.it`

**Authorized redirect URIs:**
- Clicca **"+ ADD URI"**

**IMPORTANTE:** Questi URI sono per Supabase Auth!

Formato: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

Dove trovare il tuo PROJECT-REF:
- Dashboard Supabase → Settings → API
- Prendi URL tipo: `https://mfuxhdvsvqcthyeqsjin.supabase.co`
- Il PROJECT-REF è: `mfuxhdvsvqcthyeqsjin`

Aggiungi:
1. `https://mfuxhdvsvqcthyeqsjin.supabase.co/auth/v1/callback` (PRODUCTION)
2. `http://localhost:54321/auth/v1/callback` (se usi Supabase Local)

4. Clicca **"CREATE"**

#### Salva le Credentials:

Apparirà un popup con:
- **Client ID:** `xxxxxxxxxxxx-yyyyyyyyyyyy.apps.googleusercontent.com`
- **Client secret:** `GOCSPX-zzzzzzzzzzzzzzzzzzzz`

**IMPORTANTISSIMO:** Copia e salva queste credenziali! Le useremo dopo.

✅ Puoi anche scaricare il JSON cliccando l'icona download.

---

## FASE 2: Configurazione Supabase

### 2.1 Aggiungi Google Provider a Supabase

1. Vai su [Supabase Dashboard](https://app.supabase.com/)
2. Seleziona il tuo progetto RMI
3. Vai su **"Authentication"** → **"Providers"**
4. Trova **"Google"** nella lista
5. Clicca per espandere

#### Configurazione Google Provider:

**Enable Sign in with Google:**
- Toggle: **ON** ✅

**Client ID (for OAuth):**
- Incolla il **Client ID** da Google Cloud Console
- Formato: `xxxxxxxxxxxx-yyyyyyyyyyyy.apps.googleusercontent.com`

**Client Secret (for OAuth):**
- Incolla il **Client secret** da Google Cloud Console
- Formato: `GOCSPX-zzzzzzzzzzzzzzzzzzzz`

**Authorized Client IDs:**
- Lascia vuoto (non serve per web app)

**Skip nonce checks:**
- Lascia **OFF** (più sicuro)

6. Clicca **"SAVE"**

✅ Verifica: Google dovrebbe apparire come provider abilitato

---

### 2.2 Verifica Redirect URL

1. Nella stessa pagina, in alto trovi: **"Redirect URLs"**
2. Copia l'URL: `https://mfuxhdvsvqcthyeqsjin.supabase.co/auth/v1/callback`
3. **Verifica** che questo URL sia stato aggiunto ai "Authorized redirect URIs" in Google Cloud Console

Se non l'hai fatto prima, torna a Google Cloud Console e aggiungilo!

---

## FASE 3: Configurazione Next.js (.env)

### 3.1 Aggiungi Variabili d'Ambiente

Apri il file `.env` nel progetto e aggiungi:

```bash
# ============================================
# Google OAuth Configuration
# ============================================
GOOGLE_CLIENT_ID=xxxxxxxxxxxx-yyyyyyyyyyyy.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-zzzzzzzzzzzzzzzzzzzz
```

**NOTA:** Queste variabili NON sono necessarie per il codice attuale (usiamo Supabase Auth),
ma è buona pratica salvarle per riferimento futuro.

---

## FASE 4: Configurazione Scopes in Supabase

Per richiedere l'accesso ai contatti Google, dobbiamo configurare gli scopes.

### 4.1 Metodo 1: Configurazione Supabase Dashboard (PREFERITO)

Sfortunatamente, Supabase Dashboard non permette di configurare scopes custom nella UI.
Dobbiamo usare il metodo 2.

### 4.2 Metodo 2: Configurazione via Codice (IMPLEMENTATO)

Nel codice Next.js, quando chiami `supabase.auth.signInWithOAuth()`, specifica gli scopes:

```typescript
// Esempio di login con Google + Contacts scope
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/dashboard`,
    scopes: 'https://www.googleapis.com/auth/contacts.readonly',
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  },
})
```

**IMPORTANTE:** Questo deve essere fatto nel componente di login!

---

## FASE 5: Modifica Componente Login

Dobbiamo aggiornare la pagina di login per supportare Google OAuth.

File: `app/login/page.tsx`

Aggiungi un pulsante "Sign in with Google" che chiama:

```typescript
const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      scopes: 'https://www.googleapis.com/auth/contacts.readonly',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('Error signing in with Google:', error)
    toast.error('Errore durante il login con Google')
  }
}
```

**Nota:** Il `provider_token` necessario per la sincronizzazione viene salvato automaticamente
nella sessione Supabase quando l'utente fa login con Google.

---

## FASE 6: Test Completo

### 6.1 Test Login Google

1. Avvia il server: `npm run dev`
2. Vai su `http://localhost:3000/login`
3. Clicca su "Sign in with Google"
4. Dovresti vedere il popup di Google OAuth
5. Seleziona account Google
6. **IMPORTANTE:** Google chiederà permessi per:
   - ✅ Vedere email e profilo
   - ✅ Vedere i tuoi contatti
7. Clicca **"Consenti"**
8. Dovresti essere reindirizzato a `/dashboard`

✅ Se tutto funziona, hai completato l'OAuth setup!

### 6.2 Verifica Provider Token

Dopo il login, verifica che il token sia presente:

```typescript
// Console del browser o API route
const { data: { session } } = await supabase.auth.getSession()
console.log('Provider Token:', session?.provider_token)
```

Dovresti vedere un token lungo tipo: `ya29.a0AfB_byA...`

✅ Se vedi il token, l'OAuth funziona!

### 6.3 Test Sincronizzazione Google Contacts

1. Vai su `/rubrica`
2. Clicca pulsante **"Sincronizza con Google"**
3. L'app chiamerà `POST /api/clienti/sync-google`
4. Verifica nella console:
   - Nessun errore
   - Messaggio di successo: "X nuovi, Y aggiornati"
5. Ricarica la tabella clienti
6. Dovresti vedere i contatti importati da Google!

✅ Se vedi i contatti, la sincronizzazione funziona!

---

## 🐛 Troubleshooting

### Errore: "redirect_uri_mismatch"

**Causa:** L'URI di redirect non corrisponde a quello configurato in Google Cloud Console.

**Soluzione:**
1. Copia l'URI esatto dall'errore
2. Vai su Google Cloud Console → Credentials
3. Modifica OAuth client
4. Aggiungi l'URI esatto in "Authorized redirect URIs"
5. SAVE e riprova dopo 5 minuti (cache Google)

---

### Errore: "invalid_scope"

**Causa:** Scope non abilitato nel Consent Screen.

**Soluzione:**
1. Google Cloud Console → OAuth consent screen
2. EDIT APP
3. Scopes → ADD OR REMOVE SCOPES
4. Aggiungi `contacts.readonly`
5. SAVE

---

### Errore: "Token Google non trovato"

**Causa:** L'utente non ha fatto login con Google OAuth.

**Soluzione:**
1. Logout dall'app
2. Login nuovamente con "Sign in with Google"
3. Verifica che `provider_token` sia presente nella sessione

---

### Errore: "Access Not Configured"

**Causa:** Google People API non abilitata nel progetto.

**Soluzione:**
1. Google Cloud Console → APIs & Services → Library
2. Cerca "Google People API"
3. ENABLE
4. Aspetta 5 minuti e riprova

---

### Errore: "insufficientPermissions" o "Forbidden"

**Causa:** L'utente non ha dato il consenso per leggere i contatti.

**Soluzione:**
1. Logout e re-login con Google
2. Assicurati di cliccare "Consenti" per TUTTI i permessi
3. Se necessario, revoca accesso su [myaccount.google.com/permissions](https://myaccount.google.com/permissions)
4. Re-login

---

### App in modalità "Testing"

**Problema:** Solo 100 test users possono usare l'app.

**Soluzione (per produzione):**
1. Google Cloud Console → OAuth consent screen
2. Clicca **"PUBLISH APP"**
3. Compila il form di verifica Google (può richiedere settimane)

**Alternativa (per uso interno):**
- Usa Google Workspace con app "Internal"
- Tutti gli utenti @tuodominio.com possono usarla

---

## 📚 Risorse Utili

- [Google People API Docs](https://developers.google.com/people)
- [Supabase Google OAuth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth Scopes](https://developers.google.com/identity/protocols/oauth2/scopes)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## ✅ Checklist Configurazione

- [ ] Creato progetto Google Cloud Console
- [ ] Abilitato Google People API
- [ ] Configurato OAuth Consent Screen
- [ ] Creato OAuth2 Credentials (Client ID + Secret)
- [ ] Aggiunto Authorized redirect URIs (Supabase callback)
- [ ] Configurato Google Provider in Supabase Dashboard
- [ ] Aggiunto variabili .env (opzionale)
- [ ] Modificato componente login con Google OAuth
- [ ] Testato login con Google
- [ ] Verificato provider_token nella sessione
- [ ] Testato sincronizzazione contatti
- [ ] Verificato import contatti nella rubrica

---

**Setup completato! 🎉**

Ora puoi sincronizzare i contatti Google nella tua rubrica RMI.
