// ============================================
// Supabase Query Helper Functions
// ============================================

import { SupabaseClient } from '@supabase/supabase-js';
import { Rilievo, Serramento, RilievoDashboard } from '@/lib/types/database.types';

// ============================================
// RILIEVI QUERIES
// ============================================

/**
 * Fetch all rilievi for current user
 */
export async function getRilievi(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('rilievi')
    .select(`
      *,
      serramenti (
        id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform data to include num_serramenti
  const rilievi: RilievoDashboard[] = (data || []).map((rilievo: any) => ({
    ...rilievo,
    num_serramenti: rilievo.serramenti?.length || 0,
    last_serramento_update: null,
  }));

  return rilievi;
}

/**
 * Fetch single rilievo with all serramenti
 */
export async function getRilievoById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('rilievi')
    .select(`
      *,
      serramenti (
        *
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create new rilievo
 */
export async function createRilievo(
  supabase: SupabaseClient,
  data: Partial<Rilievo>
) {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) throw new Error('User not authenticated');

  const { data: rilievo, error } = await supabase
    .from('rilievi')
    .insert({
      user_id: user.user.id,
      status: 'bozza',
      ...data,
    })
    .select()
    .single();

  if (error) throw error;
  return rilievo;
}

/**
 * Update rilievo
 */
export async function updateRilievo(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Rilievo>
) {
  const { data: rilievo, error } = await supabase
    .from('rilievi')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return rilievo;
}

/**
 * Delete rilievo (cascades to serramenti)
 */
export async function deleteRilievo(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from('rilievi')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

// ============================================
// SERRAMENTI QUERIES
// ============================================

/**
 * Get serramenti for a rilievo
 */
export async function getSerramenti(supabase: SupabaseClient, rilievoId: string) {
  const { data, error } = await supabase
    .from('serramenti')
    .select('*')
    .eq('rilievo_id', rilievoId)
    .order('page_number', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Create new serramento
 */
export async function createSerramento(
  supabase: SupabaseClient,
  data: Partial<Serramento>
) {
  const { data: serramento, error } = await supabase
    .from('serramenti')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return serramento;
}

/**
 * Update serramento
 */
export async function updateSerramento(
  supabase: SupabaseClient,
  id: string,
  data: Partial<Serramento>
) {
  const { data: serramento, error } = await supabase
    .from('serramenti')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return serramento;
}

/**
 * Delete serramento
 */
export async function deleteSerramento(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from('serramenti')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { success: true };
}

/**
 * Bulk update serramenti (for reordering page_numbers)
 */
export async function updateSerramentoPageNumbers(
  supabase: SupabaseClient,
  updates: { id: string; page_number: number }[]
) {
  const promises = updates.map(({ id, page_number }) =>
    supabase
      .from('serramenti')
      .update({ page_number })
      .eq('id', id)
  );

  const results = await Promise.all(promises);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    throw new Error('Failed to update page numbers');
  }

  return { success: true };
}

// ============================================
// DASHBOARD QUERIES
// ============================================

/**
 * Get rilievi with counts and filters
 */
export async function getDashboardRilievi(
  supabase: SupabaseClient,
  filters?: {
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }
) {
  let query = supabase
    .from('rilievi')
    .select(`
      *,
      serramenti (
        id
      )
    `, { count: 'exact' });

  // Apply filters
  if (filters?.search) {
    query = query.or(`cliente.ilike.%${filters.search}%,commessa.ilike.%${filters.search}%,indirizzo.ilike.%${filters.search}%`);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.dateFrom) {
    query = query.gte('data', filters.dateFrom);
  }

  if (filters?.dateTo) {
    query = query.lte('data', filters.dateTo);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) throw error;

  // Transform data
  const rilievi: RilievoDashboard[] = (data || []).map((rilievo: any) => ({
    ...rilievo,
    num_serramenti: rilievo.serramenti?.length || 0,
    last_serramento_update: null,
  }));

  return { rilievi, total: count || 0 };
}
