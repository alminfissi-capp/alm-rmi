// ============================================
// Rilievi Status API - PATCH status only
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const VALID_STATUSES = ['bozza', 'in_lavorazione', 'completato', 'archiviato'];

// PATCH /api/rilievi/[id]/status - Update only the status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + VALID_STATUSES.join(', ') },
        { status: 400 }
      );
    }

    // Update only the status field
    const { data: rilievo, error } = await supabase
      .from('rilievi')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!rilievo) {
      return NextResponse.json(
        { error: 'Rilievo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ rilievo }, { status: 200 });
  } catch (error) {
    console.error('Error updating rilievo status:', error);
    return NextResponse.json(
      { error: 'Failed to update status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
