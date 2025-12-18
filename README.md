# ALM-RMI - Rilevatore Misure Interattivo

Sistema web professionale per la rilevazione misure serramenti in cantiere, sviluppato per **A.L.M. Infissi** (Palermo, Sicilia).

[![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-Private-red)](LICENSE)

---

## 📋 Descrizione

**ALM-RMI** è un'applicazione web moderna che sostituisce il processo manuale Excel per la rilevazione delle misure dei serramenti. Permette ai tecnici di rilevare le misure direttamente in cantiere usando tablet o smartphone, con generazione automatica di PDF professionali.

Include un **Configuratore Infissi** interattivo con anteprima 3D e calcolo preventivi in tempo reale.

### 🎯 Obiettivi Principali

- ✅ Gestione dinamica delle pagine (P1, P2, P3...)
- ✅ Form completo e strutturato per tutti i dati necessari
- ✅ Salvataggio automatico cloud
- ✅ Generazione PDF professionale con logo aziendale
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Auto-incremento numero commessa (formato: RMI_0001_2025)
- ✅ **Configuratore Infissi** con anteprima 3D e preventivazione
- ✅ **Tema Retro-Futuristico Cyberpunk** con effetti luminosi

---

## 🚀 Tech Stack

### Frontend
- **Next.js 16** (App Router) - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Componenti UI
- **React Hook Form** + **Zod** - Form validation
- **jsPDF** + **html2canvas** - Generazione PDF

### Backend
- **Supabase** - PostgreSQL database + Auth
- **Prisma ORM** - Database client
- **Resend** - Invio email

### Deploy
- **Vercel** - Hosting frontend
- **Supabase Cloud** - Hosting backend

---

## 📦 Installazione

### Prerequisiti

- Node.js 18+
- npm o yarn
- Account Supabase (gratuito)

### Setup

1. **Clone del repository**
```bash
git clone https://github.com/alminfissi-capp/alm-rmi.git
cd alm-rmi
```

2. **Installazione dipendenze**
```bash
npm install
```

3. **Configurazione environment variables**

Crea un file `.env.local` nella root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database (Prisma)
DATABASE_URL=postgresql://postgres:[password]@[host]/[database]

# Email (Resend)
RESEND_API_KEY=your-resend-api-key
```

4. **Setup database**

Esegui le migrations Prisma:
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Avvia il server di sviluppo**
```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

---

## 📁 Struttura Progetto

```
alm-rmi/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── rilievi/       # CRUD rilievi
│   │   ├── serramenti/    # CRUD serramenti
│   │   ├── pdf/           # Generazione PDF
│   │   └── dashboard/     # Statistiche
│   ├── dashboard/         # Dashboard principale
│   ├── rilievi/           # Lista rilievi
│   ├── rubrica/           # Gestione clienti
│   ├── configuratore/     # 🆕 Configuratore infissi
│   ├── login/             # Autenticazione
│   ├── signup/            # Registrazione
│   └── globals.css        # 🆕 Tema cyberpunk globale
├── components/
│   ├── rmi/               # Componenti form RMI
│   ├── dashboard/         # Componenti dashboard
│   ├── pdf/               # Generazione PDF
│   └── ui/                # Shadcn/ui components
├── lib/
│   ├── supabase/          # Client Supabase
│   ├── config/            # Configurazione app
│   ├── types/             # TypeScript types
│   └── constants/         # Costanti
├── prisma/
│   └── schema.prisma      # Database schema
├── PRD/                   # Documentazione progetto
└── public/                # Assets statici
```

---

## 🔑 Funzionalità Principali

### 1. **Autenticazione**
- Login/Signup con email
- Verifica email
- Gestione profilo utente
- Cambio password

### 2. **Dashboard**
- Statistiche rilievi (totali, in lavorazione, completati)
- Lista rilievi con ricerca e filtri
- Azioni rapide (modifica, elimina, genera PDF)

### 3. **Form RMI**
- Gestione dinamica pagine (aggiungi/rimuovi serramenti)
- Sezioni complete:
  - Dati cliente/commessa
  - Tipologia e misure
  - Colori
  - Ferramenta
  - Zanzariere
  - Oscuranti
  - E altro...
- Auto-save ogni 3 secondi
- Validazione real-time

### 4. **Generazione PDF**
- PDF professionale con logo A.L.M.
- Una pagina per serramento
- Download automatico
- Invio via email

### 5. **Auto-incremento Commessa**
- Formato: `RMI_0001_2025`, `RMI_0002_2025`, etc.
- Generazione automatica con anno corrente
- Protezione race condition con transazioni
- Retry logic con exponential backoff

### 6. **Configuratore Infissi** 🎨
- **5 Step di configurazione**:
  1. Tipo infisso (finestra, porta-finestra, scorrevole, vetrata fissa)
  2. Dimensioni personalizzate e serie profilo
  3. Colori RAL e tipo vetro
  4. Prestazioni (isolamento termico, acustico, sicurezza)
  5. Accessori (maniglie, zanzariere, tapparelle)
- **Anteprima 3D** in tempo reale con SVG
- **Calcolo preventivo dinamico** al m²
- **Riepilogo configurazione** completo
- **Tema cyberpunk** con effetti luminosi
- Database prodotti integrato (serie, colori, vetri, accessori)

---

## 🛠️ Script Disponibili

```bash
# Sviluppo
npm run dev          # Avvia server dev (http://localhost:3000)

# Build
npm run build        # Build per produzione
npm start            # Avvia server produzione

# Database
npx prisma studio    # UI per database
npx prisma migrate dev  # Crea nuova migration
npx prisma generate  # Genera Prisma client

# Linting
npm run lint         # ESLint check
```

---

## 🔒 Sicurezza

- **Row Level Security (RLS)** attivo su tutte le tabelle
- **Validazione parametri API** con limiti configurabili
- **Transazioni database** per prevenire race conditions
- **Error Boundary** per gestione crash
- **AbortController** per prevenire memory leak
- **HTTPS obbligatorio** in produzione

---

## 📊 Database Schema

### Tabelle Principali

**rilievi**
- `id` (UUID) - Primary key
- `user_id` (UUID) - FK a auth.users
- `cliente`, `data`, `indirizzo`, `email`, `celltel`
- `commessa` (UNIQUE) - Numero commessa auto-generato
- `status` (enum) - bozza, in_lavorazione, completato, archiviato

**serramenti**
- `id` (UUID) - Primary key
- `rilievo_id` (UUID) - FK a rilievi
- `page_number` (INT) - Numero pagina (P1, P2, P3...)
- Campi misure, colori, ferramenta, etc.

**pdf_generated**
- `id` (UUID) - Primary key
- `rilievo_id` (UUID) - FK a rilievi
- `file_path` - Path in Supabase Storage

---

## 🎨 Design System

### Tema Retro-Futuristico Cyberpunk

**Palette Colori**
- **Cyber Cyan**: `#64ffda` - Colore primario, effetti glow
- **Cyber Teal**: `#4dd0e1` - Secondario, gradienti
- **Dark Blue**: `#0a0e27`, `#1a1f3a`, `#0f1419` - Sfondo gradiente
- **Muted Blue**: `rgba(30, 35, 55, 0.8)` - Card e pannelli
- **Danger Red**: `#ef4444` - Errori

**Typography**
- **Heading Font**: Orbitron (700-900) - Titoli cyberpunk
- **Body Font**: Inter - Testo leggibile
- **Sizes**: Sistema responsive Tailwind

**Effetti Visivi**
- ✨ **Griglia di sfondo** traslucida cyan (stile Tron)
- ✨ **Bordi luminosi** sulle card con glow multipli
- ✨ **Backdrop blur** 20px su pannelli trasparenti
- ✨ **Hover drammatici** con intensificazione glow
- ✨ **Gradienti** cyan-teal su bottoni e accenti
- ✨ **Box shadow** stratificati per profondità 3D
- ✨ **Barre luminose** gradient che appaiono in hover

**Componenti Stilizzati**
- Card con bordi `2px solid rgba(100, 255, 218, 0.3)`
- Bottoni primary con gradiente cyan-teal
- Input con focus glow cyan
- Sidebar con bordo destro luminoso
- Tabelle con righe hover glow

---

## 📝 Documentazione

Per documentazione dettagliata, consulta:

- **[RMI_PROJECT_SPEC.md](PRD/RMI_PROJECT_SPEC.md)** - Specifica completa progetto
- **[QUICK_START.md](PRD/QUICK_START.md)** - Guida rapida implementazione
- **[CHANGELOG.md](CHANGELOG.md)** - Storico modifiche

---

## 🚀 Deploy

### Deploy su Vercel (consigliato)

1. Push del codice su GitHub
2. Importa il progetto su [Vercel](https://vercel.com)
3. Configura le environment variables
4. Deploy automatico ad ogni push su `main`

**URL Produzione**: https://alm-rmi.vercel.app

---

## 🤝 Contributing

Questo è un progetto privato per A.L.M. Infissi. Per modifiche o suggerimenti, contatta il team di sviluppo.

---

## 📞 Contatti

**Progetto**: ALM-RMI - Rilevatore Misure Interattivo
**Cliente**: A.L.M. Infissi, Palermo
**Repository**: https://github.com/alminfissi-capp/alm-rmi
**Deploy**: https://alm-rmi.vercel.app

---

## 📄 Licenza

Copyright © 2025 A.L.M. Infissi. Tutti i diritti riservati.

Questo software è proprietà privata e non può essere utilizzato, modificato o distribuito senza autorizzazione scritta.

---

**Sviluppato con ❤️ per A.L.M. Infissi**
