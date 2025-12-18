/**
 * Configurazione mapping tra serie profili e file DXF
 * Facilmente estendibile aggiungendo nuovi profili
 */

export const PROFILI_MAPPING = {
  'basic': {
    fileName: 'TT61802.DXF',
    nome: 'Basic Line 50mm',
    descrizione: 'Profilo base 50mm, ideale per soluzioni standard',
    spessore: '50mm'
  },
  'comfort': {
    fileName: 'TT61813.DXF',
    nome: 'Comfort Plus 60mm',
    descrizione: 'Profilo intermedio 60mm, isolamento migliorato',
    spessore: '60mm'
  },
  'premium': {
    fileName: 'TT61851.DXF',
    nome: 'Premium HD 70mm',
    descrizione: 'Profilo premium 70mm, massime prestazioni',
    spessore: '70mm'
  },
  'design': {
    fileName: null, // Aggiungeremo il file DXF quando disponibile
    nome: 'Design Collection',
    descrizione: 'Profilo slim design, estetica minimale',
    spessore: 'Slim'
  }
};

/**
 * Ottiene il file DXF per una serie
 */
export function getDxfFileForSerie(serieId) {
  return PROFILI_MAPPING[serieId]?.fileName || null;
}

/**
 * Ottiene le info complete del profilo
 */
export function getProfiloInfo(serieId) {
  return PROFILI_MAPPING[serieId] || null;
}

/**
 * Lista di tutti i profili disponibili
 */
export function getAllProfili() {
  return Object.entries(PROFILI_MAPPING).map(([id, info]) => ({
    id,
    ...info
  }));
}
