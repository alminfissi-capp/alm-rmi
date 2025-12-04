// ============================================
// Rilievi API Routes - GET (list), POST (create)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDashboardRilievi, createRilievo } from '@/lib/supabase/queries';
import prisma from '@/lib/prisma';

// Force dynamic - no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/rilievi - List all rilievi with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    // Build filters
    const filters: any = {};

    if (status && status !== 'all') {
      filters.status = status;
    }

    if (search) {
      filters.search = search;
    }

    // Build SQL query with filters
    let whereClause = '';
    const params: any[] = [];

    if (filters.status && filters.status !== 'all') {
      whereClause = 'WHERE r.status = $1';
      params.push(filters.status);
    }

    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      if (whereClause) {
        whereClause += ` AND (r.cliente ILIKE $${params.length + 1} OR r.commessa ILIKE $${params.length + 2} OR r.indirizzo ILIKE $${params.length + 3})`;
        params.push(searchPattern, searchPattern, searchPattern);
      } else {
        whereClause = `WHERE (r.cliente ILIKE $1 OR r.commessa ILIKE $2 OR r.indirizzo ILIKE $3)`;
        params.push(searchPattern, searchPattern, searchPattern);
      }
    }

    // Build ORDER BY clause
    const validSortFields = ['created_at', 'updated_at', 'cliente', 'commessa', 'status'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Build LIMIT clause
    const limitClause = limit ? `LIMIT ${parseInt(limit)}` : '';

    // Fetch rilievi with creator email using raw SQL
    const query = `
      SELECT
        r.*,
        (SELECT COUNT(*)::int FROM serramenti WHERE rilievo_id = r.id) as num_serramenti,
        u.email as creator_email
      FROM rilievi r
      LEFT JOIN auth.users u ON r.user_id = u.id
      ${whereClause}
      ORDER BY r.${sortField} ${sortOrder}
      ${limitClause}
    `;

    const rilieviWithCreator = params.length > 0
      ? await prisma.$queryRawUnsafe(query, ...params) as any[]
      : await prisma.$queryRawUnsafe(query) as any[];

    const total = rilieviWithCreator.length;

    const response = NextResponse.json({ rilievi: rilieviWithCreator, total }, { status: 200 });

    // Set cache headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error fetching rilievi:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rilievi', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/rilievi - Create new rilievo
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      cliente,
      data,
      indirizzo,
      celltel,
      email,
      note_header,
      commessa,
    } = body;

    // Create new rilievo using query helper
    const rilievo = await createRilievo(supabase, {
      cliente: cliente || null,
      data: data || null,
      indirizzo: indirizzo || null,
      celltel: celltel || null,
      email: email || null,
      note_header: note_header || null,
      commessa: commessa || null,
    });

    return NextResponse.json({ rilievo }, { status: 201 });
  } catch (error) {
    console.error('Error creating rilievo:', error);
    return NextResponse.json(
      { error: 'Failed to create rilievo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
