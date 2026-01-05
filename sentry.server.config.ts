import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0, // 100% delle transazioni in dev, abbassa a 0.1 in prod

  // Debug mode (disabilitare in produzione)
  debug: false,

  // Ambiente
  environment: process.env.NODE_ENV,

  // Integrations specifiche per server
  integrations: [
    // Traccia query Prisma
    new Sentry.Integrations.Prisma({ client: undefined }), // Passerai il client dove serve
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
