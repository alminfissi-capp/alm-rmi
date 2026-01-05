import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0, // 100% delle transazioni in dev, abbassa a 0.1 in prod

  // Session Replay
  replaysOnErrorSampleRate: 1.0, // Cattura replay quando c'è errore
  replaysSessionSampleRate: 0.1, // 10% delle sessioni normali

  // Debug mode (disabilitare in produzione)
  debug: false,

  // Ambiente
  environment: process.env.NODE_ENV,

  // Filtri per ridurre rumore
  ignoreErrors: [
    // Errori browser comuni da ignorare
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
  ],

  beforeSend(event, hint) {
    // Non inviare eventi in development locale
    if (process.env.NODE_ENV === "development") {
      console.error("Sentry Event (not sent in dev):", event);
      return null;
    }
    return event;
  },
});
