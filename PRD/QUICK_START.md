# RMI - Quick Start Guide per Claude Code

## 🚀 Setup Iniziale

### 1. Prerequisiti
```bash
# Assicurati di avere:
- Node.js 18+ installato
- Un account Supabase (gratuito)
- Git configurato
```

### 2. Setup Supabase

#### A. Crea nuovo progetto su Supabase
1. Vai su [supabase.com](https://supabase.com)
2. Crea un nuovo progetto
3. Salva:
   - `Project URL` (es: https://xyz.supabase.co)
   - `Anon/Public Key` (dalla sezione API settings)

#### B. Esegui migrations
1. Copia il contenuto di `supabase_migrations.sql`
2. Vai su Supabase Dashboard > SQL Editor
3. Incolla e esegui lo script
4. Verifica che le tabelle siano create (Table Editor)

#### C. Configura Storage (opzionale per PDF)
```sql
-- Esegui in SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('rilievi-pdf', 'rilievi-pdf', false);
```

### 3. Setup Next.js

```bash
# Nella root del progetto Next.js esistente

# Installa dipendenze
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zod react-hook-form @hookform/resolvers
npm install jspdf html2canvas
npm install date-fns
npm install lucide-react class-variance-authority clsx tailwind-merge

# Installa Shadcn/ui (se non già fatto)
npx shadcn-ui@latest init

# Aggiungi componenti necessari
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dialog
```

### 4. Configurazione Environment

Crea `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Struttura File da Creare

```
/app
  /api
    /rilievi
      route.ts              # ⭐ PRIORITÀ 1
    /serramenti
      route.ts              # ⭐ PRIORITÀ 1
  /dashboard
    page.tsx                # ⭐ PRIORITÀ 2
  /rilievo
    /[id]
      page.tsx              # ⭐ PRIORITÀ 3
    /nuovo
      page.tsx              # ⭐ PRIORITÀ 3

/components
  /ui                       # Shadcn components (auto-generati)
  /rmi
    RMIForm.tsx            # ⭐ PRIORITÀ 3
    PageManager.tsx        # ⭐ PRIORITÀ 3
    HeaderSection.tsx      # ⭐ PRIORITÀ 4
    DatiTipologiaSection.tsx
    # ... altre sezioni

/lib
  /supabase
    client.ts              # ⭐ PRIORITÀ 1
    queries.ts             # ⭐ PRIORITÀ 2
  /types
    database.types.ts      # Copia da rmi-types.ts
  /schemas
    rilievo.schema.ts      # ⭐ PRIORITÀ 2
  /constants
    index.ts               # Copia costanti da rmi-types.ts
```

## 📝 Ordine di Implementazione

### FASE 1: Foundation (30 min)
1. ✅ Copia `rmi-types.ts` in `/lib/types/database.types.ts`
2. ✅ Crea `/lib/supabase/client.ts`
3. ✅ Crea `/lib/constants/index.ts` (copia costanti da types)
4. ✅ Test connessione Supabase

### FASE 2: API Routes (1 ora)
1. ✅ `/app/api/rilievi/route.ts`
   - GET: lista rilievi utente
   - POST: crea nuovo rilievo
2. ✅ `/app/api/rilievi/[id]/route.ts`
   - GET: dettaglio rilievo
   - PATCH: aggiorna rilievo
   - DELETE: elimina rilievo
3. ✅ `/app/api/serramenti/route.ts`
   - POST: crea serramento
   - PATCH: aggiorna serramento
   - DELETE: elimina serramento

### FASE 3: Autenticazione (30 min)
1. ✅ Setup Supabase Auth
2. ✅ `/app/login/page.tsx` - Form login/signup
3. ✅ Middleware per protezione routes

### FASE 4: Dashboard (1 ora)
1. ✅ `/app/dashboard/page.tsx`
   - Tabella rilievi
   - Bottone "Nuovo Rilievo"
   - Azioni: Modifica, Elimina, PDF
2. ✅ `/lib/supabase/queries.ts` - Query helper functions

### FASE 5: Form RMI Core (2-3 ore)
1. ✅ `/app/rilievo/nuovo/page.tsx` - Crea nuovo rilievo
2. ✅ `/app/rilievo/[id]/page.tsx` - Modifica rilievo
3. ✅ `/components/rmi/PageManager.tsx` - Tab P1, P2, P3...
4. ✅ `/components/rmi/RMIForm.tsx` - Container principale
5. ✅ `/components/rmi/HeaderSection.tsx` - Sezione cliente/data

### FASE 6: Form Sections (3-4 ore)
Implementare tutti i componenti sezione:
1. ✅ DatiTipologiaSection.tsx
2. ✅ MisureAletteSection.tsx
3. ✅ ColoriSection.tsx
4. ✅ FerramentaSection.tsx
5. ✅ OpzioniSection.tsx
6. ✅ AperturaSection.tsx
7. ✅ TraversoMontanteSection.tsx
8. ✅ ZanzariereSection.tsx
9. ✅ RiempientiSection.tsx
10. ✅ ZoccoloFasciaSection.tsx
11. ✅ OscurantiSection.tsx

### FASE 7: Validazione & Auto-save (1 ora)
1. ✅ `/lib/schemas/rilievo.schema.ts` - Zod schemas
2. ✅ Implementare auto-save (debounce 3s)
3. ✅ Toast notifications per success/error

### FASE 8: PDF Generation (2 ore)
1. ✅ `/components/pdf/PDFGenerator.tsx`
2. ✅ `/app/api/pdf/route.ts`
3. ✅ Template PDF con logo A.L.M.
4. ✅ Upload su Supabase Storage

### FASE 9: Polish & Testing (2-3 ore)
1. ✅ Responsive design (mobile/tablet)
2. ✅ Loading states
3. ✅ Error handling
4. ✅ Test su dispositivi reali

## 🎨 Styling Guidelines

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'alm-blue': '#0288d1',
        'alm-green': '#7cb342',
      }
    }
  }
}
```

### CSS Custom per Layout Excel
Usa le classi da `rmi-app.html` esistente per:
- `.header-section` - Grid header con logo
- `.excel-layout` - Grid 3 colonne
- `.section-box` - Box con bordo blu
- `.field-row` - Row campo form
- `.field-label` - Label 9px bold
- `.field-input` - Input con bordo nero

## 🔍 Debug & Testing

### Test Connessione Supabase
```typescript
// app/test/page.tsx
import { supabase } from '@/lib/supabase/client'

export default async function TestPage() {
  const { data, error } = await supabase
    .from('rilievi')
    .select('*')
    .limit(1)
  
  return <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
}
```

### Verifica Auth
```typescript
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)
```

### Test RLS Policies
```sql
-- Esegui in SQL Editor come test
SELECT * FROM rilievi; -- Dovrebbe vedere solo propri dati
```

## 📚 Riferimenti Rapidi

### Supabase Client Usage
```typescript
// Select
const { data, error } = await supabase
  .from('rilievi')
  .select('*, serramenti(*)')
  .eq('id', rilievoId)
  .single()

// Insert
const { data, error } = await supabase
  .from('rilievi')
  .insert({ cliente: 'Test', user_id: userId })
  .select()
  .single()

// Update
const { error } = await supabase
  .from('rilievi')
  .update({ cliente: 'Nuovo Nome' })
  .eq('id', rilievoId)

// Delete
const { error } = await supabase
  .from('rilievi')
  .delete()
  .eq('id', rilievoId)
```

### React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { rilievoSchema } from '@/lib/schemas/rilievo.schema'

const form = useForm({
  resolver: zodResolver(rilievoSchema),
  defaultValues: EMPTY_RILIEVO_FORM
})
```

## 🐛 Common Issues

### Issue: Supabase RLS blocking queries
**Solution:** Verifica che `auth.uid()` corrisponda a `user_id` in rilievi

### Issue: CORS errors
**Solution:** Aggiungi domain a Supabase Dashboard > Authentication > URL Configuration

### Issue: PDF non si genera
**Solution:** Aumenta timeout server in `next.config.js`

### Issue: Form non si aggiorna
**Solution:** Verifica che `updateField` stia aggiornando lo stato corretto

## 🎯 MVP Checklist

Per un MVP funzionante, assicurati di completare:

- [ ] ✅ Autenticazione funzionante
- [ ] ✅ Creazione nuovo rilievo
- [ ] ✅ Aggiunta/rimozione pagine (P1, P2, P3...)
- [ ] ✅ Form con almeno 5 sezioni principali
- [ ] ✅ Salvataggio su Supabase
- [ ] ✅ Dashboard lista rilievi
- [ ] ✅ Generazione PDF base
- [ ] ✅ Responsive mobile/tablet

## 📞 Support

Per domande o problemi:
1. Controlla `RMI_PROJECT_SPEC.md` per dettagli completi
2. Verifica `supabase_migrations.sql` per schema database
3. Consulta `rmi-types.ts` per types TypeScript

---

**Prossimo Step:** Inizia con FASE 1 - Foundation
