"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Cliente } from "@/lib/types/database.types"

interface ClienteComboboxProps {
  value?: string | null
  onChange: (clienteId: string | null, cliente?: Cliente) => void
  onAddNew: () => void
}

export function ClienteCombobox({ value, onChange, onAddNew }: ClienteComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [clienti, setClienti] = React.useState<Cliente[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    fetchClienti()
  }, [])

  const fetchClienti = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/clienti')
      const { clienti } = await response.json()
      setClienti(clienti)
    } catch (error) {
      console.error('Error fetching clienti:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedCliente = clienti.find((c) => c.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCliente ? selectedCliente.nome : "Seleziona cliente da rubrica..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Cerca cliente..." />
          <CommandList>
            <CommandEmpty>
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">Nessun cliente trovato</p>
                <Button variant="outline" size="sm" onClick={() => { setOpen(false); onAddNew(); }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Aggiungi Nuovo Cliente
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {clienti.map((cliente) => (
                <CommandItem
                  key={cliente.id}
                  value={cliente.nome}
                  onSelect={() => {
                    onChange(cliente.id, cliente)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cliente.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{cliente.nome}</span>
                    {cliente.ragione_sociale && (
                      <span className="text-xs text-muted-foreground">{cliente.ragione_sociale}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => { setOpen(false); onAddNew(); }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi Nuovo Cliente
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
