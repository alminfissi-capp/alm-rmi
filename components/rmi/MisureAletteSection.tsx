"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SerramentoFormData } from "@/lib/types/database.types"

interface MisureAletteSectionProps {
  formData: SerramentoFormData
  updateField: (field: keyof SerramentoFormData, value: string) => void
  readOnly?: boolean
}

export function MisureAletteSection({
  formData,
  updateField,
  readOnly = false,
}: MisureAletteSectionProps) {
  return (
    <div className="border-[3px] border-alm-blue rounded-sm bg-background p-4">
      <h3 className="text-xs font-bold uppercase mb-4 text-alm-blue">
        Misure Speciali Alette
      </h3>

      <div className="space-y-3">
        {/* Alette DX */}
        <div className="flex items-center gap-3">
          <Label htmlFor="alette_dx" className="text-xs font-bold min-w-[100px]">
            Alette DX
          </Label>
          <div className="flex-1 flex items-center gap-2">
            <Input
              id="alette_dx"
              type="number"
              step="0.01"
              value={formData.alette_dx}
              onChange={(e) => updateField("alette_dx", e.target.value)}
              className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
              placeholder="0.00"
              disabled={readOnly}
            />
            <span className="text-xs text-muted-foreground min-w-[30px]">mm</span>
          </div>
        </div>

        {/* Alette Testa */}
        <div className="flex items-center gap-3">
          <Label htmlFor="alette_testa" className="text-xs font-bold min-w-[100px]">
            Alette Testa
          </Label>
          <div className="flex-1 flex items-center gap-2">
            <Input
              id="alette_testa"
              type="number"
              step="0.01"
              value={formData.alette_testa}
              onChange={(e) => updateField("alette_testa", e.target.value)}
              className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
              placeholder="0.00"
              disabled={readOnly}
            />
            <span className="text-xs text-muted-foreground min-w-[30px]">mm</span>
          </div>
        </div>

        {/* Alette SX */}
        <div className="flex items-center gap-3">
          <Label htmlFor="alette_sx" className="text-xs font-bold min-w-[100px]">
            Alette SX
          </Label>
          <div className="flex-1 flex items-center gap-2">
            <Input
              id="alette_sx"
              type="number"
              step="0.01"
              value={formData.alette_sx}
              onChange={(e) => updateField("alette_sx", e.target.value)}
              className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
              placeholder="0.00"
              disabled={readOnly}
            />
            <span className="text-xs text-muted-foreground min-w-[30px]">mm</span>
          </div>
        </div>

        {/* Alette Base */}
        <div className="flex items-center gap-3">
          <Label htmlFor="alette_base" className="text-xs font-bold min-w-[100px]">
            Alette Base
          </Label>
          <div className="flex-1 flex items-center gap-2">
            <Input
              id="alette_base"
              type="number"
              step="0.01"
              value={formData.alette_base}
              onChange={(e) => updateField("alette_base", e.target.value)}
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
