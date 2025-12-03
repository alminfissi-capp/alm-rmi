import { jsPDF } from "jspdf"
import { Rilievo, Serramento } from "@/lib/types/database.types"

interface PDFGeneratorProps {
  rilievo: Rilievo & { serramenti?: Serramento[] }
}

export class PDFGenerator {
  private pdf: jsPDF
  private pageWidth: number
  private pageHeight: number
  private margin: number
  private currentY: number
  private lineHeight: number
  private almBlue: string = "#0288d1"
  private almGreen: string = "#7cb342"
  private black: string = "#000000"

  constructor() {
    this.pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })
    this.pageWidth = this.pdf.internal.pageSize.getWidth()
    this.pageHeight = this.pdf.internal.pageSize.getHeight()
    this.margin = 15
    this.currentY = this.margin
    this.lineHeight = 6
  }

  async generate(rilievo: Rilievo & { serramenti?: Serramento[] }): Promise<Blob> {
    try {
      // Add header with logo
      await this.addHeader(rilievo)

      // Add client info section
      this.addClientInfo(rilievo)

      // Add serramenti sections
      if (rilievo.serramenti && rilievo.serramenti.length > 0) {
        for (const serramento of rilievo.serramenti) {
          this.addSerramento(serramento)
        }
      }

      // Add footer
      this.addFooter()

      return this.pdf.output("blob")
    } catch (error) {
      console.error("Error generating PDF:", error)
      throw error
    }
  }

  private async addHeader(rilievo: Rilievo) {
    // Add ALM logo (text-based for now, can be replaced with actual logo)
    this.pdf.setFontSize(24)
    this.pdf.setTextColor(this.almBlue)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text("A.L.M. INFISSI", this.margin, this.currentY)

    // Add subtitle
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(this.almGreen)
    this.pdf.setFont("helvetica", "normal")
    this.currentY += 8
    this.pdf.text("Rilevatore Misure Interattivo", this.margin, this.currentY)

    // Add separator line
    this.currentY += 5
    this.pdf.setDrawColor(this.almBlue)
    this.pdf.setLineWidth(0.5)
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY)

    // Add document title
    this.currentY += 10
    this.pdf.setFontSize(16)
    this.pdf.setTextColor(this.black)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text("SCHEDA RILIEVO SERRAMENTI", this.margin, this.currentY)

    // Add date
    this.pdf.setFontSize(10)
    this.pdf.setFont("helvetica", "normal")
    const dateStr = rilievo.data
      ? new Date(rilievo.data).toLocaleDateString("it-IT")
      : new Date().toLocaleDateString("it-IT")
    this.pdf.text(`Data: ${dateStr}`, this.pageWidth - this.margin - 40, this.currentY)

    this.currentY += 10
  }

  private addClientInfo(rilievo: Rilievo) {
    this.checkPageBreak(40)

    // Section title
    this.pdf.setFillColor(this.almBlue)
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 8, "F")
    this.pdf.setTextColor(255, 255, 255)
    this.pdf.setFontSize(12)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text("DATI CLIENTE E COMMESSA", this.margin + 3, this.currentY + 5.5)

    this.currentY += 12
    this.pdf.setTextColor(this.black)
    this.pdf.setFontSize(10)
    this.pdf.setFont("helvetica", "normal")

    const clientData = [
      { label: "Cliente", value: rilievo.cliente || "N/D" },
      { label: "Indirizzo", value: rilievo.indirizzo || "N/D" },
      { label: "Telefono", value: rilievo.celltel || "N/D" },
      { label: "Email", value: rilievo.email || "N/D" },
      { label: "N° Commessa", value: rilievo.commessa || "N/D" },
    ]

    for (const item of clientData) {
      this.pdf.setFont("helvetica", "bold")
      this.pdf.text(`${item.label}:`, this.margin + 5, this.currentY)
      this.pdf.setFont("helvetica", "normal")
      this.pdf.text(item.value, this.margin + 45, this.currentY)
      this.currentY += this.lineHeight
    }

    if (rilievo.note_header) {
      this.currentY += 2
      this.pdf.setFont("helvetica", "bold")
      this.pdf.text("Note:", this.margin + 5, this.currentY)
      this.currentY += this.lineHeight
      this.pdf.setFont("helvetica", "normal")
      const notes = this.pdf.splitTextToSize(rilievo.note_header, this.pageWidth - 2 * this.margin - 10)
      this.pdf.text(notes, this.margin + 5, this.currentY)
      this.currentY += notes.length * this.lineHeight
    }

    this.currentY += 5
  }

  private addSerramento(serramento: Serramento) {
    this.checkPageBreak(60)

    // Serramento header
    this.pdf.setFillColor(this.almGreen)
    this.pdf.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 8, "F")
    this.pdf.setTextColor(255, 255, 255)
    this.pdf.setFontSize(12)
    this.pdf.setFont("helvetica", "bold")
    this.pdf.text(
      `SERRAMENTO P${serramento.page_number} - ${serramento.tipologia || "Non specificato"}`,
      this.margin + 3,
      this.currentY + 5.5
    )

    this.currentY += 12
    this.pdf.setTextColor(this.black)
    this.pdf.setFontSize(9)

    // Dati Tipologia
    this.addSubSection("DATI TIPOLOGIA", [
      { label: "N° Pezzi", value: serramento.n_pezzi?.toString() || "N/D" },
      { label: "Tipologia", value: serramento.tipologia || "N/D" },
      { label: "Serie", value: serramento.serie || "N/D" },
      { label: "Nome", value: serramento.nome || "N/D" },
      {
        label: "Dimensioni (L x H)",
        value: `${serramento.larghezza || "N/D"} x ${serramento.altezza || "N/D"} mm`,
      },
      { label: "Descrizione", value: serramento.descrizione || "N/D" },
    ])

    // Misure Alette
    if (
      serramento.alette_dx ||
      serramento.alette_testa ||
      serramento.alette_sx ||
      serramento.alette_base
    ) {
      this.addSubSection("MISURE ALETTE", [
        { label: "Destra", value: `${serramento.alette_dx || "N/D"} mm` },
        { label: "Testa", value: `${serramento.alette_testa || "N/D"} mm` },
        { label: "Sinistra", value: `${serramento.alette_sx || "N/D"} mm` },
        { label: "Base", value: `${serramento.alette_base || "N/D"} mm` },
      ])
    }

    // Colori
    if (
      serramento.colore_interno ||
      serramento.colore_esterno ||
      serramento.colore_accessori
    ) {
      this.addSubSection("COLORI", [
        { label: "Interno Telaio", value: serramento.colore_interno || "N/D" },
        { label: "Esterno Telaio", value: serramento.colore_esterno || "N/D" },
        { label: "Accessori", value: serramento.colore_accessori || "N/D" },
        { label: "Interno Anta", value: serramento.c_interno_anta || "N/D" },
        { label: "Esterno Anta", value: serramento.c_esterno_anta || "N/D" },
      ])
    }

    // Ferramenta
    if (
      serramento.quantita_anta_ribalta ||
      serramento.tipologia_cerniere ||
      serramento.serrature
    ) {
      this.addSubSection("FERRAMENTA", [
        { label: "Ante Ribalta", value: serramento.quantita_anta_ribalta?.toString() || "N/D" },
        { label: "Cerniere", value: serramento.tipologia_cerniere || "N/D" },
        { label: "Serrature", value: serramento.serrature || "N/D" },
        { label: "Cilindro", value: serramento.cilindro || "N/D" },
      ])
    }

    // Apertura
    if (serramento.lato_apertura || serramento.tipologia_maniglia) {
      this.addSubSection("APERTURA", [
        { label: "Lato Apertura", value: serramento.lato_apertura || "N/D" },
        { label: "Altezza Maniglia", value: `${serramento.altezza_maniglia || "N/D"} mm` },
        { label: "Tipo Maniglia", value: serramento.tipologia_maniglia || "N/D" },
        { label: "Alette Aperture", value: serramento.alette_aperture || "N/D" },
      ])
    }

    // Opzioni
    if (serramento.linea_estetica_telai || serramento.tipo_anta) {
      this.addSubSection("OPZIONI ESTETICHE", [
        { label: "Linea Telai", value: serramento.linea_estetica_telai || "N/D" },
        { label: "Tipo Anta", value: serramento.tipo_anta || "N/D" },
        { label: "Linea Ante", value: serramento.linea_estetica_ante || "N/D" },
        { label: "Riporto Centrale", value: serramento.riporto_centrale || "N/D" },
      ])
    }

    // Traverso/Montante
    if (serramento.tipo_profilo || serramento.misura_traverso) {
      this.addSubSection("TRAVERSO/MONTANTE", [
        { label: "Tipo Profilo", value: serramento.tipo_profilo || "N/D" },
        { label: "Riferimento Misure", value: serramento.riferimento_misure || "N/D" },
        { label: "Misura Traverso", value: `${serramento.misura_traverso || "N/D"} mm` },
      ])
    }

    // Zanzariere
    if (serramento.zanzariere_tipologia) {
      this.addSubSection("ZANZARIERE", [
        { label: "Tipologia", value: serramento.zanzariere_tipologia || "N/D" },
        { label: "Colore", value: serramento.zanzariere_colore || "N/D" },
        { label: "Chiusura", value: serramento.zanzariere_chiusura || "N/D" },
        {
          label: "Dimensioni",
          value: `${serramento.zanzariere_x || "N/D"} x ${serramento.zanzariere_h || "N/D"} mm`,
        },
      ])
    }

    // Riempimenti
    if (serramento.vetri || serramento.pannelli) {
      this.addSubSection("RIEMPIMENTI", [
        { label: "Vetri", value: serramento.vetri || "N/D" },
        { label: "Pannelli", value: serramento.pannelli || "N/D" },
      ])
    }

    // Zoccolo/Fascia
    if (serramento.zoccolo || serramento.fascia_tipo) {
      this.addSubSection("ZOCCOLO/FASCIA", [
        { label: "Zoccolo", value: serramento.zoccolo || "N/D" },
        { label: "Altezza Fascia", value: `${serramento.fascia_h || "N/D"} mm` },
        { label: "Tipo Fascia", value: serramento.fascia_tipo || "N/D" },
      ])
    }

    // Oscuranti
    if (serramento.oscuranti_tipo) {
      this.addSubSection("OSCURANTI", [
        { label: "Tipo", value: serramento.oscuranti_tipo || "N/D" },
        {
          label: "Dimensioni",
          value: `${serramento.oscuranti_l || "N/D"} x ${serramento.oscuranti_h || "N/D"} mm`,
        },
      ])
    }

    // Note
    if (serramento.note) {
      this.currentY += 2
      this.pdf.setFont("helvetica", "bold")
      this.pdf.text("Note:", this.margin + 5, this.currentY)
      this.currentY += this.lineHeight
      this.pdf.setFont("helvetica", "normal")
      const notes = this.pdf.splitTextToSize(serramento.note, this.pageWidth - 2 * this.margin - 10)
      this.pdf.text(notes, this.margin + 5, this.currentY)
      this.currentY += notes.length * this.lineHeight
    }

    this.currentY += 8
  }

  private addSubSection(title: string, items: Array<{ label: string; value: string }>) {
    this.checkPageBreak(items.length * this.lineHeight + 10)

    this.pdf.setFont("helvetica", "bold")
    this.pdf.setFontSize(9)
    this.pdf.text(title, this.margin + 5, this.currentY)
    this.currentY += this.lineHeight

    this.pdf.setFont("helvetica", "normal")
    this.pdf.setFontSize(8)

    for (const item of items) {
      this.pdf.setFont("helvetica", "bold")
      this.pdf.text(`${item.label}:`, this.margin + 8, this.currentY)
      this.pdf.setFont("helvetica", "normal")
      this.pdf.text(item.value, this.margin + 55, this.currentY)
      this.currentY += this.lineHeight - 1
    }

    this.currentY += 3
  }

  private addFooter() {
    const totalPages = this.pdf.internal.pages.length - 1

    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i)
      this.pdf.setFontSize(8)
      this.pdf.setTextColor(128, 128, 128)
      this.pdf.setFont("helvetica", "normal")

      // Footer text
      const footerText = "Generato con RMI - A.L.M. Infissi"
      this.pdf.text(footerText, this.margin, this.pageHeight - 10)

      // Page number
      const pageText = `Pagina ${i} di ${totalPages}`
      const pageTextWidth = this.pdf.getTextWidth(pageText)
      this.pdf.text(pageText, this.pageWidth - this.margin - pageTextWidth, this.pageHeight - 10)

      // Generation date
      const dateText = new Date().toLocaleString("it-IT")
      const dateTextWidth = this.pdf.getTextWidth(dateText)
      this.pdf.text(
        dateText,
        this.pageWidth / 2 - dateTextWidth / 2,
        this.pageHeight - 10
      )
    }
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.currentY + requiredSpace > this.pageHeight - 20) {
      this.pdf.addPage()
      this.currentY = this.margin
    }
  }
}

export async function generatePDF(
  rilievo: Rilievo & { serramenti?: Serramento[] }
): Promise<Blob> {
  const generator = new PDFGenerator()
  return await generator.generate(rilievo)
}
