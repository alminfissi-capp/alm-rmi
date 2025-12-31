# 📚 Guida Libreria Frame ALM Infissi v2.0

## 🎉 Libreria Completa Creata con Successo!

La libreria frame è stata completamente rinnovata con **36 configurazioni professionali** stile **PVC Windows Studio** e **FP Pro**.

---

## 📊 Statistiche

```
╔════════════════════════════════════════════════════════╗
║  LIBRERIA FRAME ALM INFISSI v2.0                      ║
╠════════════════════════════════════════════════════════╣
║  ✅ 36 Configurazioni Professionali                    ║
║  ✅ 9 Categorie Organizzate                           ║
║  ✅ Sistema di Ricerca Integrato                      ║
║  ✅ Filtri per Categoria e Tipo Apertura              ║
║  ✅ 100% Compatibile con Sistema Esistente            ║
╚════════════════════════════════════════════════════════╝
```

---

## 📁 Configurazioni per Categoria

| Categoria | N° Config | Esempi |
|-----------|-----------|---------|
| **1 Anta** | 4 | Fissa, Battente DX/SX, Ribalta |
| **2 Ante** | 6 | Fisse, Battenti, Fissa+Battente, Oscillo-Battente |
| **3 Ante** | 4 | 3 Battenti, Fissa+Batt+Fissa, Batt+Fissa+Batt |
| **4 Ante** | 3 | 4 Battenti, 4 Fisse, Griglia 2x2 |
| **Porte-Finestre** | 4 | 1 Anta, 2 Ante, Con Sopraluce, Fissa+Battente |
| **Scorrevoli** | 4 | 2 Ante, 3 Ante, Alzante, Complanare |
| **Con Sopraluce** | 4 | 2 Ante+Sopraluce, 3 Ante+Sopraluce, Ribalta |
| **Asimmetriche** | 3 | Larga+Stretta (70/30), 3 Ante Asimmetriche |
| **Speciali** | 4 | Angolare DX/SX, Bow Window, Vetrata Continua |

**TOTALE: 36 configurazioni**

---

## 🚀 Come Usare la Nuova Libreria

### 1. Importare le Funzioni

```javascript
import {
  getFrameConfig,              // Ottieni singola configurazione
  getAllAnteConfigs,            // Ottieni tutte le configurazioni
  getFramesByCategory,          // Filtra per categoria
  getFramesByApertura,          // Filtra per tipo apertura
  searchFrameConfigs,           // Cerca per nome
  CATEGORIE_FRAMES              // Array categorie per UI
} from '@/lib/frames/frames-config';
```

### 2. Usare il Nuovo FrameSelector

**Esempio nel Configuratore:**

```jsx
import FrameSelectorComplete from '@/components/frames/FrameSelectorComplete';

function ConfiguratorePage() {
  const [selectedFrameId, setSelectedFrameId] = useState('ante_2_battenti');

  return (
    <div>
      <FrameSelectorComplete
        selectedFrameId={selectedFrameId}
        onSelectFrame={setSelectedFrameId}
      />
    </div>
  );
}
```

**Features del FrameSelector:**
- ✅ Filtri per categoria (9 categorie)
- ✅ Barra di ricerca con autocomplete
- ✅ Paginazione automatica
- ✅ Grid responsive (2x3 su desktop, 2x2 su tablet)
- ✅ Badge per tipo apertura
- ✅ Icone SVG per preview
- ✅ Selezione visuale con checkmark

### 3. Filtrare per Categoria

```javascript
// Ottieni solo finestre a 2 ante
const dueAnte = getFramesByCategory('finestre_2_ante');

// Ottieni solo porte-finestre
const porte = getFramesByCategory('porte_finestre');

// Ottieni solo scorrevoli
const scorrevoli = getFramesByCategory('scorrevoli');
```

### 4. Filtrare per Tipo Apertura

```javascript
// Ottieni solo battenti
const battenti = getFramesByApertura('battente');

// Ottieni solo scorrevoli
const scorrevoli = getFramesByApertura('scorrevole');

// Ottieni solo fissi
const fissi = getFramesByApertura('fisso');
```

### 5. Cercare Configurazioni

```javascript
// Cerca per nome
const risultati = searchFrameConfigs('sopraluce');
// Restituisce: [ante_2_sopraluce, ante_3_sopraluce, ...]

const risultati2 = searchFrameConfigs('porta');
// Restituisce: [porta_finestra_1_anta, porta_finestra_2_ante, ...]
```

---

## 🏗️ Struttura Configurazione Frame

Ogni frame ha questa struttura:

```javascript
{
  id: 'ante_2_battenti',                    // ID univoco
  nome: '2 Ante Battenti',                  // Nome visualizzato
  descrizione: 'Due ante battenti...',      // Descrizione
  tipo: 'ante',                             // Tipo (ante/geometria)
  categoria: 'finestre_2_ante',             // Categoria per filtri

  divisioni: {
    verticali: 2,                           // N° divisioni verticali
    orizzontali: 1                          // N° divisioni orizzontali
  },

  apertura: 'battente',                     // Tipo apertura
  apertura_lato: 'destra',                  // Lato apertura (opzionale)

  lati: [
    { id: 'base', lunghezza: 1200, label: 'Larghezza', minimo: 800, massimo: 2000 },
    { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
  ],

  angoli: [
    { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
    { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
    { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
    { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
  ],

  // Opzionale: traversi per sopraluce/sottoluce
  traversi: [
    { posizione: 0.3, tipo: 'orizzontale', fisso: true }
  ],

  // Opzionale: proporzioni asimmetriche
  asimmetrica: true,
  proporzioni: [0.7, 0.3],

  // Icona SVG per preview
  icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85 M 30 50 L 45 50 M 55 50 L 70 50'
}
```

---

## 🎨 Tipi di Apertura Disponibili

| Tipo | Descrizione | Icon |
|------|-------------|------|
| `'fisso'` | Vetrata fissa senza apertura | ⬜ |
| `'battente'` | Apertura a battente classica | 🚪 |
| `'scorrevole'` | Ante scorrevoli sovrapposte | ↔️ |
| `'ribalta'` | Apertura a ribalta (vasistas) | 🔼 |
| `'oscillo_battente'` | Doppia apertura oscilobattente | 🔄 |
| `'alzante_scorrevole'` | Sistema alzante scorrevole premium | ⬆️ |
| `'scorrevole_complanare'` | Scorrevole a scomparsa complanare | ↔️ |
| `'mista'` | Combinazione fissa + battente | ⚙️ |

---

## 📋 Esempi di Utilizzo Avanzato

### Esempio 1: Dropdown Categorie

```jsx
import { CATEGORIE_FRAMES, getFramesByCategory } from '@/lib/frames/frames-config';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

function CategoryFilter({ onCategoryChange }) {
  return (
    <Select onValueChange={onCategoryChange}>
      <SelectTrigger>
        <SelectValue placeholder="Seleziona categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tutti ({getAllAnteConfigs().length})</SelectItem>
        {CATEGORIE_FRAMES.map(cat => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.icon} {cat.nome} ({cat.count})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Esempio 2: Lista con Ricerca

```jsx
import { useState } from 'react';
import { searchFrameConfigs } from '@/lib/frames/frames-config';
import { Search } from 'lucide-react';

function FrameSearchList() {
  const [query, setQuery] = useState('');
  const results = searchFrameConfigs(query);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
        <input
          type="text"
          placeholder="Cerca configurazione..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 w-full p-2 border rounded"
        />
      </div>

      <div className="mt-4 space-y-2">
        {results.map(frame => (
          <div key={frame.id} className="p-3 border rounded hover:bg-gray-50">
            <h3 className="font-bold">{frame.nome}</h3>
            <p className="text-sm text-gray-600">{frame.descrizione}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Esempio 3: Galleria con Filtri Multipli

```jsx
import { useState, useMemo } from 'react';
import { getAllAnteConfigs } from '@/lib/frames/frames-config';

function FrameGallery() {
  const [filters, setFilters] = useState({
    categoria: 'all',
    apertura: 'all',
    ante: 'all'
  });

  const filteredFrames = useMemo(() => {
    let frames = getAllAnteConfigs();

    if (filters.categoria !== 'all') {
      frames = frames.filter(f => f.categoria === filters.categoria);
    }

    if (filters.apertura !== 'all') {
      frames = frames.filter(f => f.apertura === filters.apertura);
    }

    if (filters.ante !== 'all') {
      const ante = parseInt(filters.ante);
      frames = frames.filter(f => f.divisioni.verticali === ante);
    }

    return frames;
  }, [filters]);

  return (
    <div>
      {/* Filtri */}
      <div className="flex gap-2 mb-4">
        <select value={filters.apertura} onChange={(e) => setFilters({...filters, apertura: e.target.value})}>
          <option value="all">Tutte le aperture</option>
          <option value="battente">Solo Battenti</option>
          <option value="scorrevole">Solo Scorrevoli</option>
          <option value="fisso">Solo Fissi</option>
        </select>

        <select value={filters.ante} onChange={(e) => setFilters({...filters, ante: e.target.value})}>
          <option value="all">Tutte le ante</option>
          <option value="1">1 Anta</option>
          <option value="2">2 Ante</option>
          <option value="3">3 Ante</option>
          <option value="4">4 Ante</option>
        </select>
      </div>

      {/* Risultati */}
      <div className="grid grid-cols-3 gap-4">
        {filteredFrames.map(frame => (
          <FrameCard key={frame.id} frame={frame} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🔧 Integrazione nel Configuratore Esistente

### Sostituire FrameSelector Vecchio

**Prima (vecchio):**
```jsx
import FrameSelector from '@/components/frames/FrameSelector';

<FrameSelector
  selectedFrameId={config.frameId}
  onSelectFrame={handleFrameSelect}
  mode="ante"
/>
```

**Dopo (nuovo):**
```jsx
import FrameSelectorComplete from '@/components/frames/FrameSelectorComplete';

<FrameSelectorComplete
  selectedFrameId={config.frameId}
  onSelectFrame={handleFrameSelect}
/>
```

### Compatibilità Retroattiva

Il nuovo sistema è **100% compatibile** con il codice esistente:

```javascript
// Tutte le funzioni esistenti funzionano ancora
getFrameConfig('ante_2');           // ✅ Funziona
getAllAnteConfigs();                 // ✅ Funziona + 36 frames
cloneFrameConfig('porta_finestra');  // ✅ Funziona
```

---

## 🎯 Prossimi Passi

### 1. Testing Configurazioni
```bash
# Testa tutte le 36 configurazioni nel configuratore
npm run dev
# Vai su /configuratore e prova ogni frame
```

### 2. Aggiungere Nuove Configurazioni

Per aggiungere un nuovo frame, modifica `lib/frames/frames-config-complete.js`:

```javascript
// Aggiungi in una categoria esistente
export const FINESTRE_2_ANTE = {
  // ... frames esistenti ...

  nuovo_frame: {
    id: 'nuovo_frame',
    nome: 'Nuovo Frame',
    descrizione: 'Descrizione del nuovo frame',
    tipo: 'ante',
    categoria: 'finestre_2_ante',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'battente',
    lati: [
      { id: 'base', lunghezza: 1200, label: 'Larghezza', minimo: 800, massimo: 2000 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z' // Path SVG
  }
};
```

### 3. Personalizzare FrameSelector

Il nuovo `FrameSelectorComplete` supporta:
- **Personalizzazione colori**: Modifica le classi Tailwind nel componente
- **Numero frames per pagina**: Cambia `FRAMES_PER_PAGE`
- **Layout grid**: Modifica `grid-cols-2 md:grid-cols-3`
- **Rimozione ricerca**: Commenta la sezione "Barra Ricerca"
- **Rimozione filtri**: Commenta la sezione "Filtri Categoria"

---

## 📞 Supporto

Per domande o problemi:
1. Controlla questa guida
2. Leggi i commenti nel codice (`frames-config-complete.js`)
3. Testa nel configuratore: http://localhost:3000/configuratore

---

## 📝 Changelog

### v2.0 - 2025-12-22
- ✅ Aggiunta libreria completa con 36 configurazioni
- ✅ Organizzazione in 9 categorie
- ✅ Nuovo FrameSelectorComplete con filtri e ricerca
- ✅ Sistema di ricerca integrato
- ✅ Filtri per categoria e tipo apertura
- ✅ Icone SVG per ogni frame
- ✅ Compatibilità retroattiva 100%

### v1.0 - Precedente
- 8 configurazioni base
- Sistema FrameSelector semplice
- Solo forme geometriche legacy

---

🎉 **La libreria è pronta all'uso! Buon configuratore!** 🚀
