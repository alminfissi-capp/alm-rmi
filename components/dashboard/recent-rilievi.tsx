"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { it } from "date-fns/locale"

interface Rilievo {
  id: string
  cliente: string | null
  commessa: string | null
  status: string
  created_at: string
  updated_at: string
}

interface RecentRilieviProps {
  rilievi: Rilievo[]
  loading?: boolean
}

const statusConfig = {
  bozza: { label: "Bozza", variant: "secondary" as const },
  in_lavorazione: { label: "In Lavorazione", variant: "default" as const },
  completato: { label: "Completato", variant: "default" as const },
  archiviato: { label: "Archiviato", variant: "outline" as const },
}

export function RecentRilievi({ rilievi, loading }: RecentRilieviProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rilievi Recenti</CardTitle>
          <CardDescription>Gli ultimi rilievi su cui hai lavorato</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 bg-muted animate-pulse rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (rilievi.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rilievi Recenti</CardTitle>
          <CardDescription>Gli ultimi rilievi su cui hai lavorato</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Nessun rilievo ancora.
              <br />
              Crea il tuo primo rilievo per iniziare!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Rilievi Recenti</CardTitle>
          <CardDescription>Gli ultimi rilievi su cui hai lavorato</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/rilievi">
            Vedi tutti
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rilievi.map((rilievo) => (
            <Link
              key={rilievo.id}
              href={`/rilievo/${rilievo.id}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {rilievo.cliente || "Cliente non specificato"}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {rilievo.commessa ? `Commessa: ${rilievo.commessa}` : "Nessuna commessa"}
                  {" · "}
                  {formatDistanceToNow(new Date(rilievo.updated_at), {
                    addSuffix: true,
                    locale: it,
                  })}
                </p>
              </div>
              <Badge variant={statusConfig[rilievo.status as keyof typeof statusConfig]?.variant || "secondary"}>
                {statusConfig[rilievo.status as keyof typeof statusConfig]?.label || rilievo.status}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
