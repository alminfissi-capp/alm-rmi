// ============================================
// Rilievi API Routes - GET (list), POST (create)
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDashboardRilievi, createRilievo } from '@/lib/supabase/queries';
import prisma from '@/lib/prisma';
import { API_CONFIG, COMMESSA_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '@/lib/config/constants';

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
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
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

    // Build ORDER BY clause with strict validation
    const validSortFields = ['created_at', 'updated_at', 'cliente', 'commessa', 'status'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Build LIMIT clause with proper validation
    let limitClause = '';
    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      // Validate: must be a positive integer between min and max
      if (!isNaN(parsedLimit) && parsedLimit >= API_CONFIG.MIN_QUERY_LIMIT && parsedLimit <= API_CONFIG.MAX_QUERY_LIMIT) {
        limitClause = `LIMIT ${parsedLimit}`;
      } else {
        return NextResponse.json(
          { error: `Invalid limit parameter. Must be between ${API_CONFIG.MIN_QUERY_LIMIT} and ${API_CONFIG.MAX_QUERY_LIMIT}.` },
          { status: HTTP_STATUS.BAD_REQUEST }
        );
      }
    }

    // Fetch rilievi with creator email and name using raw SQL
    const query = `
      SELECT
        r.*,
        (SELECT COUNT(*)::int FROM serramenti WHERE rilievo_id = r.id) as num_serramenti,
        u.email as creator_email,
        u.raw_user_meta_data->>'full_name' as creator_name
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
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED }
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

    // Auto-generate commessa number if not provided
    let finalCommessa = commessa;

    if (!finalCommessa) {
      const currentYear = new Date().getFullYear();
      let retryCount = 0;
      let success = false;

      // Use transaction with retry logic to prevent race conditions
      while (!success && retryCount < API_CONFIG.MAX_RETRY_ATTEMPTS) {
        try {
          await prisma.$transaction(async (tx) => {
            // Get the highest existing commessa number for current year (with lock)
            const lastRilievo = await tx.rilievo.findFirst({
              where: {
                commessa: {
                  not: null,
                  startsWith: `RMI_`,
                  endsWith: `_${currentYear}`,
                },
              },
              orderBy: {
                commessa: 'desc',
              },
              select: {
                commessa: true,
              },
            });

            // Generate next number (format: RMI_0001_2025, RMI_0002_2025, etc.)
            let nextNumber = 1;
            if (lastRilievo?.commessa) {
              // Extract number from commessa (pattern: RMI_XXXX_YYYY)
              const match = lastRilievo.commessa.match(/RMI_(\d+)_\d{4}/);
              if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
              }
            }

            // Format with leading zeros and year suffix
            const progressivo = String(nextNumber).padStart(COMMESSA_CONFIG.PROGRESSIVO_DIGITS, '0');
            finalCommessa = `${COMMESSA_CONFIG.PREFIX}_${progressivo}_${currentYear}`;

            // Verify uniqueness within transaction
            const existing = await tx.rilievo.findFirst({
              where: { commessa: finalCommessa },
            });

            if (existing) {
              throw new Error('Duplicate commessa detected, retrying...');
            }

            success = true;
          });
        } catch (error) {
          retryCount++;
          if (retryCount >= API_CONFIG.MAX_RETRY_ATTEMPTS) {
            return NextResponse.json(
              { error: ERROR_MESSAGES.GENERATION_FAILED },
              { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
            );
          }
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_BASE_DELAY_MS * retryCount));
        }
      }
    }

    // Create new rilievo using query helper
    const rilievo = await createRilievo(supabase, {
      cliente: cliente || null,
      data: data || null,
      indirizzo: indirizzo || null,
      celltel: celltel || null,
      email: email || null,
      note_header: note_header || null,
      commessa: finalCommessa,
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
