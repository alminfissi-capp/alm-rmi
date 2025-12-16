import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { consentType, consentGiven } = body

    if (!consentType || consentGiven === undefined) {
      return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
    }

    // Ottieni IP e User Agent per tracciabilità GDPR
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Crea o aggiorna il consenso
    const consent = await prisma.userConsent.upsert({
      where: {
        user_id_consent_type: {
          user_id: userId,
          consent_type: consentType,
        },
      },
      update: {
        consent_given: consentGiven,
        consent_date: new Date(),
        ip_address: ipAddress,
        user_agent: userAgent,
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        consent_type: consentType,
        consent_given: consentGiven,
        consent_date: new Date(),
        ip_address: ipAddress,
        user_agent: userAgent,
        consent_text_version: '1.0',
      },
    })

    return NextResponse.json({
      success: true,
      consent: {
        id: consent.id,
        consentGiven: consent.consent_given,
        consentDate: consent.consent_date,
      },
    })
  } catch (error: any) {
    console.error('Error saving consent:', error)
    return NextResponse.json(
      { error: error.message || 'Errore durante il salvataggio del consenso' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
