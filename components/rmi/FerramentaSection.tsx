"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SerramentoFormData } from "@/lib/types/database.types"

interface FerramentaSectionProps {
  formData: SerramentoFormData
  updateField: (field: keyof SerramentoFormData, value: string) => void
  readOnly?: boolean
}

export function FerramentaSection({
  formData,
  updateField,
  readOnly = false,
}: FerramentaSectionProps) {
  return (
    <div className="border-[3px] border-alm-blue rounded-sm bg-background p-4">
      <h3 className="text-xs font-bold uppercase mb-4 text-alm-blue">
        Ferramenta
      </h3>

      <div className="space-y-3">
        {/* Quantità Anta Ribalta */}
        <div className="flex items-center gap-3">
          <Label htmlFor="quantita_anta_ribalta" className="text-xs font-bold min-w-[140px]">
            Qt. Anta Ribalta
          </Label>
          <Input
            id="quantita_anta_ribalta"
            type="number"
            min="0"
            value={formData.quantita_anta_ribalta}
            onChange={(e) => updateField("quantita_anta_ribalta", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="0"
            disabled={readOnly}
          />
        </div>

        {/* Tipologia Cerniere */}
        <div className="flex items-center gap-3">
          <Label htmlFor="tipologia_cerniere" className="text-xs font-bold min-w-[140px]">
            Tipologia Cerniere
          </Label>
          <Input
            id="tipologia_cerniere"
            value={formData.tipologia_cerniere}
            onChange={(e) => updateField("tipologia_cerniere", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="Descrizione cerniere..."
            disabled={readOnly}
          />
        </div>

        {/* Serrature */}
        <div className="flex items-center gap-3">
          <Label htmlFor="serrature" className="text-xs font-bold min-w-[140px]">
            Serrature
          </Label>
          <Input
            id="serrature"
            value={formData.serrature}
            onChange={(e) => updateField("serrature", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="Tipo serrature..."
            disabled={readOnly}
          />
        </div>

        {/* Cilindro */}
        <div className="flex items-center gap-3">
          <Label htmlFor="cilindro" className="text-xs font-bold min-w-[140px]">
            Cilindro
          </Label>
          <Input
            id="cilindro"
            value={formData.cilindro}
            onChange={(e) => updateField("cilindro", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="Tipo cilindro..."
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  )
}
