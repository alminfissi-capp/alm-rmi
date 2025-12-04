"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import { toast } from "sonner"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  Mail,
  ChevronDown,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Rilievo {
  id: string
  cliente: string | null
  data: string | null
  indirizzo: string | null
  commessa: string | null
  status: string
  created_at: string
  num_serramenti: number
  creator_email?: string | null
}

interface RilieviTableProps {
  rilievi: Rilievo[]
  loading: boolean
  onRefresh: () => void
}

const statusConfig = {
  bozza: {
    label: "Bozza",
    variant: "secondary" as const,
    className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
  },
  in_lavorazione: {
    label: "In lavorazione",
    variant: "default" as const,
    className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
  },
  completato: {
    label: "Completato",
    variant: "default" as const,
    className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
  },
  archiviato: {
    label: "Archiviato",
    variant: "outline" as const,
    className: "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
  },
}

const statusOptions = [
  { value: "bozza", label: "Bozza" },
  { value: "in_lavorazione", label: "In lavorazione" },
  { value: "completato", label: "Completato" },
  { value: "archiviato", label: "Archiviato" },
]

export function RilieviTable({ rilievi, loading, onRefresh }: RilieviTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)

    const deletePromise = fetch(`/api/rilievi/${deleteId}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Errore durante l'eliminazione")
      }
      return response
    })

    toast.promise(deletePromise, {
      loading: "Eliminazione in corso...",
      success: () => {
        setDeleting(false)
        setDeleteId(null)
        onRefresh()
        return "Rilievo eliminato con successo"
      },
      error: (err) => {
        console.error("Error deleting rilievo:", err)
        setDeleting(false)
        setDeleteId(null)
        return "Errore durante l'eliminazione del rilievo"
      },
    })
  }

  const handleGeneratePDF = async (rilievoId: string) => {
    setGeneratingPdfId(rilievoId)

    const generatePromise = fetch("/api/pdf/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rilievoId }),
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Errore durante la generazione del PDF")
      }
      return response.json()
    })

    toast.promise(generatePromise, {
      loading: "Generazione PDF in corso...",
      success: (data) => {
        setGeneratingPdfId(null)

        // Download the PDF
        if (data.pdf?.downloadUrl) {
          window.open(data.pdf.downloadUrl, "_blank")
        }

        return "PDF generato con successo!"
      },
      error: (err) => {
        console.error("Error generating PDF:", err)
        setGeneratingPdfId(null)
        return err.message || "Errore durante la generazione del PDF"
      },
    })
  }

  const handleStatusChange = async (rilievoId: string, newStatus: string) => {
    setUpdatingStatusId(rilievoId)

    const updatePromise = fetch(`/api/rilievi/${rilievoId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Errore durante l'aggiornamento dello stato")
      }
      return response.json()
    })

    toast.promise(updatePromise, {
      loading: "Aggiornamento stato...",
      success: () => {
        setUpdatingStatusId(null)
        onRefresh()
        const statusLabel = statusOptions.find(s => s.value === newStatus)?.label || newStatus
        return `Stato aggiornato a "${statusLabel}"`
      },
      error: (err) => {
        console.error("Error updating status:", err)
        setUpdatingStatusId(null)
        return err.message || "Errore durante l'aggiornamento dello stato"
      },
    })
  }

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Commessa</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Serramenti</TableHead>
              <TableHead>Creato da</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (rilievi.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Nessun rilievo trovato</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Inizia creando il tuo primo rilievo
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Commessa</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Serramenti</TableHead>
              <TableHead>Creato da</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rilievi.map((rilievo) => {
              const statusInfo = statusConfig[rilievo.status as keyof typeof statusConfig] || statusConfig.bozza

              return (
                <TableRow key={rilievo.id}>
                  <TableCell className="font-medium">
                    {rilievo.cliente || <span className="text-muted-foreground">N/A</span>}
                  </TableCell>
                  <TableCell>
                    {rilievo.commessa || <span className="text-muted-foreground">N/A</span>}
                  </TableCell>
                  <TableCell>
                    {rilievo.data
                      ? format(new Date(rilievo.data), "dd MMM yyyy", { locale: it })
                      : <span className="text-muted-foreground">N/A</span>
                    }
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={updatingStatusId === rilievo.id}>
                        <Button
                          variant="ghost"
                          className="h-auto p-0 hover:bg-transparent"
                          disabled={updatingStatusId === rilievo.id}
                        >
                          <Badge
                            variant={statusInfo.variant}
                            className={`cursor-pointer hover:opacity-80 ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                            <ChevronDown className="ml-1 h-3 w-3" />
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Cambia stato</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {statusOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => handleStatusChange(rilievo.id, option.value)}
                            disabled={option.value === rilievo.status}
                          >
                            {option.label}
                            {option.value === rilievo.status && " (corrente)"}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {rilievo.num_serramenti}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {rilievo.creator_email || <span className="text-muted-foreground italic">N/A</span>}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Apri menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/rilievo/${rilievo.id}?mode=view`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizza
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/rilievo/${rilievo.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifica
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleGeneratePDF(rilievo.id)}
                          disabled={generatingPdfId === rilievo.id}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {generatingPdfId === rilievo.id ? "Generando..." : "Genera PDF"}
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <Mail className="mr-2 h-4 w-4" />
                          Invia Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(rilievo.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Elimina
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione non può essere annullata. Il rilievo e tutti i serramenti associati verranno eliminati permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Eliminazione..." : "Elimina"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
