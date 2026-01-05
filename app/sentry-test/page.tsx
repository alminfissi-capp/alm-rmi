"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SentryTestPage() {
  const testClientError = () => {
    throw new Error("Sentry Client-Side Test Error - This is expected!");
  };

  const testServerError = async () => {
    const res = await fetch("/api/sentry-example-api");
    if (!res.ok) {
      console.error("Server error triggered successfully");
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Sentry Integration Test</h1>
        <p className="mb-6 text-muted-foreground">
          Usa i pulsanti sotto per testare che Sentry catturi correttamente gli errori.
          Gli errori appariranno nella console in development e in Sentry dashboard in produzione.
        </p>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Client-Side Error Test</h2>
            <Button onClick={testClientError} variant="destructive">
              Trigger Client Error
            </Button>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Server-Side Error Test</h2>
            <Button onClick={testServerError} variant="destructive">
              Trigger Server Error
            </Button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Come verificare:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>In development: Gli errori appariranno nella console</li>
            <li>In production: Vai su sentry.io e verifica che gli errori siano stati catturati</li>
            <li>Puoi eliminare questa pagina dopo aver verificato</li>
          </ol>
        </div>
      </Card>
    </div>
  );
}
