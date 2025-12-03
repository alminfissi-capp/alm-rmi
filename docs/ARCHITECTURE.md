# Architettura RMI - Single-Tenant

## Modello di Accesso

### 🏢 Single-Tenant Organization

Il sistema RMI è progettato come applicazione **single-tenant** per A.L.M. Infissi.

**Cosa significa:**
- Tutti gli utenti registrati sono **operatori della stessa azienda** (A.L.M. Infissi, Palermo)
- **Condivisione completa** dei dati tra tutti gli utenti
- **Nessuna limitazione di accesso** basata sul creatore
- **Tracciamento delle azioni** per audit e accountability

### ✅ Permessi Utenti

**Tutti gli utenti autenticati possono:**
- ✅ Visualizzare TUTTI i rilievi (anche quelli creati da altri)
- ✅ Modificare TUTTI i rilievi
- ✅ Eliminare TUTTI i rilievi
- ✅ Generare PDF di TUTTI i rilievi
- ✅ Creare nuovi rilievi

**Tracciamento:**
- Il campo `user_id` in `rilievi` indica **chi ha creato** il rilievo
- Il campo `updated_at` traccia l'ultima modifica
- Il campo `generated_by` in `pdf_generated` indica chi ha generato il PDF

### 🔒 Sicurezza

**Autenticazione richiesta:**
- Solo utenti autenticati possono accedere all'app
- Login tramite Supabase Auth (email/password)
- Sessioni gestite con JWT

**Row Level Security (RLS) su Supabase:**
```sql
-- Tutti gli utenti autenticati possono vedere tutti i rilievi
CREATE POLICY "Users can view all rilievi"
ON rilievi FOR SELECT
TO authenticated
USING (true);

-- Tutti gli utenti autenticati possono modificare tutti i rilievi
CREATE POLICY "Users can update all rilievi"
ON rilievi FOR UPDATE
TO authenticated
USING (true);

-- Tutti gli utenti autenticati possono eliminare tutti i rilievi
CREATE POLICY "Users can delete all rilievi"
ON rilievi FOR DELETE
TO authenticated
USING (true);

-- Tutti gli utenti autenticati possono creare rilievi
CREATE POLICY "Users can create rilievi"
ON rilievi FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

## 📊 Schema Database

### Tabella `rilievi`
```sql
- id (UUID, PK)
- user_id (UUID, FK to auth.users) -- Chi ha CREATO il rilievo
- cliente, data, indirizzo, celltel, email, note_header, commessa
- status (bozza, in_lavorazione, completato, archiviato)
- created_at, updated_at
```

**Nota importante:** `user_id` è il creatore, NON il proprietario esclusivo.

### Tabella `pdf_generated`
```sql
- id (UUID, PK)
- rilievo_id (UUID, FK to rilievi)
- file_path, file_name, file_size
- generated_at
- generated_by (UUID, FK to auth.users) -- Chi ha GENERATO il PDF
```

## 🎯 Casi d'Uso

### Scenario 1: Collaborazione tra Tecnici
**Situazione:** Mario è in cantiere e inizia un rilievo ma non finisce. Luca deve completarlo.

**Flusso:**
1. Mario crea rilievo (user_id = Mario)
2. Mario compila 3 serramenti su 5
3. Luca accede al dashboard → Vede il rilievo di Mario
4. Luca apre il rilievo di Mario → Può modificarlo
5. Luca completa gli altri 2 serramenti
6. Luca genera PDF → OK (generated_by = Luca)

**Risultato:** ✅ Collaborazione fluida, nessun blocco

### Scenario 2: Supervisore Controlla Tutto
**Situazione:** Sara (supervisore) deve verificare tutti i rilievi della settimana.

**Flusso:**
1. Sara accede alla dashboard
2. Vede TUTTI i rilievi creati da Mario, Luca, Giovanni, ecc.
3. Può aprirli, modificarli, generare PDF
4. Può vedere chi ha creato cosa (tracciabilità)

**Risultato:** ✅ Piena visibilità e controllo

### Scenario 3: Generazione Report Mensile
**Situazione:** Fine mese, serve generare PDF di tutti i rilievi completati.

**Flusso:**
1. Amministratore filtra per status="completato"
2. Vede tutti i rilievi di tutti gli utenti
3. Genera PDF uno per uno (o batch se implementato)
4. Invia ai clienti

**Risultato:** ✅ Nessuna limitazione

## 🚫 Cosa NON è Possibile

### Non è Multi-Tenant
- ❌ NON c'è isolamento tra "aziende" diverse
- ❌ NON c'è campo `organization_id` o `tenant_id`
- ❌ NON serve se tutti lavorano per A.L.M. Infissi

### Se Servisse Multi-Tenant in Futuro...

**Cambiamenti necessari:**
1. Aggiungere `organizations` table
2. Aggiungere `organization_id` a `users` e `rilievi`
3. Modificare tutte le query per filtrare per `organization_id`
4. Aggiornare RLS policies
5. Aggiungere sistema di inviti/onboarding per organizzazioni

**Stima effort:** ~2-3 giorni di sviluppo

## 🔄 Alternative Considerate

### Opzione A: Ownership Stretto (SCARTATA)
**Descrizione:** Solo il creatore può modificare/vedere i propri rilievi.

**Pro:**
- Maggiore isolamento
- Responsabilità chiare

**Contro:**
- ❌ Blocca la collaborazione tra tecnici
- ❌ Supervisori non possono aiutare
- ❌ Complica il workflow
- ❌ Non adatto a team piccoli/medi

**Decisione:** ❌ Scartata - troppo restrittiva per il caso d'uso

### Opzione B: Ruoli e Permessi Granulari (SCARTATA per ora)
**Descrizione:** Admin, Editor, Viewer con permessi diversi.

**Pro:**
- Controllo fine-grained
- Flessibilità

**Contro:**
- ⚠️ Over-engineering per team piccolo
- ⚠️ Complessità aggiuntiva
- ⚠️ YAGNI (You Aren't Gonna Need It)

**Decisione:** ⚠️ Posticipata - implementare solo se richiesto

### Opzione C: Single-Tenant con Tracciamento (✅ SCELTA)
**Descrizione:** Accesso libero + tracciamento chi fa cosa.

**Pro:**
- ✅ Semplice e funzionale
- ✅ Adatto a team piccoli/medi
- ✅ Nessun blocco al workflow
- ✅ Tracciabilità per audit

**Contro:**
- ⚠️ Richiede fiducia tra membri del team
- ⚠️ Nessuna protezione contro cancellazioni accidentali (risolvibile con soft-delete)

**Decisione:** ✅ IMPLEMENTATA

## 📝 Best Practices

### Per gli Sviluppatori
1. **Non aggiungere filtri user_id** nelle query di lettura
2. **Tracciare sempre le azioni** (created_by, updated_by, generated_by)
3. **Loggare operazioni critiche** (eliminazioni, cambi status)
4. **Autenticare sempre** prima di operazioni sensibili

### Per gli Utenti
1. **Controllare il creatore** prima di modificare rilievi altrui
2. **Comunicare** se si lavora su rilievi di altri (buona prassi)
3. **Non eliminare** rilievi senza essere sicuri
4. **Archiviare invece di eliminare** quando possibile

## 🔮 Roadmap Futura

### Fase 1: Current (✅ Implementato)
- [x] Autenticazione base
- [x] Accesso condiviso a tutti i rilievi
- [x] Tracciamento creatore
- [x] Generazione PDF

### Fase 2: Miglioramenti (Prossimi sprint)
- [ ] Visualizzare nome utente creatore in dashboard
- [ ] Log audit delle modifiche (chi ha fatto cosa quando)
- [ ] Soft-delete per rilievi (recupero da cestino)
- [ ] Notifiche per modifiche a rilievi condivisi

### Fase 3: Features Avanzate (Futuro)
- [ ] Commenti e note su rilievi
- [ ] Storia versioni (version control)
- [ ] Workflow approvazioni (bozza → review → approvato)
- [ ] Export batch PDF

### Fase 4: Multi-Tenant (Se necessario)
- [ ] Sistema organizzazioni
- [ ] Isolamento dati tra aziende
- [ ] Amministrazione multi-livello
- [ ] Fatturazione per organizzazione

## 📞 Supporto

Per domande sull'architettura o proposte di modifica, contattare il team di sviluppo.

---

**Documento versione:** 1.0
**Data:** 2024-12-03
**Autore:** RMI Development Team
**Status:** ✅ Implementato e Attivo
