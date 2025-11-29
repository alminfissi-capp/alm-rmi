"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, CheckCircle, Loader2, AlertCircle, Clock } from 'lucide-react'
import Logo from '@/public/alm.svg'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [cooldown, setCooldown] = useState(0)

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [cooldown])

  async function handleResendEmail() {
    if (!email) {
      setMessage({ type: 'error', text: 'Indirizzo email non disponibile' })
      return
    }

    if (cooldown > 0) {
      return
    }

    setResending(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Email di verifica inviata nuovamente!' })
        setCooldown(60) // 60 secondi di cooldown
      } else {
        setMessage({ type: 'error', text: data.error || 'Errore nell\'invio dell\'email' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Errore di connessione' })
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo
              className="w-16 h-16 rounded-2xl"
              aria-label="A.L.M. Infissi Logo"
            />
          </div>
          <div>
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Registrazione completata!
            </CardTitle>
            <CardDescription className="mt-2">
              Controlla la tua email per attivare l'account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm space-y-2">
                <p className="font-medium">Ti abbiamo inviato un'email di verifica</p>
                {email && (
                  <p className="text-xs text-muted-foreground break-all">
                    Inviata a: {email}
                  </p>
                )}
                <p className="text-muted-foreground">
                  Clicca sul link nell'email per attivare il tuo account e accedere a RMI.
                  Se non vedi l'email, controlla la cartella spam.
                </p>
              </div>
            </div>
          </div>

          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'error' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="text-xs text-muted-foreground text-center space-y-2">
            <p>
              Dopo aver cliccato sul link di verifica, potrai accedere al tuo account.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          {email && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleResendEmail}
              disabled={resending || cooldown > 0}
            >
              {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {cooldown > 0 && <Clock className="mr-2 h-4 w-4" />}
              {cooldown > 0
                ? `Attendi ${cooldown}s prima di reinviare`
                : 'Reinvia email di verifica'
              }
            </Button>
          )}
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Torna al Login
            </Button>
          </Link>
          <div className="text-xs text-center text-muted-foreground">
            A.L.M. Infissi © 2025
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
