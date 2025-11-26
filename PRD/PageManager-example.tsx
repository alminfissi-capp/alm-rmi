'use client'

// ============================================
// PageManager Component - Esempio Template
// Gestisce i tab P1, P2, P3... con pulsanti +/-
// ============================================

import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { PageName } from '@/lib/types/database.types'

interface PageManagerProps {
  pages: PageName[]
  currentPage: PageName
  onPageChange: (page: PageName) => void
  onPageAdd: () => void
  onPageRemove: (page: PageName) => void
}

export function PageManager({
  pages,
  currentPage,
  onPageChange,
  onPageAdd,
  onPageRemove,
}: PageManagerProps) {
  const handleRemovePage = (page: PageName) => {
    if (pages.length === 1) {
      alert('Non puoi eliminare l\'ultima pagina!')
      return
    }
    
    if (confirm(`Vuoi davvero eliminare ${page}?`)) {
      onPageRemove(page)
    }
  }

  return (
    <div className="flex gap-1 flex-wrap mb-4">
      {/* Pulsante Aggiungi Pagina */}
      <Button
        onClick={onPageAdd}
        className="bg-alm-green hover:bg-alm-green/90 text-white font-bold"
        size="sm"
        title="Aggiungi nuova pagina"
      >
        <Plus className="h-4 w-4" />
      </Button>

      {/* Tab per ogni pagina */}
      {pages.map((page, index) => (
        <div key={page} className="flex items-stretch">
          {/* Tab Pagina */}
          <Button
            onClick={() => onPageChange(page)}
            variant={currentPage === page ? 'default' : 'outline'}
            className={`rounded-r-none ${
              currentPage === page
                ? 'bg-alm-blue hover:bg-alm-blue/90 text-white'
                : 'border-alm-blue text-alm-blue hover:bg-alm-blue/10'
            }`}
            size="sm"
          >
            {page} - Serramento {index + 1}
          </Button>

          {/* Pulsante Elimina (se più di 1 pagina) */}
          {pages.length > 1 && (
            <Button
              onClick={() => handleRemovePage(page)}
              variant="outline"
              className="rounded-l-none border-l-0 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              size="sm"
              title={`Elimina ${page}`}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
