# 📦 RMI - Pacchetto Completo Documentazione Progetto

## 📚 File Inclusi

### 📋 Documentazione Principale

#### 1. **RMI_PROJECT_SPEC.md** ⭐⭐⭐⭐⭐
**Tipo:** Specifica completa di progetto  
**Quando usarlo:** SEMPRE - È il documento principale  
**Contenuto:**
- Executive summary e obiettivi
- Architettura tecnica completa (Next.js + Supabase)
- Schema database dettagliato
- Design system e UI/UX specs
- Implementazione step-by-step
- Checklist milestone
- Tutte le risorse e riferimenti

**👉 Da dare a Claude Code come primo documento**

---

#### 2. **QUICK_START.md** ⭐⭐⭐⭐⭐
**Tipo:** Guida rapida setup e implementazione  
**Quando usarlo:** All'inizio, come companion di PROJECT_SPEC  
**Contenuto:**
- Setup Supabase passo-passo
- Setup Next.js e dipendenze
- Ordine di implementazione (FASE 1-9)
- Comandi utili
- Debug & troubleshooting
- MVP checklist

**👉 Per iniziare rapidamente il progetto**

---

### 🗄️ Database & Backend

#### 3. **supabase_migrations.sql** ⭐⭐⭐⭐⭐
**Tipo:** SQL migrations complete  
**Quando usarlo:** Setup database Supabase  
**Contenuto:**
- Creazione tabelle (rilievi, serramenti, pdf_generated)
- Indici per performance
- Row Level Security (RLS) policies completas
- Triggers per updated_at
- Funzioni utility
- Views per dashboard
- Storage bucket configuration

**👉 Eseguire in Supabase SQL Editor**

---

### 💻 TypeScript & Types

#### 4. **rmi-types.ts** ⭐⭐⭐⭐⭐
**Tipo:** Types, interfaces e costanti TypeScript  
**Quando usarlo:** Copiare in `/lib/types/database.types.ts`  
**Contenuto:**
- Tutte le 44 tipologie serramenti
- 18 serie
- Finiture, alette, posizioni
- Database interfaces (Rilievo, Serramento, etc.)
- Form data types
- Component props types
- Utility types e empty templates
- Brand colors

**👉 Foundation per tutto il progetto TypeScript**

---

### 🧩 Esempi Componenti React

#### 5. **PageManager-example.tsx** ⭐⭐⭐⭐
**Tipo:** Componente React esempio  
**Quando usarlo:** Template per gestione tab pagine  
**Contenuto:**
- Gestione tab P1, P2, P3... dinamici
- Pulsante "+" per aggiungere pagine
- Pulsante "×" per eliminare pagine
- Styling con Shadcn/ui
- Props interface

**👉 Usare come base per `/components/rmi/PageManager.tsx`**

---

#### 6. **HeaderSection-example.tsx** ⭐⭐⭐⭐
**Tipo:** Componente React esempio  
**Quando usarlo:** Template per sezione header (dati cliente)  
**Contenuto:**
- Layout grid Excel-style
- Logo laterale parallelogramma
- Campi cliente, data, indirizzo, email, etc.
- Bordi blu A.L.M.
- Props interface

**👉 Usare come base per `/components/rmi/HeaderSection.tsx`**

---

#### 7. **DatiTipologiaSection-example.tsx** ⭐⭐⭐⭐
**Tipo:** Componente React esempio  
**Quando usarlo:** Template per sezioni form  
**Contenuto:**
- Pattern FieldRow per tutti i campi
- Componenti utility: FieldRow, FieldRowSelect, FieldRowTextarea
- Styling consistente
- Dropdown tipologie e serie
- Props interface

**👉 Usare come template per TUTTE le altre sezioni form**

---

## 🎯 Ordine di Lettura Consigliato

### Per Claude Code:
1. ✅ **RMI_PROJECT_SPEC.md** - Leggi tutto per capire il progetto
2. ✅ **QUICK_START.md** - Segui le fasi in ordine
3. ✅ **rmi-types.ts** - Copia in progetto come primo file
4. ✅ **supabase_migrations.sql** - Esegui in Supabase
5. ✅ Usa gli esempi componenti come template

### Per lo sviluppatore umano:
1. ✅ PROJECT_SPEC per overview
2. ✅ QUICK_START per setup pratico
3. ✅ Riferimenti agli esempi durante implementazione

---

## 🔧 Come Usare Questi File

### Setup Iniziale (Day 1)
```bash
# 1. Leggi PROJECT_SPEC.md
# 2. Crea progetto Supabase
# 3. Esegui supabase_migrations.sql in SQL Editor
# 4. Copia rmi-types.ts nel progetto Next.js
# 5. Segui QUICK_START.md FASE 1
```

### Sviluppo (Day 2-10)
```bash
# 1. Segui QUICK_START.md FASE 2-9
# 2. Usa esempi componenti come template
# 3. Riferisci a PROJECT_SPEC per dettagli
# 4. Consulta rmi-types.ts per types
```

---

## 📁 Dove Mettere Ogni File nel Progetto

```
your-nextjs-project/
├── docs/
│   ├── RMI_PROJECT_SPEC.md          ← Copia qui per riferimento
│   ├── QUICK_START.md               ← Copia qui per riferimento
│   └── supabase_migrations.sql      ← Copia qui per riferimento
│
├── lib/
│   ├── types/
│   │   └── database.types.ts        ← COPIA rmi-types.ts QUI
│   └── constants/
│       └── index.ts                 ← Estrai costanti da rmi-types.ts
│
├── components/
│   └── rmi/
│       ├── PageManager.tsx          ← Usa PageManager-example.tsx
│       ├── HeaderSection.tsx        ← Usa HeaderSection-example.tsx
│       └── DatiTipologiaSection.tsx ← Usa DatiTipologiaSection-example.tsx
│
└── supabase/
    └── migrations/
        └── 001_initial.sql          ← Copia supabase_migrations.sql QUI
```

---

## ✅ Checklist Prima di Iniziare

Prima di dare questi file a Claude Code, assicurati di:

- [ ] Hai un account Supabase creato
- [ ] Hai un progetto Next.js con boilerplate
- [ ] Hai Node.js 18+ installato
- [ ] Hai Git configurato
- [ ] Hai letto almeno PROJECT_SPEC.md una volta

---

## 🚀 Prompt Consigliato per Claude Code

```
Ciao! Ho un progetto RMI (Rilevatore Misure Interattivo) da implementare.

Ho questi documenti:
1. RMI_PROJECT_SPEC.md - Specifica completa
2. QUICK_START.md - Guida implementazione
3. supabase_migrations.sql - Schema database
4. rmi-types.ts - Types TypeScript
5. Esempi componenti React

Il progetto usa Next.js 14 (App Router) + Supabase + TypeScript.

Iniziamo dalla FASE 1 del QUICK_START.md:
1. Setup Supabase client
2. Configurazione environment
3. Test connessione

Procediamo?
```

---

## 🆘 Supporto

### Se Claude Code ha problemi:
1. Verifica di aver dato PROJECT_SPEC.md come contesto
2. Riferisci alla sezione specifica di QUICK_START.md
3. Mostra l'esempio componente pertinente
4. Verifica schema database in supabase_migrations.sql

### Se c'è confusione su types:
1. Apri rmi-types.ts
2. Cerca il type specifico necessario
3. Verifica le costanti (TIPOLOGIE, SERIE, etc.)

---

## 📞 Contatti

**Progetto:** RMI - Rilevatore Misure Interattivo  
**Cliente:** A.L.M. Infissi, Palermo  
**Stack:** Next.js + Supabase + TypeScript  

---

## 🎉 Ready to Start!

Tutti i file sono pronti! 

**Next Step:** 
1. Crea progetto Supabase
2. Esegui migrations SQL
3. Configura Next.js
4. Dai PROJECT_SPEC.md a Claude Code
5. Inizia FASE 1!

**Buon lavoro! 🚀**
