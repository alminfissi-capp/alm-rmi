"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/mode-toggle';
import { Mail, Send, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function TestEmailPage() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('Test Email from RMI');
  const [html, setHtml] = useState('<h1>Ciao!</h1><p>Questa è una email di test dal sistema RMI.</p>');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendEmail = async () => {
    if (!to || !subject || !html) {
      setResult({ success: false, message: 'Compila tutti i campi richiesti' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, html }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: `Email inviata con successo! ID: ${data.data?.id || 'N/A'}` });
      } else {
        setResult({ success: false, message: data.error || 'Errore durante l\'invio dell\'email' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Errore di rete: ' + (error instanceof Error ? error.message : 'Unknown') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Mail className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Test Email Resend</h1>
              <p className="text-muted-foreground mt-2">Testa l'invio email tramite Resend API</p>
            </div>
          </div>
          <ModeToggle />
        </div>

        <Separator />

        {/* API Key Status */}
        <Card>
          <CardHeader>
            <CardTitle>Configurazione API</CardTitle>
            <CardDescription>Verifica che la chiave API Resend sia configurata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="font-medium">RESEND_API_KEY:</span>
              <Badge variant="secondary" className="font-mono">
                Configurata nel file .env
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Ricorda di sostituire <code className="bg-muted px-1 py-0.5 rounded">your_resend_api_key_here</code> con la tua chiave API reale.
            </p>
          </CardContent>
        </Card>

        {/* Email Form */}
        <Card>
          <CardHeader>
            <CardTitle>Invia Email di Test</CardTitle>
            <CardDescription>Compila il form e clicca su "Invia Email"</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to">Destinatario *</Label>
              <Input
                id="to"
                type="email"
                placeholder="esempio@email.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Oggetto *</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Oggetto dell'email"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="html">Contenuto HTML *</Label>
              <Textarea
                id="html"
                placeholder="<h1>Ciao!</h1><p>Testo dell'email...</p>"
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                rows={8}
                className="font-mono text-sm"
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleSendEmail}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Invia Email
                </>
              )}
            </Button>

            {/* Result */}
            {result && (
              <div className={`flex items-start gap-2 p-4 rounded-md border ${
                result.success
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
              }`}>
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5" />
                )}
                <div className={result.success ? 'text-green-900 dark:text-green-200' : 'text-red-900 dark:text-red-200'}>
                  <p className="font-medium">{result.success ? 'Successo!' : 'Errore'}</p>
                  <p className="text-sm">{result.message}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-200">Note Importanti</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-blue-800 dark:text-blue-300 text-sm space-y-1">
              <li>Sostituisci la chiave API nel file .env con la tua chiave Resend reale</li>
              <li>Se usi un dominio verificato, aggiorna anche RESEND_FROM_EMAIL nel .env</li>
              <li>Per test puoi usare onboarding@resend.dev come sender (default)</li>
              <li>Controlla lo stato dell'invio nel dashboard di Resend</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
