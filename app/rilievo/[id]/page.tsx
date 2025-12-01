import { createClient } from "@/lib/supabase/server"
import { getRilievoById } from "@/lib/supabase/queries"
import { redirect } from "next/navigation"
import { RMIForm } from "@/components/rmi/RMIForm"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function RilievoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ mode?: string }>
}) {
  const { id } = await params
  const { mode } = await searchParams
  const isViewMode = mode === "view"
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  // Fetch rilievo with serramenti
  let rilievo
  try {
    rilievo = await getRilievoById(supabase, id)
  } catch (error) {
    console.error("Error fetching rilievo:", error)
    redirect("/dashboard")
  }

  if (!rilievo) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">
            R.M.I. - Rilevatore Misure Interattivo
          </h1>
          <p className="text-sm text-muted-foreground">
            {rilievo.cliente || "Nuovo Rilievo"} {rilievo.commessa && `- Commessa: ${rilievo.commessa}`}
          </p>
        </div>
        {!isViewMode && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Save className="h-3 w-3" />
            <span>Salvataggio automatico attivo</span>
          </div>
        )}
        {isViewMode && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span>Modalità visualizzazione</span>
          </div>
        )}
      </header>

      {/* Form */}
      <main className="flex-1 overflow-hidden">
        <RMIForm rilievo={rilievo} readOnly={isViewMode} />
      </main>
    </div>
  )
}
