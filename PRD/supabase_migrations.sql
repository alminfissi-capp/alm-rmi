-- ============================================
-- RMI - Supabase Database Migrations
-- Progetto: Rilevatore Misure Interattivo
-- Cliente: A.L.M. Infissi
-- ============================================

-- ============================================
-- 1. TABELLA RILIEVI (Progetti/Commesse)
-- ============================================
CREATE TABLE rilievi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Dati progetto/commessa
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
  
  -- Status workflow
  status TEXT DEFAULT 'bozza' CHECK (status IN ('bozza', 'completato', 'inviato', 'archiviato'))
);

-- Indici per performance
CREATE INDEX idx_rilievi_user_id ON rilievi(user_id);
CREATE INDEX idx_rilievi_created_at ON rilievi(created_at DESC);
CREATE INDEX idx_rilievi_status ON rilievi(status);
CREATE INDEX idx_rilievi_cliente ON rilievi(cliente);
CREATE INDEX idx_rilievi_commessa ON rilievi(commessa);

-- Trigger per updated_at automatico
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rilievi_updated_at BEFORE UPDATE ON rilievi
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. TABELLA SERRAMENTI (Pagine P1, P2, P3...)
-- ============================================
CREATE TABLE serramenti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rilievo_id UUID REFERENCES rilievi(id) ON DELETE CASCADE NOT NULL,
  
  -- Numero pagina (P1, P2, P3...)
  page_number INTEGER NOT NULL,
  
  -- =====================================
  -- DATI TIPOLOGIA
  -- =====================================
  n_pezzi INTEGER,
  tipologia TEXT,
  serie TEXT,
  nome TEXT,
  larghezza NUMERIC(10, 2),
  altezza NUMERIC(10, 2),
  descrizione TEXT,
  note TEXT,
  
  -- =====================================
  -- MISURE SPECIALI ALETTE
  -- =====================================
  alette_dx NUMERIC(10, 2),
  alette_testa NUMERIC(10, 2),
  alette_sx NUMERIC(10, 2),
  alette_base NUMERIC(10, 2),
  
  -- =====================================
  -- COLORI
  -- =====================================
  colore_interno TEXT,
  colore_esterno TEXT,
  colore_accessori TEXT,
  c_interno_anta TEXT,
  c_esterno_anta TEXT,
  
  -- =====================================
  -- FERRAMENTA
  -- =====================================
  quantita_anta_ribalta INTEGER,
  tipologia_cerniere TEXT,
  serrature TEXT,
  cilindro TEXT,
  
  -- =====================================
  -- OPZIONI
  -- =====================================
  linea_estetica_telai TEXT,
  tipo_anta TEXT,
  linea_estetica_ante TEXT,
  riporto_centrale TEXT,
  
  -- =====================================
  -- APERTURA
  -- =====================================
  lato_apertura TEXT,
  altezza_maniglia NUMERIC(10, 2),
  tipologia_maniglia TEXT,
  
  -- =====================================
  -- ALETTE & APERTURE
  -- =====================================
  alette_aperture TEXT,
  
  -- =====================================
  -- TRAVERSO/MONTANTE
  -- =====================================
  tipo_profilo TEXT,
  riferimento_misure TEXT,
  misura_traverso NUMERIC(10, 2),
  
  -- =====================================
  -- ZANZARIERE
  -- =====================================
  zanzariere_tipologia TEXT DEFAULT 'RULLO CASSONETTO 42',
  zanzariere_colore TEXT,
  zanzariere_chiusura TEXT,
  zanzariere_x NUMERIC(10, 2),
  zanzariere_h NUMERIC(10, 2),
  
  -- =====================================
  -- RIEMPIMENTI
  -- =====================================
  vetri TEXT,
  pannelli TEXT,
  
  -- =====================================
  -- ZOCCOLO & FASCIA
  -- =====================================
  zoccolo TEXT,
  fascia_h NUMERIC(10, 2),
  fascia_tipo TEXT,
  
  -- =====================================
  -- OSCURANTI
  -- =====================================
  oscuranti_tipo TEXT,
  oscuranti_l NUMERIC(10, 2),
  oscuranti_h NUMERIC(10, 2),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: unique page number per rilievo
  UNIQUE(rilievo_id, page_number)
);

-- Indici per performance
CREATE INDEX idx_serramenti_rilievo_id ON serramenti(rilievo_id);
CREATE INDEX idx_serramenti_page_number ON serramenti(page_number);

-- Trigger per updated_at automatico
CREATE TRIGGER update_serramenti_updated_at BEFORE UPDATE ON serramenti
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. TABELLA PDF GENERATI
-- ============================================
CREATE TABLE pdf_generated (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rilievo_id UUID REFERENCES rilievi(id) ON DELETE CASCADE NOT NULL,
  
  -- Storage info
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  
  -- Metadata
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by UUID REFERENCES auth.users(id)
);

-- Indici
CREATE INDEX idx_pdf_rilievo_id ON pdf_generated(rilievo_id);
CREATE INDEX idx_pdf_generated_at ON pdf_generated(generated_at DESC);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Abilita RLS su tutte le tabelle
ALTER TABLE rilievi ENABLE ROW LEVEL SECURITY;
ALTER TABLE serramenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_generated ENABLE ROW LEVEL SECURITY;

-- =====================================
-- POLICIES PER RILIEVI
-- =====================================

-- SELECT: Gli utenti possono vedere solo i propri rilievi
CREATE POLICY "Users can view own rilievi"
  ON rilievi FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Gli utenti possono creare solo rilievi per se stessi
CREATE POLICY "Users can insert own rilievi"
  ON rilievi FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Gli utenti possono aggiornare solo i propri rilievi
CREATE POLICY "Users can update own rilievi"
  ON rilievi FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE: Gli utenti possono eliminare solo i propri rilievi
CREATE POLICY "Users can delete own rilievi"
  ON rilievi FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================
-- POLICIES PER SERRAMENTI
-- =====================================

-- SELECT: Gli utenti possono vedere serramenti dei propri rilievi
CREATE POLICY "Users can view own serramenti"
  ON serramenti FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rilievi
      WHERE rilievi.id = serramenti.rilievo_id
      AND rilievi.user_id = auth.uid()
    )
  );

-- INSERT: Gli utenti possono inserire serramenti nei propri rilievi
CREATE POLICY "Users can insert own serramenti"
  ON serramenti FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rilievi
      WHERE rilievi.id = serramenti.rilievo_id
      AND rilievi.user_id = auth.uid()
    )
  );

-- UPDATE: Gli utenti possono aggiornare serramenti dei propri rilievi
CREATE POLICY "Users can update own serramenti"
  ON serramenti FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM rilievi
      WHERE rilievi.id = serramenti.rilievo_id
      AND rilievi.user_id = auth.uid()
    )
  );

-- DELETE: Gli utenti possono eliminare serramenti dei propri rilievi
CREATE POLICY "Users can delete own serramenti"
  ON serramenti FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM rilievi
      WHERE rilievi.id = serramenti.rilievo_id
      AND rilievi.user_id = auth.uid()
    )
  );

-- =====================================
-- POLICIES PER PDF
-- =====================================

-- SELECT: Gli utenti possono vedere PDF dei propri rilievi
CREATE POLICY "Users can view own pdf"
  ON pdf_generated FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rilievi
      WHERE rilievi.id = pdf_generated.rilievo_id
      AND rilievi.user_id = auth.uid()
    )
  );

-- INSERT: Gli utenti possono generare PDF per i propri rilievi
CREATE POLICY "Users can insert own pdf"
  ON pdf_generated FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rilievi
      WHERE rilievi.id = pdf_generated.rilievo_id
      AND rilievi.user_id = auth.uid()
    )
  );

-- DELETE: Gli utenti possono eliminare PDF dei propri rilievi
CREATE POLICY "Users can delete own pdf"
  ON pdf_generated FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM rilievi
      WHERE rilievi.id = pdf_generated.rilievo_id
      AND rilievi.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. STORAGE BUCKET PER PDF
-- ============================================

-- Crea bucket per PDF (da eseguire tramite Supabase Dashboard o API)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('rilievi-pdf', 'rilievi-pdf', false);

-- Policy per storage bucket
-- CREATE POLICY "Users can upload own PDF"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'rilievi-pdf' AND
--   auth.uid()::text = (storage.foldername(name))[1]
-- );

-- CREATE POLICY "Users can view own PDF"
-- ON storage.objects FOR SELECT
-- USING (
--   bucket_id = 'rilievi-pdf' AND
--   auth.uid()::text = (storage.foldername(name))[1]
-- );

-- ============================================
-- 6. FUNZIONI UTILITY
-- ============================================

-- Funzione per contare serramenti per rilievo
CREATE OR REPLACE FUNCTION count_serramenti(rilievo_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM serramenti
  WHERE rilievo_id = rilievo_uuid;
$$ LANGUAGE SQL STABLE;

-- Funzione per ottenere l'ultimo numero pagina
CREATE OR REPLACE FUNCTION get_next_page_number(rilievo_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(MAX(page_number), 0) + 1
  FROM serramenti
  WHERE rilievo_id = rilievo_uuid;
$$ LANGUAGE SQL STABLE;

-- ============================================
-- 7. VIEWS UTILI
-- ============================================

-- View per dashboard: rilievi con conteggio serramenti
CREATE OR REPLACE VIEW rilievi_dashboard AS
SELECT 
  r.id,
  r.user_id,
  r.cliente,
  r.data,
  r.indirizzo,
  r.celltel,
  r.email,
  r.commessa,
  r.status,
  r.created_at,
  r.updated_at,
  COUNT(s.id) as num_serramenti,
  MAX(s.updated_at) as last_serramento_update
FROM rilievi r
LEFT JOIN serramenti s ON r.id = s.rilievo_id
GROUP BY r.id;

-- ============================================
-- FINE MIGRATIONS
-- ============================================

-- Verifica tabelle create
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as num_columns
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_name IN ('rilievi', 'serramenti', 'pdf_generated')
ORDER BY table_name;
