"use client"

import { useState, useEffect } from "react"
import { Plus, Users, Building2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { StatusDistribution } from "@/components/dashboard/status-distribution"
import { RecentRilievi } from "@/components/dashboard/recent-rilievi"
import { NewRilievoDialog } from "@/components/dashboard/new-rilievo-dialog"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { Skeleton } from "@/components/ui/skeleton"

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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [clientiStats, setClientiStats] = useState({ total: 0, privati: 0, aziende: 0 })
  const [loadingClienti, setLoadingClienti] = useState(true)

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
  }, [])

  const handleRilievoCreated = () => {
    setIsDialogOpen(false)
    fetchDashboardData()
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
    </div>
  )
}
