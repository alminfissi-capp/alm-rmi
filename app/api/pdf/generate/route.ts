import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import prisma from "@/lib/prisma"
import { uploadPDF, getPDFDownloadUrl } from "@/lib/supabase/storage"
import type { Rilievo, Serramento } from "@/lib/types/database.types"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
    }

    const { rilievoId } = await request.json()

    if (!rilievoId) {
      return NextResponse.json({ error: "ID rilievo mancante" }, { status: 400 })
    }

    // Get rilievo with serramenti
    const rilievo = await prisma.rilievo.findUnique({
      where: {
        id: rilievoId,
      },
      include: {
        serramenti: {
          orderBy: {
            page_number: "asc",
          },
        },
      },
    })

    if (!rilievo) {
      return NextResponse.json({ error: "Rilievo non trovato" }, { status: 404 })
    }

    // Single-tenant mode: All authenticated users can access all rilievi
    // No ownership check needed - all users work for the same organization (A.L.M. Infissi)

    // Import PDF generator dynamically (client-side only)
    const { generatePDF } = await import("@/components/pdf/PDFGenerator")

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
    const fileName = `RMI_${rilievo.cliente || "Rilievo"}_${
      rilievo.commessa || timestamp
    }_${timestamp}.pdf`

    // Upload to Supabase Storage
    const uploadResult = await uploadPDF(user.id, fileName, pdfBuffer)

    if (!uploadResult.success) {
      console.error("Error uploading PDF:", uploadResult.error)
      return NextResponse.json({ error: "Errore nel salvataggio del PDF" }, { status: 500 })
    }

    const filePath = uploadResult.filePath!

    // Get signed URL for download
    const urlResult = await getPDFDownloadUrl(filePath, 3600) // 1 hour expiry

    if (!urlResult.success) {
      console.error("Error creating signed URL:", urlResult.error)
    }

    // Save PDF record to database
    const pdfRecord = await prisma.pDFGenerated.create({
      data: {
        rilievo_id: rilievoId,
        file_path: filePath,
        file_name: fileName,
        file_size: pdfBuffer.length,
        generated_by: user.id,
      },
    })

    return NextResponse.json({
      success: true,
      pdf: {
        id: pdfRecord.id,
        fileName: fileName,
        fileSize: pdfBuffer.length,
        downloadUrl: urlResult.url || null,
        generatedAt: pdfRecord.generated_at,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      { error: "Errore interno del server", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
