"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

interface ActivityChartProps {
  monthlyData: Record<string, number>
  loading?: boolean
}

const chartConfig = {
  rilievi: {
    label: "Rilievi",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ActivityChart({ monthlyData, loading }: ActivityChartProps) {
  if (loading) {
    // Use fixed heights to avoid hydration mismatch
    const skeletonHeights = [150, 180, 120, 200, 160, 140]

    return (
      <Card>
        <CardHeader>
          <CardTitle>Attività Mensile</CardTitle>
          <CardDescription>Rilievi creati negli ultimi 6 mesi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-end gap-2">
            {skeletonHeights.map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-muted animate-pulse rounded" style={{ height: `${height}px` }} />
                <div className="h-3 w-12 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const months = Object.keys(monthlyData)
  const values = Object.values(monthlyData)

  // Transform data for Recharts
  const chartData = months.map((month, index) => ({
    month,
    rilievi: values[index],
  }))

  // Calculate total and trend
  const total = values.reduce((sum, val) => sum + val, 0)
  const hasData = total > 0

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attività Mensile</CardTitle>
          <CardDescription>Rilievi creati negli ultimi 6 mesi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-sm text-muted-foreground">
              Nessun rilievo creato negli ultimi 6 mesi
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Crea il tuo primo rilievo per vedere le statistiche!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attività Mensile</CardTitle>
        <CardDescription>
          Mostra il totale dei rilievi creati negli ultimi 6 mesi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
              <linearGradient id="fillRilievi" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rilievi)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rilievi)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="rilievi"
              type="natural"
              fill="url(#fillRilievi)"
              fillOpacity={0.4}
              stroke="var(--color-rilievi)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
