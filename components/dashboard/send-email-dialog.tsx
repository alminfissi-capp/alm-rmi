"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SendEmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rilievoId: string
  defaultEmail?: string
  defaultName?: string
  cliente?: string
  commessa?: string
}

export function SendEmailDialog({
  open,
  onOpenChange,
  rilievoId,
  defaultEmail = "",
  defaultName = "",
  cliente = "",
  commessa = "",
}: SendEmailDialogProps) {
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail)
  const [recipientName, setRecipientName] = useState(defaultName || cliente)
  const [subject, setSubject] = useState(
    `Rilievo ${commessa || "N/D"} - ${cliente || "Cliente"}`
  )
  const [message, setMessage] = useState(
    "Resto a disposizione per qualsiasi chiarimento."
  )
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      toast.error("Inserisci un'email valida")
      return
    }

    setIsSending(true)

    const sendPromise = (async () => {
      // Step 1: Fetch rilievo data
      const rilievoResponse = await fetch(`/api/rilievi/${rilievoId}`)
      if (!rilievoResponse.ok) {
        throw new Error("Errore durante il recupero dei dati del rilievo")
      }
      const { rilievo } = await rilievoResponse.json()

      // Step 2: Generate PDF client-side
      const { generatePDF } = await import("@/components/pdf/PDFGenerator")
      const pdfBlob = await generatePDF(rilievo)

      // Step 3: Convert blob to base64
      const arrayBuffer = await pdfBlob.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const pdfBase64 = buffer.toString('base64')

      // Step 4: Send email with PDF as base64
      const response = await fetch("/api/pdf/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail,
          recipientName,
          subject,
          message,
          pdfBase64,
          fileName: `RMI_${rilievo.cliente || "Rilievo"}_${rilievo.commessa || "N-D"}.pdf`,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Errore durante l'invio dell'email")
      }

      return response.json()
    })()

    toast.promise(sendPromise, {
      loading: "Preparazione e invio email in corso...",
      success: () => {
        setIsSending(false)
        onOpenChange(false)
        // Reset form
        setRecipientEmail("")
        setRecipientName("")
        setMessage("Resto a disposizione per qualsiasi chiarimento.")
        return "Email inviata con successo!"
      },
      error: (err) => {
        console.error("Error sending email:", err)
        setIsSending(false)
        return err.message || "Errore durante l'invio dell'email"
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invia PDF via Email
          </DialogTitle>
          <DialogDescription>
            Invia il PDF del rilievo direttamente via email al cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">
              Email Destinatario <span className="text-destructive">*</span>
            </Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder="cliente@esempio.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientName">Nome Destinatario</Label>
            <Input
              id="recipientName"
              type="text"
              placeholder="Mario Rossi"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Opzionale - utilizzato nel messaggio email
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Oggetto Email</Label>
            <Input
              id="subject"
              type="text"
              placeholder="Oggetto email"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Messaggio Aggiuntivo</Label>
            <Textarea
              id="message"
              placeholder="Inserisci un messaggio personalizzato..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Il messaggio sarà aggiunto al corpo dell&apos;email insieme ai dettagli del
              rilievo
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Annulla
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? "Invio..." : "Invia Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
