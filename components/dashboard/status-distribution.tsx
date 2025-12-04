"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart } from "lucide-react"

interface StatusDistributionProps {
  statusCounts: Record<string, number>
  loading?: boolean
}

const statusConfig = {
  bozza: { label: "Bozza", color: "bg-gray-500" },
  in_lavorazione: { label: "In Lavorazione", color: "bg-blue-500" },
  completato: { label: "Completato", color: "bg-green-500" },
  archiviato: { label: "Archiviato", color: "bg-gray-400" },
}

export function StatusDistribution({ statusCounts, loading }: StatusDistributionProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuzione Stati</CardTitle>
          <CardDescription>Riepilogo per stato di lavorazione</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-4 bg-muted animate-pulse rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-2 w-full bg-muted animate-pulse rounded" />
                </div>
                <div className="h-4 w-8 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0)

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuzione Stati</CardTitle>
          <CardDescription>Riepilogo per stato di lavorazione</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PieChart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Nessun dato disponibile
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuzione Stati</CardTitle>
        <CardDescription>Riepilogo per stato di lavorazione</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = statusCounts[status] || 0
            const percentage = total > 0 ? (count / total) * 100 : 0

            return (
              <div key={status} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${config.color}`} />
                    <span className="text-sm font-medium">{config.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${config.color} transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Total */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Totale</span>
            <span className="text-lg font-bold">{total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
