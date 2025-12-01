"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SerramentoFormData } from "@/lib/types/database.types"
import { TIPOLOGIE, SERIE } from "@/lib/constants"

interface DatiTipologiaSectionProps {
  formData: SerramentoFormData
  updateField: (field: keyof SerramentoFormData, value: string) => void
  readOnly?: boolean
}

export function DatiTipologiaSection({
  formData,
  updateField,
  readOnly = false,
}: DatiTipologiaSectionProps) {
  return (
    <div className="border-[3px] border-alm-blue rounded-sm bg-background p-4">
      <h3 className="text-xs font-bold uppercase mb-4 text-alm-blue">
        Dati Tipologia
      </h3>

      <div className="space-y-3">
        {/* N° Pezzi */}
        <div className="flex items-center gap-3">
          <Label htmlFor="n_pezzi" className="text-xs font-bold min-w-[100px]">
            N° Pezzi
          </Label>
          <Input
            id="n_pezzi"
            type="number"
            min="1"
            value={formData.n_pezzi}
            onChange={(e) => updateField("n_pezzi", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="1"
            disabled={readOnly}
          />
        </div>

        {/* Tipologia */}
        <div className="flex items-center gap-3">
          <Label htmlFor="tipologia" className="text-xs font-bold min-w-[100px]">
            Tipologia
          </Label>
          <Select
            value={formData.tipologia}
            onValueChange={(value) => updateField("tipologia", value)}
            disabled={readOnly}
          >
            <SelectTrigger className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm">
              <SelectValue placeholder="Seleziona tipologia..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {TIPOLOGIE.map((tipo) => (
                <SelectItem key={tipo} value={tipo} className="text-sm">
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Serie */}
        <div className="flex items-center gap-3">
          <Label htmlFor="serie" className="text-xs font-bold min-w-[100px]">
            Serie
          </Label>
          <Select
            value={formData.serie}
            onValueChange={(value) => updateField("serie", value)}
            disabled={readOnly}
          >
            <SelectTrigger className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm">
              <SelectValue placeholder="Seleziona serie..." />
            </SelectTrigger>
            <SelectContent>
              {SERIE.map((s) => (
                <SelectItem key={s} value={s} className="text-sm">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nome */}
        <div className="flex items-center gap-3">
          <Label htmlFor="nome" className="text-xs font-bold min-w-[100px]">
            Nome
          </Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => updateField("nome", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
            placeholder="Nome serramento..."
            disabled={readOnly}
          />
        </div>

        {/* Larghezza */}
        <div className="flex items-center gap-3">
          <Label htmlFor="larghezza" className="text-xs font-bold min-w-[100px]">
            Larghezza
          </Label>
          <div className="flex-1 flex items-center gap-2">
            <Input
              id="larghezza"
              type="number"
              step="0.01"
              value={formData.larghezza}
              onChange={(e) => updateField("larghezza", e.target.value)}
              className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
              placeholder="0.00"
              disabled={readOnly}
            />
            <span className="text-xs text-muted-foreground min-w-[30px]">mm</span>
          </div>
        </div>

        {/* Altezza */}
        <div className="flex items-center gap-3">
          <Label htmlFor="altezza" className="text-xs font-bold min-w-[100px]">
            Altezza
          </Label>
          <div className="flex-1 flex items-center gap-2">
            <Input
              id="altezza"
              type="number"
              step="0.01"
              value={formData.altezza}
              onChange={(e) => updateField("altezza", e.target.value)}
              className="flex-1 border-2 border-black/20 focus:border-alm-blue h-8 text-sm"
              placeholder="0.00"
              disabled={readOnly}
            />
            <span className="text-xs text-muted-foreground min-w-[30px]">mm</span>
          </div>
        </div>

        {/* Descrizione */}
        <div className="flex items-start gap-3">
          <Label htmlFor="descrizione" className="text-xs font-bold min-w-[100px] pt-2">
            Descrizione
          </Label>
          <Textarea
            id="descrizione"
            value={formData.descrizione}
            onChange={(e) => updateField("descrizione", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue resize-none text-sm"
            rows={3}
            placeholder="Descrizione dettagliata..."
            disabled={readOnly}
          />
        </div>

        {/* Note */}
        <div className="flex items-start gap-3">
          <Label htmlFor="note" className="text-xs font-bold min-w-[100px] pt-2">
            Note
          </Label>
          <Textarea
            id="note"
            value={formData.note}
            onChange={(e) => updateField("note", e.target.value)}
            className="flex-1 border-2 border-black/20 focus:border-alm-blue resize-none text-sm"
            rows={3}
            placeholder="Note aggiuntive..."
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  )
}
