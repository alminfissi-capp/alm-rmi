// ============================================
// Serramenti API Routes - PATCH, DELETE by ID
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateSerramento, deleteSerramento } from '@/lib/supabase/queries';

// PATCH /api/serramenti/[id] - Update serramento
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
    const { id: _, created_at, updated_at, ...updateData } = body;

    const serramento = await updateSerramento(supabase, id, updateData);

    return NextResponse.json({ serramento }, { status: 200 });
  } catch (error) {
    console.error('Error updating serramento:', error);
    return NextResponse.json(
      { error: 'Failed to update serramento', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/serramenti/[id] - Delete serramento
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

    await deleteSerramento(supabase, id);

    return NextResponse.json(
      { message: 'Serramento deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting serramento:', error);
    return NextResponse.json(
      { error: 'Failed to delete serramento', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
