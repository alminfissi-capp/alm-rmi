"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClientiTable } from "@/components/dashboard/clienti-table"
import { ClienteDialog } from "@/components/dashboard/cliente-dialog"
import { ClienteConRilievi, ClienteFormData } from "@/lib/types/database.types"
import { CLIENTE_TIPOLOGIE_LABELS } from "@/lib/config/constants"

export function RubricaClient() {
  const router = useRouter()
  const [clienti, setClienti] = useState<ClienteConRilievi[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [tipologia, setTipologia] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<ClienteConRilievi | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  useEffect(() => {
    fetchClienti()
  }, [search, tipologia])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, tipologia])

  const fetchClienti = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (tipologia && tipologia !== 'all') params.append('tipologia', tipologia)

      const response = await fetch(`/api/clienti?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setClienti(data.clienti || [])
    } catch (error) {
      console.error('Error fetching clienti:', error)
      setClienti([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (cliente: ClienteConRilievi) => {
    setEditingCliente(cliente)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingCliente(null)
  }

  const handleSuccess = () => {
    fetchClienti()
  }

  // Stats
  const totalClienti = clienti?.length || 0
  const clientiPrivati = clienti?.filter(c => c.tipologia === 'privato').length || 0
  const clientiAziende = clienti?.filter(c => c.tipologia === 'azienda').length || 0

  // Pagination
  const totalPages = Math.ceil(totalClienti / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedClienti = clienti.slice(startIndex, endIndex)

  const initialData: ClienteFormData | undefined = editingCliente ? {
    nome: editingCliente.nome,
    indirizzo: editingCliente.indirizzo || '',
    telefono: editingCliente.telefono || '',
    email: editingCliente.email || '',
    partita_iva_cf: editingCliente.partita_iva_cf || '',
    ragione_sociale: editingCliente.ragione_sociale || '',
    tipologia: editingCliente.tipologia,
    note: editingCliente.note || '',
  } : undefined

  return (
    <div className="flex flex-1 flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rubrica Clienti</h2>
          <p className="text-muted-foreground">Gestisci l'anagrafica dei tuoi clienti</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Cliente
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex gap-3">
        <Input
          placeholder="Cerca clienti..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={tipologia} onValueChange={setTipologia}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipologia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte</SelectItem>
            {Object.entries(CLIENTE_TIPOLOGIE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <ClientiTable
        clienti={paginatedClienti}
        loading={loading}
        onEdit={handleEdit}
        onDeleted={handleSuccess}
      />

      {/* Pagination Controls */}
      {!loading && totalClienti > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalClienti)} di {totalClienti} clienti
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Precedente
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Mostra sempre: prima, ultima, corrente, e 1 pagina prima e dopo della corrente
                  return page === 1 ||
                         page === totalPages ||
                         Math.abs(page - currentPage) <= 1
                })
                .map((page, idx, arr) => (
                  <div key={page} className="flex items-center">
                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-9"
                    >
                      {page}
                    </Button>
                  </div>
                ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Successivo
            </Button>
          </div>
        </div>
      )}

      {/* Dialog */}
      <ClienteDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSuccess={handleSuccess}
        clienteId={editingCliente?.id}
        initialData={initialData}
      />
    </div>
  )
}
