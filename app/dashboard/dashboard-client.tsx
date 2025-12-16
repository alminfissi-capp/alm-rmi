"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { StatusDistribution } from "@/components/dashboard/status-distribution"
import { RecentRilievi } from "@/components/dashboard/recent-rilievi"
import { NewRilievoDialog } from "@/components/dashboard/new-rilievo-dialog"
import { User as SupabaseUser } from "@supabase/supabase-js"

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

  useEffect(() => {
    fetchDashboardData()
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
