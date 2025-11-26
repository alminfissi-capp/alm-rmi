'use client'

// ============================================
// HeaderSection Component - Esempio Template
// Sezione dati cliente/commessa
// ============================================

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RilievoFormData } from '@/lib/types/database.types'

interface HeaderSectionProps {
  formData: RilievoFormData
  updateField: (field: keyof RilievoFormData, value: string) => void
}

export function HeaderSection({ formData, updateField }: HeaderSectionProps) {
  return (
    <div className="border-[3px] border-alm-blue bg-white">
      {/* Logo laterale + Grid header */}
      <div className="grid grid-cols-[40px_1fr_1fr] gap-0">
        {/* Logo Cell */}
        <div className="row-span-4 border-r-2 border-alm-blue p-1 flex items-center justify-center">
          <div className="w-9 h-[70px] bg-gradient-to-br from-alm-blue via-alm-blue to-alm-green clip-parallelogram" />
        </div>

        {/* Row 1: Cliente + Data */}
        <div className="flex items-center border-r-2 border-b-2 border-alm-blue p-1">
          <Label className="text-[10px] font-bold mr-2">CLIENTE</Label>
        </div>
        <div className="flex items-center border-b-2 border-alm-blue p-1">
          <Input
            value={formData.cliente}
            onChange={(e) => updateField('cliente', e.target.value)}
            className="border-none text-[11px] h-6 p-1"
          />
        </div>

        <div className="flex items-center border-r-2 border-b-2 border-alm-blue p-1">
          <Label className="text-[10px] font-bold mr-2">DATA</Label>
        </div>
        <div className="flex items-center border-b-2 border-alm-blue p-1">
          <Input
            type="date"
            value={formData.data}
            onChange={(e) => updateField('data', e.target.value)}
            className="border-none text-[11px] h-6 p-1"
          />
        </div>

        {/* Row 2: Indirizzo (span 4 colonne) */}
        <div className="flex items-center border-r-2 border-b-2 border-alm-blue p-1">
          <Label className="text-[10px] font-bold mr-2">INDIRIZZO</Label>
        </div>
        <div className="col-span-4 flex items-center border-b-2 border-alm-blue p-1">
          <Input
            value={formData.indirizzo}
            onChange={(e) => updateField('indirizzo', e.target.value)}
            className="border-none text-[11px] h-6 p-1"
          />
        </div>

        {/* Row 3: Cell/Tel + Email */}
        <div className="flex items-center border-r-2 border-b-2 border-alm-blue p-1">
          <Label className="text-[10px] font-bold mr-2">CELL./TEL</Label>
        </div>
        <div className="flex items-center border-b-2 border-alm-blue p-1">
          <Input
            value={formData.celltel}
            onChange={(e) => updateField('celltel', e.target.value)}
            className="border-none text-[11px] h-6 p-1"
          />
        </div>

        <div className="flex items-center border-r-2 border-b-2 border-alm-blue p-1">
          <Label className="text-[10px] font-bold mr-2">EMAIL</Label>
        </div>
        <div className="col-span-2 flex items-center border-b-2 border-alm-blue p-1">
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="border-none text-[11px] h-6 p-1"
          />
        </div>

        {/* Row 4: Note + Commessa */}
        <div className="flex items-center border-r-2 border-alm-blue p-1">
          <Label className="text-[10px] font-bold mr-2">NOTE</Label>
        </div>
        <div className="col-span-2 flex items-center border-alm-blue p-1">
          <Input
            value={formData.note_header}
            onChange={(e) => updateField('note_header', e.target.value)}
            className="border-none text-[11px] h-6 p-1"
          />
        </div>

        <div className="flex items-center border-r-2 border-alm-blue p-1">
          <Label className="text-[10px] font-bold mr-2">COMMESSA</Label>
        </div>
        <div className="flex items-center border-alm-blue p-1">
          <Input
            value={formData.commessa}
            onChange={(e) => updateField('commessa', e.target.value)}
            className="border-none text-[11px] h-6 p-1"
          />
        </div>
      </div>
    </div>
  )
}

// CSS aggiuntivo per il logo parallelogramma
// Aggiungi in globals.css:
/*
.clip-parallelogram {
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
}
*/
