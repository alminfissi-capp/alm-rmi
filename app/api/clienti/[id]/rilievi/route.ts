// ============================================
// GET Rilievi for specific Cliente
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { HTTP_STATUS } from '@/lib/config/constants';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    // Verifica che il cliente appartenga all'utente
    const cliente = await prisma.cliente.findFirst({
      where: { id, user_id: user.id },
    });

    if (!cliente) {
      return NextResponse.json({ error: 'Cliente non trovato' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    const rilievi = await prisma.rilievo.findMany({
      where: { cliente_id: id },
      include: {
        serramenti: {
          select: { id: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const rilieviWithCount = rilievi.map(r => ({
      ...r,
      num_serramenti: r.serramenti.length,
    }));

    return NextResponse.json({ rilievi: rilieviWithCount }, { status: 200 });
  } catch (error) {
    console.error('Error fetching rilievi for cliente:', error);
    return NextResponse.json({ error: 'Errore nel caricamento dei rilievi' }, { status: 500 });
  }
}
