// ============================================
// Rilievi API Routes - GET, PATCH, DELETE by ID
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/rilievi/[id] - Get single rilievo with serramenti
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rilievo = await prisma.rilievo.findUnique({
      where: { id },
      include: {
        serramenti: {
          orderBy: { page_number: 'asc' },
        },
        pdf: {
          orderBy: { generated_at: 'desc' },
        },
      },
    });

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
    const { id } = await params;
    const body = await request.json();

    // Remove fields that shouldn't be updated directly
    const { id: _, user_id, created_at, updated_at, ...updateData } = body;

    // Convert date string to Date if present
    if (updateData.data) {
      updateData.data = new Date(updateData.data);
    }

    const rilievo = await prisma.rilievo.update({
      where: { id },
      data: updateData,
    });

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
    const { id } = await params;

    await prisma.rilievo.delete({
      where: { id },
    });

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
