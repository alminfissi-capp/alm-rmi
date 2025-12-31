/**
 * LIBRERIA COMPLETA CONFIGURAZIONI SERRAMENTI
 * Stile PVC Windows Studio & FP Pro
 *
 * 35+ Configurazioni professionali pre-costruite
 * Tutte le misure in millimetri (mm)
 *
 * @author ALM Infissi - RMI Project
 * @version 2.0
 */

// ========================================
// CATEGORIA 1: FINESTRE 1 ANTA
// ========================================
export const FINESTRE_1_ANTA = {
  anta_1_fissa: {
    id: 'anta_1_fissa',
    nome: '1 Anta Fissa',
    descrizione: 'Vetrata fissa senza apertura',
    tipo: 'ante',
    categoria: 'finestre_1_anta',
    divisioni: { verticali: 1, orizzontali: 1 },
    apertura: 'fisso',
    lati: [
      { id: 'base', lunghezza: 800, label: 'Larghezza', minimo: 400, massimo: 1200 },
      { id: 'altezza', lunghezza: 1200, label: 'Altezza', minimo: 600, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z'
  },

  anta_1_battente_dx: {
    id: 'anta_1_battente_dx',
    nome: '1 Anta Battente DX',
    descrizione: 'Anta battente con apertura a destra',
    tipo: 'ante',
    categoria: 'finestre_1_anta',
    divisioni: { verticali: 1, orizzontali: 1 },
    apertura: 'battente',
    apertura_lato: 'destra',
    lati: [
      { id: 'base', lunghezza: 800, label: 'Larghezza', minimo: 400, massimo: 1200 },
      { id: 'altezza', lunghezza: 1200, label: 'Altezza', minimo: 600, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 35 L 50 65 M 45 50 L 55 50 M 55 45 L 60 50 L 55 55'
  },

  anta_1_battente_sx: {
    id: 'anta_1_battente_sx',
    nome: '1 Anta Battente SX',
    descrizione: 'Anta battente con apertura a sinistra',
    tipo: 'ante',
    categoria: 'finestre_1_anta',
    divisioni: { verticali: 1, orizzontali: 1 },
    apertura: 'battente',
    apertura_lato: 'sinistra',
    lati: [
      { id: 'base', lunghezza: 800, label: 'Larghezza', minimo: 400, massimo: 1200 },
      { id: 'altezza', lunghezza: 1200, label: 'Altezza', minimo: 600, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 35 L 50 65 M 45 50 L 55 50 M 45 45 L 40 50 L 45 55'
  },

  anta_1_ribalta: {
    id: 'anta_1_ribalta',
    nome: '1 Anta Ribalta',
    descrizione: 'Anta con apertura a ribalta (vasistas)',
    tipo: 'ante',
    categoria: 'finestre_1_anta',
    divisioni: { verticali: 1, orizzontali: 1 },
    apertura: 'ribalta',
    lati: [
      { id: 'base', lunghezza: 800, label: 'Larghezza', minimo: 400, massimo: 1200 },
      { id: 'altezza', lunghezza: 1200, label: 'Altezza', minimo: 600, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 30 50 L 70 50 M 50 45 L 50 55 M 45 25 L 50 20 L 55 25'
  }
};

// ========================================
// CATEGORIA 2: FINESTRE 2 ANTE
// ========================================
export const FINESTRE_2_ANTE = {
  ante_2_fisse: {
    id: 'ante_2_fisse',
    nome: '2 Ante Fisse',
    descrizione: 'Due vetrate fisse affiancate',
    tipo: 'ante',
    categoria: 'finestre_2_ante',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'fisso',
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
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85'
  },

  ante_2_battenti: {
    id: 'ante_2_battenti',
    nome: '2 Ante Battenti',
    descrizione: 'Due ante battenti che si aprono verso l\'interno',
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
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85 M 30 50 L 45 50 M 55 50 L 70 50 M 40 45 L 35 50 L 40 55 M 60 45 L 65 50 L 60 55'
  },

  fissa_battente_dx: {
    id: 'fissa_battente_dx',
    nome: 'Fissa + Battente DX',
    descrizione: 'Anta sinistra fissa, destra battente',
    tipo: 'ante',
    categoria: 'finestre_2_ante',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'mista',
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
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85 M 65 50 L 75 50 M 70 45 L 75 50 L 70 55'
  },

  fissa_battente_sx: {
    id: 'fissa_battente_sx',
    nome: 'Fissa + Battente SX',
    descrizione: 'Anta destra fissa, sinistra battente',
    tipo: 'ante',
    categoria: 'finestre_2_ante',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'mista',
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
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85 M 25 50 L 35 50 M 30 45 L 25 50 L 30 55'
  },

  ante_2_oscillo_battente: {
    id: 'ante_2_oscillo_battente',
    nome: '2 Ante Oscillo-Battente',
    descrizione: 'Due ante con apertura oscillante e battente',
    tipo: 'ante',
    categoria: 'finestre_2_ante',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'oscillo_battente',
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
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85 M 30 30 L 30 40 M 70 30 L 70 40 M 30 55 L 40 55 M 60 55 L 70 55'
  },

  ante_2_ribalta: {
    id: 'ante_2_ribalta',
    nome: '2 Ante Ribalta',
    descrizione: 'Due ante con apertura a ribalta',
    tipo: 'ante',
    categoria: 'finestre_2_ante',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'ribalta',
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
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85 M 30 50 L 45 50 M 55 50 L 70 50 M 35 25 L 40 20 L 45 25 M 55 25 L 60 20 L 65 25'
  }
};

// ========================================
// CATEGORIA 3: FINESTRE 3 ANTE
// ========================================
export const FINESTRE_3_ANTE = {
  ante_3_battenti: {
    id: 'ante_3_battenti',
    nome: '3 Ante Battenti',
    descrizione: 'Tre ante battenti simmetriche',
    tipo: 'ante',
    categoria: 'finestre_3_ante',
    divisioni: { verticali: 3, orizzontali: 1 },
    apertura: 'battente',
    lati: [
      { id: 'base', lunghezza: 1800, label: 'Larghezza', minimo: 1200, massimo: 2800 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 38 15 L 38 85 M 62 15 L 62 85 M 25 50 L 32 50 M 45 50 L 55 50 M 68 50 L 75 50'
  },

  fissa_battente_fissa: {
    id: 'fissa_battente_fissa',
    nome: 'Fissa + Batt. + Fissa',
    descrizione: 'Anta centrale battente, laterali fisse',
    tipo: 'ante',
    categoria: 'finestre_3_ante',
    divisioni: { verticali: 3, orizzontali: 1 },
    apertura: 'mista',
    lati: [
      { id: 'base', lunghezza: 1800, label: 'Larghezza', minimo: 1200, massimo: 2800 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 38 15 L 38 85 M 62 15 L 62 85 M 45 50 L 55 50 M 50 45 L 50 55'
  },

  battente_fissa_battente: {
    id: 'battente_fissa_battente',
    nome: 'Batt. + Fissa + Batt.',
    descrizione: 'Ante laterali battenti, centrale fissa',
    tipo: 'ante',
    categoria: 'finestre_3_ante',
    divisioni: { verticali: 3, orizzontali: 1 },
    apertura: 'mista',
    lati: [
      { id: 'base', lunghezza: 1800, label: 'Larghezza', minimo: 1200, massimo: 2800 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 38 15 L 38 85 M 62 15 L 62 85 M 22 50 L 30 50 M 70 50 L 78 50'
  },

  ante_3_fisse: {
    id: 'ante_3_fisse',
    nome: '3 Ante Fisse',
    descrizione: 'Tre vetrate fisse affiancate',
    tipo: 'ante',
    categoria: 'finestre_3_ante',
    divisioni: { verticali: 3, orizzontali: 1 },
    apertura: 'fisso',
    lati: [
      { id: 'base', lunghezza: 1800, label: 'Larghezza', minimo: 1200, massimo: 2800 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 38 15 L 38 85 M 62 15 L 62 85'
  }
};

// ========================================
// CATEGORIA 4: FINESTRE 4 ANTE
// ========================================
export const FINESTRE_4_ANTE = {
  ante_4_battenti: {
    id: 'ante_4_battenti',
    nome: '4 Ante Battenti',
    descrizione: 'Quattro ante battenti simmetriche',
    tipo: 'ante',
    categoria: 'finestre_4_ante',
    divisioni: { verticali: 4, orizzontali: 1 },
    apertura: 'battente',
    lati: [
      { id: 'base', lunghezza: 2000, label: 'Larghezza', minimo: 1600, massimo: 3200 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 32 15 L 32 85 M 50 15 L 50 85 M 68 15 L 68 85 M 23 50 L 28 50 M 40 50 L 45 50 M 55 50 L 60 50 M 72 50 L 77 50'
  },

  ante_4_fisse: {
    id: 'ante_4_fisse',
    nome: '4 Ante Fisse',
    descrizione: 'Quattro vetrate fisse affiancate',
    tipo: 'ante',
    categoria: 'finestre_4_ante',
    divisioni: { verticali: 4, orizzontali: 1 },
    apertura: 'fisso',
    lati: [
      { id: 'base', lunghezza: 2000, label: 'Larghezza', minimo: 1600, massimo: 3200 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 32 15 L 32 85 M 50 15 L 50 85 M 68 15 L 68 85'
  },

  ante_2x2_griglia: {
    id: 'ante_2x2_griglia',
    nome: '2x2 Griglia (4 Ante)',
    descrizione: 'Quattro ante disposte a griglia 2x2',
    tipo: 'ante',
    categoria: 'finestre_4_ante',
    divisioni: { verticali: 2, orizzontali: 2 },
    apertura: 'battente',
    traversi: [
      { posizione: 0.5, tipo: 'orizzontale', fisso: true }
    ],
    lati: [
      { id: 'base', lunghezza: 1400, label: 'Larghezza', minimo: 1000, massimo: 2000 },
      { id: 'altezza', lunghezza: 1600, label: 'Altezza', minimo: 1200, massimo: 2400 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85 M 15 50 L 85 50 M 30 32 L 35 32 M 65 32 L 70 32 M 30 68 L 35 68 M 65 68 L 70 68'
  }
};

// ========================================
// CATEGORIA 5: PORTE-FINESTRE
// ========================================
export const PORTE_FINESTRE = {
  porta_finestra_1_anta: {
    id: 'porta_finestra_1_anta',
    nome: 'Porta-Finestra 1 Anta',
    descrizione: 'Porta-finestra singola battente',
    tipo: 'ante',
    categoria: 'porte_finestre',
    divisioni: { verticali: 1, orizzontali: 1 },
    apertura: 'battente',
    lati: [
      { id: 'base', lunghezza: 900, label: 'Larghezza', minimo: 700, massimo: 1200 },
      { id: 'altezza', lunghezza: 2100, label: 'Altezza', minimo: 1800, massimo: 2400 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 10 L 85 10 L 85 90 L 15 90 Z M 50 45 L 50 60 M 45 52 L 55 52'
  },

  porta_finestra_2_ante: {
    id: 'porta_finestra_2_ante',
    nome: 'Porta-Finestra 2 Ante',
    descrizione: 'Porta-finestra a due ante battenti',
    tipo: 'ante',
    categoria: 'porte_finestre',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'battente',
    lati: [
      { id: 'base', lunghezza: 1600, label: 'Larghezza', minimo: 1200, massimo: 2400 },
      { id: 'altezza', lunghezza: 2100, label: 'Altezza', minimo: 1800, massimo: 2400 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 10 L 85 10 L 85 90 L 15 90 Z M 50 10 L 50 90 M 35 50 L 45 50 M 55 50 L 65 50'
  },

  porta_finestra_sopraluce: {
    id: 'porta_finestra_sopraluce',
    nome: 'Porta-Finestra + Sopraluce',
    descrizione: 'Porta-finestra con sopraluce fisso',
    tipo: 'ante',
    categoria: 'porte_finestre',
    divisioni: { verticali: 1, orizzontali: 2 },
    apertura: 'battente',
    traversi: [
      { posizione: 0.25, tipo: 'orizzontale', fisso: true }
    ],
    lati: [
      { id: 'base', lunghezza: 900, label: 'Larghezza', minimo: 700, massimo: 1200 },
      { id: 'altezza', lunghezza: 2400, label: 'Altezza', minimo: 2000, massimo: 2800 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 10 L 85 10 L 85 90 L 15 90 Z M 15 28 L 85 28 M 50 55 L 50 70 M 45 62 L 55 62'
  },

  porta_finestra_fissa_battente: {
    id: 'porta_finestra_fissa_battente',
    nome: 'Porta-Fin. Fissa+Batt.',
    descrizione: 'Porta-finestra con laterale fisso',
    tipo: 'ante',
    categoria: 'porte_finestre',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'mista',
    lati: [
      { id: 'base', lunghezza: 1400, label: 'Larghezza', minimo: 1000, massimo: 2000 },
      { id: 'altezza', lunghezza: 2100, label: 'Altezza', minimo: 1800, massimo: 2400 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 10 L 85 10 L 85 90 L 15 90 Z M 55 10 L 55 90 M 35 50 L 48 50 M 42 45 L 38 50 L 42 55'
  }
};

// ========================================
// CATEGORIA 6: SCORREVOLI
// ========================================
export const SCORREVOLI = {
  scorrevole_2_ante: {
    id: 'scorrevole_2_ante',
    nome: 'Scorrevole 2 Ante',
    descrizione: 'Due ante scorrevoli sovrapposte',
    tipo: 'ante',
    categoria: 'scorrevoli',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'scorrevole',
    lati: [
      { id: 'base', lunghezza: 1400, label: 'Larghezza', minimo: 1000, massimo: 3000 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85 M 55 20 L 55 80 M 35 50 L 50 50 M 55 50 L 70 50 M 42 45 L 47 50 L 42 55 M 63 45 L 68 50 L 63 55'
  },

  scorrevole_3_ante: {
    id: 'scorrevole_3_ante',
    nome: 'Scorrevole 3 Ante',
    descrizione: 'Tre ante scorrevoli sovrapposte',
    tipo: 'ante',
    categoria: 'scorrevoli',
    divisioni: { verticali: 3, orizzontali: 1 },
    apertura: 'scorrevole',
    lati: [
      { id: 'base', lunghezza: 2100, label: 'Larghezza', minimo: 1500, massimo: 4000 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 38 15 L 38 85 M 62 15 L 62 85 M 42 20 L 42 80 M 66 20 L 66 80 M 25 50 L 35 50 M 45 50 L 58 50 M 68 50 L 78 50'
  },

  alzante_scorrevole: {
    id: 'alzante_scorrevole',
    nome: 'Alzante Scorrevole',
    descrizione: 'Sistema alzante scorrevole premium',
    tipo: 'ante',
    categoria: 'scorrevoli',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'alzante_scorrevole',
    lati: [
      { id: 'base', lunghezza: 2400, label: 'Larghezza', minimo: 1600, massimo: 6000 },
      { id: 'altezza', lunghezza: 2200, label: 'Altezza', minimo: 1800, massimo: 3000 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85 M 54 18 L 54 82 M 40 50 L 52 50 M 56 50 L 68 50 M 45 45 L 50 50 L 45 55 M 61 45 L 66 50 L 61 55 M 50 25 L 45 30 M 54 25 L 59 30'
  },

  scorrevole_complanare: {
    id: 'scorrevole_complanare',
    nome: 'Scorrevole Complanare',
    descrizione: 'Sistema scorrevole a scomparsa complanare',
    tipo: 'ante',
    categoria: 'scorrevoli',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'scorrevole_complanare',
    lati: [
      { id: 'base', lunghezza: 1600, label: 'Larghezza', minimo: 1200, massimo: 3600 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85 M 35 50 L 48 50 M 52 50 L 65 50 M 40 45 L 45 50 L 40 55 M 57 45 L 62 50 L 57 55'
  }
};

// ========================================
// CATEGORIA 7: CONFIGURAZIONI CON SOPRALUCE
// ========================================
export const CON_SOPRALUCE = {
  ante_2_sopraluce: {
    id: 'ante_2_sopraluce',
    nome: '2 Ante + Sopraluce',
    descrizione: 'Due ante battenti con sopraluce fisso superiore',
    tipo: 'ante',
    categoria: 'con_sopraluce',
    divisioni: { verticali: 2, orizzontali: 2 },
    apertura: 'battente',
    traversi: [
      { posizione: 0.3, tipo: 'orizzontale', fisso: true }
    ],
    lati: [
      { id: 'base', lunghezza: 1200, label: 'Larghezza', minimo: 800, massimo: 2000 },
      { id: 'altezza', lunghezza: 1800, label: 'Altezza', minimo: 1200, massimo: 2400 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 15 33 L 85 33 M 50 33 L 50 85 M 30 59 L 45 59 M 55 59 L 70 59'
  },

  ante_3_sopraluce: {
    id: 'ante_3_sopraluce',
    nome: '3 Ante + Sopraluce',
    descrizione: 'Tre ante battenti con sopraluce fisso',
    tipo: 'ante',
    categoria: 'con_sopraluce',
    divisioni: { verticali: 3, orizzontali: 2 },
    apertura: 'battente',
    traversi: [
      { posizione: 0.3, tipo: 'orizzontale', fisso: true }
    ],
    lati: [
      { id: 'base', lunghezza: 1800, label: 'Larghezza', minimo: 1200, massimo: 2800 },
      { id: 'altezza', lunghezza: 1800, label: 'Altezza', minimo: 1200, massimo: 2400 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 15 33 L 85 33 M 38 33 L 38 85 M 62 33 L 62 85 M 25 59 L 32 59 M 45 59 L 55 59 M 68 59 L 75 59'
  },

  ante_2_sopraluce_ribalta: {
    id: 'ante_2_sopraluce_ribalta',
    nome: '2 Ante + Sopraluce Ribalta',
    descrizione: 'Due ante battenti con sopraluce a ribalta',
    tipo: 'ante',
    categoria: 'con_sopraluce',
    divisioni: { verticali: 2, orizzontali: 2 },
    apertura: 'mista',
    traversi: [
      { posizione: 0.3, tipo: 'orizzontale', fisso: false }
    ],
    lati: [
      { id: 'base', lunghezza: 1200, label: 'Larghezza', minimo: 800, massimo: 2000 },
      { id: 'altezza', lunghezza: 1800, label: 'Altezza', minimo: 1200, massimo: 2400 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 15 33 L 85 33 M 50 33 L 50 85 M 40 24 L 45 20 L 50 24 M 55 24 L 60 20 L 65 24 M 30 59 L 45 59 M 55 59 L 70 59'
  },

  fissa_battente_sopraluce: {
    id: 'fissa_battente_sopraluce',
    nome: 'Fissa+Batt. + Sopraluce',
    descrizione: 'Fissa e battente con sopraluce',
    tipo: 'ante',
    categoria: 'con_sopraluce',
    divisioni: { verticali: 2, orizzontali: 2 },
    apertura: 'mista',
    traversi: [
      { posizione: 0.3, tipo: 'orizzontale', fisso: true }
    ],
    lati: [
      { id: 'base', lunghezza: 1200, label: 'Larghezza', minimo: 800, massimo: 2000 },
      { id: 'altezza', lunghezza: 1800, label: 'Altezza', minimo: 1200, massimo: 2400 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 15 33 L 85 33 M 50 33 L 50 85 M 65 59 L 75 59 M 70 54 L 75 59 L 70 64'
  }
};

// ========================================
// CATEGORIA 8: CONFIGURAZIONI ASIMMETRICHE
// ========================================
export const ASIMMETRICHE = {
  anta_larga_stretta: {
    id: 'anta_larga_stretta',
    nome: 'Anta Larga + Stretta',
    descrizione: 'Due ante asimmetriche (70/30)',
    tipo: 'ante',
    categoria: 'asimmetriche',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'battente',
    asimmetrica: true,
    proporzioni: [0.7, 0.3],
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
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 58 15 L 58 85 M 35 50 L 50 50 M 68 50 L 75 50'
  },

  larga_stretta_fissa: {
    id: 'larga_stretta_fissa',
    nome: 'Larga Batt. + Stretta Fissa',
    descrizione: 'Anta larga battente + laterale stretto fisso',
    tipo: 'ante',
    categoria: 'asimmetriche',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'mista',
    asimmetrica: true,
    proporzioni: [0.75, 0.25],
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
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 62 15 L 62 85 M 35 50 L 52 50 M 48 45 L 43 50 L 48 55'
  },

  tre_ante_asimmetriche: {
    id: 'tre_ante_asimmetriche',
    nome: '3 Ante Asimmetriche',
    descrizione: 'Tre ante con proporzioni diverse',
    tipo: 'ante',
    categoria: 'asimmetriche',
    divisioni: { verticali: 3, orizzontali: 1 },
    apertura: 'battente',
    asimmetrica: true,
    proporzioni: [0.25, 0.5, 0.25],
    lati: [
      { id: 'base', lunghezza: 1800, label: 'Larghezza', minimo: 1200, massimo: 2800 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 32 15 L 32 85 M 68 15 L 68 85 M 23 50 L 28 50 M 45 50 L 55 50 M 72 50 L 77 50'
  }
};

// ========================================
// CATEGORIA 9: CONFIGURAZIONI SPECIALI
// ========================================
export const SPECIALI = {
  angolare_dx: {
    id: 'angolare_dx',
    nome: 'Angolare Destro 90°',
    descrizione: 'Configurazione angolare a 90° verso destra',
    tipo: 'ante',
    categoria: 'speciali',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'battente',
    angolare: true,
    angolo_tipo: 'destro',
    lati: [
      { id: 'base_1', lunghezza: 1200, label: 'Larghezza Lato 1', minimo: 600, massimo: 2000 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 },
      { id: 'base_2', lunghezza: 1200, label: 'Larghezza Lato 2', minimo: 600, massimo: 2000 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Centrale', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 50 L 50 50 L 50 85 L 15 85 Z M 50 15 L 85 15 L 85 50 L 50 50 Z M 50 50 L 50 50'
  },

  angolare_sx: {
    id: 'angolare_sx',
    nome: 'Angolare Sinistro 90°',
    descrizione: 'Configurazione angolare a 90° verso sinistra',
    tipo: 'ante',
    categoria: 'speciali',
    divisioni: { verticali: 2, orizzontali: 1 },
    apertura: 'battente',
    angolare: true,
    angolo_tipo: 'sinistro',
    lati: [
      { id: 'base_1', lunghezza: 1200, label: 'Larghezza Lato 1', minimo: 600, massimo: 2000 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 },
      { id: 'base_2', lunghezza: 1200, label: 'Larghezza Lato 2', minimo: 600, massimo: 2000 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Centrale', minimo: 90, massimo: 90 }
    ],
    icon: 'M 15 15 L 50 15 L 50 50 L 15 50 Z M 50 50 L 85 50 L 85 85 L 50 85 Z M 50 50 L 50 50'
  },

  bow_window: {
    id: 'bow_window',
    nome: 'Bow Window (5 Elementi)',
    descrizione: 'Finestra panoramica a 5 elementi angolati',
    tipo: 'ante',
    categoria: 'speciali',
    divisioni: { verticali: 5, orizzontali: 1 },
    apertura: 'mista',
    panoramica: true,
    lati: [
      { id: 'base', lunghezza: 3000, label: 'Larghezza Totale', minimo: 2000, massimo: 5000 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],
    angoli: [
      { id: 'ang1', gradi: 135, label: 'Angolo 1', minimo: 120, massimo: 150 },
      { id: 'ang2', gradi: 135, label: 'Angolo 2', minimo: 120, massimo: 150 },
      { id: 'ang3', gradi: 90, label: 'Angolo Centrale', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 135, label: 'Angolo 4', minimo: 120, massimo: 150 },
      { id: 'ang5', gradi: 135, label: 'Angolo 5', minimo: 120, massimo: 150 }
    ],
    icon: 'M 20 50 L 30 35 L 50 30 L 70 35 L 80 50 L 80 80 L 20 80 Z M 35 30 L 35 80 M 50 28 L 50 80 M 65 30 L 65 80'
  },

  vetrata_continua: {
    id: 'vetrata_continua',
    nome: 'Vetrata Continua',
    descrizione: 'Grande vetrata fissa senza divisioni',
    tipo: 'ante',
    categoria: 'speciali',
    divisioni: { verticali: 1, orizzontali: 1 },
    apertura: 'fisso',
    lati: [
      { id: 'base', lunghezza: 3000, label: 'Larghezza', minimo: 1000, massimo: 6000 },
      { id: 'altezza', lunghezza: 2800, label: 'Altezza', minimo: 1000, massimo: 3500 }
    ],
    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],
    icon: 'M 10 10 L 90 10 L 90 90 L 10 90 Z'
  }
};

// ========================================
// AGGREGAZIONE COMPLETA
// ========================================
export const ANTE_CONFIGS_COMPLETE = {
  ...FINESTRE_1_ANTA,
  ...FINESTRE_2_ANTE,
  ...FINESTRE_3_ANTE,
  ...FINESTRE_4_ANTE,
  ...PORTE_FINESTRE,
  ...SCORREVOLI,
  ...CON_SOPRALUCE,
  ...ASIMMETRICHE,
  ...SPECIALI
};

// ========================================
// CATEGORIE PER FILTRI UI
// ========================================
export const CATEGORIE_FRAMES = [
  { id: 'finestre_1_anta', nome: '1 Anta', icon: '🪟', count: Object.keys(FINESTRE_1_ANTA).length },
  { id: 'finestre_2_ante', nome: '2 Ante', icon: '🪟🪟', count: Object.keys(FINESTRE_2_ANTE).length },
  { id: 'finestre_3_ante', nome: '3 Ante', icon: '🪟🪟🪟', count: Object.keys(FINESTRE_3_ANTE).length },
  { id: 'finestre_4_ante', nome: '4 Ante', icon: '🪟🪟🪟🪟', count: Object.keys(FINESTRE_4_ANTE).length },
  { id: 'porte_finestre', nome: 'Porte-Finestre', icon: '🚪', count: Object.keys(PORTE_FINESTRE).length },
  { id: 'scorrevoli', nome: 'Scorrevoli', icon: '↔️', count: Object.keys(SCORREVOLI).length },
  { id: 'con_sopraluce', nome: 'Con Sopraluce', icon: '🔼', count: Object.keys(CON_SOPRALUCE).length },
  { id: 'asimmetriche', nome: 'Asimmetriche', icon: '⚖️', count: Object.keys(ASIMMETRICHE).length },
  { id: 'speciali', nome: 'Speciali', icon: '✨', count: Object.keys(SPECIALI).length }
];

// ========================================
// FUNZIONI UTILITY
// ========================================

/**
 * Ottiene la configurazione frame per ID
 */
export function getFrameConfig(frameId) {
  return ANTE_CONFIGS_COMPLETE[frameId] || null;
}

/**
 * Ottiene tutte le configurazioni
 */
export function getAllFrameConfigs() {
  return Object.values(ANTE_CONFIGS_COMPLETE);
}

/**
 * Filtra configurazioni per categoria
 */
export function getFramesByCategory(categoria) {
  return Object.values(ANTE_CONFIGS_COMPLETE).filter(
    config => config.categoria === categoria
  );
}

/**
 * Filtra configurazioni per tipo di apertura
 */
export function getFramesByApertura(apertura) {
  return Object.values(ANTE_CONFIGS_COMPLETE).filter(
    config => config.apertura === apertura
  );
}

/**
 * Cerca configurazioni per nome/descrizione
 */
export function searchFrames(query) {
  const lowerQuery = query.toLowerCase();
  return Object.values(ANTE_CONFIGS_COMPLETE).filter(config =>
    config.nome.toLowerCase().includes(lowerQuery) ||
    config.descrizione.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Ottiene conteggio totale configurazioni
 */
export function getTotalFramesCount() {
  return Object.keys(ANTE_CONFIGS_COMPLETE).length;
}

/**
 * Clona una configurazione per modifiche
 */
export function cloneFrameConfig(frameId) {
  const config = getFrameConfig(frameId);
  if (!config) return null;

  return {
    ...config,
    lati: config.lati.map(lato => ({ ...lato })),
    angoli: config.angoli.map(angolo => ({ ...angolo })),
    ...(config.traversi && { traversi: config.traversi.map(t => ({ ...t })) })
  };
}

/**
 * Valida che una configurazione sia completa
 */
export function validateFrameConfig(config) {
  const errors = [];

  if (!config.id) errors.push('ID mancante');
  if (!config.nome) errors.push('Nome mancante');
  if (!config.categoria) errors.push('Categoria mancante');
  if (!config.lati || config.lati.length === 0) errors.push('Lati mancanti');
  if (!config.angoli || config.angoli.length === 0) errors.push('Angoli mancanti');

  return {
    valid: errors.length === 0,
    errors
  };
}

// ========================================
// STATISTICHE LIBRERIA
// ========================================
export const LIBRARY_STATS = {
  totalFrames: getTotalFramesCount(),
  categoriesCount: CATEGORIE_FRAMES.length,
  version: '2.0',
  lastUpdate: '2025-12-22'
};

console.log(`
╔════════════════════════════════════════════════════════╗
║  LIBRERIA FRAME ALM INFISSI - CARICATA CON SUCCESSO   ║
╠════════════════════════════════════════════════════════╣
║  Total Configurazioni: ${LIBRARY_STATS.totalFrames} frames                       ║
║  Categorie: ${LIBRARY_STATS.categoriesCount} categorie                            ║
║  Versione: ${LIBRARY_STATS.version}                                       ║
╚════════════════════════════════════════════════════════╝
`);
