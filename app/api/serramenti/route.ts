// ============================================
// Serramenti API Routes - POST (create)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createSerramento } from '@/lib/supabase/queries';

// POST /api/serramenti - Create new serramento
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

    // Create new serramento using query helper
    const serramento = await createSerramento(supabase, body);

    return NextResponse.json({ serramento }, { status: 201 });
  } catch (error) {
    console.error('Error creating serramento:', error);
    return NextResponse.json(
      { error: 'Failed to create serramento', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
