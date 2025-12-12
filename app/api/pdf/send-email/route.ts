import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { resend, getSenderEmail } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }

    const { recipientEmail, recipientName, subject, message, pdfBase64, fileName } = await request.json()

    // Validate input
    if (!pdfBase64 || !recipientEmail || !fileName) {
      return NextResponse.json(
        { error: 'PDF, nome file e email destinatario sono richiesti' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      )
    }

    // Prepare email content
    const defaultSubject = subject || 'Rilievo Misure Interattivo'
    const defaultMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Rilievo Misure Interattivo</h2>
        <p>Gentile ${recipientName || 'Cliente'},</p>
        <p>In allegato trovi il rilievo richiesto.</p>
        <p>${message || 'Resto a disposizione per qualsiasi chiarimento.'}</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #888; font-size: 12px;">
          Questo messaggio è stato generato automaticamente da ALM RMI - Rilevatore Misure Interattivo
        </p>
      </div>
    `

    // Send email with PDF attachment
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: getSenderEmail(),
      to: [recipientEmail],
      subject: defaultSubject,
      html: defaultMessage,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64,
        },
      ],
    })

    if (emailError) {
      console.error('Resend API error:', emailError)
      return NextResponse.json(
        { error: 'Errore durante l\'invio dell\'email', details: emailError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Email inviata con successo',
      emailId: emailData?.id,
    })
  } catch (error) {
    console.error('Error sending PDF email:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
