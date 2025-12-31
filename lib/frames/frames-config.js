/**
 * Database configurazioni serramento disponibili per il configuratore
 * Tutte le misure sono in millimetri (mm)
 *
 * LEGACY: FRAMES_DATABASE - forme geometriche pure (triangolo, rombo, etc.)
 * NUOVO: ANTE_CONFIGS - configurazioni ante professionali (1 anta, 2 ante, etc.)
 *
 * v2.0 - Libreria completa con 36+ configurazioni stile PVC Windows Studio
 */

// Importa la libreria completa
import {
  ANTE_CONFIGS_COMPLETE,
  CATEGORIE_FRAMES,
  getFrameConfig as getFrameConfigComplete,
  getAllFrameConfigs,
  getFramesByCategory,
  getFramesByApertura,
  searchFrames
} from './frames-config-complete.js';

// Esporta la libreria completa come ANTE_CONFIGS
export const ANTE_CONFIGS = ANTE_CONFIGS_COMPLETE;

// Esporta le categorie per UI
export { CATEGORIE_FRAMES };

// ========================================
// CONFIGURAZIONI ANTE LEGACY (per compatibilità)
// ========================================
const ANTE_CONFIGS_LEGACY = {
  anta_singola: {
    id: 'anta_singola',
    nome: '1 Anta',
    descrizione: 'Finestra ad anta singola battente',
    tipo: 'ante',
    categoria: 'finestre',

    // Suddivisioni
    divisioni: {
      verticali: 1,  // 1 anta
      orizzontali: 1 // Nessun traverso
    },

    // Tipo apertura
    apertura: 'battente',

    // Template L×H (dimensioni totali telaio)
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

    // SVG icon per preview
    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 40 L 50 60 M 45 50 L 55 50'
  },

  ante_2: {
    id: 'ante_2',
    nome: '2 Ante',
    descrizione: 'Finestra a due ante battenti simmetriche',
    tipo: 'ante',
    categoria: 'finestre',

    divisioni: {
      verticali: 2,  // 2 ante affiancate
      orizzontali: 1
    },

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

    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85 M 30 50 L 45 50 M 55 50 L 70 50'
  },

  ante_3: {
    id: 'ante_3',
    nome: '3 Ante',
    descrizione: 'Finestra a tre ante battenti',
    tipo: 'ante',
    categoria: 'finestre',

    divisioni: {
      verticali: 3,
      orizzontali: 1
    },

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

  ante_2_sopraluce: {
    id: 'ante_2_sopraluce',
    nome: '2 Ante + Sopraluce',
    descrizione: 'Due ante con traverso fisso superiore',
    tipo: 'ante',
    categoria: 'finestre',

    divisioni: {
      verticali: 2,
      orizzontali: 2  // Traverso divide in 2 parti orizzontali
    },

    traversi: [
      { posizione: 0.3, tipo: 'orizzontale', fisso: true } // Traverso al 30% dall'alto
    ],

    apertura: 'battente',

    lati: [
      { id: 'base', lunghezza: 1200, label: 'Larghezza', minimo: 800, massimo: 2000 },
      { id: 'altezza', lunghezza: 1600, label: 'Altezza', minimo: 1000, massimo: 2400 }
    ],

    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],

    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 15 35 L 85 35 M 50 35 L 50 85 M 30 60 L 45 60 M 55 60 L 70 60'
  },

  porta_finestra: {
    id: 'porta_finestra',
    nome: 'Porta-Finestra',
    descrizione: 'Porta-finestra con pannello superiore fisso',
    tipo: 'ante',
    categoria: 'porte',

    divisioni: {
      verticali: 1,
      orizzontali: 2
    },

    traversi: [
      { posizione: 0.2, tipo: 'orizzontale', fisso: true }
    ],

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

    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 15 30 L 85 30 M 50 50 L 50 70 M 45 60 L 55 60'
  },

  scorrevole_2: {
    id: 'scorrevole_2',
    nome: 'Scorrevole 2 Ante',
    descrizione: 'Finestra scorrevole a due ante sovrapposte',
    tipo: 'ante',
    categoria: 'scorrevoli',

    divisioni: {
      verticali: 2,
      orizzontali: 1
    },

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

    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 50 15 L 50 85 M 55 20 L 55 80 M 40 50 L 50 50 M 55 50 L 65 50'
  },

  ante_4_verticali: {
    id: 'ante_4_verticali',
    nome: '4 Ante Verticali',
    descrizione: 'Quattro ante strette affiancate',
    tipo: 'ante',
    categoria: 'finestre',

    divisioni: {
      verticali: 4,
      orizzontali: 1
    },

    apertura: 'battente',

    lati: [
      { id: 'base', lunghezza: 1600, label: 'Larghezza', minimo: 1200, massimo: 2400 },
      { id: 'altezza', lunghezza: 1400, label: 'Altezza', minimo: 800, massimo: 2200 }
    ],

    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 90, massimo: 90 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 90, massimo: 90 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 90, massimo: 90 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 90, massimo: 90 }
    ],

    icon: 'M 15 15 L 85 15 L 85 85 L 15 85 Z M 32 15 L 32 85 M 50 15 L 50 85 M 68 15 L 68 85'
  }
};

// ========================================
// FORME GEOMETRICHE LEGACY (per compatibilità)
// ========================================
export const FRAMES_DATABASE = {
  rettangolo: {
    id: 'rettangolo',
    nome: 'Rettangolo',
    descrizione: 'Forma rettangolare standard per finestre classiche',
    punti: 4,

    // Template iniziale
    lati: [
      {
        id: 'base',
        lunghezza: 1200,
        label: 'Base',
        minimo: 300,
        massimo: 2500
      },
      {
        id: 'destra',
        lunghezza: 1400,
        label: 'Altezza Destra',
        minimo: 300,
        massimo: 2500
      },
      {
        id: 'alto',
        lunghezza: 1200,
        label: 'Alto',
        minimo: 300,
        massimo: 2500
      },
      {
        id: 'sinistra',
        lunghezza: 1400,
        label: 'Altezza Sinistra',
        minimo: 300,
        massimo: 2500
      }
    ],

    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 0, massimo: 180 },
      { id: 'ang2', gradi: 90, label: 'Angolo Alto Dx', minimo: 0, massimo: 180 },
      { id: 'ang3', gradi: 90, label: 'Angolo Alto Sx', minimo: 0, massimo: 180 },
      { id: 'ang4', gradi: 90, label: 'Angolo Basso Sx', minimo: 0, massimo: 180 }
    ],

    // SVG icon per preview (stringa path)
    icon: 'M 10 10 L 90 10 L 90 90 L 10 90 Z'
  },

  triangolo: {
    id: 'triangolo',
    nome: 'Triangolo',
    descrizione: 'Forma triangolare per sopraluce o finestre particolari',
    punti: 3,

    lati: [
      {
        id: 'base',
        lunghezza: 1200,
        label: 'Base',
        minimo: 300,
        massimo: 2500
      },
      {
        id: 'lato-dx',
        lunghezza: 1200,
        label: 'Lato Destro',
        minimo: 300,
        massimo: 2500
      },
      {
        id: 'lato-sx',
        lunghezza: 1200,
        label: 'Lato Sinistro',
        minimo: 300,
        massimo: 2500
      }
    ],

    angoli: [
      { id: 'ang1', gradi: 60, label: 'Angolo Base Dx', minimo: 0, massimo: 180 },
      { id: 'ang2', gradi: 60, label: 'Angolo Apice', minimo: 0, massimo: 180 },
      { id: 'ang3', gradi: 60, label: 'Angolo Base Sx', minimo: 0, massimo: 180 }
    ],

    icon: 'M 50 10 L 90 90 L 10 90 Z'
  },

  rombo: {
    id: 'rombo',
    nome: 'Rombo',
    descrizione: 'Forma a rombo o parallelogramma per finestre inclinate',
    punti: 4,

    lati: [
      {
        id: 'base',
        lunghezza: 1200,
        label: 'Base',
        minimo: 300,
        massimo: 2500
      },
      {
        id: 'lato-dx',
        lunghezza: 1000,
        label: 'Lato Destro',
        minimo: 300,
        massimo: 2500
      },
      {
        id: 'alto',
        lunghezza: 1200,
        label: 'Alto',
        minimo: 300,
        massimo: 2500
      },
      {
        id: 'lato-sx',
        lunghezza: 1000,
        label: 'Lato Sinistro',
        minimo: 300,
        massimo: 2500
      }
    ],

    angoli: [
      { id: 'ang1', gradi: 70, label: 'Angolo Basso Dx', minimo: 0, massimo: 180 },
      { id: 'ang2', gradi: 110, label: 'Angolo Alto Dx', minimo: 0, massimo: 180 },
      { id: 'ang3', gradi: 70, label: 'Angolo Alto Sx', minimo: 0, massimo: 180 },
      { id: 'ang4', gradi: 110, label: 'Angolo Basso Sx', minimo: 0, massimo: 180 }
    ],

    icon: 'M 50 10 L 90 50 L 50 90 L 10 50 Z'
  },

  zoppa: {
    id: 'zoppa',
    nome: 'Zoppa (Pentagono)',
    descrizione: 'Forma a pentagono irregolare per finestre mansardate',
    punti: 5,

    lati: [
      {
        id: 'base',
        lunghezza: 1200,
        label: 'Base',
        minimo: 300,
        massimo: 2500
      },
      {
        id: 'lato-basso-dx',
        lunghezza: 800,
        label: 'Lato Basso Dx',
        minimo: 300,
        massimo: 2500
      },
      {
        id: 'lato-alto-dx',
        lunghezza: 850,
        label: 'Lato Alto Dx',
        minimo: 300,
        massimo: 2500
      },
      {
        id: 'lato-alto-sx',
        lunghezza: 850,
        label: 'Lato Alto Sx',
        minimo: 300,
        massimo: 2500
      },
      {
        id: 'lato-basso-sx',
        lunghezza: 800,
        label: 'Lato Basso Sx',
        minimo: 300,
        massimo: 2500
      }
    ],

    angoli: [
      { id: 'ang1', gradi: 90, label: 'Angolo Basso Dx', minimo: 0, massimo: 180 },
      { id: 'ang2', gradi: 135, label: 'Angolo Medio Dx', minimo: 0, massimo: 180 },
      { id: 'ang3', gradi: 90, label: 'Angolo Apice', minimo: 0, massimo: 180 },
      { id: 'ang4', gradi: 135, label: 'Angolo Medio Sx', minimo: 0, massimo: 180 },
      { id: 'ang5', gradi: 90, label: 'Angolo Basso Sx', minimo: 0, massimo: 180 }
    ],

    icon: 'M 10 90 L 30 30 L 50 10 L 70 30 L 90 90 Z'
  }
};

/**
 * Ottiene la configurazione di una forma o ante
 * Cerca prima in ANTE_CONFIGS, poi fallback a FRAMES_DATABASE
 * @param {string} frameId - ID della configurazione
 * @returns {Object|null} Configurazione o null
 */
export function getFrameConfig(frameId) {
  // Prima prova la libreria completa
  const completeConfig = getFrameConfigComplete(frameId);
  if (completeConfig) return completeConfig;

  // Fallback a forme geometriche legacy
  return FRAMES_DATABASE[frameId] || null;
}

/**
 * Ottiene tutte le configurazioni ante disponibili
 * @returns {Array} Array di configurazioni ante
 */
export function getAllAnteConfigs() {
  return getAllFrameConfigs();
}

/**
 * Ottiene tutte le forme geometriche disponibili (LEGACY)
 * @returns {Array} Array di forme geometriche
 */
export function getAllFrames() {
  return Object.values(FRAMES_DATABASE);
}

/**
 * Ottiene TUTTE le configurazioni (ante + forme legacy)
 * @returns {Array} Array combinato
 */
export function getAllConfigurations() {
  return [...getAllFrameConfigs(), ...Object.values(FRAMES_DATABASE)];
}

/**
 * Filtra configurazioni per categoria
 * @param {string} categoria - 'finestre_1_anta', 'finestre_2_ante', 'porte_finestre', etc.
 * @returns {Array} Configurazioni filtrate
 */
export function getConfigsByCategory(categoria) {
  return getFramesByCategory(categoria);
}

/**
 * Cerca configurazioni per nome/descrizione
 * @param {string} query - Testo da cercare
 * @returns {Array} Configurazioni che matchano
 */
export function searchFrameConfigs(query) {
  return searchFrames(query);
}

/**
 * Filtra configurazioni per tipo di apertura
 * @param {string} apertura - 'battente', 'scorrevole', 'fisso', etc.
 * @returns {Array} Configurazioni filtrate
 */
export function getConfigsByApertura(apertura) {
  return getFramesByApertura(apertura);
}

/**
 * Crea una copia profonda della configurazione frame per modifiche
 * @param {string} frameId - ID della configurazione
 * @returns {Object} Copia della configurazione
 */
export function cloneFrameConfig(frameId) {
  const config = getFrameConfig(frameId);
  if (!config) return null;

  return {
    ...config,
    lati: config.lati.map(lato => ({ ...lato })),
    angoli: config.angoli.map(angolo => ({ ...angolo })),
    ...(config.traversi && { traversi: config.traversi.map(t => ({ ...t })) }),
    ...(config.proporzioni && { proporzioni: [...config.proporzioni] })
  };
}
