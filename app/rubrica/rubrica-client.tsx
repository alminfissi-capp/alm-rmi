"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Plus, Loader2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ClientiTable } from "@/components/dashboard/clienti-table"
import { ClienteDialog } from "@/components/dashboard/cliente-dialog"
import { GoogleContactsConsentDialog } from "@/components/google-contacts-consent-dialog"
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
  const [syncing, setSyncing] = useState(false)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [checkingGoogle, setCheckingGoogle] = useState(true)
  const [consentDialogOpen, setConsentDialogOpen] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false) // true = mostra dialog per connessione, false = per sync
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)

  useEffect(() => {
    fetchClienti()
    checkGoogleConnection()
    checkConsent()
  }, [search, tipologia])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, tipologia])

  const checkGoogleConnection = async () => {
    try {
      setCheckingGoogle(true)
      const response = await fetch('/api/auth/google-status')
      if (response.ok) {
        const data = await response.json()
        setGoogleConnected(data.canSync)
      }
    } catch (error) {
      console.error('Error checking Google connection:', error)
    } finally {
      setCheckingGoogle(false)
    }
  }

  const checkConsent = async () => {
    try {
      const response = await fetch('/api/consent/check?type=google_contacts_sync')
      if (response.ok) {
        const data = await response.json()
        setHasConsent(data.hasConsent)
      }
    } catch (error) {
      console.error('Error checking consent:', error)
    }
  }

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
      console.log('Clienti data:', data)
      setClienti(data.clienti || [])
    } catch (error) {
      console.error('Error fetching clienti:', error)
      toast.error("Errore nel caricamento dei clienti")
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

  const handleConnectGoogle = async () => {
    // Se l'utente non è ancora connesso a Google, mostra sempre il dialog del consenso
    // anche se ha già dato il consenso in passato (potrebbe aver revocato l'accesso)
    if (!googleConnected) {
      setIsConnecting(true)
      setConsentDialogOpen(true)
      return
    }

    // Se è già connesso (caso improbabile), procedi direttamente
    performGoogleConnection()
  }

  const performGoogleConnection = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/rubrica`,
          scopes: 'https://www.googleapis.com/auth/contacts.readonly',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Error connecting Google:', error)
        toast.error('Errore durante la connessione con Google')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('Errore imprevisto durante la connessione')
    }
  }

  const handleSyncGoogle = async () => {
    // Il consenso è già stato dato al momento della connessione
    // Procedi direttamente con la sincronizzazione
    performSync()
  }

  const handleConsentAccept = async () => {
    try {
      setSyncing(true)

      // Salva il consenso nel database
      const consentResponse = await fetch('/api/consent/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consentType: 'google_contacts_sync',
          consentGiven: true,
        }),
      })

      if (!consentResponse.ok) {
        throw new Error('Errore nel salvataggio del consenso')
      }

      // Aggiorna lo stato locale
      setHasConsent(true)
      setConsentDialogOpen(false)
      setSyncing(false)

      // Se stiamo connettendo, procedi con l'autenticazione Google
      if (isConnecting) {
        setIsConnecting(false)
        performGoogleConnection()
      } else {
        // Altrimenti procedi con la sincronizzazione (caso legacy, non dovrebbe più succedere)
        performSync()
      }
    } catch (error) {
      console.error('Error saving consent:', error)
      toast.error('Errore nel salvataggio del consenso')
      setSyncing(false)
    }
  }

  const performSync = async () => {
    setSyncing(true)
    const syncPromise = fetch('/api/clienti/sync-google', {
      method: 'POST'
    }).then(async (response) => {
      if (response.status === 401) {
        const data = await response.json()
        throw new Error(data.error || 'Token Google non trovato. Effettua login con Google.')
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Errore durante la sincronizzazione')
      }

      return response.json()
    })

    toast.promise(syncPromise, {
      loading: "Sincronizzazione Google Contacts in corso...",
      success: (result) => {
        setSyncing(false)
        fetchClienti()
        checkGoogleConnection()
        return result.message || "Sincronizzazione completata!"
      },
      error: (err) => {
        setSyncing(false)
        return err.message || "Errore durante la sincronizzazione"
      },
    })
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

      {/* Filters */}
      <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle>Filtra Clienti</CardTitle>
                  <CardDescription>Cerca per nome, ragione sociale o email, oppure importa da Google</CardDescription>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isFiltersOpen ? '' : '-rotate-90'}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pb-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-4">
              <Input
                placeholder="Cerca clienti..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
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

            {/* Google Connection/Sync Button */}
            <div className="flex items-center gap-2 pt-1.5 border-t">
              <p className="text-sm text-muted-foreground">Importa contatti:</p>
              {checkingGoogle ? (
                <Button variant="outline" size="sm" disabled className="gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifica...
                </Button>
              ) : googleConnected ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSyncGoogle}
                  disabled={syncing || loading}
                  className="gap-2"
                >
                  {syncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  {syncing ? "Sincronizzazione..." : "Sincronizza Google"}
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleConnectGoogle}
                  disabled={loading}
                  className="gap-2"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Connetti Google
                </Button>
              )}
            </div>
          </div>
        </CardContent>
          </CollapsibleContent>
      </Card>
      </Collapsible>

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

      {/* Table */}
      <ClientiTable
        clienti={paginatedClienti}
        loading={loading}
        onEdit={handleEdit}
        onDeleted={handleSuccess}
      />

      {/* Dialog */}
      <ClienteDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        onSuccess={handleSuccess}
        clienteId={editingCliente?.id}
        initialData={initialData}
      />

      {/* Consent Dialog */}
      <GoogleContactsConsentDialog
        open={consentDialogOpen}
        onOpenChange={(open) => {
          setConsentDialogOpen(open)
          if (!open) {
            // Se il dialog viene chiuso senza accettare, resetta lo stato di connessione
            setIsConnecting(false)
            setSyncing(false)
          }
        }}
        onAccept={handleConsentAccept}
        isLoading={syncing}
      />
    </div>
  )
}
