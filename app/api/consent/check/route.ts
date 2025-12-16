import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const consentType = searchParams.get('type')

    if (!consentType) {
      return NextResponse.json({ error: 'Tipo di consenso mancante' }, { status: 400 })
    }

    // Verifica se esiste un consenso per questo utente e tipo
    const consent = await prisma.userConsent.findUnique({
      where: {
        user_id_consent_type: {
          user_id: userId,
          consent_type: consentType,
        },
      },
    })

    return NextResponse.json({
      hasConsent: consent ? consent.consent_given : false,
      consentDate: consent ? consent.consent_date : null,
      version: consent ? consent.consent_text_version : null,
    })
  } catch (error: any) {
    console.error('Error checking consent:', error)
    return NextResponse.json(
      { error: error.message || 'Errore durante la verifica del consenso' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
