# 🚀 RMI - Sessione Refactoring UI Tablet-First

**Data:** 18 Dicembre 2025
**Sviluppatore:** Giorgio + Claude Code
**Obiettivo:** Implementare layout tablet-first ottimizzato per uso in cantiere con pennino

---

## 📋 STATO ATTUALE PROGETTO

### ✅ Completato in questa sessione:

1. **Sistema breakpoint custom tablet-first**
   - Hook TypeScript per rilevamento device type
   - Custom CSS variants per Tailwind
   - Breakpoint: mobile (<768px), tablet (768-1023px), desktop (>1024px)

2. **Componenti UI ottimizzati per pennino**
   - MeasureInput con bottoni +/- grandi
   - PresetButtons per selezione rapida misure comuni
   - Touch-optimized e leggibili

3. **FrameEditor tablet-first**
   - Layout responsive: 1 colonna mobile, 2 colonne tablet, 3 colonne desktop
   - Statistiche sempre visibili
   - Validazione real-time migliorata

4. **Pagina demo configuratore tablet**
   - Route: `/configuratore-tablet`
   - Split-screen con preview laterale
   - Indicatore device type in header

5. **Build verificata**
   - Zero errori TypeScript
   - Compilazione Next.js OK

---

## 📁 FILE CREATI/MODIFICATI

### 📄 File nuovi creati:

```
hooks/use-device-type.ts                    # Hook responsive tablet-first
components/ui/measure-input.tsx             # Input ottimizzato pennino
components/ui/preset-buttons.tsx            # Preset misure comuni
components/frames/FrameEditorTablet.tsx     # Editor tablet-optimized
app/configuratore-tablet/page.tsx           # Demo page
```

### ✏️ File modificati:

```
app/globals.css                             # +custom breakpoint variants (righe 6-20)
components/frames/index.js                  # +export FrameEditorTablet
```

---

## 🎯 COME TESTARE

### 1. Avvia server (se non già attivo):

```bash
npm run dev
```

Server: `http://localhost:3000`

### 2. Apri demo tablet-first:

```
http://localhost:3000/configuratore-tablet
```

### 3. Testa breakpoint in Chrome DevTools:

**Attiva Device Toolbar:** `F12` → `Ctrl+Shift+M`

**Dispositivi da testare:**
- **Mobile**: iPhone 13 (390x844) → Layout 1 colonna
- **Tablet**: iPad Air (820x1180) → Layout 2 colonne ✅ TARGET PRIMARIO
- **Desktop**: Responsive (>1024px) → Layout 3 colonne

### 4. Funzionalità da verificare:

- ✅ Indicatore device type in header (icona mobile/tablet/desktop)
- ✅ Selezione frame geometrico (rettangolo, triangolo, rombo, zoppa)
- ✅ Bottoni +/- per incrementi rapidi
- ✅ Preset misure comuni (60cm, 80cm, 100cm, 120cm, 140cm, 160cm)
- ✅ Validazione real-time (bordo rosso se fuori range)
- ✅ Statistiche aggiornate automaticamente (area, perimetro, lati)
- ✅ Preview geometrica laterale (su tablet/desktop)
- ✅ Layout responsive cambia automaticamente

---

## 🔧 RIFERIMENTI RAPIDI CODICE

### Hook responsive:

```tsx
import { useResponsive } from '@/hooks/use-device-type';

export default function MyComponent() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Layout condizionale
  const columns = isMobile ? 1 : isTablet ? 2 : 4;

  return (
    <div className={`grid grid-cols-${columns}`}>
      {/* ... */}
    </div>
  );
}
```

### Classi CSS custom:

```tsx
<div className="
  grid-cols-1           /* Base mobile */
  tablet:grid-cols-2    /* Tablet 768-1023px */
  desktop:grid-cols-4   /* Desktop 1024px+ */
">
```

### MeasureInput:

```tsx
import { MeasureInput } from '@/components/ui/measure-input';

<MeasureInput
  value={1200}
  onChange={(v) => setLato(v)}
  min={300}
  max={2500}
  step={10}
  unit="mm"
  label="Lato Base"
  size="large"  // Grande su tablet
/>
```

### PresetButtons:

```tsx
import { PresetButtons, PRESET_LATI_COMUNI } from '@/components/ui/preset-buttons';

<PresetButtons
  presets={PRESET_LATI_COMUNI}  // [600, 800, 1000, 1200, 1400, 1600]
  currentValue={lato}
  onSelect={(v) => setLato(v)}
  layout="grid"
/>
```

---

## 🎯 PROSSIMI PASSI CONSIGLIATI

### FASE 2: Integrazione nel configuratore principale

**Priorità: ALTA**

1. **Sostituire FrameEditor con FrameEditorTablet**
   - File: `/app/configuratore/configuratore-alm.jsx`
   - Riga 7: Import FrameEditorTablet invece di FrameEditor
   - Testare workflow completo multi-step

2. **Adattare layout multi-step per tablet**
   - Split-screen persistente: Preview SX | Steps DX
   - Stepper orizzontale in alto (attualmente verticale)
   - Preview DXF profilo sempre visibile

3. **Ottimizzare altri step per tablet**
   - Step 3 (Materiali): Grid colori più grande
   - Step 4 (Prestazioni): Toggle switch grandi
   - Step 5 (Accessori): Checkbox touch-friendly

### FASE 3: Persistenza e Database

**Priorità: ALTA**

1. **Estendere schema Prisma**
   ```prisma
   model Serramento {
     // ... campi esistenti
     frame_id        String?  // 'rettangolo', 'triangolo', etc
     frame_data      Json?    // {lati, angoli, points, area}
     serie_profilo   String?  // 'basic', 'comfort', 'premium'
     prestazioni_extra Json?
     immagini        Json?    // Array URL foto profili
   }
   ```

2. **Implementare API salvaggio**
   - Endpoint: `POST /api/configuratore/save`
   - Auto-save ogni 3 secondi (debounce)
   - Persistenza localStorage come fallback offline

3. **Collegare Configuratore → Serramento → Rilievo**
   - Creare rilievo se non esiste
   - Associare serramento a rilievo
   - Sync stato configuratore

### FASE 4: Upload Immagini Profili

**Priorità: MEDIA**

1. **Estendere Supabase Storage**
   - Nuovo bucket: `rmi-images` (pubblico per preview)
   - Path: `profili/{rilievo_id}/{serramento_id}/{filename}`
   - Mime types: `image/jpeg`, `image/png`

2. **Componente ImageUpload**
   ```tsx
   <ImageUpload
     onCapture={(file) => uploadToSupabase(file)}
     maxFiles={10}
     touchOptimized={true}
   />
   ```

3. **Integrazione camera tablet**
   - Accesso camera nativa
   - Preview prima upload
   - Compressione immagini

### FASE 5: Ottimizzazioni avanzate tablet

**Priorità: BASSA**

1. **Gesture support**
   - Pinch-to-zoom sulla preview geometrica
   - Swipe per navigare step
   - Long-press per info dettagliate

2. **Voice input per misure**
   - Web Speech API
   - Comando vocale: "lato base 120 centimetri"
   - Feedback visivo durante dettatura

3. **Preset configurazioni salvate**
   - Salva configurazioni frequenti
   - Quick-load preset personali
   - Condivisione preset tra utenti team

---

## 🐛 ISSUE CONOSCIUTI

Nessun issue critico al momento.

**Note:**
- Il configuratore attuale NON salva su database (placeholder)
- Bottone "Salva" e "Scarica PDF" sono ancora mock
- Upload immagini non implementato

---

## 📚 DOCUMENTAZIONE TECNICA

### Architettura breakpoint:

```
BREAKPOINTS:
├── mobile:  0-767px    (uso secondario)
├── tablet:  768-1023px (TARGET PRIMARIO - cantiere)
└── desktop: 1024px+    (ufficio, elaborazione)

DESIGN BASE: Tablet
ADATTAMENTI: Mobile (semplifica), Desktop (espande)
```

### Stack tecnologico:

- **Framework**: Next.js 16.0.10 (Turbopack)
- **React**: 19+
- **Styling**: Tailwind CSS v4 + Custom variants
- **UI Library**: shadcn/ui (theme: new-york)
- **Database**: Prisma + PostgreSQL (Supabase)
- **Storage**: Supabase Storage
- **Theme**: Cyberpunk (cyber-cyan, glassmorphism)

### Breakpoint Tailwind standard (ancora usati):

```
sm:  640px
md:  768px   (coincide con tablet.min)
lg:  1024px  (coincide con desktop.min)
xl:  1280px
2xl: 1536px
```

### Custom variants aggiunti:

```css
@custom-variant mobile (@media (max-width: 767px));
@custom-variant tablet (@media (min-width: 768px) and (max-width: 1023px));
@custom-variant desktop (@media (min-width: 1024px));
```

---

## 🔍 DEBUG & TROUBLESHOOTING

### Server non parte:

```bash
# Termina processi Next.js esistenti
pkill -f "next dev"

# Rimuovi lock
rm -rf .next/dev/lock

# Riavvia
npm run dev
```

### Errori TypeScript:

```bash
# Type check manuale
npx tsc --noEmit --skipLibCheck

# Build completa
npm run build
```

### Hot reload non funziona:

```bash
# Riavvia Turbopack
rm -rf .next
npm run dev
```

### Breakpoint custom non applicati:

1. Verifica import in `globals.css` (riga 1-20)
2. Controlla sintassi: `tablet:grid-cols-2` (non `tablet-grid-cols-2`)
3. Purge cache browser (Ctrl+Shift+R)

---

## 📞 CONTATTI & RISORSE

**Team:**
- Giorgio (Developer)
- Collega (Developer)
- Claude Code (AI Assistant)

**Repository:**
- Path: `/home/dimagio/Applications/ALM-projects/ALM-RMI/alm-rmi-main`
- Branch: `main` (no remote branch configurato)

**Commit recenti:**
```
1d658fd feat: implementa sistema frames geometrici nel configuratore
b0184da feat: integra visualizzazione profili tecnici DXF nel configuratore
7306d10 feat: implementa tema cyberpunk e configuratore infissi
```

**Risorse utili:**
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

---

## 🎓 LEZIONI APPRESE

### Design tablet-first funziona quando:

1. **Target primario chiaro**: Operatori in cantiere con tablet + pennino
2. **Breakpoint specifici**: Non solo mobile vs desktop
3. **Controlli ottimizzati**: Bottoni grandi, preset, validazione chiara
4. **Layout adattivo**: Non responsive "standard" ma pensato per use-case

### Best practices:

- ✅ Hook TypeScript per device detection (non solo media queries CSS)
- ✅ Componenti riutilizzabili (MeasureInput, PresetButtons)
- ✅ Custom variants Tailwind per controllo preciso
- ✅ Props size condizionale (`size={isTablet ? 'large' : 'default'}`)
- ✅ Statistiche sempre visibili su target primario (tablet)

### Anti-patterns evitati:

- ❌ Non usare solo `md:` generico (troppo grossolano)
- ❌ Non assumere "mobile-first" = sempre meglio
- ❌ Non replicare pattern consumer per app B2B
- ❌ Non ignorare input method (touch vs pennino vs mouse)

---

## ✅ CHECKLIST RIPRESA LAVORO

Prima di riprendere, verifica:

- [ ] Server dev avviato (`npm run dev`)
- [ ] Demo visibile su `http://localhost:3000/configuratore-tablet`
- [ ] DevTools aperto con emulazione iPad Air (820x1180)
- [ ] Layout split-screen funzionante
- [ ] Bottoni +/- cliccabili e responsivi
- [ ] Preset misure selezionabili
- [ ] Validazione real-time attiva
- [ ] Nessun errore console browser

Se tutto OK → **Pronto per FASE 2: Integrazione nel configuratore principale**

---

## 🚀 QUICK START PROSSIMA SESSIONE

```bash
# 1. Naviga alla directory
cd /home/dimagio/Applications/ALM-projects/ALM-RMI/alm-rmi-main

# 2. Avvia server
npm run dev

# 3. Apri browser
# http://localhost:3000/configuratore-tablet

# 4. Test breakpoint
# Chrome DevTools → Device Toolbar → iPad Air

# 5. Verifica funzionalità base
# - Selezione frame
# - Modifica misure con +/-
# - Usa preset
# - Osserva validazione

# 6. Se tutto OK → Inizia FASE 2
# - Apri file: app/configuratore/configuratore-alm.jsx
# - Sostituisci FrameEditor con FrameEditorTablet
# - Testa workflow completo
```

---

## 📊 METRICHE SESSIONE

**Durata:** ~2 ore
**File creati:** 5
**File modificati:** 2
**Righe codice:** ~1200
**Componenti nuovi:** 3 (MeasureInput, PresetButtons, FrameEditorTablet)
**Hook nuovi:** 1 (use-device-type.ts)
**Build errors:** 0 ✅

---

## 💾 BACKUP & VERSION CONTROL

**Stato git attuale:**
```
Branch: main
Status: Clean (uncommitted changes)
```

**Consiglio:** Committa le modifiche prima della prossima sessione

```bash
git add .
git commit -m "feat: implementa UI tablet-first per configuratore

- Aggiunge sistema breakpoint custom (mobile/tablet/desktop)
- Crea componenti MeasureInput e PresetButtons ottimizzati pennino
- Implementa FrameEditorTablet con layout responsive
- Aggiunge demo page /configuratore-tablet
- Zero errori TypeScript, build verificata

Target: operatori in cantiere con tablet + pennino"
```

---

**Fine sessione - Buon lavoro! 🎯**

*Documento generato il: 18/12/2025*
*Prossimo step: FASE 2 - Integrazione nel configuratore principale*
