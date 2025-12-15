import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    // Verifica se l'utente ha un provider_token Google nella sessione corrente
    const hasProviderToken = !!session.provider_token

    // Verifica se l'utente ha identità Google linkate
    const { data: { user } } = await supabase.auth.getUser()
    const googleIdentity = user?.identities?.find(
      (identity) => identity.provider === 'google'
    )

    return NextResponse.json({
      connected: hasProviderToken,
      hasGoogleIdentity: !!googleIdentity,
      canSync: hasProviderToken,
    })
  } catch (error: any) {
    console.error('Error checking Google status:', error)
    return NextResponse.json(
      { error: error.message || 'Errore durante la verifica dello stato Google' },
      { status: 500 }
    )
  }
}
