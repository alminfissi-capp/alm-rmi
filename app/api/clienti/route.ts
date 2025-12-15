// ============================================
// Clienti API Routes - GET (list), POST (create)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { HTTP_STATUS } from '@/lib/config/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/clienti - List all clienti with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const tipologia = searchParams.get('tipologia');

    // Build query con join per contare rilievi
    let whereClause = 'WHERE c.user_id = $1::uuid';
    const params: any[] = [user.id];

    if (search) {
      const searchPattern = `%${search}%`;
      whereClause += ` AND (c.nome ILIKE $2 OR c.ragione_sociale ILIKE $3 OR c.email ILIKE $4)`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (tipologia && tipologia !== 'all') {
      const tipologiaIndex = params.length + 1;
      whereClause += ` AND c.tipologia = $${tipologiaIndex}`;
      params.push(tipologia);
    }

    const query = `
      SELECT
        c.*,
        COUNT(r.id)::int as num_rilievi,
        MAX(r.data) as ultimo_rilievo_data
      FROM clienti c
      LEFT JOIN rilievi r ON c.id = r.cliente_id
      ${whereClause}
      GROUP BY c.id
      ORDER BY c.nome ASC
    `;

    const clienti = await prisma.$queryRawUnsafe(query, ...params) as any[];

    return NextResponse.json({ clienti, total: clienti.length }, { status: 200 });
  } catch (error) {
    console.error('Error fetching clienti:', error);
    return NextResponse.json(
      { error: 'Errore nel caricamento clienti', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/clienti - Create new cliente
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    const body = await request.json();
    const {
      nome,
      indirizzo,
      telefono,
      email,
      partita_iva_cf,
      ragione_sociale,
      tipologia,
      note,
    } = body;

    // Validazione base
    if (!nome || nome.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nome cliente obbligatorio (minimo 2 caratteri)' },
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const cliente = await prisma.cliente.create({
      data: {
        user_id: user.id,
        nome: nome.trim(),
        indirizzo: indirizzo || null,
        telefono: telefono || null,
        email: email || null,
        partita_iva_cf: partita_iva_cf || null,
        ragione_sociale: ragione_sociale || null,
        tipologia: tipologia || 'privato',
        note: note || null,
      },
    });

    return NextResponse.json({ cliente }, { status: 201 });
  } catch (error) {
    console.error('Error creating cliente:', error);
    return NextResponse.json(
      { error: 'Errore nella creazione del cliente', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
