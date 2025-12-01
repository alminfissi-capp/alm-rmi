"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RilievoFormData } from "@/lib/types/database.types"
import Logo from "@/public/alm.svg"

interface HeaderSectionProps {
  formData: RilievoFormData
  updateField: (field: keyof RilievoFormData, value: string) => void
  readOnly?: boolean
}

export function HeaderSection({ formData, updateField, readOnly = false }: HeaderSectionProps) {
  return (
    <div className="border-[3px] border-alm-blue rounded-sm bg-background mb-4">
      <div className="grid grid-cols-12 gap-0">
        {/* Logo Column */}
        <div className="col-span-12 md:col-span-2 border-r-2 border-alm-blue p-4 flex items-center justify-center bg-gradient-to-br from-alm-blue/5 to-alm-green/5">
          <Logo
            className="w-20 h-20 rounded-xl"
            aria-label="A.L.M. Infissi Logo"
          />
        </div>

        {/* Form Fields Column */}
        <div className="col-span-12 md:col-span-10 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Row 1 */}
            <div className="space-y-1.5">
              <Label htmlFor="cliente" className="text-xs font-bold uppercase">
                Cliente
              </Label>
              <Input
                id="cliente"
                value={formData.cliente}
                onChange={(e) => updateField("cliente", e.target.value)}
                className="border-2 border-black/20 focus:border-alm-blue"
                placeholder="Nome cliente..."
                disabled={readOnly}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="data" className="text-xs font-bold uppercase">
                Data
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => updateField("data", e.target.value)}
                className="border-2 border-black/20 focus:border-alm-blue"
                disabled={readOnly}
              />
            </div>

            {/* Row 2 - Indirizzo (full width) */}
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="indirizzo" className="text-xs font-bold uppercase">
                Indirizzo
              </Label>
              <Input
                id="indirizzo"
                value={formData.indirizzo}
                onChange={(e) => updateField("indirizzo", e.target.value)}
                className="border-2 border-black/20 focus:border-alm-blue"
                placeholder="Via, città, provincia..."
                disabled={readOnly}
              />
            </div>

            {/* Row 3 */}
            <div className="space-y-1.5">
              <Label htmlFor="celltel" className="text-xs font-bold uppercase">
                Cell./Tel.
              </Label>
              <Input
                id="celltel"
                type="tel"
                value={formData.celltel}
                onChange={(e) => updateField("celltel", e.target.value)}
                className="border-2 border-black/20 focus:border-alm-blue"
                placeholder="+39 ..."
                disabled={readOnly}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="border-2 border-black/20 focus:border-alm-blue"
                placeholder="cliente@email.com"
                disabled={readOnly}
              />
            </div>

            {/* Row 4 */}
            <div className="space-y-1.5">
              <Label htmlFor="note_header" className="text-xs font-bold uppercase">
                Note
              </Label>
              <Textarea
                id="note_header"
                value={formData.note_header}
                onChange={(e) => updateField("note_header", e.target.value)}
                className="border-2 border-black/20 focus:border-alm-blue resize-none"
                rows={2}
                placeholder="Note aggiuntive..."
                disabled={readOnly}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="commessa" className="text-xs font-bold uppercase">
                Commessa
              </Label>
              <Input
                id="commessa"
                value={formData.commessa}
                onChange={(e) => updateField("commessa", e.target.value)}
                className="border-2 border-black/20 focus:border-alm-blue"
                placeholder="N° commessa..."
                disabled={readOnly}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
