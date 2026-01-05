import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Turbopack configuration for SVG handling
  turbopack: {
    root: __dirname,
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // Opzioni per il plugin Sentry webpack
  silent: true, // Sopprimi log durante build
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Upload source maps solo in produzione
  widenClientFileUpload: true,
  hideSourceMaps: true,

  // Opzioni webpack
  webpack: {
    treeshake: {
      removeDebugLogging: true, // Sostituisce disableLogger deprecato
    },
    automaticVercelMonitors: true, // Sostituisce automaticVercelMonitors deprecato al top level
  },
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
