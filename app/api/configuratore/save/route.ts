import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getFrameConfig } from '@/lib/frames/frames-config-complete';

const prisma = new PrismaClient();

interface SaveRequest {
  userId: string;
  rilievoId?: string;
  serramentoId?: string;

  frameId: string;
  larghezza: number;
  altezza: number;
  nome?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveRequest = await request.json();

    // VALIDAZIONE
    if (!body.userId || !body.frameId || !body.larghezza || !body.altezza) {
      return NextResponse.json(
        {
          success: false,
          error: 'Campi obbligatori mancanti (userId, frameId, larghezza, altezza)',
        },
        { status: 400 }
      );
    }

    // Recupera frame config
    const frameConfig = getFrameConfig(body.frameId);
    if (!frameConfig) {
      return NextResponse.json(
        { success: false, error: `Frame ${body.frameId} non trovato` },
        { status: 404 }
      );
    }

    // PREPARA DATI SERIALIZZABILI
    const area = (body.larghezza / 1000) * (body.altezza / 1000);
    const perimetro = ((body.larghezza * 2) + (body.altezza * 2)) / 1000;

    const frameData = {
      frame_id: body.frameId,
      frame_nome: frameConfig.nome,
      larghezza: body.larghezza,
      altezza: body.altezza,
      area,
      perimetro,
      categoria: frameConfig.categoria,
      apertura: frameConfig.apertura,
      divisioni: frameConfig.divisioni,
    };

    // GESTIONE RILIEVO_ID PER STANDALONE
    let finalRilievoId = body.rilievoId;

    if (!finalRilievoId) {
      // Cerca o crea un Rilievo "Configuratore Standalone" per questo user
      const standaloneCommessa = `CONFIGURATORE_${body.userId}`;

      let standaloneRilievo = await prisma.rilievo.findFirst({
        where: {
          user_id: body.userId,
          commessa: standaloneCommessa,
        },
      });

      if (!standaloneRilievo) {
        // Crea nuovo Rilievo standalone
        standaloneRilievo = await prisma.rilievo.create({
          data: {
            user_id: body.userId,
            commessa: standaloneCommessa,
            cliente: 'Configuratore Standalone',
            status: 'bozza',
          },
        });
      }

      finalRilievoId = standaloneRilievo.id;
    }

    // UPDATE o CREATE
    if (body.serramentoId) {
      // UPDATE esistente
      const updated = await prisma.serramento.update({
        where: { id: body.serramentoId },
        data: {
          larghezza: body.larghezza,
          altezza: body.altezza,
          tipologia: frameConfig.categoria,
          nome: body.nome || frameConfig.nome,
          note: JSON.stringify(frameData),
          updated_at: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        id: updated.id,
        message: 'Aggiornato con successo',
      });
    } else {
      // CREATE nuovo
      const created = await prisma.serramento.create({
        data: {
          rilievo_id: finalRilievoId,
          page_number: 1, // Default
          larghezza: body.larghezza,
          altezza: body.altezza,
          tipologia: frameConfig.categoria,
          nome: body.nome || frameConfig.nome,
          note: JSON.stringify(frameData),
          n_pezzi: 1,
        },
      });

      return NextResponse.json({
        success: true,
        id: created.id,
        message: 'Creato con successo',
      });
    }
  } catch (error) {
    console.error('Errore API /api/configuratore/save:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Errore interno del server',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
