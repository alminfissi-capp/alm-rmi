"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SerramentoFormData } from "@/lib/types/database.types"

interface ZanzariereSectionProps {
  formData: SerramentoFormData
  updateField: (field: keyof SerramentoFormData, value: string) => void
  readOnly?: boolean
}

export function ZanzariereSection({
  formData,
  updateField,
  readOnly = false,
}: ZanzariereSectionProps) {
  return (
    <div className="border-[3px] border-alm-blue rounded-sm bg-background p-4">
      <h3 className="text-xs font-bold uppercase mb-4 text-alm-blue">
        Zanzariere
      </h3>

      <div className="space-y-3">
        {/* Tipologia */}
        <div className="flex items-center gap-3">
          <Label htmlFor="zanzariere_tipologia" className="text-xs font-bold min-w-[100px]">
            Tipologia
          </Label>
          <Input
            id="zanzariere_tipologia"
            value={formData.zanzariere_tipologia}
            onChange={(e) => updateField("zanzariere_tipologia", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="RULLO CASSONETTO 42"
            disabled={readOnly}
          />
        </div>

        {/* Colore */}
        <div className="flex items-center gap-3">
          <Label htmlFor="zanzariere_colore" className="text-xs font-bold min-w-[100px]">
            Colore
          </Label>
          <Input
            id="zanzariere_colore"
            value={formData.zanzariere_colore}
            onChange={(e) => updateField("zanzariere_colore", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="Colore..."
            disabled={readOnly}
          />
        </div>

        {/* Chiusura */}
        <div className="flex items-center gap-3">
          <Label htmlFor="zanzariere_chiusura" className="text-xs font-bold min-w-[100px]">
            Chiusura
          </Label>
          <Input
            id="zanzariere_chiusura"
            value={formData.zanzariere_chiusura}
            onChange={(e) => updateField("zanzariere_chiusura", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="Tipo chiusura..."
            disabled={readOnly}
          />
        </div>

        {/* X (Larghezza) */}
        <div className="flex items-center gap-3">
          <Label htmlFor="zanzariere_x" className="text-xs font-bold min-w-[100px]">
            X (Larghezza)
          </Label>
          <div className="flex-1 flex items-center gap-2">
            <Input
              id="zanzariere_x"
              type="number"
              step="0.01"
              value={formData.zanzariere_x}
              onChange={(e) => updateField("zanzariere_x", e.target.value)}
              className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
              placeholder="0.00"
              disabled={readOnly}
            />
            <span className="text-xs text-muted-foreground min-w-[30px]">mm</span>
          </div>
        </div>

        {/* H (Altezza) */}
        <div className="flex items-center gap-3">
          <Label htmlFor="zanzariere_h" className="text-xs font-bold min-w-[100px]">
            H (Altezza)
          </Label>
          <div className="flex-1 flex items-center gap-2">
            <Input
              id="zanzariere_h"
              type="number"
              step="0.01"
              value={formData.zanzariere_h}
              onChange={(e) => updateField("zanzariere_h", e.target.value)}
              className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
              placeholder="0.00"
              disabled={readOnly}
            />
            <span className="text-xs text-muted-foreground min-w-[30px]">mm</span>
          </div>
        </div>
      </div>
    </div>
  )
}
