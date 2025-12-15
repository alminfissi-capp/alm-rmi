// ============================================
// Migration API - Migra dati clienti esistenti da rilievi
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { HTTP_STATUS } from '@/lib/config/constants';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    const stats = {
      clientiCreati: 0,
      rilieviAggiornati: 0,
      duplicatiSkip: 0,
      errori: [] as string[],
    };

    await prisma.$transaction(async (tx) => {
      // 1. Trova tutti i rilievi dell'utente che hanno dati cliente ma no cliente_id
      const rilieviDaMigrare = await tx.rilievo.findMany({
        where: {
          user_id: user.id,
          cliente_id: null,
          cliente: { not: null },
        },
        orderBy: { created_at: 'asc' },
      });

      if (rilieviDaMigrare.length === 0) {
        return; // Nessun rilievo da migrare
      }

      // 2. Raggruppa per nome cliente (case-insensitive)
      const clientiMap = new Map<string, any[]>();

      for (const rilievo of rilieviDaMigrare) {
        const nomeKey = rilievo.cliente!.toLowerCase().trim();
        if (!clientiMap.has(nomeKey)) {
          clientiMap.set(nomeKey, []);
        }
        clientiMap.get(nomeKey)!.push(rilievo);
      }

      // 3. Per ogni gruppo, crea cliente e aggiorna rilievi
      for (const [nomeKey, rilievi] of clientiMap.entries()) {
        // Prendi il rilievo più recente come "master" per dati
        const master = rilievi[rilievi.length - 1];

        try {
          // Crea cliente
          const cliente = await tx.cliente.create({
            data: {
              user_id: user.id,
              nome: master.cliente!,
              indirizzo: master.indirizzo,
              telefono: master.celltel,
              email: master.email,
              tipologia: 'privato', // Default
              note: null,
              partita_iva_cf: null,
              ragione_sociale: null,
            },
          });

          stats.clientiCreati++;

          // Aggiorna tutti i rilievi del gruppo
          for (const rilievo of rilievi) {
            await tx.rilievo.update({
              where: { id: rilievo.id },
              data: { cliente_id: cliente.id },
            });
            stats.rilieviAggiornati++;
          }
        } catch (error) {
          stats.errori.push(`Errore creando cliente "${master.cliente}": ${error}`);
        }
      }
    });

    return NextResponse.json({
      success: true,
      stats,
      message: `Migrazione completata: ${stats.clientiCreati} clienti creati, ${stats.rilieviAggiornati} rilievi aggiornati`,
    }, { status: 200 });
  } catch (error) {
    console.error('Error during migration:', error);
    return NextResponse.json({
      error: 'Errore durante la migrazione',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
