// ============================================
// Rilievi API Routes - GET, PATCH, DELETE by ID
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRilievoById, updateRilievo, deleteRilievo } from '@/lib/supabase/queries';

// GET /api/rilievi/[id] - Get single rilievo with serramenti
export async function GET(
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

    const rilievo = await getRilievoById(supabase, id);

    if (!rilievo) {
      return NextResponse.json(
        { error: 'Rilievo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ rilievo }, { status: 200 });
  } catch (error) {
    console.error('Error fetching rilievo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rilievo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH /api/rilievi/[id] - Update rilievo
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

    // Remove fields that shouldn't be updated directly
    const { id: _, user_id, created_at, updated_at, ...updateData } = body;

    const rilievo = await updateRilievo(supabase, id, updateData);

    return NextResponse.json({ rilievo }, { status: 200 });
  } catch (error) {
    console.error('Error updating rilievo:', error);
    return NextResponse.json(
      { error: 'Failed to update rilievo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/rilievi/[id] - Delete rilievo (cascade delete serramenti and PDF)
export async function DELETE(
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

    await deleteRilievo(supabase, id);

    return NextResponse.json(
      { message: 'Rilievo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting rilievo:', error);
    return NextResponse.json(
      { error: 'Failed to delete rilievo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
