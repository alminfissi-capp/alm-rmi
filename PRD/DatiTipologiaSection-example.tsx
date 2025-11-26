'use client'

// ============================================
// DatiTipologiaSection - Esempio Template
// Sezione dati tipologia serramento
// ============================================

import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SerramentoFormData, TIPOLOGIE, SERIE } from '@/lib/types/database.types'

interface DatiTipologiaSectionProps {
  formData: SerramentoFormData
  updateField: (field: keyof SerramentoFormData, value: string) => void
  pageNumber: string // P1, P2, ecc.
}

export function DatiTipologiaSection({
  formData,
  updateField,
  pageNumber,
}: DatiTipologiaSectionProps) {
  return (
    <div className="border-[3px] border-alm-blue p-2 bg-white">
      {/* Page Tag */}
      <div className="bg-alm-blue text-white px-2 py-0.5 text-[11px] font-bold -mx-2 -mt-2 mb-2 border-r-2 border-alm-blue inline-block">
        {pageNumber}
      </div>

      {/* Section Title */}
      <div className="bg-alm-blue text-white px-2 py-0.5 text-[10px] font-bold uppercase -mx-2 -mt-2 mb-2">
        DATI TIPOLOGIA
      </div>

      {/* Form Fields using FieldRow pattern */}
      <div className="space-y-1.5">
        <FieldRow
          label="N° PEZZI"
          value={formData.n_pezzi}
          onChange={(value) => updateField('n_pezzi', value)}
          type="number"
        />

        <FieldRowSelect
          label="TIPOLOGIA"
          value={formData.tipologia}
          onChange={(value) => updateField('tipologia', value)}
          options={TIPOLOGIE}
        />

        <FieldRowSelect
          label="SERIE"
          value={formData.serie}
          onChange={(value) => updateField('serie', value)}
          options={SERIE}
        />

        <FieldRow
          label="NOME"
          value={formData.nome}
          onChange={(value) => updateField('nome', value)}
        />

        <FieldRow
          label="LARGHEZZA"
          value={formData.larghezza}
          onChange={(value) => updateField('larghezza', value)}
          type="number"
          unit="mm"
        />

        <FieldRow
          label="ALTEZZA"
          value={formData.altezza}
          onChange={(value) => updateField('altezza', value)}
          type="number"
          unit="mm"
        />

        <FieldRowTextarea
          label="DESC."
          value={formData.descrizione}
          onChange={(value) => updateField('descrizione', value)}
        />

        <FieldRowTextarea
          label="NOTE"
          value={formData.note}
          onChange={(value) => updateField('note', value)}
        />
      </div>
    </div>
  )
}

// ============================================
// Componenti Utility - FieldRow Pattern
// ============================================

interface FieldRowProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'number' | 'email' | 'date'
  unit?: string
  placeholder?: string
}

function FieldRow({
  label,
  value,
  onChange,
  type = 'text',
  unit,
  placeholder,
}: FieldRowProps) {
  return (
    <div className="flex items-center gap-1">
      <Label className="text-[9px] font-bold min-w-[80px]">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border border-black text-[10px] h-6 px-1"
      />
      {unit && <span className="text-[9px] text-gray-600">{unit}</span>}
    </div>
  )
}

interface FieldRowSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  placeholder?: string
}

function FieldRowSelect({
  label,
  value,
  onChange,
  options,
  placeholder = '.',
}: FieldRowSelectProps) {
  return (
    <div className="flex items-center gap-1">
      <Label className="text-[9px] font-bold min-w-[80px]">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="flex-1 border border-black text-[10px] h-6 px-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option} className="text-[10px]">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface FieldRowTextareaProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function FieldRowTextarea({
  label,
  value,
  onChange,
  placeholder,
}: FieldRowTextareaProps) {
  return (
    <div className="flex gap-1">
      <Label className="text-[9px] font-bold min-w-[80px] pt-1">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border border-black text-[10px] min-h-[50px] px-1 py-1 resize-y"
      />
    </div>
  )
}
