import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { resend, getSenderEmail } from '@/lib/resend'
import prisma from '@/lib/prisma'
import { uploadPDF } from '@/lib/supabase/storage'
import type { Rilievo, Serramento } from '@/lib/types/database.types'

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
        serramenti: {
          orderBy: {
            page_number: 'asc',
          },
        },
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
    let pdfRecord = await prisma.pDFGenerated.findFirst({
      where: { rilievo_id: rilievoId },
      orderBy: { generated_at: 'desc' },
    })

    let pdfData: Blob
    let fileName: string

    // If PDF doesn't exist, generate it automatically
    if (!pdfRecord) {
      console.log('PDF not found, generating automatically...')

      // Import PDF generator dynamically
      const { generatePDF } = await import('@/components/pdf/PDFGenerator')

      // Serialize rilievo data (convert Date to string, Decimal to number)
      const serializedRilievo: Rilievo & { serramenti?: Serramento[] } = {
        ...rilievo,
        data: rilievo.data ? rilievo.data.toISOString() : null,
        created_at: rilievo.created_at.toISOString(),
        updated_at: rilievo.updated_at.toISOString(),
        status: rilievo.status as Rilievo['status'],
        serramenti: rilievo.serramenti.map((s) => ({
          ...s,
          larghezza: s.larghezza ? Number(s.larghezza) : null,
          altezza: s.altezza ? Number(s.altezza) : null,
          alette_dx: s.alette_dx ? Number(s.alette_dx) : null,
          alette_testa: s.alette_testa ? Number(s.alette_testa) : null,
          alette_sx: s.alette_sx ? Number(s.alette_sx) : null,
          alette_base: s.alette_base ? Number(s.alette_base) : null,
          altezza_maniglia: s.altezza_maniglia ? Number(s.altezza_maniglia) : null,
          misura_traverso: s.misura_traverso ? Number(s.misura_traverso) : null,
          zanzariere_x: s.zanzariere_x ? Number(s.zanzariere_x) : null,
          zanzariere_h: s.zanzariere_h ? Number(s.zanzariere_h) : null,
          fascia_h: s.fascia_h ? Number(s.fascia_h) : null,
          oscuranti_l: s.oscuranti_l ? Number(s.oscuranti_l) : null,
          oscuranti_h: s.oscuranti_h ? Number(s.oscuranti_h) : null,
          created_at: s.created_at.toISOString(),
          updated_at: s.updated_at.toISOString(),
          tipologia: s.tipologia as Serramento['tipologia'],
          serie: s.serie as Serramento['serie'],
          colore_accessori: s.colore_accessori as Serramento['colore_accessori'],
        })),
      }

      // Generate PDF blob
      const pdfBlob = await generatePDF(serializedRilievo)
      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer())

      // Create filename
      const timestamp = new Date().getTime()
      fileName = `RMI_${rilievo.cliente || 'Rilievo'}_${rilievo.commessa || timestamp}_${timestamp}.pdf`

      // Upload to Supabase Storage
      const uploadResult = await uploadPDF(user.id, fileName, pdfBuffer)

      if (!uploadResult.success) {
        console.error('Error uploading PDF:', uploadResult.error)
        return NextResponse.json(
          { error: 'Errore durante la generazione del PDF' },
          { status: 500 }
        )
      }

      const filePath = uploadResult.filePath!

      // Save PDF metadata to database
      pdfRecord = await prisma.pDFGenerated.create({
        data: {
          rilievo_id: rilievoId,
          file_path: filePath,
          file_name: fileName,
          file_size: pdfBuffer.length,
          generated_by: user.id,
        },
      })

      pdfData = pdfBlob
    } else {
      // PDF exists, download it
      fileName = pdfRecord.file_name
      const { data: downloadedData, error: downloadError } = await supabase.storage
        .from('pdfs')
        .download(pdfRecord.file_path)

      if (downloadError || !downloadedData) {
        console.error('Error downloading PDF:', downloadError)
        return NextResponse.json(
          { error: 'Errore durante il download del PDF' },
          { status: 500 }
        )
      }

      pdfData = downloadedData
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
          filename: fileName,
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
