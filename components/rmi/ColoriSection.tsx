"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SerramentoFormData } from "@/lib/types/database.types"
import { FINITURE } from "@/lib/constants"

interface ColoriSectionProps {
  formData: SerramentoFormData
  updateField: (field: keyof SerramentoFormData, value: string) => void
  readOnly?: boolean
}

export function ColoriSection({
  formData,
  updateField,
  readOnly = false,
}: ColoriSectionProps) {
  return (
    <div className="border-[3px] border-alm-blue rounded-sm bg-background p-4">
      <h3 className="text-xs font-bold uppercase mb-4 text-alm-blue">
        Colori
      </h3>

      <div className="space-y-3">
        {/* Colore Interno */}
        <div className="flex items-center gap-3">
          <Label htmlFor="colore_interno" className="text-xs font-bold min-w-[120px]">
            Colore Interno
          </Label>
          <Input
            id="colore_interno"
            value={formData.colore_interno}
            onChange={(e) => updateField("colore_interno", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="RAL o descrizione..."
            disabled={readOnly}
          />
        </div>

        {/* Colore Esterno */}
        <div className="flex items-center gap-3">
          <Label htmlFor="colore_esterno" className="text-xs font-bold min-w-[120px]">
            Colore Esterno
          </Label>
          <Input
            id="colore_esterno"
            value={formData.colore_esterno}
            onChange={(e) => updateField("colore_esterno", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="RAL o descrizione..."
            disabled={readOnly}
          />
        </div>

        {/* Colore Accessori */}
        <div className="flex items-center gap-3">
          <Label htmlFor="colore_accessori" className="text-xs font-bold min-w-[120px]">
            Colore Accessori
          </Label>
          <Select
            value={formData.colore_accessori}
            onValueChange={(value) => updateField("colore_accessori", value)}
            disabled={readOnly}
          >
            <SelectTrigger className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm">
              <SelectValue placeholder="Seleziona finitura..." />
            </SelectTrigger>
            <SelectContent>
              {FINITURE.map((finitura) => (
                <SelectItem key={finitura} value={finitura} className="text-sm">
                  {finitura}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* C. Interno Anta */}
        <div className="flex items-center gap-3">
          <Label htmlFor="c_interno_anta" className="text-xs font-bold min-w-[120px]">
            C. Interno Anta
          </Label>
          <Input
            id="c_interno_anta"
            value={formData.c_interno_anta}
            onChange={(e) => updateField("c_interno_anta", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="Colore..."
            disabled={readOnly}
          />
        </div>

        {/* C. Esterno Anta */}
        <div className="flex items-center gap-3">
          <Label htmlFor="c_esterno_anta" className="text-xs font-bold min-w-[120px]">
            C. Esterno Anta
          </Label>
          <Input
            id="c_esterno_anta"
            value={formData.c_esterno_anta}
            onChange={(e) => updateField("c_esterno_anta", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="Colore..."
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  )
}
