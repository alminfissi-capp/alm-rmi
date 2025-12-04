"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Package, TrendingUp, CheckCircle2, Clock, Archive } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalRilievi: number
    rilieviThisMonth: number
    monthlyChange: number
    totalSerramenti: number
    statusCounts: Record<string, number>
  }
  loading?: boolean
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Rilievi Totali",
      value: stats.totalRilievi,
      description: `${stats.rilieviThisMonth} questo mese`,
      icon: FileText,
      trend: stats.monthlyChange > 0 ? "up" : stats.monthlyChange < 0 ? "down" : "neutral",
      trendValue: Math.abs(stats.monthlyChange),
    },
    {
      title: "Serramenti Totali",
      value: stats.totalSerramenti,
      description: "Pagine registrate",
      icon: Package,
    },
    {
      title: "Completati",
      value: stats.statusCounts.completato || 0,
      description: "Rilievi completati",
      icon: CheckCircle2,
    },
    {
      title: "In Lavorazione",
      value: (stats.statusCounts.bozza || 0) + (stats.statusCounts.in_lavorazione || 0),
      description: "Bozze e in corso",
      icon: Clock,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              {card.trend && (
                <>
                  {card.trend === "up" && (
                    <span className="flex items-center text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{card.trendValue}%
                    </span>
                  )}
                  {card.trend === "down" && (
                    <span className="flex items-center text-red-600">
                      <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                      -{card.trendValue}%
                    </span>
                  )}
                </>
              )}
              <span>{card.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
