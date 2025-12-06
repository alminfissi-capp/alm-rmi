# 🗺️ ROADMAP - ALM RMI Project

**Ultimo aggiornamento**: 2025-12-06

## 📊 Stato Progetto

**Completamento generale**: 90%
**Versione corrente**: 1.0.0-beta
**Stack**: Next.js 16.0.7, React 19.2.0, TypeScript 5, Prisma 6.19.0, Supabase

---

## ✅ COMPLETATO

### Sistema di Autenticazione
- [x] Login con email/password (Supabase Auth)
- [x] Registrazione utenti
- [x] Verifica email obbligatoria
- [x] Resend email verification con cooldown
- [x] Logout con server actions
- [x] Protezione route automatica
- [x] Gestione sessioni SSR

### Dashboard
- [x] Card statistiche (4 cards con metriche principali)
- [x] Trend mensile rilievi (% change)
- [x] Grafico attività ultimi 6 mesi (Area chart)
- [x] Distribuzione stati (Pie chart)
- [x] Tabella rilievi recenti (ultimi 5)
- [x] Quick action "Nuovo Rilievo"

### Gestione Rilievi
- [x] Lista rilievi con tabella interattiva
- [x] Filtri ricerca testo (cliente, commessa, indirizzo)
- [x] Filtro per stato (dropdown)
- [x] Azioni riga: Visualizza, Modifica, PDF, Email, Elimina
- [x] **Cambio stato interattivo** dalla tabella (commit: 76c529c)
- [x] Loading states con skeleton loaders
- [x] Creazione nuovo rilievo con dialog
- [x] Eliminazione con conferma

### Form RMI (Rilevatore Misure Interattivo)
- [x] Header Section (cliente, commessa, data, indirizzo, contatti)
- [x] Dati Tipologia (44 tipologie serramenti, 18 serie)
- [x] Misure Alette (DX, Testa, SX, Base)
- [x] Colori (interno/esterno, accessori, ante)
- [x] Ferramenta (cerniere, serrature, cilindro)
- [x] Opzioni (linee estetiche, tipo anta)
- [x] Apertura (lato, altezza/tipo maniglia)
- [x] Riempimenti (vetri, pannelli)
- [x] Traverso/Montante
- [x] Zoccolo/Fascia
- [x] Oscuranti
- [x] Zanzariere (tipologia, colore, chiusura, misure)
- [x] Sistema multi-pagina (P1, P2, P3...)
- [x] Aggiungi/Rimuovi pagine con conferma
- [x] Validazione real-time (React Hook Form + Zod)
- [x] Salvataggio automatico
- [x] View mode / Edit mode toggle
- [x] 50+ campi gestiti per serramento

### Database & API
- [x] Schema Prisma completo (3 models: Rilievo, Serramento, PDFGenerated)
- [x] PostgreSQL su Supabase
- [x] API RESTful `/api/rilievi` (GET, POST)
- [x] API `/api/rilievi/[id]` (GET, PATCH, DELETE)
- [x] API `/api/rilievi/[id]/status` (PATCH stato)
- [x] API `/api/serramenti` (POST, PATCH, DELETE)
- [x] API `/api/dashboard/stats` (statistiche dashboard)
- [x] API `/api/pdf/generate` (generazione PDF)
- [x] Query helpers in `/lib/supabase/queries.ts`
- [x] No-cache headers su API dinamiche

### PDF & Storage
- [x] Generazione PDF con jsPDF + html2canvas
- [x] Upload automatico Supabase Storage
- [x] Download con signed URL temporanei
- [x] Salvataggio metadata in database (PDFGenerated table)
- [x] Storage helpers in `/lib/supabase/storage.ts`

### Email
- [x] Integrazione Resend API
- [x] Email verification funzionante
- [x] Resend verification con cooldown 60s
- [x] API `/api/send` per test invio email
- [x] API `/api/auth/resend-verification`

### UI/UX & Design System
- [x] 28 componenti shadcn/ui (Button, Dialog, Table, Form, ecc.)
- [x] Dark/Light mode con next-themes
- [x] **Migrazione tema Blue da HSL a OKLCH** (commit: 1d497b5)
- [x] Logo SVG A.L.M. Infissi con supporto dark mode
- [x] Responsive design (Tailwind CSS 4)
- [x] Toast notifications (Sonner)
- [x] Loading states con skeleton loaders
- [x] 58+ Lucide React icons
- [x] Sidebar navigation con AppSidebar
- [x] Breadcrumb navigation

### Ottimizzazioni & Deployment
- [x] **Next.js 16.0.7** upgrade (commit: 78c464c)
- [x] **Separazione pagine Dashboard/Rilievi** (commit: 3063adc)
- [x] **Rimosso auto-refresh polling** da dashboard (commit: 7bd4cfe)
- [x] Force dynamic rendering dove necessario
- [x] Server components dove possibile
- [x] Turbopack abilitato

---

## 🚧 IN PROGRESS

_Nessuna task attualmente in corso_

---

## 📋 TODO - PRIORITY ALTA

### Settings Page
- [ ] Implementare pagina `/dashboard/settings` completa
- [ ] Sezione Profilo Utente
  - [ ] Visualizzazione dati utente (email, nome)
  - [ ] Modifica informazioni profilo
  - [ ] Upload avatar/foto profilo
- [ ] Sezione Sicurezza
  - [ ] Cambio password
  - [ ] Gestione sessioni attive
  - [ ] Two-factor authentication (opzionale)
- [ ] Sezione Preferenze
  - [ ] Lingua (IT/EN)
  - [ ] Formato data (DD/MM/YYYY vs MM/DD/YYYY)
  - [ ] Tema default (Light/Dark/System)
  - [ ] Notifiche email

### Invio PDF via Email
- [ ] Creare dialog "Invia PDF via Email"
- [ ] Form con input email destinatario (con validazione)
- [ ] Campo oggetto email (precompilato modificabile)
- [ ] Campo messaggio/corpo email
- [ ] Anteprima email prima invio
- [ ] Integrazione API `/api/send` con allegato PDF
- [ ] Conferma invio con toast notification
- [ ] Log invii email in database (tabella EmailLog)
- [ ] UI bottone "Invia Email" nella tabella rilievi

### Testing Completo
- [ ] Test edge cases form RMI
  - [ ] Validazione campi obbligatori
  - [ ] Limiti numerici (larghezza, altezza)
  - [ ] Gestione caratteri speciali
- [ ] Test workflow completo
  - [ ] Creazione rilievo → Edit → Salvataggio → PDF → Email
  - [ ] Test cambio stato in tutti gli stati possibili
  - [ ] Test eliminazione con cascade (serramenti + PDF)
- [ ] Test autenticazione
  - [ ] Protezione route non autenticate
  - [ ] Session expiry handling
  - [ ] Email verification flow
- [ ] Test responsive design
  - [ ] Mobile (320px - 768px)
  - [ ] Tablet (768px - 1024px)
  - [ ] Desktop (1024px+)

---

## 📋 TODO - PRIORITY MEDIA

### Gestione Errori Avanzata
- [ ] Implementare Error Boundaries React
  - [ ] Global error boundary in root layout
  - [ ] Specific boundaries per sezioni critiche (Form RMI, Dashboard)
- [ ] Logging centralizzato errori
  - [ ] Integrazione servizio logging (es. Sentry)
  - [ ] Log errori API con stack trace
  - [ ] Log errori client-side
- [ ] Error recovery automatico
  - [ ] Retry automatico API calls fallite
  - [ ] Fallback UI per componenti broken
  - [ ] Toast error con azioni recovery

### Ottimizzazioni Performance
- [ ] Code splitting avanzato
  - [ ] Dynamic imports componenti pesanti
  - [ ] Route-based code splitting
  - [ ] Lazy loading PDF generator
- [ ] Ottimizzazione bundle
  - [ ] Analisi bundle size con webpack-bundle-analyzer
  - [ ] Tree shaking dipendenze non usate
  - [ ] Minimizzazione CSS
- [ ] Cache strategy
  - [ ] SWR per API calls client
  - [ ] Cache-Control headers ottimizzati
  - [ ] Service Worker per offline support (opzionale)
- [ ] Image optimization
  - [ ] Conversione logo a WebP/AVIF
  - [ ] Lazy loading images
  - [ ] Responsive images

### UX Improvements
- [ ] Conferma prima di uscire da form non salvato
  - [ ] Dialog "Hai modifiche non salvate"
  - [ ] beforeunload event listener
- [ ] Autosave indicator visibile
  - [ ] Badge "Salvato" / "Salvataggio..." / "Errore salvataggio"
  - [ ] Timestamp ultimo salvataggio
- [ ] Breadcrumb navigation migliorata
  - [ ] Click per navigare a livelli superiori
  - [ ] Indicatore pagina corrente
- [ ] Tutorial/Onboarding
  - [ ] Tour guidato prima volta (es. react-joyride)
  - [ ] Tooltips interattivi
  - [ ] Video tutorial inline
- [ ] Keyboard shortcuts
  - [ ] Ctrl+S per salvare
  - [ ] Ctrl+N per nuovo rilievo
  - [ ] ESC per chiudere dialog
  - [ ] Modale con lista shortcuts (Ctrl+?)

---

## 📋 TODO - PRIORITY BASSA

### Features Aggiuntive
- [ ] Export CSV lista rilievi
  - [ ] Bottone "Esporta CSV" in lista rilievi
  - [ ] Export con filtri applicati
  - [ ] Selezione colonne da esportare
- [ ] Duplica rilievo esistente
  - [ ] Action "Duplica" nella tabella
  - [ ] Dialog conferma duplicazione
  - [ ] Copia tutti i serramenti
  - [ ] Nuovo nome/commessa
- [ ] Template rilievi predefiniti
  - [ ] CRUD templates
  - [ ] Applicazione template a nuovo rilievo
  - [ ] Galleria templates con preview
- [ ] Search avanzata
  - [ ] Filtro per range date
  - [ ] Filtro per tipologia serramento
  - [ ] Filtro per serie
  - [ ] Combinazione filtri multipli
- [ ] Ordinamento colonne tabella
  - [ ] Click header per sort ASC/DESC
  - [ ] Indicatore direzione sort
  - [ ] Sort persistente in URL params
- [ ] Paginazione tabella rilievi
  - [ ] Limit configurabile (10, 25, 50, 100)
  - [ ] Navigazione pagine
  - [ ] Infinite scroll (alternativa)
- [ ] Bulk actions
  - [ ] Selezione multipla rilievi (checkbox)
  - [ ] Cambio stato multiplo
  - [ ] Eliminazione multipla
  - [ ] Export multiplo PDF

### Amministrazione (se necessario)
- [ ] Pannello Admin
  - [ ] Route `/admin` protetta (role-based)
  - [ ] Dashboard admin con metriche globali
- [ ] Gestione Utenti
  - [ ] Lista tutti gli utenti
  - [ ] Sospendi/Riattiva utenti
  - [ ] Modifica ruoli (admin/user)
  - [ ] Reset password manuale
- [ ] Analytics e Report
  - [ ] Report rilievi per periodo
  - [ ] Report per utente
  - [ ] Export report Excel/PDF
- [ ] Audit Log
  - [ ] Tabella AuditLog in database
  - [ ] Log modifiche critiche (DELETE, STATUS change)
  - [ ] Visualizzazione log in admin panel
  - [ ] Filtri e ricerca log

### Backup & Security
- [ ] Backup Strategy
  - [ ] Backup automatico database (daily)
  - [ ] Backup Supabase Storage
  - [ ] Script restore
  - [ ] Test restore procedure
- [ ] Rate Limiting
  - [ ] Middleware rate limiting API
  - [ ] IP-based limits
  - [ ] User-based limits
  - [ ] Redis per distributed rate limiting
- [ ] Security Hardening
  - [ ] CSRF protection (già in Next.js, verificare)
  - [ ] Input sanitization avanzata
  - [ ] SQL injection prevention (Prisma già sicuro, verificare)
  - [ ] XSS prevention
  - [ ] Content Security Policy headers
- [ ] Monitoring & Alerting
  - [ ] Uptime monitoring
  - [ ] Error rate alerting
  - [ ] Performance monitoring (Core Web Vitals)
  - [ ] Database performance monitoring

### Documentazione
- [ ] User Guide
  - [ ] Manuale utente completo (PDF/online)
  - [ ] Screenshots e video tutorial
  - [ ] FAQ
- [ ] API Documentation
  - [ ] OpenAPI/Swagger spec
  - [ ] Postman collection
  - [ ] Examples per ogni endpoint
- [ ] Developer Documentation
  - [ ] Architecture overview
  - [ ] Database schema diagram
  - [ ] Component structure
  - [ ] Setup locale per nuovi developer
- [ ] Deployment Guide
  - [ ] Step-by-step deploy Vercel
  - [ ] Environment variables setup
  - [ ] Database migration procedure
  - [ ] Rollback procedure

---

## 🎯 MILESTONE

### v1.0.0 - Release Produzione
**Target**: Q1 2025
**Blockers**: Settings page, Email PDF, Testing completo

- [ ] Tutte le task Priority Alta completate
- [ ] Testing completo passato
- [ ] Documentazione user guide
- [ ] Deploy su ambiente produzione
- [ ] Monitoring attivo

### v1.1.0 - UX & Performance
**Target**: Q2 2025
**Focus**: Ottimizzazioni e miglioramenti esperienza utente

- [ ] Tutte le task Priority Media completate
- [ ] Performance audit con Lighthouse (score >90)
- [ ] Tutorial onboarding implementato

### v2.0.0 - Features Avanzate
**Target**: Q3 2025
**Focus**: Features aggiuntive e amministrazione

- [ ] Export CSV e duplicazione rilievi
- [ ] Template predefiniti
- [ ] Pannello admin (se necessario)
- [ ] Backup strategy completa

---

## 📝 NOTE

### Come Aggiornare questa Roadmap
Quando completi una task:
1. Sposta la task da TODO a COMPLETATO
2. Aggiungi la data di completamento
3. Se presente, aggiungi il commit hash di riferimento
4. Aggiorna la percentuale "Completamento generale"
5. Commit in git con messaggio descrittivo

Esempio commit message:
```
feat: implementa settings page con profilo utente

- Aggiunta sezione profilo in /dashboard/settings
- Form modifica dati utente
- Update ROADMAP.md con task completata
```

### Convenzioni Commit
- `feat:` - Nuova feature
- `fix:` - Bug fix
- `docs:` - Modifiche documentazione
- `style:` - Formattazione, styling
- `refactor:` - Refactoring codice
- `test:` - Aggiunta test
- `chore:` - Manutenzione, build

---

**Ultimo commit**: 76c529c - Implementazione cambio stato interattivo nella tabella rilievi
**Branch corrente**: main
**Prossima task suggerita**: Settings Page - Sezione Profilo Utente
