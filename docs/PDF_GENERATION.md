# Generazione PDF - RMI

## Panoramica

Il sistema RMI include una funzionalità completa per la generazione di PDF professionali contenenti tutti i dati dei rilievi e serramenti.

## Funzionalità Implementate

### 1. Componente PDFGenerator
**File**: `components/pdf/PDFGenerator.tsx`

Classe che gestisce la generazione del PDF utilizzando jsPDF:
- Layout professionale con branding A.L.M. Infissi
- Header con logo e informazioni documento
- Sezione dati cliente/commessa
- Rendering completo di tutti i serramenti (P1, P2, P3...)
- Tutte le 11 sezioni per ogni serramento:
  - Dati Tipologia
  - Misure Alette
  - Colori
  - Ferramenta
  - Apertura
  - Opzioni Estetiche
  - Traverso/Montante
  - Zanzariere
  - Riempimenti
  - Zoccolo/Fascia
  - Oscuranti
- Gestione automatica page break
- Footer con numerazione pagine e timestamp

### 2. API Route
**File**: `app/api/pdf/generate/route.ts`

Endpoint POST per generare e salvare PDF:
- Autentica l'utente
- Recupera rilievo e serramenti dal database
- Genera il PDF tramite PDFGenerator
- Salva su Supabase Storage
- Crea record nella tabella `pdf_generated`
- Restituisce URL firmato per il download (valido 1 ora)

**Endpoint**: `POST /api/pdf/generate`

**Body**:
```json
{
  "rilievoId": "uuid-del-rilievo"
}
```

**Response**:
```json
{
  "success": true,
  "pdf": {
    "id": "uuid",
    "fileName": "RMI_Cliente_Commessa_timestamp.pdf",
    "fileSize": 123456,
    "downloadUrl": "https://...",
    "generatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Storage Utility
**File**: `lib/supabase/storage.ts`

Funzioni helper per gestire lo storage:
- `uploadPDF()` - Carica PDF su Supabase Storage
- `getPDFDownloadUrl()` - Genera URL firmato per download
- `deletePDF()` - Elimina PDF dallo storage
- `listUserPDFs()` - Elenca tutti i PDF di un utente

### 4. Integrazione Dashboard
**File**: `components/dashboard/rilievi-table.tsx`

Pulsante "Genera PDF" nel menu azioni:
- Chiamata API per generazione
- Toast notifications per feedback utente
- Loading state durante generazione
- Apertura automatica download in nuova tab

## Formato PDF Generato

### Struttura
1. **Header**
   - Logo e nome A.L.M. Infissi
   - Titolo "SCHEDA RILIEVO SERRAMENTI"
   - Data rilievo

2. **Dati Cliente e Commessa** (box blu)
   - Cliente
   - Indirizzo
   - Telefono
   - Email
   - N° Commessa
   - Note header

3. **Serramenti** (box verde per ognuno)
   - Titolo: "SERRAMENTO P1 - [Tipologia]"
   - Sottosezioni con tutti i dati compilati
   - Solo campi con valori vengono mostrati
   - Note finali per ogni serramento

4. **Footer** (su ogni pagina)
   - Testo: "Generato con RMI - A.L.M. Infissi"
   - Numerazione: "Pagina X di Y"
   - Timestamp generazione

### Colori Branding
- **Blu ALM**: `#0288d1` - Header principale, separatori
- **Verde ALM**: `#7cb342` - Sezioni serramenti, accenti
- **Nero**: `#000000` - Testo principale

### Font e Dimensioni
- **Header**: 24pt bold (logo), 16pt bold (titolo)
- **Sezioni**: 12pt bold (titoli sezioni), 9pt (sottotitoli)
- **Contenuto**: 8-10pt normale
- **Footer**: 8pt grigio

## Utilizzo

### Dal Dashboard
1. Accedi alla Dashboard
2. Trova il rilievo da esportare
3. Clicca sui tre puntini (⋯) per aprire menu azioni
4. Clicca su "Genera PDF"
5. Attendi il completamento (toast "Generazione PDF in corso...")
6. Il PDF si aprirà automaticamente in una nuova tab
7. Salva il PDF dal browser

### Programmaticamente

```typescript
import { generatePDF, downloadPDF } from "@/components/pdf/PDFGenerator"

// Genera blob PDF
const pdfBlob = await generatePDF(rilievo)

// Oppure download diretto
await downloadPDF(rilievo)
```

## Storage e Persistenza

### Supabase Storage
- **Bucket**: `rmi-documents`
- **Percorso**: `pdfs/{user_id}/{filename}.pdf`
- **Sicurezza**: Row Level Security (RLS) - solo il proprietario può accedere
- **Limite**: 10MB per file

### Database
Tabella `pdf_generated` registra ogni PDF generato:
- `id` - UUID
- `rilievo_id` - FK al rilievo
- `file_path` - Percorso su storage
- `file_name` - Nome file
- `file_size` - Dimensione in bytes
- `generated_at` - Timestamp generazione
- `generated_by` - UUID utente

## Setup Iniziale

Vedi [SETUP_STORAGE.md](./SETUP_STORAGE.md) per:
1. Creazione bucket Supabase
2. Configurazione policy RLS
3. Verifica funzionamento

## Limitazioni e Note

### Limitazioni Correnti
- ❌ Immagini SVG delle tipologie non incluse (placeholder testuale)
- ❌ Logo bitmap non incluso (header testuale)
- ❌ Non c'è anteprima PDF prima del download
- ❌ Non c'è storico PDF generati nell'UI
- ❌ Un solo formato (A4 portrait)

### Ottimizzazioni Future
- [ ] Aggiungere immagini/disegni delle tipologie
- [ ] Includere logo bitmap nel PDF
- [ ] Anteprima PDF prima del download
- [ ] Sezione storico PDF nel dashboard
- [ ] Opzioni formato (A4, Letter, landscape)
- [ ] Compressione automatica per PDF grandi
- [ ] Watermark per bozze
- [ ] Template personalizzabili

## Performance

- **Tempo generazione**: ~1-3 secondi per rilievo con 1-5 serramenti
- **Dimensione media**: 50-200 KB per rilievo base
- **Limite file**: 10 MB (configurabile)

## Errori Comuni

### "Bucket not found"
**Causa**: Bucket storage non configurato
**Soluzione**: Segui [SETUP_STORAGE.md](./SETUP_STORAGE.md)

### "Row-level security policy"
**Causa**: Policy RLS non configurate
**Soluzione**: Applica le policy SQL da SETUP_STORAGE.md

### "Error generating PDF"
**Causa**: Dati rilievo incompleti o corrotti
**Soluzione**: Verifica che il rilievo abbia almeno un serramento

### "File too large"
**Causa**: PDF supera 10MB (molto raro)
**Soluzione**: Contatta amministratore per aumentare limite

## Testing

### Test Manuale
1. Crea un rilievo di test con dati completi
2. Aggiungi 2-3 serramenti con campi compilati
3. Genera PDF dal dashboard
4. Verifica:
   - PDF si apre correttamente
   - Tutti i dati sono presenti
   - Formattazione corretta
   - Footer e numerazione pagine

### Test Automatici (TODO)
- [ ] Unit test per PDFGenerator
- [ ] Integration test per API route
- [ ] E2E test per flow completo
- [ ] Visual regression test per PDF output

## Manutenzione

### Aggiornamento Template
Per modificare il layout PDF, edita `PDFGenerator.tsx`:
- `addHeader()` - Header documento
- `addClientInfo()` - Sezione cliente
- `addSerramento()` - Rendering serramento
- `addSubSection()` - Sottosezioni
- `addFooter()` - Footer pagine

### Aggiunta Nuovi Campi
1. Aggiungi campo in `addSerramento()` o `addSubSection()`
2. Usa `checkPageBreak()` prima di sezioni grandi
3. Mantieni lo stile coerente con il resto

### Debugging
Abilita logging dettagliato:
```typescript
console.log("Generating PDF for rilievo:", rilievo.id)
console.log("Serramenti count:", rilievo.serramenti?.length)
```

Verifica il PDF generato prima dell'upload:
```typescript
// Salva temporaneamente per debug
const pdfBlob = await generatePDF(rilievo)
const url = URL.createObjectURL(pdfBlob)
window.open(url) // Apri per verifica visuale
```

## Supporto

Per problemi o domande:
1. Controlla questa documentazione
2. Vedi [SETUP_STORAGE.md](./SETUP_STORAGE.md) per setup storage
3. Controlla console browser per errori
4. Verifica log server Next.js

## Changelog

### v1.0.0 (2024-12-03)
- ✅ Implementazione iniziale PDFGenerator
- ✅ API route per generazione
- ✅ Integrazione dashboard
- ✅ Storage su Supabase
- ✅ Documentazione completa
