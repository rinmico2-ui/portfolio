import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // The local JSON store is read at runtime from `<app>/.data`. Next.js file
  // tracing cannot detect that dynamic path, so include it explicitly or the
  // deployed site falls back to the in-code seed.
  outputFileTracingIncludes: {
    "/*": ["./.data/db.json", "./.data/uploads/**/*"],
  },
};

export default nextConfig;
