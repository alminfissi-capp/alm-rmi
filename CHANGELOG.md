# Changelog

Tutte le modifiche notevoli a questo progetto saranno documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/),
e questo progetto aderisce al [Semantic Versioning](https://semver.org/lang/it/).

---

## [Non rilasciato]

### Added
- Error Boundary React per gestione crash dell'applicazione
- File di configurazione centralizzato `/lib/config/constants.ts`
- Validazione robusta dei parametri API (limit, sort, order)
- AbortController per prevenire memory leak nei fetch
- Retry logic con exponential backoff per generazione commessa

### Changed
- **Nome progetto da "nextjs" a "alm-rmi"** in package.json
- Migliorata sicurezza SQL injection con validazione parametri
- Ottimizzata race condition nell'auto-incremento commessa usando transazioni Prisma
- Messaggi di errore standardizzati con costanti centralizzate
- HTTP status codes centralizzati in configurazione

### Fixed
- SQL injection risk nella route GET /api/rilievi
- Race condition nella generazione automatica numero commessa
- Memory leak in useEffect del componente rilievi-client
- Validazione insufficiente del parametro `limit` nelle API

### Security
- Validazione parametri API con limiti configurabili (1-1000)
- Transazioni database per prevenire duplicati commessa
- Error handling migliorato con messaggi standardizzati

---

## [0.1.0] - 2025-12-12

### Added
- Setup iniziale progetto Next.js 16 con App Router
- Integrazione Supabase per autenticazione e database
- Integrazione Prisma ORM per PostgreSQL
- Sistema di autenticazione completo (login, signup, verifica email)
- Dashboard con statistiche e lista rilievi
- Form RMI completo per rilevazione misure serramenti
- Gestione dinamica pagine (P1, P2, P3...)
- Auto-save con debounce
- Generazione PDF con jsPDF e html2canvas
- Invio email PDF con Resend
- Responsive design con Tailwind CSS
- Componenti UI con Shadcn/ui
- Theme provider (dark/light mode)
- Toast notifications con Sonner

### API Routes Implementate
- `/api/rilievi` - CRUD rilievi
- `/api/serramenti` - CRUD serramenti
- `/api/dashboard/stats` - Statistiche dashboard
- `/api/pdf/generate` - Generazione PDF
- `/api/pdf/send-email` - Invio email PDF
- `/api/user/profile` - Gestione profilo utente
- `/api/user/password` - Cambio password
- `/api/user/preferences` - Preferenze utente

### Componenti Implementati
- `RMIForm` - Form principale rilevazione
- `PageManager` - Gestione tab dinamici
- `HeaderSection` - Dati cliente/commessa
- `DatiTipologiaSection` - Tipologia e misure
- `MisureAletteSection` - Misure alette
- `ColoriSection` - Colori serramenti
- `FerramentaSection` - Ferramenta
- `ZanzariereSection` - Zanzariere
- Altre sezioni form (Opzioni, Apertura, Riempimenti, etc.)

### Database Schema
- Tabella `rilievi` con RLS policies
- Tabella `serramenti` con relazione a rilievi
- Tabella `pdf_generated` per tracciamento PDF
- Auto-incremento commessa formato `RMI_0001_2025`

---

## Convenzioni di Versioning

- **MAJOR version** (X.0.0) - Cambiamenti incompatibili con versioni precedenti
- **MINOR version** (0.X.0) - Nuove funzionalità retrocompatibili
- **PATCH version** (0.0.X) - Bug fix retrocompatibili

## Tipi di Modifiche

- `Added` - Nuove funzionalità
- `Changed` - Modifiche a funzionalità esistenti
- `Deprecated` - Funzionalità che saranno rimosse
- `Removed` - Funzionalità rimosse
- `Fixed` - Bug fix
- `Security` - Correzioni di sicurezza
