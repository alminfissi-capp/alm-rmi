"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Calendar, Shield, Lock, Settings, Globe, Bell } from "lucide-react"
import { User as SupabaseUser } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useTheme } from "next-themes"

interface SettingsClientProps {
  user: SupabaseUser
}

interface UserPreferences {
  language: string
  dateFormat: string
  theme: string
  emailNotifications: boolean
}

export function SettingsClient({ user }: SettingsClientProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || "")
  const [phone, setPhone] = useState(user.user_metadata?.phone || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: "it",
    dateFormat: "DD/MM/YYYY",
    theme: "system",
    emailNotifications: true,
  })
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch("/api/user/preferences")
        if (response.ok) {
          const data = await response.json()
          setPreferences(data)
        }
      } catch (error) {
        console.error("Error loading preferences:", error)
      }
    }
    loadPreferences()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoadingProfile(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error("Errore durante l'aggiornamento del profilo")
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Le password non coincidono")
      return
    }

    if (newPassword.length < 6) {
      toast.error("La password deve essere lunga almeno 6 caratteri")
      return
    }

    setIsLoadingPassword(true)

    try {
      const response = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error("Errore durante l'aggiornamento della password")
    } finally {
      setIsLoadingPassword(false)
    }
  }

  const handleUpdatePreferences = async () => {
    setIsLoadingPreferences(true)

    try {
      const response = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error("Errore durante l'aggiornamento delle preferenze")
    } finally {
      setIsLoadingPreferences(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Impostazioni</h2>
        <p className="text-muted-foreground">
          Gestisci il tuo profilo e le preferenze dell&apos;account
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profilo
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Sicurezza
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Settings className="h-4 w-4 mr-2" />
            Preferenze
          </TabsTrigger>
          <TabsTrigger value="account">
            <Shield className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* Tab: Profilo */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Profilo</CardTitle>
              <CardDescription>
                Aggiorna le tue informazioni personali
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
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
                    L&apos;email non può essere modificata
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Mario Rossi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+39 123 456 7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <Button type="submit" disabled={isLoadingProfile}>
                  {isLoadingProfile ? "Salvataggio..." : "Salva Modifiche"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Sicurezza */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cambia Password</CardTitle>
              <CardDescription>
                Aggiorna la password del tuo account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Password Corrente</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nuova Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimo 6 caratteri
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Conferma Nuova Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoadingPassword}>
                  {isLoadingPassword ? "Aggiornamento..." : "Aggiorna Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Preferenze */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferenze Applicazione</CardTitle>
              <CardDescription>
                Personalizza la tua esperienza
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Lingua
                </Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, language: value })
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">Italiano</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Formato Data</Label>
                <Select
                  value={preferences.dateFormat}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, dateFormat: value })
                  }
                >
                  <SelectTrigger id="dateFormat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">GG/MM/AAAA</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/GG/AAAA</SelectItem>
                    <SelectItem value="YYYY-MM-DD">AAAA-MM-GG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                {!mounted ? (
                  <Select disabled>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Caricamento..." />
                    </SelectTrigger>
                  </Select>
                ) : (
                  <Select
                    value={theme}
                    onValueChange={(value) => setTheme(value)}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Chiaro</SelectItem>
                      <SelectItem value="dark">Scuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifiche Email
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Ricevi aggiornamenti via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, emailNotifications: checked })
                  }
                />
              </div>

              <Button onClick={handleUpdatePreferences} disabled={isLoadingPreferences}>
                {isLoadingPreferences ? "Salvataggio..." : "Salva Preferenze"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Account */}
        <TabsContent value="account" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
