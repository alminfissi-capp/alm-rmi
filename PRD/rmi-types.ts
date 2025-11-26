// ============================================
// RMI - TypeScript Types & Constants
// Progetto: Rilevatore Misure Interattivo
// ============================================

// ============================================
// TIPOLOGIE SERRAMENTI (44 opzioni)
// ============================================
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
  "PORTA-FINESTRA 3A + FIX UP",
  "PORTA-FINESTRA 4A + FIX UP",
  "SCORREVOLE 2A",
  "SCORREVOLE 3A",
  "SCORREVOLE 4A",
  "SCORREVOLE 5A",
  "SCORREVOLE 6A",
  "ALZANTE SCORREVOLE 2A",
  "ALZANTE SCORREVOLE 3A",
  "ALZANTE SCORREVOLE 4A",
  "BILICO",
  "VASISTAS",
  "RIBALTA",
  "FISSO",
  "PORTA 1A",
  "PORTA 2A"
] as const;

export type TipologiaSerramento = typeof TIPOLOGIE[number];

// ============================================
// SERIE (18 opzioni)
// ============================================
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

export type SerieSerramento = typeof SERIE[number];

// ============================================
// FINITURE ACCESSORI
// ============================================
export const FINITURE = [
  "INOX",
  "NERO OPACO",
  "RAL 1013",
  "ORO",
  "RAL 9010",
  "BRONZO",
  "BIANCO",
  "GRIGIO ANTRACITE"
] as const;

export type FinituraAccessorio = typeof FINITURE[number];

// ============================================
// ALETTE
// ============================================
export const ALETTE = [
  "Z",
  "L",
  "SORMONTO",
  "T",
  "COMPLANARE"
] as const;

export type TipologiaAletta = typeof ALETTE[number];

// ============================================
// POSIZIONI
// ============================================
export const POSIZIONI = [
  "POSIZIONE 1",
  "POSIZIONE 2",
  "POSIZIONE 3",
  "POSIZIONE 4"
] as const;

export type Posizione = typeof POSIZIONI[number];

// ============================================
// STATUS RILIEVO
// ============================================
export const RILIEVO_STATUS = [
  "bozza",
  "completato",
  "inviato",
  "archiviato"
] as const;

export type RilievoStatus = typeof RILIEVO_STATUS[number];

// ============================================
// COLORS BRAND A.L.M.
// ============================================
export const BRAND_COLORS = {
  primary: '#0288d1',      // Blu A.L.M.
  secondary: '#7cb342',    // Verde A.L.M.
  danger: '#f44336',       // Rosso per elimina
  border: '#0288d1',       // Bordi blu
  background: '#f0f0f0',   // Sfondo grigio chiaro
  white: '#ffffff',
  black: '#000000',
  textGray: '#666666',
  inputBorder: '#000000',
} as const;

// ============================================
// DATABASE TYPES
// ============================================

/**
 * Tabella RILIEVI
 */
export interface Rilievo {
  id: string;
  user_id: string;
  
  // Dati cliente/commessa
  cliente: string | null;
  data: string | null; // ISO date string
  indirizzo: string | null;
  celltel: string | null;
  email: string | null;
  note_header: string | null;
  commessa: string | null;
  
  // Metadata
  created_at: string;
  updated_at: string;
  status: RilievoStatus;
}

/**
 * Tabella SERRAMENTI
 */
export interface Serramento {
  id: string;
  rilievo_id: string;
  page_number: number;
  
  // DATI TIPOLOGIA
  n_pezzi: number | null;
  tipologia: TipologiaSerramento | null;
  serie: SerieSerramento | null;
  nome: string | null;
  larghezza: number | null;
  altezza: number | null;
  descrizione: string | null;
  note: string | null;
  
  // MISURE SPECIALI ALETTE
  alette_dx: number | null;
  alette_testa: number | null;
  alette_sx: number | null;
  alette_base: number | null;
  
  // COLORI
  colore_interno: string | null;
  colore_esterno: string | null;
  colore_accessori: FinituraAccessorio | null;
  c_interno_anta: string | null;
  c_esterno_anta: string | null;
  
  // FERRAMENTA
  quantita_anta_ribalta: number | null;
  tipologia_cerniere: string | null;
  serrature: string | null;
  cilindro: string | null;
  
  // OPZIONI
  linea_estetica_telai: string | null;
  tipo_anta: string | null;
  linea_estetica_ante: string | null;
  riporto_centrale: string | null;
  
  // APERTURA
  lato_apertura: string | null;
  altezza_maniglia: number | null;
  tipologia_maniglia: string | null;
  
  // ALETTE & APERTURE
  alette_aperture: string | null;
  
  // TRAVERSO/MONTANTE
  tipo_profilo: string | null;
  riferimento_misure: string | null;
  misura_traverso: number | null;
  
  // ZANZARIERE
  zanzariere_tipologia: string | null;
  zanzariere_colore: string | null;
  zanzariere_chiusura: string | null;
  zanzariere_x: number | null;
  zanzariere_h: number | null;
  
  // RIEMPIMENTI
  vetri: string | null;
  pannelli: string | null;
  
  // ZOCCOLO & FASCIA
  zoccolo: string | null;
  fascia_h: number | null;
  fascia_tipo: string | null;
  
  // OSCURANTI
  oscuranti_tipo: string | null;
  oscuranti_l: number | null;
  oscuranti_h: number | null;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

/**
 * Tabella PDF_GENERATED
 */
export interface PDFGenerated {
  id: string;
  rilievo_id: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  generated_at: string;
  generated_by: string | null;
}

/**
 * Dashboard View
 */
export interface RilievoDashboard extends Rilievo {
  num_serramenti: number;
  last_serramento_update: string | null;
}

// ============================================
// FORM TYPES (per React Hook Form)
// ============================================

/**
 * Form data per Header (dati cliente/commessa)
 */
export interface RilievoFormData {
  cliente: string;
  data: string;
  indirizzo: string;
  celltel: string;
  email: string;
  note_header: string;
  commessa: string;
}

/**
 * Form data per Serramento (singola pagina P1, P2, ecc.)
 */
export interface SerramentoFormData {
  // DATI TIPOLOGIA
  n_pezzi: string;
  tipologia: TipologiaSerramento | '';
  serie: SerieSerramento | '';
  nome: string;
  larghezza: string;
  altezza: string;
  descrizione: string;
  note: string;
  
  // MISURE SPECIALI ALETTE
  alette_dx: string;
  alette_testa: string;
  alette_sx: string;
  alette_base: string;
  
  // COLORI
  colore_interno: string;
  colore_esterno: string;
  colore_accessori: FinituraAccessorio | '';
  c_interno_anta: string;
  c_esterno_anta: string;
  
  // FERRAMENTA
  quantita_anta_ribalta: string;
  tipologia_cerniere: string;
  serrature: string;
  cilindro: string;
  
  // OPZIONI
  linea_estetica_telai: string;
  tipo_anta: string;
  linea_estetica_ante: string;
  riporto_centrale: string;
  
  // APERTURA
  lato_apertura: string;
  altezza_maniglia: string;
  tipologia_maniglia: string;
  
  // ALETTE & APERTURE
  alette_aperture: string;
  
  // TRAVERSO/MONTANTE
  tipo_profilo: string;
  riferimento_misure: string;
  misura_traverso: string;
  
  // ZANZARIERE
  zanzariere_tipologia: string;
  zanzariere_colore: string;
  zanzariere_chiusura: string;
  zanzariere_x: string;
  zanzariere_h: string;
  
  // RIEMPIMENTI
  vetri: string;
  pannelli: string;
  
  // ZOCCOLO & FASCIA
  zoccolo: string;
  fascia_h: string;
  fascia_tipo: string;
  
  // OSCURANTI
  oscuranti_tipo: string;
  oscuranti_l: string;
  oscuranti_h: string;
}

/**
 * Form data completo (Header + Serramenti)
 */
export interface RMICompleteFormData {
  header: RilievoFormData;
  serramenti: Record<string, SerramentoFormData>; // Key: 'P1', 'P2', etc.
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Page name type (P1, P2, P3, etc.)
 */
export type PageName = `P${number}`;

/**
 * Empty form data template
 */
export const EMPTY_SERRAMENTO_FORM: SerramentoFormData = {
  n_pezzi: '',
  tipologia: '',
  serie: '',
  nome: '',
  larghezza: '',
  altezza: '',
  descrizione: '',
  note: '',
  alette_dx: '',
  alette_testa: '',
  alette_sx: '',
  alette_base: '',
  colore_interno: '',
  colore_esterno: '',
  colore_accessori: '',
  c_interno_anta: '',
  c_esterno_anta: '',
  quantita_anta_ribalta: '',
  tipologia_cerniere: '',
  serrature: '',
  cilindro: '',
  linea_estetica_telai: '',
  tipo_anta: '',
  linea_estetica_ante: '',
  riporto_centrale: '',
  lato_apertura: '',
  altezza_maniglia: '',
  tipologia_maniglia: '',
  alette_aperture: '',
  tipo_profilo: '',
  riferimento_misure: '',
  misura_traverso: '',
  zanzariere_tipologia: 'RULLO CASSONETTO 42',
  zanzariere_colore: '',
  zanzariere_chiusura: '',
  zanzariere_x: '',
  zanzariere_h: '',
  vetri: '',
  pannelli: '',
  zoccolo: '',
  fascia_h: '',
  fascia_tipo: '',
  oscuranti_tipo: '',
  oscuranti_l: '',
  oscuranti_h: '',
};

export const EMPTY_RILIEVO_FORM: RilievoFormData = {
  cliente: '',
  data: '',
  indirizzo: '',
  celltel: '',
  email: '',
  note_header: '',
  commessa: '',
};

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface PageManagerProps {
  pages: PageName[];
  currentPage: PageName;
  onPageChange: (page: PageName) => void;
  onPageAdd: () => void;
  onPageRemove: (page: PageName) => void;
}

export interface FormSectionProps {
  formData: SerramentoFormData;
  updateField: (field: keyof SerramentoFormData, value: string) => void;
}

export interface FieldRowProps {
  label: string;
  field: keyof SerramentoFormData;
  type?: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'email';
  unit?: string;
  options?: readonly string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

// ============================================
// PDF GENERATION TYPES
// ============================================

export interface PDFGenerationOptions {
  rilievoId: string;
  includeLogo: boolean;
  includeFooter: boolean;
  orientation: 'portrait' | 'landscape';
  format: 'a4' | 'letter';
}

export interface PDFGenerationResult {
  success: boolean;
  filePath?: string;
  fileSize?: number;
  error?: string;
}
