"use client"

import { useState, useEffect, useCallback } from "react"
import { PageManager } from "./PageManager"
import { HeaderSection } from "./HeaderSection"
import { DatiTipologiaSection } from "./DatiTipologiaSection"
import { MisureAletteSection } from "./MisureAletteSection"
import { ColoriSection } from "./ColoriSection"
import { FerramentaSection } from "./FerramentaSection"
import { ZanzariereSection } from "./ZanzariereSection"
import {
  OpzioniSection,
  AperturaSection,
  RiempientiSection,
  TraversoMontanteSection,
  ZoccoloFasciaSection,
  OscurantiSection,
} from "./OtherSections"
import {
  PageName,
  RilievoFormData,
  SerramentoFormData,
  EMPTY_RILIEVO_FORM,
  EMPTY_SERRAMENTO_FORM,
  Rilievo,
  Serramento,
} from "@/lib/types/database.types"
import { Loader2 } from "lucide-react"

interface RMIFormProps {
  rilievo: Rilievo & { serramenti?: Serramento[] }
  onUpdate?: () => void
  readOnly?: boolean
}

export function RMIForm({ rilievo, onUpdate, readOnly = false }: RMIFormProps) {
  const [saving, setSaving] = useState(false)

  // Header form data
  const [headerData, setHeaderData] = useState<RilievoFormData>(EMPTY_RILIEVO_FORM)

  // Pages and serramenti data
  const [pages, setPages] = useState<PageName[]>(["P1"])
  const [currentPage, setCurrentPage] = useState<PageName>("P1")
  const [serramenti, setSerramenti] = useState<Record<string, SerramentoFormData>>({
    P1: EMPTY_SERRAMENTO_FORM,
  })
  const [serramentoIds, setSerramentoIds] = useState<Record<string, string>>({})

  // Initialize form data from rilievo
  useEffect(() => {
    if (rilievo) {
      // Set header data
      setHeaderData({
        cliente: rilievo.cliente || "",
        data: rilievo.data || "",
        indirizzo: rilievo.indirizzo || "",
        celltel: rilievo.celltel || "",
        email: rilievo.email || "",
        note_header: rilievo.note_header || "",
        commessa: rilievo.commessa || "",
      })

      // Set serramenti data
      if (rilievo.serramenti && rilievo.serramenti.length > 0) {
        const newPages: PageName[] = []
        const newSerramenti: Record<string, SerramentoFormData> = {}
        const newIds: Record<string, string> = {}

        rilievo.serramenti.forEach((serramento) => {
          const pageName = `P${serramento.page_number}` as PageName
          newPages.push(pageName)
          newIds[pageName] = serramento.id

          newSerramenti[pageName] = {
            n_pezzi: serramento.n_pezzi?.toString() || "",
            tipologia: serramento.tipologia || "",
            serie: serramento.serie || "",
            nome: serramento.nome || "",
            larghezza: serramento.larghezza?.toString() || "",
            altezza: serramento.altezza?.toString() || "",
            descrizione: serramento.descrizione || "",
            note: serramento.note || "",
            alette_dx: serramento.alette_dx?.toString() || "",
            alette_testa: serramento.alette_testa?.toString() || "",
            alette_sx: serramento.alette_sx?.toString() || "",
            alette_base: serramento.alette_base?.toString() || "",
            colore_interno: serramento.colore_interno || "",
            colore_esterno: serramento.colore_esterno || "",
            colore_accessori: serramento.colore_accessori || "",
            c_interno_anta: serramento.c_interno_anta || "",
            c_esterno_anta: serramento.c_esterno_anta || "",
            quantita_anta_ribalta: serramento.quantita_anta_ribalta?.toString() || "",
            tipologia_cerniere: serramento.tipologia_cerniere || "",
            serrature: serramento.serrature || "",
            cilindro: serramento.cilindro || "",
            linea_estetica_telai: serramento.linea_estetica_telai || "",
            tipo_anta: serramento.tipo_anta || "",
            linea_estetica_ante: serramento.linea_estetica_ante || "",
            riporto_centrale: serramento.riporto_centrale || "",
            lato_apertura: serramento.lato_apertura || "",
            altezza_maniglia: serramento.altezza_maniglia?.toString() || "",
            tipologia_maniglia: serramento.tipologia_maniglia || "",
            alette_aperture: serramento.alette_aperture || "",
            tipo_profilo: serramento.tipo_profilo || "",
            riferimento_misure: serramento.riferimento_misure || "",
            misura_traverso: serramento.misura_traverso?.toString() || "",
            zanzariere_tipologia: serramento.zanzariere_tipologia || "RULLO CASSONETTO 42",
            zanzariere_colore: serramento.zanzariere_colore || "",
            zanzariere_chiusura: serramento.zanzariere_chiusura || "",
            zanzariere_x: serramento.zanzariere_x?.toString() || "",
            zanzariere_h: serramento.zanzariere_h?.toString() || "",
            vetri: serramento.vetri || "",
            pannelli: serramento.pannelli || "",
            zoccolo: serramento.zoccolo || "",
            fascia_h: serramento.fascia_h?.toString() || "",
            fascia_tipo: serramento.fascia_tipo || "",
            oscuranti_tipo: serramento.oscuranti_tipo || "",
            oscuranti_l: serramento.oscuranti_l?.toString() || "",
            oscuranti_h: serramento.oscuranti_h?.toString() || "",
          }
        })

        setPages(newPages)
        setSerramenti(newSerramenti)
        setSerramentoIds(newIds)
        if (newPages.length > 0) {
          setCurrentPage(newPages[0])
        }
      }
    }
  }, [rilievo])

  // Update header field
  const updateHeaderField = useCallback((field: keyof RilievoFormData, value: string) => {
    setHeaderData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Update serramento field
  const updateSerramentoField = useCallback((field: keyof SerramentoFormData, value: string) => {
    setSerramenti((prev) => ({
      ...prev,
      [currentPage]: {
        ...prev[currentPage],
        [field]: value,
      },
    }))
  }, [currentPage])

  // Add new page
  const handleAddPage = useCallback(() => {
    const nextPageNumber = pages.length + 1
    const newPage = `P${nextPageNumber}` as PageName
    setPages((prev) => [...prev, newPage])
    setSerramenti((prev) => ({
      ...prev,
      [newPage]: EMPTY_SERRAMENTO_FORM,
    }))
    setCurrentPage(newPage)
  }, [pages.length])

  // Remove page
  const handleRemovePage = useCallback(async (page: PageName) => {
    if (pages.length <= 1) return

    const pageIndex = pages.indexOf(page)
    const newPages = pages.filter((p) => p !== page)

    // Delete serramento from database if it exists
    const serramentoId = serramentoIds[page]
    if (serramentoId) {
      try {
        await fetch(`/api/serramenti/${serramentoId}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Error deleting serramento:", error)
      }
    }

    // Update local state
    setPages(newPages)
    const newSerramenti = { ...serramenti }
    delete newSerramenti[page]
    setSerramenti(newSerramenti)

    // Switch to another page
    if (currentPage === page) {
      const newIndex = Math.max(0, pageIndex - 1)
      setCurrentPage(newPages[newIndex])
    }
  }, [pages, serramenti, currentPage, serramentoIds])

  // Auto-save effect (debounced)
  useEffect(() => {
    if (readOnly) return

    const timer = setTimeout(() => {
      handleSave()
    }, 2000)

    return () => clearTimeout(timer)
  }, [headerData, serramenti, readOnly])

  // Save function
  const handleSave = async () => {
    setSaving(true)
    try {
      // Update rilievo header
      await fetch(`/api/rilievi/${rilievo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(headerData),
      })

      // Update or create serramenti
      for (const [page, data] of Object.entries(serramenti)) {
        const pageNumber = parseInt(page.substring(1))
        const serramentoId = serramentoIds[page]

        const payload = {
          rilievo_id: rilievo.id,
          page_number: pageNumber,
          n_pezzi: data.n_pezzi ? parseInt(data.n_pezzi) : null,
          tipologia: data.tipologia || null,
          serie: data.serie || null,
          nome: data.nome || null,
          larghezza: data.larghezza ? parseFloat(data.larghezza) : null,
          altezza: data.altezza ? parseFloat(data.altezza) : null,
          descrizione: data.descrizione || null,
          note: data.note || null,
          alette_dx: data.alette_dx ? parseFloat(data.alette_dx) : null,
          alette_testa: data.alette_testa ? parseFloat(data.alette_testa) : null,
          alette_sx: data.alette_sx ? parseFloat(data.alette_sx) : null,
          alette_base: data.alette_base ? parseFloat(data.alette_base) : null,
          colore_interno: data.colore_interno || null,
          colore_esterno: data.colore_esterno || null,
          colore_accessori: data.colore_accessori || null,
          c_interno_anta: data.c_interno_anta || null,
          c_esterno_anta: data.c_esterno_anta || null,
          quantita_anta_ribalta: data.quantita_anta_ribalta ? parseInt(data.quantita_anta_ribalta) : null,
          tipologia_cerniere: data.tipologia_cerniere || null,
          serrature: data.serrature || null,
          cilindro: data.cilindro || null,
          linea_estetica_telai: data.linea_estetica_telai || null,
          tipo_anta: data.tipo_anta || null,
          linea_estetica_ante: data.linea_estetica_ante || null,
          riporto_centrale: data.riporto_centrale || null,
          lato_apertura: data.lato_apertura || null,
          altezza_maniglia: data.altezza_maniglia ? parseFloat(data.altezza_maniglia) : null,
          tipologia_maniglia: data.tipologia_maniglia || null,
          alette_aperture: data.alette_aperture || null,
          tipo_profilo: data.tipo_profilo || null,
          riferimento_misure: data.riferimento_misure || null,
          misura_traverso: data.misura_traverso ? parseFloat(data.misura_traverso) : null,
          zanzariere_tipologia: data.zanzariere_tipologia || null,
          zanzariere_colore: data.zanzariere_colore || null,
          zanzariere_chiusura: data.zanzariere_chiusura || null,
          zanzariere_x: data.zanzariere_x ? parseFloat(data.zanzariere_x) : null,
          zanzariere_h: data.zanzariere_h ? parseFloat(data.zanzariere_h) : null,
          vetri: data.vetri || null,
          pannelli: data.pannelli || null,
          zoccolo: data.zoccolo || null,
          fascia_h: data.fascia_h ? parseFloat(data.fascia_h) : null,
          fascia_tipo: data.fascia_tipo || null,
          oscuranti_tipo: data.oscuranti_tipo || null,
          oscuranti_l: data.oscuranti_l ? parseFloat(data.oscuranti_l) : null,
          oscuranti_h: data.oscuranti_h ? parseFloat(data.oscuranti_h) : null,
        }

        if (serramentoId) {
          // Update existing
          await fetch(`/api/serramenti/${serramentoId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        } else {
          // Create new
          const response = await fetch("/api/serramenti", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
          const result = await response.json()
          if (result.serramento) {
            setSerramentoIds((prev) => ({
              ...prev,
              [page]: result.serramento.id,
            }))
          }
        }
      }

      onUpdate?.()
    } catch (error) {
      console.error("Error saving:", error)
      // TODO: Show error toast
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Save indicator */}
      {saving && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-background border rounded-md px-3 py-2 shadow-lg">
          <Loader2 className="h-4 w-4 animate-spin text-alm-blue" />
          <span className="text-sm text-muted-foreground">Salvataggio...</span>
        </div>
      )}

      {/* Page Manager */}
      <PageManager
        pages={pages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageAdd={handleAddPage}
        onPageRemove={handleRemovePage}
        readOnly={readOnly}
      />

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header Section */}
        <HeaderSection formData={headerData} updateField={updateHeaderField} readOnly={readOnly} />

        {/* Serramento Form - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <DatiTipologiaSection
              formData={serramenti[currentPage]}
              updateField={updateSerramentoField}
              readOnly={readOnly}
            />
            <ColoriSection
              formData={serramenti[currentPage]}
              updateField={updateSerramentoField}
              readOnly={readOnly}
            />
            <OpzioniSection
              formData={serramenti[currentPage]}
              updateField={updateSerramentoField}
              readOnly={readOnly}
            />
          </div>

          {/* Center Column - Placeholder for Tipologia Visualization */}
          <div className="space-y-4">
            <div className="border-[3px] border-alm-blue rounded-sm bg-gradient-to-br from-alm-blue/5 to-alm-green/5 p-8 min-h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-sm font-medium mb-2">Tipologia Telaio</p>
                <p className="text-xs">
                  {serramenti[currentPage]?.tipologia || "Nessuna tipologia selezionata"}
                </p>
                <p className="text-xs mt-4 opacity-50">Visualizzazione grafica - Da implementare</p>
              </div>
            </div>
            <TraversoMontanteSection
              formData={serramenti[currentPage]}
              updateField={updateSerramentoField}
              readOnly={readOnly}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <MisureAletteSection
              formData={serramenti[currentPage]}
              updateField={updateSerramentoField}
              readOnly={readOnly}
            />
            <FerramentaSection
              formData={serramenti[currentPage]}
              updateField={updateSerramentoField}
              readOnly={readOnly}
            />
            <AperturaSection
              formData={serramenti[currentPage]}
              updateField={updateSerramentoField}
              readOnly={readOnly}
            />
            <ZanzariereSection
              formData={serramenti[currentPage]}
              updateField={updateSerramentoField}
              readOnly={readOnly}
            />
            <RiempientiSection
              formData={serramenti[currentPage]}
              updateField={updateSerramentoField}
              readOnly={readOnly}
            />
            <ZoccoloFasciaSection
              formData={serramenti[currentPage]}
              updateField={updateSerramentoField}
              readOnly={readOnly}
            />
            <OscurantiSection
              formData={serramenti[currentPage]}
              updateField={updateSerramentoField}
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
