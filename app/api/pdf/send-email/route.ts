import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { resend, getSenderEmail } from '@/lib/resend'
import prisma from '@/lib/prisma'

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

    const { rilievoId, recipientEmail, recipientName, subject, message } = await request.json()

    // Validate input
    if (!rilievoId || !recipientEmail) {
      return NextResponse.json(
        { error: 'ID rilievo e email destinatario sono richiesti' },
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

    // Get rilievo with details
    const rilievo = await prisma.rilievo.findUnique({
      where: { id: rilievoId },
      include: {
        serramenti: true,
      },
    })

    if (!rilievo) {
      return NextResponse.json(
        { error: 'Rilievo non trovato' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (rilievo.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Non autorizzato ad accedere a questo rilievo' },
        { status: 403 }
      )
    }

    // Check if PDF exists
    const pdfRecord = await prisma.pDFGenerated.findFirst({
      where: { rilievo_id: rilievoId },
      orderBy: { generated_at: 'desc' },
    })

    if (!pdfRecord) {
      return NextResponse.json(
        { error: 'PDF non trovato. Genera prima il PDF.' },
        { status: 404 }
      )
    }

    // Get PDF from Supabase Storage
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from('pdfs')
      .download(pdfRecord.file_path)

    if (downloadError || !pdfData) {
      console.error('Error downloading PDF:', downloadError)
      return NextResponse.json(
        { error: 'Errore durante il download del PDF' },
        { status: 500 }
      )
    }

    // Convert blob to base64 for Resend attachment
    const arrayBuffer = await pdfData.arrayBuffer()
    const base64Pdf = Buffer.from(arrayBuffer).toString('base64')

    // Prepare email content
    const defaultSubject = `Rilievo ${rilievo.commessa || 'N/D'} - ${rilievo.cliente || 'Cliente'}`
    const defaultMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Rilievo Misure Interattivo</h2>
        <p>Gentile ${recipientName || 'Cliente'},</p>
        <p>In allegato trovi il rilievo richiesto con i seguenti dettagli:</p>
        <ul style="color: #555;">
          <li><strong>Cliente:</strong> ${rilievo.cliente || 'N/D'}</li>
          <li><strong>Commessa:</strong> ${rilievo.commessa || 'N/D'}</li>
          <li><strong>Data:</strong> ${rilievo.data ? new Date(rilievo.data).toLocaleDateString('it-IT') : 'N/D'}</li>
          <li><strong>Indirizzo:</strong> ${rilievo.indirizzo || 'N/D'}</li>
          <li><strong>Numero Serramenti:</strong> ${rilievo.serramenti?.length || 0}</li>
        </ul>
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
      subject: subject || defaultSubject,
      html: defaultMessage,
      attachments: [
        {
          filename: pdfRecord.file_name,
          content: base64Pdf,
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
