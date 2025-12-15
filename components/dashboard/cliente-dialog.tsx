"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClienteFormData, EMPTY_CLIENTE_FORM } from "@/lib/types/database.types"
import { CLIENTE_TIPOLOGIE_LABELS } from "@/lib/config/constants"

interface ClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  clienteId?: string | null
  initialData?: Partial<ClienteFormData>
}

export function ClienteDialog({
  open,
  onOpenChange,
  onSuccess,
  clienteId,
  initialData,
}: ClienteDialogProps) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!clienteId

  const form = useForm<ClienteFormData>({
    defaultValues: initialData || EMPTY_CLIENTE_FORM,
  })

  useEffect(() => {
    if (open && initialData) {
      form.reset(initialData)
    } else if (open && !initialData) {
      form.reset(EMPTY_CLIENTE_FORM)
    }
  }, [open, initialData, form])

  const onSubmit = async (data: ClienteFormData) => {
    setLoading(true)

    const url = isEdit ? `/api/clienti/${clienteId}` : '/api/clienti'
    const method = isEdit ? 'PUT' : 'POST'

    const promise = fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Errore durante il salvataggio')
      }
      return response.json()
    })

    toast.promise(promise, {
      loading: isEdit ? "Aggiornamento cliente..." : "Creazione cliente...",
      success: () => {
        setLoading(false)
        form.reset()
        onSuccess()
        onOpenChange(false)
        return isEdit ? "Cliente aggiornato con successo!" : "Cliente creato con successo!"
      },
      error: (err) => {
        setLoading(false)
        return err.message || "Errore durante il salvataggio"
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Modifica Cliente' : 'Nuovo Cliente'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome (required) */}
            <FormField
              control={form.control}
              name="nome"
              rules={{ required: "Nome obbligatorio", minLength: { value: 2, message: "Minimo 2 caratteri" } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Cliente *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipologia */}
            <FormField
              control={form.control}
              name="tipologia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipologia</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipologia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CLIENTE_TIPOLOGIE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ragione Sociale */}
            <FormField
              control={form.control}
              name="ragione_sociale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ragione Sociale</FormLabel>
                  <FormControl>
                    <Input placeholder="Solo per aziende" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* P.IVA / CF */}
            <FormField
              control={form.control}
              name="partita_iva_cf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>P.IVA / Codice Fiscale</FormLabel>
                  <FormControl>
                    <Input placeholder="IT12345678901" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Indirizzo */}
            <FormField
              control={form.control}
              name="indirizzo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indirizzo</FormLabel>
                  <FormControl>
                    <Input placeholder="Via, città, provincia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Telefono & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono</FormLabel>
                    <FormControl>
                      <Input placeholder="+39 ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="cliente@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Note */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note aggiuntive..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Annulla
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? 'Salva Modifiche' : 'Crea Cliente'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
