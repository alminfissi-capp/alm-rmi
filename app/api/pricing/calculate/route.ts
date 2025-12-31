/**
 * API Route: POST /api/pricing/calculate
 * Calcola prezzo frame in tempo reale
 */

import { NextRequest, NextResponse } from 'next/server';
import { calcolaPrezzoFrame } from '@/lib/pricing/calculate-price';
import type { FrameCalcoloConfig, MaterialiAggiuntivi } from '@/lib/pricing/calculate-price';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      config,
      userId,
      materiali,
      prezzarioId
    }: {
      config: FrameCalcoloConfig;
      userId: string;
      materiali?: MaterialiAggiuntivi;
      prezzarioId?: string;
    } = body;

    // Validazione input
    if (!config || !userId) {
      return NextResponse.json(
        { success: false, error: 'Parametri mancanti: config e userId sono obbligatori' },
        { status: 400 }
      );
    }

    if (!config.frame_id || !config.larghezza || !config.altezza) {
      return NextResponse.json(
        { success: false, error: 'Configurazione frame incompleta' },
        { status: 400 }
      );
    }

    // Calcola prezzo
    const risultato = await calcolaPrezzoFrame(
      config,
      userId,
      materiali,
      prezzarioId
    );

    return NextResponse.json(risultato);

  } catch (error) {
    console.error('Errore API /api/pricing/calculate:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Errore interno del server'
      },
      { status: 500 }
    );
  }
}
