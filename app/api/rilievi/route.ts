// ============================================
// Rilievi API Routes - GET (list), POST (create)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDashboardRilievi, createRilievo } from '@/lib/supabase/queries';

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

    // Build filters
    const filters: any = {};

    if (status && status !== 'all') {
      filters.status = status;
    }

    if (search) {
      filters.search = search;
    }

    // Fetch rilievi using query helper
    const { rilievi, total } = await getDashboardRilievi(supabase, filters);

    return NextResponse.json({ rilievi, total }, { status: 200 });
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
