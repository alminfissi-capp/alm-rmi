# Setup Supabase Storage per RMI

## Creazione Bucket Storage

Per abilitare la funzionalità di generazione PDF, è necessario creare un bucket storage su Supabase.

### Procedura Manuale (Consigliata)

1. Accedi alla dashboard di Supabase: https://app.supabase.com
2. Seleziona il progetto RMI
3. Nel menu laterale, vai su **Storage**
4. Clicca su **New Bucket**
5. Configura il bucket con i seguenti parametri:
   - **Nome**: `rmi-documents`
   - **Public bucket**: **NO** (non spuntare)
   - **File size limit**: `10 MB` (10485760 bytes)
   - **Allowed MIME types**: `application/pdf`

6. Clicca su **Create bucket**

### Policy di Accesso (RLS)

Dopo aver creato il bucket, configura le policy di Row Level Security:

#### 1. Policy per Upload (INSERT)
```sql
CREATE POLICY "Users can upload their own PDFs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'rmi-documents' AND
  (storage.foldername(name))[1] = 'pdfs' AND
  (storage.foldername(name))[2] = auth.uid()::text
);
```

#### 2. Policy per Download (SELECT)
```sql
CREATE POLICY "Users can download their own PDFs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'rmi-documents' AND
  (storage.foldername(name))[1] = 'pdfs' AND
  (storage.foldername(name))[2] = auth.uid()::text
);
```

#### 3. Policy per Eliminazione (DELETE)
```sql
CREATE POLICY "Users can delete their own PDFs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'rmi-documents' AND
  (storage.foldername(name))[1] = 'pdfs' AND
  (storage.foldername(name))[2] = auth.uid()::text
);
```

### Struttura delle Cartelle

I PDF verranno salvati con questa struttura:
```
rmi-documents/
  └── pdfs/
      └── {user_id}/
          └── RMI_{cliente}_{commessa}_{timestamp}.pdf
```

### Verifica Configurazione

Dopo aver configurato il bucket e le policy:

1. Accedi all'applicazione RMI
2. Vai alla Dashboard
3. Apri il menu azioni (⋯) su un rilievo
4. Clicca su **Genera PDF**
5. Il PDF dovrebbe essere generato e scaricato automaticamente

Se ricevi errori, controlla:
- Che il bucket `rmi-documents` esista
- Che le policy RLS siano configurate correttamente
- Che l'utente sia autenticato
- Che il rilievo abbia almeno un serramento

## Troubleshooting

### Errore: "Bucket not found"
Il bucket non è stato creato. Segui la procedura sopra per crearlo.

### Errore: "new row violates row-level security policy"
Le policy RLS non sono configurate o non permettono l'operazione. Verifica le policy sopra.

### Errore: "File size exceeds limit"
Il PDF generato supera i 10MB. Questo è raro, contatta il supporto.

### PDF non si scarica automaticamente
- Verifica che il browser non stia bloccando i popup
- Controlla la console del browser per errori
- Verifica che l'URL firmato sia valido (scade dopo 1 ora)

## Automazione Futura

È possibile automatizzare la creazione del bucket tramite:
1. Supabase Management API (richiede service role key)
2. Script di setup con credenziali admin
3. Terraform/IaC per l'infrastruttura

Per ora, la creazione manuale è la soluzione più sicura e semplice.
