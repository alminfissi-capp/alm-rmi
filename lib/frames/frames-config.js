/**
 * Database forme geometriche disponibili per il configuratore
 * Tutte le misure sono in millimetri (mm)
 */

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
 * Ottiene la configurazione di una forma
 * @param {string} frameId - ID della forma
 * @returns {Object|null} Configurazione forma o null
 */
export function getFrameConfig(frameId) {
  return FRAMES_DATABASE[frameId] || null;
}

/**
 * Ottiene tutte le forme disponibili
 * @returns {Array} Array di oggetti forma
 */
export function getAllFrames() {
  return Object.values(FRAMES_DATABASE);
}

/**
 * Crea una copia profonda della configurazione frame per modifiche
 * @param {string} frameId - ID della forma
 * @returns {Object} Copia della configurazione
 */
export function cloneFrameConfig(frameId) {
  const config = getFrameConfig(frameId);
  if (!config) return null;

  return {
    ...config,
    lati: config.lati.map(lato => ({ ...lato })),
    angoli: config.angoli.map(angolo => ({ ...angolo }))
  };
}
