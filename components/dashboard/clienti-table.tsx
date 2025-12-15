"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ClienteConRilievi } from "@/lib/types/database.types"
import { CLIENTE_TIPOLOGIE_LABELS } from "@/lib/config/constants"

interface ClientiTableProps {
  clienti: ClienteConRilievi[]
  loading: boolean
  onEdit: (cliente: ClienteConRilievi) => void
  onDeleted: () => void
}

export function ClientiTable({ clienti, loading, onEdit, onDeleted }: ClientiTableProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<ClienteConRilievi | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!clienteToDelete) return

    setDeleting(true)
    const deletePromise = fetch(`/api/clienti/${clienteToDelete.id}`, {
      method: "DELETE",
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Errore durante l'eliminazione")
      }
      return response.json()
    })

    toast.promise(deletePromise, {
      loading: "Eliminazione cliente...",
      success: (result) => {
        setDeleting(false)
        setDeleteDialogOpen(false)
        setClienteToDelete(null)
        onDeleted()
        if (result.numRilievi > 0) {
          return `Cliente eliminato. ${result.numRilievi} rilievi ora scollegati.`
        }
        return "Cliente eliminato con successo!"
      },
      error: (err) => {
        setDeleting(false)
        return err.message || "Errore durante l'eliminazione"
      },
    })
  }

  const getTipologiaBadgeVariant = (tipologia: string) => {
    switch (tipologia) {
      case 'privato':
        return 'secondary'
      case 'azienda':
        return 'default'
      case 'altro':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  if (loading || !clienti) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (clienti.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nessun cliente trovato
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Ragione Sociale</TableHead>
              <TableHead>Tipologia</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Rilievi</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clienti.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell className="font-medium">{cliente.nome}</TableCell>
                <TableCell>{cliente.ragione_sociale || '-'}</TableCell>
                <TableCell>
                  <Badge variant={getTipologiaBadgeVariant(cliente.tipologia)}>
                    {CLIENTE_TIPOLOGIE_LABELS[cliente.tipologia]}
                  </Badge>
                </TableCell>
                <TableCell>{cliente.telefono || '-'}</TableCell>
                <TableCell>{cliente.email || '-'}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{cliente.num_rilievi}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Apri menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(`/rubrica/${cliente.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizza
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(cliente)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifica
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => {
                          setClienteToDelete(cliente)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Elimina
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare il cliente <strong>{clienteToDelete?.nome}</strong>?
              {clienteToDelete && clienteToDelete.num_rilievi > 0 && (
                <span className="block mt-2 text-orange-600">
                  ⚠️ Questo cliente ha {clienteToDelete.num_rilievi} rilievo/i collegato/i.
                  I rilievi non verranno eliminati ma saranno scollegati dalla rubrica.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annulla</AlertDialogCancel>
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
