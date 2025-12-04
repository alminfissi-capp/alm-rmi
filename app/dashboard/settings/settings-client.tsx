"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Shield } from "lucide-react"
import { User as SupabaseUser } from "@supabase/supabase-js"

interface SettingsClientProps {
  user: SupabaseUser
}

export function SettingsClient({ user }: SettingsClientProps) {
  const createdAt = new Date(user.created_at).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const lastSignIn = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Mai"

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Impostazioni</h2>
        <p className="text-muted-foreground">
          Gestisci il tuo profilo e le preferenze dell'account
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Profilo Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profilo Account
            </CardTitle>
            <CardDescription>
              Informazioni principali del tuo account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                L'email non può essere modificata
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>ID Utente</Label>
              <Input value={user.id} disabled />
              <p className="text-xs text-muted-foreground">
                Identificativo univoco del tuo account
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informazioni Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Informazioni Account
            </CardTitle>
            <CardDescription>
              Dettagli e statistiche del tuo account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Account creato</span>
              </div>
              <span className="text-sm text-muted-foreground">{createdAt}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Ultimo accesso</span>
              </div>
              <span className="text-sm text-muted-foreground">{lastSignIn}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Email verificata</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {user.email_confirmed_at ? "Sì" : "No"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferenze (placeholder per future implementazioni) */}
      <Card>
        <CardHeader>
          <CardTitle>Preferenze</CardTitle>
          <CardDescription>
            Personalizza la tua esperienza con l'applicazione
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              Le preferenze saranno disponibili in una prossima versione
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Zona Pericolosa */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zona Pericolosa</CardTitle>
          <CardDescription>
            Azioni irreversibili sul tuo account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Elimina Account</p>
              <p className="text-sm text-muted-foreground">
                Elimina definitivamente il tuo account e tutti i dati associati
              </p>
            </div>
            <Button variant="destructive" disabled>
              Elimina Account
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Questa funzionalità sarà disponibile in una prossima versione
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
