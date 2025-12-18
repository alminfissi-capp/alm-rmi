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
- **dxf-parser** - Parsing file DXF (CAD)

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
│   ├── ui/                # Shadcn/ui components
│   └── DxfViewer.jsx      # 🆕 Viewer profili DXF
├── lib/
│   ├── supabase/          # Client Supabase
│   ├── config/            # Configurazione app
│   ├── types/             # TypeScript types
│   ├── constants/         # Costanti
│   └── profili-config.js  # 🆕 Mapping profili DXF
├── prisma/
│   └── schema.prisma      # Database schema
├── PRD/                   # Documentazione progetto
├── public/                # Assets statici
│   └── profili/           # 🆕 File DXF profili tecnici
└── AL_profili/            # 🆕 File DXF originali (sorgente)
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
  1. **Frame Geometrico** - Selezione forma (rettangolo, triangolo, rombo, zoppa)
  2. **Misure Parametriche** - Editor per ogni lato e angolo con validazione real-time
  3. Colori RAL e tipo vetro
  4. Prestazioni (isolamento termico, acustico, sicurezza)
  5. Accessori (maniglie, zanzariere, tapparelle)
- **🆕 Sistema Frames Geometrici**:
  - **4 forme MVP**: Rettangolo, Triangolo, Rombo, Zoppa (pentagono)
  - **Editor parametrico** con controlli per ogni lato (mm) e angolo (gradi)
  - **Validazione geometrica** in tempo reale:
    - Somma angoli = (n-2) × 180°
    - Verifica chiusura poligono (tolleranza 10mm)
    - Range lati: 300-2500mm, angoli: 0-180°
  - **Anteprima SVG dinamica** con:
    - Rendering real-time del poligono
    - Labels dimensioni sui lati
    - Labels angoli sui vertici
    - Auto-scaling e centering
    - Effetti glow cyberpunk
  - **Calcolo automatico**: Area (mm² → m²), Perimetro, Coordinate punti
  - **Sistema scalabile** per aggiungere nuove forme
- **Calcolo preventivo dinamico** basato su area geometrica reale
- **Riepilogo configurazione** con metriche geometriche
- **Tema cyberpunk** con effetti luminosi
- Database prodotti integrato (serie, colori, vetri, accessori)
- **Visualizzazione profili tecnici DXF**:
  - Rendering real-time dei disegni tecnici CAD
  - Parsing automatico file DXF (LINE, ARC, CIRCLE)
  - Stile cyberpunk con bordi luminosi cyan
  - Mapping dinamico tra serie profilo e file DXF
  - Sistema scalabile per aggiungere nuovi profili
  - Dettagli tecnici: spessore, nome serie, descrizione

---

## 📐 Gestione Profili DXF

### Aggiungere Nuovi Profili Tecnici

Il sistema di visualizzazione profili DXF è completamente **scalabile** e modulare. Per aggiungere nuovi profili:

**1. Posiziona il file DXF**
```bash
# Copia il file DXF nella cartella sorgente
cp NUOVO_PROFILO.DXF AL_profili/

# Copialo nella cartella public
cp NUOVO_PROFILO.DXF public/profili/
```

**2. Aggiorna il mapping**

Modifica `lib/profili-config.js`:
```javascript
export const PROFILI_MAPPING = {
  'nuova-serie': {
    fileName: 'NUOVO_PROFILO.DXF',
    nome: 'Nome Serie Profilo',
    descrizione: 'Descrizione tecnica del profilo',
    spessore: 'XXmm'
  },
  // ... altri profili esistenti
};
```

**3. Fine!** ✅

Il configuratore caricherà automaticamente il nuovo profilo quando selezioni la serie corrispondente.

### Profili Attualmente Supportati

| Serie | File DXF | Spessore | Descrizione |
|-------|----------|----------|-------------|
| Basic | TT61802.DXF | 50mm | Profilo base, prestazioni standard |
| Comfort | TT61813.DXF | 60mm | Profilo intermedio, isolamento migliorato |
| Premium | TT61851.DXF | 70mm | Profilo premium, massime prestazioni |

### Requisiti File DXF

- **Formato**: DXF R12 o superiore
- **Entità supportate**: LINE, ARC, CIRCLE, POLYLINE
- **Unità**: Millimetri (automatico scaling)
- **Dimensione consigliata**: < 1MB per file

---

## 🔺 Sistema Frames Geometrici

Il configuratore utilizza un **sistema parametrico** per definire forme geometriche personalizzate, sostituendo il precedente approccio Larghezza × Altezza.

### Architettura

**Struttura File**:
```
lib/frames/
├── geometry-utils.js    # Calcoli matematici e validazione
└── frames-config.js     # Database forme predefinite

components/frames/
├── FrameSelector.jsx    # Selezione forma (griglia 2×2)
├── FrameEditor.jsx      # Editor parametrico lati/angoli
├── FramePreview.jsx     # Anteprima SVG real-time
└── index.js             # Export componenti
```

### Forme Disponibili

| Forma | Punti | Lati Default | Angoli | Descrizione |
|-------|-------|--------------|--------|-------------|
| **Rettangolo** | 4 | 1200×1400mm | 90° × 4 | Forma standard finestre classiche |
| **Triangolo** | 3 | 1200mm × 3 | 60° × 3 | Equilatero per sopraluce |
| **Rombo** | 4 | 1200/1000mm | 70°-110° | Parallelogramma finestre inclinate |
| **Zoppa** | 5 | 1200/800/850mm | 90°-135° | Pentagono mansarde |

### Calcoli Geometrici

**Coordinate Punti**: Sistema polare → Cartesiano
```javascript
calculatePoints(lati, angoli) → [{x, y}, ...]
```

**Area Poligono**: Formula di Gauss (Shoelace)
```javascript
Area = ½ × |Σ(x[i] × y[i+1] - x[i+1] × y[i])|
```

**Validazione**:
- ✓ Somma angoli = (n-2) × 180°
- ✓ Chiusura poligono (distanza finale < 10mm)
- ✓ Lati: 300-2500mm
- ✓ Angoli: 0-180°

### Flusso Utente

1. **Step 1**: Seleziona forma geometrica dalla griglia
2. **Step 2**: Modifica parametri (lati in mm, angoli in gradi)
3. **Preview**: Rendering SVG dinamico con labels
4. **Calcolo**: Area e perimetro automatici
5. **Preventivo**: Prezzo basato su area reale (€/m²)

### Aggiungere Nuove Forme

**1. Aggiungi configurazione** in `lib/frames/frames-config.js`:
```javascript
export const FRAMES_DATABASE = {
  esagono: {
    id: 'esagono',
    nome: 'Esagono',
    descrizione: 'Forma esagonale regolare',
    punti: 6,
    lati: [
      { id: 'lato1', lunghezza: 800, label: 'Lato 1', minimo: 300, massimo: 2500 },
      // ... altri 5 lati
    ],
    angoli: [
      { id: 'ang1', gradi: 120, label: 'Angolo 1', minimo: 0, massimo: 180 },
      // ... altri 5 angoli (somma = 720°)
    ],
    icon: 'M 50 10 L 90 30 L 90 70 L 50 90 L 10 70 L 10 30 Z'
  }
};
```

**2. Fine!** Il sistema è completamente scalabile. La forma apparirà automaticamente nel selettore.

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
