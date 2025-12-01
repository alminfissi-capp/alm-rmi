"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SerramentoFormData } from "@/lib/types/database.types"

interface SectionProps {
  formData: SerramentoFormData
  updateField: (field: keyof SerramentoFormData, value: string) => void
  readOnly?: boolean
}

// OPZIONI Section
export function OpzioniSection({ formData, updateField, readOnly = false }: SectionProps) {
  return (
    <div className="border-[3px] border-alm-blue rounded-sm bg-background p-4">
      <h3 className="text-xs font-bold uppercase mb-4 text-alm-blue">Opzioni</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[140px]">Linea Estetica Telai</Label>
          <Input value={formData.linea_estetica_telai} onChange={(e) => updateField("linea_estetica_telai", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" disabled={readOnly} />
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[140px]">Tipo Anta</Label>
          <Input value={formData.tipo_anta} onChange={(e) => updateField("tipo_anta", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" disabled={readOnly} />
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[140px]">Linea Estetica Ante</Label>
          <Input value={formData.linea_estetica_ante} onChange={(e) => updateField("linea_estetica_ante", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" disabled={readOnly} />
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[140px]">Riporto Centrale</Label>
          <Input value={formData.riporto_centrale} onChange={(e) => updateField("riporto_centrale", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" disabled={readOnly} />
        </div>
      </div>
    </div>
  )
}

// APERTURA Section
export function AperturaSection({ formData, updateField, readOnly = false }: SectionProps) {
  return (
    <div className="border-[3px] border-alm-blue rounded-sm bg-background p-4">
      <h3 className="text-xs font-bold uppercase mb-4 text-alm-blue">Apertura</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[120px]">Lato Apertura</Label>
          <Input value={formData.lato_apertura} onChange={(e) => updateField("lato_apertura", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" placeholder="DX/SX" disabled={readOnly} />
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[120px]">Altezza Maniglia</Label>
          <div className="flex-1 flex items-center gap-2">
            <Input type="number" step="0.01" value={formData.altezza_maniglia} onChange={(e) => updateField("altezza_maniglia", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" placeholder="0.00" disabled={readOnly} />
            <span className="text-xs text-muted-foreground min-w-[30px]">mm</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[120px]">Tipologia Maniglia</Label>
          <Input value={formData.tipologia_maniglia} onChange={(e) => updateField("tipologia_maniglia", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" disabled={readOnly} />
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[120px]">Alette Aperture</Label>
          <Input value={formData.alette_aperture} onChange={(e) => updateField("alette_aperture", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" disabled={readOnly} />
        </div>
      </div>
    </div>
  )
}

// RIEMPIMENTI Section
export function RiempientiSection({ formData, updateField, readOnly = false }: SectionProps) {
  return (
    <div className="border-[3px] border-alm-blue rounded-sm bg-background p-4">
      <h3 className="text-xs font-bold uppercase mb-4 text-alm-blue">Riempimenti</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[80px]">Vetri</Label>
          <Input value={formData.vetri} onChange={(e) => updateField("vetri", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" placeholder="Tipo vetri..." disabled={readOnly} />
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[80px]">Pannelli</Label>
          <Input value={formData.pannelli} onChange={(e) => updateField("pannelli", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" placeholder="Tipo pannelli..." disabled={readOnly} />
        </div>
      </div>
    </div>
  )
}

// TRAVERSO/MONTANTE Section
export function TraversoMontanteSection({ formData, updateField, readOnly = false }: SectionProps) {
  return (
    <div className="border-[3px] border-alm-blue rounded-sm bg-background p-4">
      <h3 className="text-xs font-bold uppercase mb-4 text-alm-blue">Traverso/Montante</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[140px]">Tipo Profilo</Label>
          <Input value={formData.tipo_profilo} onChange={(e) => updateField("tipo_profilo", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" disabled={readOnly} />
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[140px]">Riferimento Misure</Label>
          <Input value={formData.riferimento_misure} onChange={(e) => updateField("riferimento_misure", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" disabled={readOnly} />
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[140px]">Misura Traverso</Label>
          <div className="flex-1 flex items-center gap-2">
            <Input type="number" step="0.01" value={formData.misura_traverso} onChange={(e) => updateField("misura_traverso", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" placeholder="0.00" disabled={readOnly} />
            <span className="text-xs text-muted-foreground min-w-[30px]">mm</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ZOCCOLO & FASCIA Section
export function ZoccoloFasciaSection({ formData, updateField, readOnly = false }: SectionProps) {
  return (
    <div className="border-[3px] border-alm-blue rounded-sm bg-background p-4">
      <h3 className="text-xs font-bold uppercase mb-4 text-alm-blue">Zoccolo & Fascia</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[100px]">Zoccolo</Label>
          <Input value={formData.zoccolo} onChange={(e) => updateField("zoccolo", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" disabled={readOnly} />
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[100px]">Fascia H</Label>
          <div className="flex-1 flex items-center gap-2">
            <Input type="number" step="0.01" value={formData.fascia_h} onChange={(e) => updateField("fascia_h", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" placeholder="0.00" disabled={readOnly} />
            <span className="text-xs text-muted-foreground min-w-[30px]">mm</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[100px]">Fascia Tipo</Label>
          <Input value={formData.fascia_tipo} onChange={(e) => updateField("fascia_tipo", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" disabled={readOnly} />
        </div>
      </div>
    </div>
  )
}

// OSCURANTI Section
export function OscurantiSection({ formData, updateField, readOnly = false }: SectionProps) {
  return (
    <div className="border-[3px] border-alm-blue rounded-sm bg-background p-4">
      <h3 className="text-xs font-bold uppercase mb-4 text-alm-blue">Oscuranti</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[100px]">Tipo</Label>
          <Input value={formData.oscuranti_tipo} onChange={(e) => updateField("oscuranti_tipo", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" placeholder="Tipo oscurante..." disabled={readOnly} />
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[100px]">L (Larghezza)</Label>
          <div className="flex-1 flex items-center gap-2">
            <Input type="number" step="0.01" value={formData.oscuranti_l} onChange={(e) => updateField("oscuranti_l", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" placeholder="0.00" disabled={readOnly} />
            <span className="text-xs text-muted-foreground min-w-[30px]">mm</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Label className="text-xs font-bold min-w-[100px]">H (Altezza)</Label>
          <div className="flex-1 flex items-center gap-2">
            <Input type="number" step="0.01" value={formData.oscuranti_h} onChange={(e) => updateField("oscuranti_h", e.target.value)} className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm" placeholder="0.00" disabled={readOnly} />
            <span className="text-xs text-muted-foreground min-w-[30px]">mm</span>
          </div>
        </div>
      </div>
    </div>
  )
}
