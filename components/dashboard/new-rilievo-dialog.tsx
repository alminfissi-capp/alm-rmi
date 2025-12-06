"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { it } from "date-fns/locale"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface NewRilievoDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onRilievoCreated?: () => void
}

type FormData = {
  cliente: string
  data: Date
  indirizzo: string
  celltel: string
  email: string
  note_header: string
}

export function NewRilievoDialog({
  children,
  open,
  onOpenChange,
  onRilievoCreated,
}: NewRilievoDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const form = useForm<FormData>({
    defaultValues: {
      cliente: "",
      data: new Date(),
      indirizzo: "",
      celltel: "",
      email: "",
      note_header: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    const createPromise = fetch("/api/rilievi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error("Errore durante la creazione del rilievo")
      }
      return response.json()
    })

    toast.promise(createPromise, {
      loading: "Creazione rilievo in corso...",
      success: (result) => {
        form.reset()
        onRilievoCreated?.()
        setLoading(false)
        // Redirect to rilievo edit page
        if (result.rilievo?.id) {
          setTimeout(() => router.push(`/rilievo/${result.rilievo.id}`), 500)
        }
        return "Rilievo creato con successo!"
      },
      error: (err) => {
        setLoading(false)
        console.error("Error creating rilievo:", err)
        return "Errore durante la creazione del rilievo"
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuovo Rilievo</DialogTitle>
          <DialogDescription>
            Crea un nuovo progetto/commessa inserendo i dati del cliente. Il numero commessa sarà generato automaticamente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: it })
                          ) : (
                            <span>Seleziona una data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="indirizzo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indirizzo</FormLabel>
                  <FormControl>
                    <Input placeholder="Via, città" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="celltel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cellulare/Telefono</FormLabel>
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

            <FormField
              control={form.control}
              name="note_header"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Note aggiuntive..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
                disabled={loading}
              >
                Annulla
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crea Rilievo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
