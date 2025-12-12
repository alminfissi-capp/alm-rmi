import type { NextConfig } from "next";

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

export default nextConfig;
