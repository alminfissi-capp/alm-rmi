/**
 * ============================================
 * SISTEMA CALCOLO PREZZI REAL-TIME
 * ============================================
 *
 * Calcola prezzi in tempo reale basandosi su:
 * - Configurazione frame selezionata
 * - Misure inserite (larghezza, altezza)
 * - Listino prezzi attivo
 * - Materiali e opzioni selezionate
 */

import { Decimal } from '@prisma/client';
import prisma from '@/lib/prisma';

/**
 * Tipologie di calcolo disponibili
 */
export type TipoCalcolo = 'area' | 'perimetro' | 'fisso' | 'formula';

/**
 * Configurazione frame per calcolo
 */
export interface FrameCalcoloConfig {
  frame_id: string;
  frame_nome: string;
  larghezza: number; // mm
  altezza: number; // mm
  area?: number; // m² (calcolato automaticamente se non fornito)
  perimetro?: number; // ml (calcolato automaticamente se non fornito)
  n_ante?: number;
  tipo_apertura?: string;
}

/**
 * Materiali aggiuntivi per calcolo
 */
export interface MaterialiAggiuntivi {
  vetro?: string; // Codice voce prezzario vetro
  ferramenta?: string[]; // Array codici voci ferramenta
  accessori?: string[]; // Array codici accessori
  manodopera_extra?: number; // € aggiuntivi manodopera
}

/**
 * Breakdown dettagliato del calcolo
 */
export interface CalcoloBreakdown {
  // Costi base frame
  costo_base_area: number; // € da area (m² * prezzo_base_mq)
  costo_base_perimetro: number; // € da perimetro (ml * prezzo_base_ml)

  // Manodopera
  costo_manodopera_area: number; // € da area (m² * manodopera_mq)
  costo_manodopera_fissa: number; // € fisso per serramento
  costo_manodopera_extra: number; // € extra opzionale

  // Moltiplicatori
  moltiplicatore_ante_applicato: number;
  moltiplicatore_apertura_applicato: number;

  // Materiali aggiuntivi
  costi_vetro: { codice: string; nome: string; quantita: number; prezzo_unitario: number; totale: number }[];
  costi_ferramenta: { codice: string; nome: string; quantita: number; prezzo_unitario: number; totale: number }[];
  costi_accessori: { codice: string; nome: string; quantita: number; prezzo_unitario: number; totale: number }[];

  // Totali parziali
  subtotale_frame: number;
  subtotale_manodopera: number;
  subtotale_materiali: number;

  // Totali finali
  subtotale: number;
  iva_percentuale: number;
  iva_importo: number;
  totale: number;
}

/**
 * Risultato calcolo completo
 */
export interface CalcoloPrezzoResult {
  success: boolean;
  error?: string;

  // Configurazione usata
  frame: FrameCalcoloConfig;

  // Listino usato
  prezzario_id: string;
  prezzario_nome: string;

  // Breakdown dettagliato
  breakdown: CalcoloBreakdown;

  // Timestamp calcolo
  calcolato_at: Date;
}

/**
 * ============================================
 * FUNZIONE PRINCIPALE - CALCOLA PREZZO
 * ============================================
 */
export async function calcolaPrezzoFrame(
  config: FrameCalcoloConfig,
  userId: string,
  materiali?: MaterialiAggiuntivi,
  prezzarioId?: string
): Promise<CalcoloPrezzoResult> {
  try {
    // 1. Recupera listino prezzi attivo
    const prezzario = await getPrezzarioAttivo(userId, prezzarioId);

    if (!prezzario) {
      return {
        success: false,
        error: 'Nessun listino prezzi attivo trovato',
        frame: config,
        prezzario_id: '',
        prezzario_nome: '',
        breakdown: getEmptyBreakdown(),
        calcolato_at: new Date()
      };
    }

    // 2. Recupera prezzi specifici per questo frame
    const prezzoFrame = await prisma.prezzoFrame.findUnique({
      where: {
        prezzario_id_frame_id: {
          prezzario_id: prezzario.id,
          frame_id: config.frame_id
        }
      }
    });

    if (!prezzoFrame) {
      return {
        success: false,
        error: `Prezzi non configurati per frame ${config.frame_nome}`,
        frame: config,
        prezzario_id: prezzario.id,
        prezzario_nome: prezzario.nome,
        breakdown: getEmptyBreakdown(),
        calcolato_at: new Date()
      };
    }

    // 3. Calcola area e perimetro se non forniti
    const area_m2 = config.area ?? calcola_area_m2(config.larghezza, config.altezza);
    const perimetro_ml = config.perimetro ?? calcola_perimetro_ml(config.larghezza, config.altezza);

    // 4. Calcola costi base
    const costo_base_area = decimalToNumber(prezzoFrame.prezzo_base_mq) * area_m2;
    const costo_base_perimetro = decimalToNumber(prezzoFrame.prezzo_base_ml) * perimetro_ml;

    // 5. Calcola manodopera
    const costo_manodopera_area = decimalToNumber(prezzoFrame.manodopera_mq) * area_m2;
    const costo_manodopera_fissa = decimalToNumber(prezzoFrame.manodopera_fissa);
    const costo_manodopera_extra = materiali?.manodopera_extra ?? 0;

    // 6. Applica moltiplicatori
    const molt_ante = decimalToNumber(prezzoFrame.moltiplicatore_ante);
    const molt_apertura = decimalToNumber(prezzoFrame.moltiplicatore_apertura);

    const n_ante = config.n_ante ?? 1;
    const moltiplicatore_ante_applicato = Math.pow(molt_ante, n_ante - 1); // Scala con numero ante
    const moltiplicatore_apertura_applicato = molt_apertura;

    // 7. Calcola materiali aggiuntivi
    const costi_vetro = await calcolaMateriali(prezzario.id, materiali?.vetro ? [materiali.vetro] : [], area_m2);
    const costi_ferramenta = await calcolaMateriali(prezzario.id, materiali?.ferramenta ?? [], 1);
    const costi_accessori = await calcolaMateriali(prezzario.id, materiali?.accessori ?? [], 1);

    // 8. Calcola totali parziali
    const subtotale_frame = (costo_base_area + costo_base_perimetro) *
                            moltiplicatore_ante_applicato *
                            moltiplicatore_apertura_applicato;

    const subtotale_manodopera = costo_manodopera_area +
                                  costo_manodopera_fissa +
                                  costo_manodopera_extra;

    const subtotale_materiali =
      costi_vetro.reduce((sum, item) => sum + item.totale, 0) +
      costi_ferramenta.reduce((sum, item) => sum + item.totale, 0) +
      costi_accessori.reduce((sum, item) => sum + item.totale, 0);

    // 9. Calcola totali finali
    const subtotale = subtotale_frame + subtotale_manodopera + subtotale_materiali;
    const iva_percentuale = 22; // IVA 22%
    const iva_importo = subtotale * (iva_percentuale / 100);
    const totale = subtotale + iva_importo;

    // 10. Costruisci breakdown
    const breakdown: CalcoloBreakdown = {
      costo_base_area,
      costo_base_perimetro,
      costo_manodopera_area,
      costo_manodopera_fissa,
      costo_manodopera_extra,
      moltiplicatore_ante_applicato,
      moltiplicatore_apertura_applicato,
      costi_vetro,
      costi_ferramenta,
      costi_accessori,
      subtotale_frame,
      subtotale_manodopera,
      subtotale_materiali,
      subtotale,
      iva_percentuale,
      iva_importo,
      totale
    };

    return {
      success: true,
      frame: {
        ...config,
        area: area_m2,
        perimetro: perimetro_ml
      },
      prezzario_id: prezzario.id,
      prezzario_nome: prezzario.nome,
      breakdown,
      calcolato_at: new Date()
    };

  } catch (error) {
    console.error('Errore calcolo prezzo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore sconosciuto',
      frame: config,
      prezzario_id: '',
      prezzario_nome: '',
      breakdown: getEmptyBreakdown(),
      calcolato_at: new Date()
    };
  }
}

/**
 * ============================================
 * FUNZIONI HELPER
 * ============================================
 */

/**
 * Recupera listino prezzi attivo per user
 */
async function getPrezzarioAttivo(userId: string, prezzarioId?: string) {
  if (prezzarioId) {
    // Prezzario specifico richiesto
    return await prisma.prezzario.findFirst({
      where: {
        id: prezzarioId,
        attivo: true
      }
    });
  }

  // Cerca prezzario per user specifico
  let prezzario = await prisma.prezzario.findFirst({
    where: {
      user_id: userId,
      attivo: true,
      valido_da: {
        lte: new Date()
      },
      OR: [
        { valido_a: null },
        { valido_a: { gte: new Date() } }
      ]
    },
    orderBy: {
      valido_da: 'desc'
    }
  });

  // Fallback: usa prezzario di sistema/demo se user non ha prezzario personale
  if (!prezzario) {
    prezzario = await prisma.prezzario.findFirst({
      where: {
        user_id: '00000000-0000-0000-0000-000000000000', // User di sistema
        attivo: true,
        valido_da: {
          lte: new Date()
        },
        OR: [
          { valido_a: null },
          { valido_a: { gte: new Date() } }
        ]
      },
      orderBy: {
        valido_da: 'desc'
      }
    });
  }

  return prezzario;
}

/**
 * Calcola costi materiali aggiuntivi
 */
async function calcolaMateriali(
  prezzarioId: string,
  codici: string[],
  quantita_base: number
): Promise<Array<{ codice: string; nome: string; quantita: number; prezzo_unitario: number; totale: number }>> {
  if (codici.length === 0) return [];

  const voci = await prisma.vocePrezzario.findMany({
    where: {
      prezzario_id: prezzarioId,
      codice: { in: codici },
      attivo: true
    }
  });

  return voci.map(voce => {
    const prezzo_unitario = decimalToNumber(voce.prezzo);
    const quantita = quantita_base; // Potrebbe essere calcolato con una formula
    const totale = prezzo_unitario * quantita;

    return {
      codice: voce.codice,
      nome: voce.nome,
      quantita,
      prezzo_unitario,
      totale
    };
  });
}

/**
 * Converte Prisma Decimal a number
 */
function decimalToNumber(decimal: Decimal): number {
  return decimal.toNumber();
}

/**
 * Calcola area in m² da misure in mm
 */
function calcola_area_m2(larghezza_mm: number, altezza_mm: number): number {
  return (larghezza_mm / 1000) * (altezza_mm / 1000);
}

/**
 * Calcola perimetro in ml da misure in mm
 */
function calcola_perimetro_ml(larghezza_mm: number, altezza_mm: number): number {
  return ((larghezza_mm * 2) + (altezza_mm * 2)) / 1000;
}

/**
 * Restituisce breakdown vuoto
 */
function getEmptyBreakdown(): CalcoloBreakdown {
  return {
    costo_base_area: 0,
    costo_base_perimetro: 0,
    costo_manodopera_area: 0,
    costo_manodopera_fissa: 0,
    costo_manodopera_extra: 0,
    moltiplicatore_ante_applicato: 1,
    moltiplicatore_apertura_applicato: 1,
    costi_vetro: [],
    costi_ferramenta: [],
    costi_accessori: [],
    subtotale_frame: 0,
    subtotale_manodopera: 0,
    subtotale_materiali: 0,
    subtotale: 0,
    iva_percentuale: 22,
    iva_importo: 0,
    totale: 0
  };
}

/**
 * ============================================
 * FUNZIONI PUBBLICHE AGGIUNTIVE
 * ============================================
 */

/**
 * Salva preventivo nel database
 */
export async function salvaPreventivoCalcolato(
  calcolo: CalcoloPrezzoResult,
  userId: string,
  rilievoId?: string,
  cliente?: string,
  note?: string
): Promise<{ success: boolean; preventivo_id?: string; numero?: string; error?: string }> {
  try {
    // Genera numero preventivo progressivo
    const anno = new Date().getFullYear();
    const ultimoPreventivo = await prisma.preventivo.findFirst({
      where: {
        numero: {
          startsWith: `PREV-${anno}-`
        }
      },
      orderBy: {
        numero: 'desc'
      }
    });

    let progressivo = 1;
    if (ultimoPreventivo) {
      const match = ultimoPreventivo.numero.match(/PREV-\d{4}-(\d+)/);
      if (match) {
        progressivo = parseInt(match[1]) + 1;
      }
    }

    const numero = `PREV-${anno}-${progressivo.toString().padStart(3, '0')}`;

    // Crea preventivo
    const preventivo = await prisma.preventivo.create({
      data: {
        numero,
        user_id: userId,
        rilievo_id: rilievoId,
        cliente: cliente,
        frame_id: calcolo.frame.frame_id,
        frame_data: calcolo.frame as any,
        calcolo_dettaglio: calcolo.breakdown as any,
        subtotale: new Decimal(calcolo.breakdown.subtotale),
        iva: new Decimal(calcolo.breakdown.iva_importo),
        totale: new Decimal(calcolo.breakdown.totale),
        stato: 'bozza',
        note: note,
        valido_fino: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 giorni
      }
    });

    return {
      success: true,
      preventivo_id: preventivo.id,
      numero: preventivo.numero
    };

  } catch (error) {
    console.error('Errore salvataggio preventivo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Errore sconosciuto'
    };
  }
}

/**
 * Recupera preventivo salvato
 */
export async function recuperaPreventivo(preventivoId: string) {
  return await prisma.preventivo.findUnique({
    where: { id: preventivoId },
    include: {
      rilievo: true
    }
  });
}

/**
 * Lista preventivi per user
 */
export async function listaPreventivi(userId: string, filters?: {
  stato?: string;
  cliente?: string;
  data_da?: Date;
  data_a?: Date;
}) {
  return await prisma.preventivo.findMany({
    where: {
      user_id: userId,
      ...(filters?.stato && { stato: filters.stato }),
      ...(filters?.cliente && { cliente: { contains: filters.cliente, mode: 'insensitive' } }),
      ...(filters?.data_da && { created_at: { gte: filters.data_da } }),
      ...(filters?.data_a && { created_at: { lte: filters.data_a } })
    },
    orderBy: {
      created_at: 'desc'
    },
    take: 50
  });
}
