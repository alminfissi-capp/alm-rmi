import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0, // 100% delle transazioni in dev, abbassa a 0.1 in prod

  // Debug mode (disabilitare in produzione)
  debug: false,

  // Ambiente
  environment: process.env.NODE_ENV,

  beforeSend(event, hint) {
    // Non inviare eventi in development locale
    if (process.env.NODE_ENV === "development") {
      console.error("Sentry Edge Event (not sent in dev):", event);
      return null;
    }
    return event;
  },
});
