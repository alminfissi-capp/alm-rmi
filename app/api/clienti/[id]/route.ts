// ============================================
// Clienti API Routes - GET, PUT, DELETE (single)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { HTTP_STATUS } from '@/lib/config/constants';

export const dynamic = 'force-dynamic';

// GET /api/clienti/[id]
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

    const cliente = await prisma.cliente.findFirst({
      where: { id, user_id: user.id },
      include: {
        rilievi: {
          select: {
            id: true,
            commessa: true,
            data: true,
            status: true,
            created_at: true,
          },
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!cliente) {
      return NextResponse.json({ error: 'Cliente non trovato' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    return NextResponse.json({ cliente }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cliente:', error);
    return NextResponse.json({ error: 'Errore nel caricamento del cliente' }, { status: 500 });
  }
}

// PUT /api/clienti/[id]
export async function PUT(
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

    const body = await request.json();

    // Verifica ownership
    const existing = await prisma.cliente.findFirst({
      where: { id, user_id: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Cliente non trovato' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    // Validazione base
    if (body.nome && body.nome.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nome cliente obbligatorio (minimo 2 caratteri)' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nome: body.nome?.trim(),
        indirizzo: body.indirizzo || null,
        telefono: body.telefono || null,
        email: body.email || null,
        partita_iva_cf: body.partita_iva_cf || null,
        ragione_sociale: body.ragione_sociale || null,
        tipologia: body.tipologia || 'privato',
        note: body.note || null,
      },
    });

    return NextResponse.json({ cliente }, { status: 200 });
  } catch (error) {
    console.error('Error updating cliente:', error);
    return NextResponse.json({ error: 'Errore nell\'aggiornamento del cliente' }, { status: 500 });
  }
}

// DELETE /api/clienti/[id]
export async function DELETE(
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

    // Verifica ownership
    const existing = await prisma.cliente.findFirst({
      where: { id, user_id: user.id },
      include: {
        rilievi: { select: { id: true } },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Cliente non trovato' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    // Count rilievi collegati per info
    const numRilievi = existing.rilievi.length;

    await prisma.cliente.delete({ where: { id } });

    return NextResponse.json({ success: true, numRilievi }, { status: 200 });
  } catch (error) {
    console.error('Error deleting cliente:', error);
    return NextResponse.json({ error: 'Errore nell\'eliminazione del cliente' }, { status: 500 });
  }
}
