// ============================================
// RMI - Constants
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

// ============================================
// POSIZIONI
// ============================================
export const POSIZIONI = [
  "POSIZIONE 1",
  "POSIZIONE 2",
  "POSIZIONE 3",
  "POSIZIONE 4"
] as const;

// ============================================
// STATUS RILIEVO
// ============================================
export const RILIEVO_STATUS = [
  "bozza",
  "completato",
  "inviato",
  "archiviato"
] as const;

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
