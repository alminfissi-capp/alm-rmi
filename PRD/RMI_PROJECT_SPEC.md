# Progetto R.M.I. - Rilevatore Misure Interattivo

## 📋 Executive Summary

**Cliente:** A.L.M. Infissi (Palermo, Sicilia)  
**Progetto:** Sistema web per rilevazione misure serramenti in cantiere  
**Stack Tecnologico:** Next.js 14+ (App Router) + Supabase + React + TypeScript  
**Obiettivo:** Sostituire il processo manuale Excel con un'applicazione web moderna, responsive e multi-dispositivo

---

## 🎯 Obiettivi del Progetto

### Obiettivo Principale
Creare un'applicazione web professionale che permetta ai tecnici di A.L.M. Infissi di rilevare le misure dei serramenti direttamente in cantiere utilizzando tablet o smartphone, con generazione automatica di PDF professionali.

### Obiettivi Specifici
1. **Gestione dinamica delle pagine** - Aggiungere/rimuovere serramenti da rilevare
2. **Form completo e strutturato** - Tutti i dati necessari per la produzione
3. **Salvataggio automatico** - Nessuna perdita di dati
4. **Generazione PDF** - Output professionale con logo aziendale
5. **Funzionamento offline** - PWA per uso in cantiere senza connessione
6. **Sincronizzazione cloud** - Backup automatico su Supabase

---

## 🏗️ Architettura Tecnica

### Stack
```
Frontend:
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Shadcn/ui (componenti UI)
- React Hook Form + Zod (validazione)
- jsPDF + html2canvas (generazione PDF)

Backend:
- Supabase (PostgreSQL)
- Supabase Auth (autenticazione)
- Supabase Storage (file PDF)
- Supabase Realtime (sincronizzazione)

Deployment:
- Vercel (frontend)
- Supabase Cloud (backend)
```

### Struttura Progetto Next.js
```
/app
  /api
    /rilievi
      route.ts          # CRUD rilievi
    /pdf
      route.ts          # Generazione PDF
  /dashboard
    page.tsx            # Lista rilievi
  /rilievo
    /[id]
      page.tsx          # Form RMI singolo rilievo
    /nuovo
      page.tsx          # Nuovo rilievo
  layout.tsx
  page.tsx              # Homepage/Login

/components
  /ui                   # Shadcn/ui components
  /rmi
    RMIForm.tsx         # Form principale
    PageManager.tsx     # Gestione tab P1, P2, P3...
    HeaderSection.tsx   # Sezione dati cliente
    TipologiaSection.tsx
    ColoriSection.tsx
    FerramentaSection.tsx
    # ... altre sezioni
  /pdf
    PDFGenerator.tsx    # Componente generazione PDF

/lib
  /supabase
    client.ts           # Supabase client
    queries.ts          # Query database
  /schemas
    rilievo.schema.ts   # Zod schemas
  /types
    rilievo.types.ts    # TypeScript types
  /constants
    tipologie.ts        # Dati dropdown (tipologie, serie, ecc.)

/public
  /images
    logo-alm.svg        # Logo A.L.M. Infissi
  /fonts
```

---

## 🗄️ Schema Database Supabase

### Tabella: `rilievi`
```sql
CREATE TABLE rilievi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Dati progetto
  cliente TEXT,
  data DATE,
  indirizzo TEXT,
  celltel TEXT,
  email TEXT,
  note_header TEXT,
  commessa TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Status
  status TEXT DEFAULT 'bozza' CHECK (status IN ('bozza', 'completato', 'inviato'))
);

-- Indici
CREATE INDEX idx_rilievi_user_id ON rilievi(user_id);
CREATE INDEX idx_rilievi_created_at ON rilievi(created_at DESC);
CREATE INDEX idx_rilievi_status ON rilievi(status);
```

### Tabella: `serramenti`
```sql
CREATE TABLE serramenti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rilievo_id UUID REFERENCES rilievi(id) ON DELETE CASCADE,
  
  -- Ordine di visualizzazione (P1, P2, P3...)
  page_number INTEGER NOT NULL,
  
  -- DATI TIPOLOGIA
  n_pezzi INTEGER,
  tipologia TEXT,
  serie TEXT,
  nome TEXT,
  larghezza NUMERIC(10, 2),
  altezza NUMERIC(10, 2),
  descrizione TEXT,
  note TEXT,
  
  -- MISURE SPECIALI ALETTE
  alette_dx NUMERIC(10, 2),
  alette_testa NUMERIC(10, 2),
  alette_sx NUMERIC(10, 2),
  alette_base NUMERIC(10, 2),
  
  -- COLORI
  colore_interno TEXT,
  colore_esterno TEXT,
  colore_accessori TEXT,
  c_interno_anta TEXT,
  c_esterno_anta TEXT,
  
  -- FERRAMENTA
  quantita_anta_ribalta INTEGER,
  tipologia_cerniere TEXT,
  serrature TEXT,
  cilindro TEXT,
  
  -- OPZIONI
  linea_estetica_telai TEXT,
  tipo_anta TEXT,
  linea_estetica_ante TEXT,
  riporto_centrale TEXT,
  
  -- APERTURA
  lato_apertura TEXT,
  altezza_maniglia NUMERIC(10, 2),
  tipologia_maniglia TEXT,
  
  -- ALETTE & APERTURE
  alette_aperture TEXT,
  
  -- TRAVERSO/MONTANTE
  tipo_profilo TEXT,
  riferimento_misure TEXT,
  misura_traverso NUMERIC(10, 2),
  
  -- ZANZARIERE
  zanzariere_tipologia TEXT DEFAULT 'RULLO CASSONETTO 42',
  zanzariere_colore TEXT,
  zanzariere_chiusura TEXT,
  zanzariere_x NUMERIC(10, 2),
  zanzariere_h NUMERIC(10, 2),
  
  -- RIEMPIMENTI
  vetri TEXT,
  pannelli TEXT,
  
  -- ZOCCOLO & FASCIA
  zoccolo TEXT,
  fascia_h NUMERIC(10, 2),
  fascia_tipo TEXT,
  
  -- OSCURANTI
  oscuranti_tipo TEXT,
  oscuranti_l NUMERIC(10, 2),
  oscuranti_h NUMERIC(10, 2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici
CREATE INDEX idx_serramenti_rilievo_id ON serramenti(rilievo_id);
CREATE INDEX idx_serramenti_page_number ON serramenti(page_number);
```

### Tabella: `pdf_generated`
```sql
CREATE TABLE pdf_generated (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rilievo_id UUID REFERENCES rilievi(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Abilita RLS
ALTER TABLE rilievi ENABLE ROW LEVEL SECURITY;
ALTER TABLE serramenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_generated ENABLE ROW LEVEL SECURITY;

-- Policy per rilievi
CREATE POLICY "Users can view own rilievi"
  ON rilievi FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rilievi"
  ON rilievi FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rilievi"
  ON rilievi FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rilievi"
  ON rilievi FOR DELETE
  USING (auth.uid() = user_id);

-- Policy per serramenti (attraverso rilievi)
CREATE POLICY "Users can view own serramenti"
  ON serramenti FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rilievi
      WHERE rilievi.id = serramenti.rilievo_id
      AND rilievi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own serramenti"
  ON serramenti FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rilievi
      WHERE rilievi.id = serramenti.rilievo_id
      AND rilievi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own serramenti"
  ON serramenti FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM rilievi
      WHERE rilievi.id = serramenti.rilievo_id
      AND rilievi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own serramenti"
  ON serramenti FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM rilievi
      WHERE rilievi.id = serramenti.rilievo_id
      AND rilievi.user_id = auth.uid()
    )
  );
```

---

## 🎨 Design System

### Brand Colors
```typescript
const colors = {
  primary: '#0288d1',      // Blu A.L.M.
  secondary: '#7cb342',    // Verde A.L.M.
  danger: '#f44336',       // Rosso per elimina
  border: '#0288d1',       // Bordi blu
  background: '#f0f0f0',   // Sfondo grigio chiaro
  white: '#ffffff',
  black: '#000000',
  textGray: '#666666',
}
```

### Typography
```css
Font Family: Arial, sans-serif
Font Sizes:
- Header Principale: 20px
- Sezione Titoli: 10px (uppercase, bold)
- Label Campi: 9px (bold)
- Input Campi: 10-11px
- Logo: 32px (bold)
```

### Logo A.L.M. INFISSI
```
Layout: Parallelogramma inclinato
Colori: Blu (#0288d1) 60% + Verde (#7cb342) 40%
Testo: "A.L.M." (32px, bold, bianco)
Sottotitolo: "INFISSI" (12px, uppercase, spaziato)
```

---

## 📱 Specifiche UI/UX

### Layout Principale

**Header (fisso in alto)**
```
┌─────────────────────────────────────────────────┐
│ [Logo A.L.M.]  R.M.I. - Rilevatore Misure      │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Tab Manager**
```
┌─────────────────────────────────────────────────┐
│ [+] [P1 - Serramento 1 ×] [P2 - Serramento 2 ×] │
└─────────────────────────────────────────────────┘
```

**Form Layout (Grid 3 colonne)**
```
┌──────────────────────────────────────────────────────────┐
│  CLIENTE  [____________]         DATA  [__________]       │
│  INDIRIZZO  [_____________________________________]       │
│  CELL./TEL  [____________]  EMAIL  [______________]       │
│  NOTE  [____________]  COMMESSA  [______________]         │
└──────────────────────────────────────────────────────────┘

┌─────────────┬──────────────────────┬─────────────────┐
│             │                      │                 │
│  DATI       │   TIPOLOGIA TELAIO   │  MISURE SPEC.   │
│  TIPOLOGIA  │   E ALETTE           │  ALETTE         │
│             │                      │                 │
│  [Campi]    │   [Visualizzazione]  │  [Campi]        │
│             │   [Grafica]          │                 │
│             │                      │                 │
│  COLORI     │                      │  FERRAMENTA     │
│  [Campi]    │                      │  [Campi]        │
│             │                      │                 │
│  OPZIONI    │                      │  ZANZARIERE     │
│  [Campi]    │                      │  [Campi]        │
│             │                      │                 │
└─────────────┴──────────────────────┴─────────────────┘
```

### Componenti Specifici

#### 1. Tab Manager (PageManager)
```typescript
Funzionalità:
- Pulsante "+" verde per aggiungere pagina
- Tab P1, P2, P3... dinamici
- Tab attivo evidenziato in blu
- Pulsante "×" rosso per eliminare (se più di 1 pagina)
- Conferma prima di eliminare
- Auto-switch alla pagina appena creata

Comportamento:
- Click "+": crea nuova pagina (P2, P3, ecc.)
- Click tab: switch alla pagina
- Click "×": conferma ed elimina (minimo 1 pagina)
```

#### 2. Header Section
```typescript
Layout: Grid con logo laterale + campi
Campi:
- Cliente (text)
- Data (date)
- Indirizzo (text, span 4 colonne)
- Cell./Tel (text)
- Email (email)
- Note (text)
- Commessa (text)

Stile: Bordi blu 3px, celle con bordi 2px
```

#### 3. Dati Tipologia Section
```typescript
Campi:
- N° Pezzi (number)
- Tipologia (select - 44 opzioni)
- Serie (select - 18 opzioni)
- Nome (text)
- Larghezza (number + "mm")
- Altezza (number + "mm")
- Descrizione (textarea)
- Note (textarea)

Layout: Colonna sinistra, bordo blu 3px
```

#### 4. Tipologia Telaio Center
```typescript
Funzionalità:
- Visualizzazione grafica della tipologia selezionata
- Placeholder quando nessuna tipologia selezionata
- Immagine/SVG dinamico basato su dropdown

Layout: Colonna centrale, min-height 400px
```

#### 5. Form Fields Pattern
```typescript
Struttura:
<div className="field-row">
  <label className="field-label">{label}</label>
  <input className="field-input" />
  {unit && <span className="unit-label">{unit}</span>}
</div>

Stile:
- Label: 9px, bold, min-width 80px
- Input: border 1px solid black, padding 3-5px
- Unit: 9px, grigio
```

---

## 🔧 Implementazione Step-by-Step

### Fase 1: Setup Iniziale
```bash
# 1. Inizializzare Supabase
- Creare progetto su supabase.com
- Eseguire migration SQL (schema database)
- Configurare RLS policies
- Ottenere SUPABASE_URL e SUPABASE_ANON_KEY

# 2. Configurare Next.js
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs
npm install zod react-hook-form @hookform/resolvers
npm install jspdf html2canvas
npm install -D tailwindcss postcss autoprefixer
npx shadcn-ui@latest init

# 3. File .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Fase 2: Autenticazione
```typescript
// /lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

// /app/login/page.tsx
- Implementare login/signup con Supabase Auth
- Redirect a /dashboard dopo login
```

### Fase 3: Dashboard
```typescript
// /app/dashboard/page.tsx
Funzionalità:
- Lista di tutti i rilievi (tabella)
- Colonne: Cliente, Data, Commessa, N° Serramenti, Status
- Bottoni: "Nuovo Rilievo", "Modifica", "Elimina", "Genera PDF"
- Filtri: Per data, cliente, status
- Search bar
```

### Fase 4: Form RMI
```typescript
// /app/rilievo/[id]/page.tsx
1. Fetch rilievo e serramenti da Supabase
2. Render PageManager con tab dinamici
3. Render form per pagina corrente
4. Auto-save ogni 3 secondi (debounce)
5. Salva su Supabase in tempo reale
```

### Fase 5: Gestione Pagine
```typescript
// /components/rmi/PageManager.tsx
State:
- pages: string[] (es. ['P1', 'P2', 'P3'])
- currentPage: string
- pagesData: Record<string, SerramentoData>

Funzioni:
- addPage(): aggiungi nuovo serramento
- removePage(page): elimina serramento (con conferma)
- setCurrentPage(page): switch pagina
```

### Fase 6: Form Sections
```typescript
Implementare componenti per ogni sezione:
- HeaderSection.tsx (dati cliente/commessa)
- DatiTipologiaSection.tsx
- MisureAletteSection.tsx
- ColoriSection.tsx
- FerramentaSection.tsx
- OpzioniSection.tsx
- AperturaSection.tsx
- TraversoMontanteSection.tsx
- ZanzariereSection.tsx
- RiempientiSection.tsx
- ZoccoloFasciaSection.tsx
- OscurantiSection.tsx

Ogni sezione:
- Accept formData e updateField come props
- Usare pattern FieldRow consistente
- Gestire validazione con Zod
```

### Fase 7: Generazione PDF
```typescript
// /components/pdf/PDFGenerator.tsx
1. Render form in modalità "stampa"
2. html2canvas per catturare ogni pagina
3. jsPDF per comporre il documento
4. Una pagina PDF per ogni serramento
5. Logo A.L.M. in header
6. Footer con data/ora generazione
7. Salva su Supabase Storage
8. Download automatico per l'utente
```

### Fase 8: PWA & Offline
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

// Implementare:
- Service Worker per cache
- IndexedDB per salvataggio offline
- Sync quando torna online
- Indicatore stato connessione
```

---

## 📊 Dati Costanti (Dropdown)

### Tipologie Serramenti (44 opzioni)
```typescript
export const TIPOLOGIE = [
  ".",
  "FINESTRA 1A",
  "FINESTRA 2A",
  "FINESTRA 3A",
  "FINESTRA 4A",
  "FINESTRA 1A + FIX DX",
  "FINESTRA 2A + FIX DX",
  "FINESTRA 3A + FIX DX",
  "FINESTRA 4A + FIX DX",
  "FINESTRA 1A + FIX SX",
  "FINESTRA 2A + FIX SX",
  "FINESTRA 3A + FIX SX",
  "FINESTRA 4A + FIX SX",
  "FINESTRA 1A + FIX UP",
  "FINESTRA 2A + FIX UP",
  "FINESTRA 3A + FIX UP",
  "FINESTRA 4A + FIX UP",
  "PORTA-FINESTRA 1A",
  "PORTA-FINESTRA 2A",
  "PORTA-FINESTRA 3A",
  "PORTA-FINESTRA 4A",
  "PORTA-FINESTRA 1A + FIX DX",
  "PORTA-FINESTRA 2A + FIX DX",
  "PORTA-FINESTRA 3A + FIX DX",
  "PORTA-FINESTRA 1A + FIX SX",
  "PORTA-FINESTRA 2A + FIX SX",
  "PORTA-FINESTRA 1A + FIX UP",
  "PORTA-FINESTRA 2A + FIX UP",
  // ... (vedere file Excel per lista completa)
] as const;
```

### Serie (18 opzioni)
```typescript
export const SERIE = [
  "ES 40",
  "Eco-Slim50TT",
  "Eco-Slim60TT",
  "Eco-Slim72TT",
  "Panoramico",
  "Planet 45",
  "Planet 50 Plus",
  "Planet 62 Hi",
  "Planet 62 Plus",
  "Planet 72 Hi",
  "Planet 72 Plus",
  "Slide 106 Plus",
  "Slide 60",
  "Slide 65",
  "Slide 80",
  "Smart 30",
  "TR 590 TH",
  "Top Slide 160"
] as const;
```

### Finiture Accessori
```typescript
export const FINITURE = [
  "INOX",
  "NERO OPACO",
  "RAL 1013",
  "ORO",
  "RAL 9010"
] as const;
```

### Alette
```typescript
export const ALETTE = [
  "Z",
  "L",
  "SORMONTO",
  "T",
  "COMPLANARE"
] as const;
```

### Posizioni
```typescript
export const POSIZIONI = [
  "POSIZIONE 1",
  "POSIZIONE 2",
  "POSIZIONE 3",
  "POSIZIONE 4"
] as const;
```

---

## 🔐 Autenticazione & Sicurezza

### Autenticazione
```typescript
// Metodi supportati:
- Email/Password (principale)
- Magic Link (opzionale)
- OAuth Google (opzionale)

// Ruoli utente:
- Tecnico: può creare/modificare/eliminare propri rilievi
- Admin: può vedere tutti i rilievi dell'azienda (futuro)
```

### Sicurezza
```typescript
- RLS abilitato su tutte le tabelle
- Ogni utente vede solo i propri dati
- Validazione input lato client (Zod) e server
- Rate limiting su API routes
- HTTPS obbligatorio in produzione
```

---

## 📱 Responsive Design

### Breakpoints
```css
Mobile: < 768px
  - Layout singola colonna
  - Tab stack verticalmente
  - Form fields full-width

Tablet: 768px - 1400px
  - Layout 2 colonne (sinistra + centro)
  - Colonna destra va sotto

Desktop: > 1400px
  - Layout completo 3 colonne
  - Massima larghezza 1600px
```

### Mobile Considerations
```typescript
- Touch-friendly: pulsanti min 44x44px
- Input type="number" con tastiera numerica
- Input type="date" con date picker nativo
- Select con scroll nativo mobile
- Salvataggio automatico più frequente
```

---

## ✅ Checklist Implementazione

### Milestone 1: Setup & Auth ✓
- [ ] Creare progetto Supabase
- [ ] Eseguire migration SQL
- [ ] Configurare Next.js
- [ ] Implementare login/signup
- [ ] Testare autenticazione

### Milestone 2: Database & CRUD ✓
- [ ] Implementare query Supabase
- [ ] API routes per rilievi
- [ ] API routes per serramenti
- [ ] Testare CRUD operations

### Milestone 3: UI Base ✓
- [ ] Implementare layout principale
- [ ] Header con logo A.L.M.
- [ ] Dashboard lista rilievi
- [ ] Routing tra pagine

### Milestone 4: Form RMI ✓
- [ ] PageManager con tab dinamici
- [ ] HeaderSection (dati cliente)
- [ ] DatiTipologiaSection
- [ ] Tutte le altre sezioni form
- [ ] Auto-save funzionante

### Milestone 5: Validazione & UX ✓
- [ ] Schema Zod completo
- [ ] Validazione real-time
- [ ] Messaggi errore user-friendly
- [ ] Loading states
- [ ] Success/error toasts

### Milestone 6: PDF Generation ✓
- [ ] Componente PDFGenerator
- [ ] Template PDF con logo
- [ ] Multi-page support
- [ ] Upload su Supabase Storage
- [ ] Download automatico

### Milestone 7: PWA & Offline ✓
- [ ] Configurare service worker
- [ ] Cache assets statici
- [ ] IndexedDB per dati offline
- [ ] Sincronizzazione online/offline
- [ ] Indicatore connessione

### Milestone 8: Testing & Deploy ✓
- [ ] Unit tests componenti chiave
- [ ] Integration tests API
- [ ] E2E tests form completo
- [ ] Test su dispositivi reali
- [ ] Deploy su Vercel
- [ ] Monitoraggio errori (Sentry)

---

## 🚀 Comandi Utili

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Type check
npm run type-check

# Database migrations
npx supabase migration new migration_name
npx supabase db push

# Generate TypeScript types from Supabase
npx supabase gen types typescript --local > lib/types/database.types.ts
```

---

## 📚 Risorse & Documentazione

### Link Utili
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Schema Validation](https://zod.dev)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)

### File di Riferimento
- `RMI_2_0.xlsx` - Excel originale con struttura dati
- `screenshot.pdf` - Layout di riferimento
- Design mockups (se disponibili)

---

## 🎯 Priorità Sviluppo

### P0 (Essenziale - MVP)
1. Auth + Dashboard base
2. Form RMI con tutte le sezioni
3. Gestione pagine dinamiche (P1, P2, P3...)
4. Salvataggio su Supabase
5. Generazione PDF base

### P1 (Importante)
6. Validazione completa form
7. Auto-save ottimizzato
8. PDF professionale con styling
9. Responsive design completo
10. Loading states & error handling

### P2 (Nice to have)
11. PWA & funzionalità offline
12. Immagini tipologie serramenti
13. Export Excel oltre a PDF
14. Analytics & monitoraggio
15. Multi-language (IT/EN)

---

## 🐛 Known Issues & Considerations

### Considerazioni Tecniche
1. **Immagini Tipologie:** Decidere se usare SVG dinamici o immagini pre-generate
2. **Offline Sync:** Strategia di conflict resolution se modifiche offline/online
3. **PDF Size:** Ottimizzare dimensione PDF per condivisione mobile
4. **File Storage:** Quota Supabase Storage per piano gratuito (1GB)

### Limitazioni Attuali
1. Un utente alla volta può modificare un rilievo (no real-time collaboration)
2. PDF generato lato client (performance su mobile)
3. Nessun versionamento storico rilievi (solo ultima versione)

---

## 📞 Contatti & Support

**Sviluppatore:** [Nome]  
**Cliente:** A.L.M. Infissi  
**Repo:** [GitHub URL]  
**Staging:** [Vercel URL]  
**Production:** [Domain URL]

---

**Ultimo aggiornamento:** {DATA}  
**Versione documento:** 1.0  
**Status progetto:** In sviluppo
