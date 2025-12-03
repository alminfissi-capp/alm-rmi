"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RilieviTable } from "@/components/dashboard/rilievi-table"
import { NewRilievoDialog } from "@/components/dashboard/new-rilievo-dialog"

export function DashboardClient() {
  const [rilievi, setRilievi] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchRilievi = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/rilievi?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setRilievi(data.rilievi)
      }
    } catch (error) {
      console.error("Error fetching rilievi:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRilievi()
  }, [search, statusFilter])

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRilievi()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [search, statusFilter])

  const handleRilievoCreated = () => {
    setIsDialogOpen(false)
    fetchRilievi()
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rilievi</h2>
          <p className="text-muted-foreground">
            Gestisci i tuoi progetti e commesse
          </p>
        </div>
        <NewRilievoDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onRilievoCreated={handleRilievoCreated}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Rilievo
          </Button>
        </NewRilievoDialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per cliente, commessa o indirizzo..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Stato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti gli stati</SelectItem>
            <SelectItem value="bozza">Bozza</SelectItem>
            <SelectItem value="in_lavorazione">In lavorazione</SelectItem>
            <SelectItem value="completato">Completato</SelectItem>
            <SelectItem value="archiviato">Archiviato</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <RilieviTable
        rilievi={rilievi}
        loading={loading}
        onRefresh={fetchRilievi}
      />
    </div>
  )
}
