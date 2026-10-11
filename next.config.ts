import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // /dev/tokens legge il file dei token: va incluso nel bundle server.
  outputFileTracingIncludes: {
    "/dev/tokens": ["./src/styles/tokens.css"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
