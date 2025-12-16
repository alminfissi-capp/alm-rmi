"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle } from 'lucide-react'

interface GoogleContactsConsentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccept: () => void
  isLoading?: boolean
}

export function GoogleContactsConsentDialog({
  open,
  onOpenChange,
  onAccept,
  isLoading = false,
}: GoogleContactsConsentDialogProps) {
  const [hasReadAndAccepted, setHasReadAndAccepted] = useState(false)

  const handleAccept = () => {
    if (hasReadAndAccepted) {
      onAccept()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col" showCloseButton={!isLoading}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Consenso Informato - Sincronizzazione Contatti Google
          </DialogTitle>
          <DialogDescription>
            Prima di procedere con la sincronizzazione, è necessario prendere visione delle seguenti informazioni
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0 pr-4 my-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">Informativa sul Trattamento dei Dati Personali</h3>
              <p className="text-muted-foreground">
                Ai sensi del Regolamento UE 2016/679 (GDPR), La informiamo che i dati personali dei contatti
                che sincronizzerà dal Suo account Google saranno trattati secondo le modalità di seguito descritte.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">1. Titolare del Trattamento</h3>
              <p className="text-muted-foreground">
                <strong>A.L.M. Infissi</strong><br />
                Partita IVA: 06365120820<br />
                Sede: Palermo, Sicilia, Italia
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. Finalità del Trattamento</h3>
              <p className="text-muted-foreground">
                I dati dei contatti sincronizzati saranno utilizzati esclusivamente per:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                <li>Gestione della rubrica clienti all'interno del sistema RMI</li>
                <li>Creazione e gestione di rilievi associati ai clienti</li>
                <li>Invio di comunicazioni relative ai progetti di infissi</li>
                <li>Archiviazione centralizzata per gli affiliati del network A.L.M. Infissi</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. Base Giuridica</h3>
              <p className="text-muted-foreground">
                Il trattamento si basa sul Suo <strong>consenso esplicito</strong> (art. 6, par. 1, lett. a) del GDPR).
                Lei ha il diritto di revocare il consenso in qualsiasi momento.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Condivisione dei Dati</h3>
              <p className="text-muted-foreground">
                <strong>IMPORTANTE:</strong> I contatti sincronizzati verranno registrati nel database centralizzato
                di A.L.M. Infissi. Ciò significa che:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                <li>I dati entreranno nella disponibilità di A.L.M. Infissi come co-titolare del trattamento</li>
                <li>I dati saranno conservati sui server del sistema RMI</li>
                <li>Lei rimane responsabile della legittimità del trattamento dei dati dei Suoi clienti</li>
                <li>È Sua responsabilità informare i Suoi clienti di questa condivisione</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">5. Durata della Conservazione</h3>
              <p className="text-muted-foreground">
                I dati saranno conservati per il tempo necessario alle finalità indicate, salvo revoca del consenso
                o richiesta di cancellazione da parte Sua.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">6. Diritti dell'Interessato</h3>
              <p className="text-muted-foreground">
                Lei ha il diritto di:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                <li>Accedere ai Suoi dati personali (art. 15 GDPR)</li>
                <li>Rettificare dati inesatti (art. 16 GDPR)</li>
                <li>Cancellare i dati ("diritto all'oblio", art. 17 GDPR)</li>
                <li>Limitare il trattamento (art. 18 GDPR)</li>
                <li>Portabilità dei dati (art. 20 GDPR)</li>
                <li>Revocare il consenso in qualsiasi momento</li>
                <li>Proporre reclamo all'Autorità Garante per la Protezione dei Dati Personali</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold mb-2">7. Responsabilità</h3>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                <p className="text-muted-foreground">
                  <strong>ATTENZIONE:</strong> Sincronizzando i Suoi contatti Google, Lei dichiara di:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                  <li>Avere titolo giuridico per trasferire i dati dei Suoi clienti nel sistema RMI</li>
                  <li>Aver informato i Suoi clienti del trattamento dei loro dati personali</li>
                  <li>Aver ottenuto, ove necessario, il consenso dei Suoi clienti per tale trattamento</li>
                  <li>Essere consapevole che A.L.M. Infissi diventa co-titolare del trattamento</li>
                </ul>
              </div>
            </section>

            <section className="pt-2">
              <p className="text-xs text-muted-foreground italic">
                Versione informativa: 1.0 - Data: {new Date().toLocaleDateString('it-IT')}
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="flex items-start space-x-2 py-4 border-t flex-shrink-0">
          <Checkbox
            id="consent"
            checked={hasReadAndAccepted}
            onCheckedChange={(checked) => setHasReadAndAccepted(checked === true)}
            disabled={isLoading}
          />
          <Label
            htmlFor="consent"
            className="text-sm font-normal leading-tight cursor-pointer"
          >
            Ho letto e compreso l'informativa sul trattamento dei dati personali e acconsento
            espressamente alla sincronizzazione dei miei contatti Google nel sistema RMI gestito
            da A.L.M. Infissi. Sono consapevole che i dati entreranno nella disponibilità del
            titolare del trattamento.
          </Label>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annulla
          </Button>
          <Button
            type="button"
            onClick={handleAccept}
            disabled={!hasReadAndAccepted || isLoading}
          >
            Accetto e Procedi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
