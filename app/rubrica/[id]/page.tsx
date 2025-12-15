"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Pencil, Trash2, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ClienteDialog } from "@/components/dashboard/cliente-dialog"
import { Cliente, ClienteFormData } from "@/lib/types/database.types"
import { CLIENTE_TIPOLOGIE_LABELS } from "@/lib/config/constants"
import { format } from "date-fns"
import { it } from "date-fns/locale"

interface ClienteWithRilievi extends Cliente {
  rilievi: Array<{
    id: string
    commessa: string | null
    data: string | null
    status: string
    created_at: string
  }>
}

export default function ClienteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [cliente, setCliente] = useState<ClienteWithRilievi | null>(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCliente()
  }, [params.id])

  const fetchCliente = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/clienti/${params.id}`)
      if (!response.ok) throw new Error("Cliente non trovato")
      const { cliente } = await response.json()
      setCliente(cliente)
    } catch (error) {
      console.error('Error fetching cliente:', error)
      toast.error("Errore nel caricamento del cliente")
      router.push('/rubrica')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    const deletePromise = fetch(`/api/clienti/${params.id}`, {
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
        router.push('/rubrica')
        return "Cliente eliminato con successo!"
      },
      error: (err) => {
        setDeleting(false)
        return err.message || "Errore durante l'eliminazione"
      },
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!cliente) {
    return null
  }

  const initialData: ClienteFormData = {
    nome: cliente.nome,
    indirizzo: cliente.indirizzo || '',
    telefono: cliente.telefono || '',
    email: cliente.email || '',
    partita_iva_cf: cliente.partita_iva_cf || '',
    ragione_sociale: cliente.ragione_sociale || '',
    tipologia: cliente.tipologia,
    note: cliente.note || '',
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/rubrica')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{cliente.nome}</h1>
            <p className="text-muted-foreground">Dettaglio cliente</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifica
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Elimina
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Informazioni Cliente</CardTitle>
            <Badge>{CLIENTE_TIPOLOGIE_LABELS[cliente.tipologia]}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nome</p>
            <p className="text-base">{cliente.nome}</p>
          </div>

          {cliente.ragione_sociale && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ragione Sociale</p>
              <p className="text-base">{cliente.ragione_sociale}</p>
            </div>
          )}

          {cliente.partita_iva_cf && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">P.IVA / CF</p>
              <p className="text-base">{cliente.partita_iva_cf}</p>
            </div>
          )}

          {cliente.indirizzo && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Indirizzo</p>
              <p className="text-base">{cliente.indirizzo}</p>
            </div>
          )}

          {cliente.telefono && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telefono</p>
              <p className="text-base">{cliente.telefono}</p>
            </div>
          )}

          {cliente.email && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{cliente.email}</p>
            </div>
          )}

          {cliente.note && (
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Note</p>
              <p className="text-base">{cliente.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rilievi Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rilievi Collegati</CardTitle>
              <CardDescription>{cliente.rilievi.length} rilievi per questo cliente</CardDescription>
            </div>
            <Button onClick={() => router.push('/rilievi')}>
              <Plus className="mr-2 h-4 w-4" />
              Nuovo Rilievo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {cliente.rilievi.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Nessun rilievo collegato a questo cliente
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commessa</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cliente.rilievi.map((rilievo) => (
                    <TableRow key={rilievo.id}>
                      <TableCell className="font-medium">{rilievo.commessa || '-'}</TableCell>
                      <TableCell>
                        {rilievo.data ? format(new Date(rilievo.data), "PPP", { locale: it }) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{rilievo.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/rilievo/${rilievo.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <ClienteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={fetchCliente}
        clienteId={cliente.id}
        initialData={initialData}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare il cliente <strong>{cliente.nome}</strong>?
              {cliente.rilievi.length > 0 && (
                <span className="block mt-2 text-orange-600">
                  ⚠️ Questo cliente ha {cliente.rilievi.length} rilievo/i collegato/i.
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
    </div>
  )
}
