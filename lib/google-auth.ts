import { createClient } from '@/lib/supabase/server'

/**
 * Verifica se l'utente corrente ha un Google provider token nella sessione
 */
export async function hasGoogleConnection(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return false

  // Verifica se esiste un provider_token (indica OAuth login/linking)
  return !!session.provider_token
}

/**
 * Ottiene il provider token di Google se disponibile
 */
export async function getGoogleProviderToken(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  return session?.provider_token || null
}
