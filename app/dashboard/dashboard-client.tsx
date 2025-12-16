"use client"

import { useState, useEffect } from "react"
import { Users, Building2, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { StatusDistribution } from "@/components/dashboard/status-distribution"
import { RecentRilievi } from "@/components/dashboard/recent-rilievi"
import { GoogleContactsConsentDialog } from "@/components/google-contacts-consent-dialog"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface DashboardStats {
  totalRilievi: number
  rilieviThisMonth: number
  monthlyChange: number
  totalSerramenti: number
  statusCounts: Record<string, number>
  monthlyData: Record<string, number>
}

interface DashboardClientProps {
  user: SupabaseUser
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentRilievi, setRecentRilievi] = useState([])
  const [loading, setLoading] = useState(true)
  const [clientiStats, setClientiStats] = useState({ total: 0, privati: 0, aziende: 0 })
  const [loadingClienti, setLoadingClienti] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [checkingGoogle, setCheckingGoogle] = useState(true)
  const [consentDialogOpen, setConsentDialogOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch stats
      const statsResponse = await fetch("/api/dashboard/stats")
      const statsData = await statsResponse.json()

      if (statsResponse.ok) {
        setStats(statsData)
      }

      // Fetch recent rilievi (last 5)
      const rilieviResponse = await fetch("/api/rilievi?limit=5&sort=updated_at&order=desc")
      const rilieviData = await rilieviResponse.json()

      if (rilieviResponse.ok) {
        setRecentRilievi(rilieviData.rilievi)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClientiStats = async () => {
    setLoadingClienti(true)
    try {
      const response = await fetch("/api/clienti")
      if (response.ok) {
        const data = await response.json()
        const clienti = data.clienti || []
        setClientiStats({
          total: clienti.length,
          privati: clienti.filter((c: any) => c.tipologia === 'privato').length,
          aziende: clienti.filter((c: any) => c.tipologia === 'azienda').length,
        })
      }
    } catch (error) {
      console.error("Error fetching clienti stats:", error)
    } finally {
      setLoadingClienti(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    fetchClientiStats()
    checkGoogleConnection()
  }, [])

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

  const handleConnectGoogle = async () => {
    if (!googleConnected) {
      setIsConnecting(true)
      setConsentDialogOpen(true)
      return
    }
    performGoogleConnection()
  }

  const performGoogleConnection = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
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
    performSync()
  }

  const handleConsentAccept = async () => {
    try {
      setSyncing(true)

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

      setConsentDialogOpen(false)
      setSyncing(false)

      if (isConnecting) {
        setIsConnecting(false)
        performGoogleConnection()
      } else {
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
        fetchClientiStats()
        checkGoogleConnection()
        return result.message || "Sincronizzazione completata!"
      },
      error: (err) => {
        setSyncing(false)
        return err.message || "Errore durante la sincronizzazione"
      },
    })
  }

  // Get user display name
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utente'

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Benvenuto, {displayName}
          </h2>
          <p className="text-muted-foreground">
            Panoramica dei tuoi rilievi e attività
          </p>
        </div>
        {checkingGoogle ? (
          <Button variant="outline" disabled className="gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifica...
          </Button>
        ) : googleConnected ? (
          <Button
            variant="default"
            onClick={handleSyncGoogle}
            disabled={syncing || loading}
            className="gap-2"
          >
            {syncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sincronizzazione...
              </>
            ) : (
              <>
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
                Sincronizza Google
              </>
            )}
          </Button>
        ) : (
          <Button variant="default" onClick={handleConnectGoogle} disabled={loading} className="gap-2">
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

      {/* Stats Cards */}
      <StatsCards stats={stats || { totalRilievi: 0, rilieviThisMonth: 0, monthlyChange: 0, totalSerramenti: 0, statusCounts: {} }} loading={loading} />

      {/* Clienti Stats */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium">Totale Clienti</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-3">
            {loadingClienti ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{clientiStats.total}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Clienti registrati in rubrica
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium">Privati</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-3">
            {loadingClienti ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{clientiStats.privati}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Clienti privati
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium">Aziende</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-3">
            {loadingClienti ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{clientiStats.aziende}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Clienti aziende
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ActivityChart monthlyData={stats?.monthlyData || {}} loading={loading} />
        <StatusDistribution statusCounts={stats?.statusCounts || {}} loading={loading} />
      </div>

      {/* Recent Rilievi */}
      <RecentRilievi rilievi={recentRilievi} loading={loading} />

      {/* Consent Dialog */}
      <GoogleContactsConsentDialog
        open={consentDialogOpen}
        onOpenChange={(open) => {
          setConsentDialogOpen(open)
          if (!open) {
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
