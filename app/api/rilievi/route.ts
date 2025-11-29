// ============================================
// Rilievi API Routes - GET (list), POST (create)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/rilievi - List all rilievi with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { cliente: { contains: search, mode: 'insensitive' } },
        { commessa: { contains: search, mode: 'insensitive' } },
        { indirizzo: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch rilievi with serramenti count
    const rilievi = await prisma.rilievo.findMany({
      where,
      include: {
        _count: {
          select: { serramenti: true },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return NextResponse.json({ rilievi }, { status: 200 });
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

    // TODO: Get user_id from session when auth is implemented
    const user_id = '00000000-0000-0000-0000-000000000000'; // Temporary placeholder

    // Create new rilievo
    const rilievo = await prisma.rilievo.create({
      data: {
        user_id,
        cliente: cliente || null,
        data: data ? new Date(data) : null,
        indirizzo: indirizzo || null,
        celltel: celltel || null,
        email: email || null,
        note_header: note_header || null,
        commessa: commessa || null,
        status: 'bozza',
      },
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
