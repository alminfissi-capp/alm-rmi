/**
 * API Route: POST /api/pricing/save-preventivo
 * Salva preventivo calcolato nel database
 */

import { NextRequest, NextResponse } from 'next/server';
import { salvaPreventivoCalcolato } from '@/lib/pricing/calculate-price';
import type { CalcoloPrezzoResult } from '@/lib/pricing/calculate-price';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      calcolo,
      userId,
      rilievoId,
      cliente,
      note
    }: {
      calcolo: CalcoloPrezzoResult;
      userId: string;
      rilievoId?: string;
      cliente?: string;
      note?: string;
    } = body;

    // Validazione input
    if (!calcolo || !userId) {
      return NextResponse.json(
        { success: false, error: 'Parametri mancanti: calcolo e userId sono obbligatori' },
        { status: 400 }
      );
    }

    if (!calcolo.success) {
      return NextResponse.json(
        { success: false, error: 'Impossibile salvare un calcolo non riuscito' },
        { status: 400 }
      );
    }

    // Salva preventivo
    const risultato = await salvaPreventivoCalcolato(
      calcolo,
      userId,
      rilievoId,
      cliente,
      note
    );

    if (!risultato.success) {
      return NextResponse.json(
        { success: false, error: risultato.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      preventivo_id: risultato.preventivo_id,
      numero: risultato.numero
    });

  } catch (error) {
    console.error('Errore API /api/pricing/save-preventivo:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Errore interno del server'
      },
      { status: 500 }
    );
  }
}
