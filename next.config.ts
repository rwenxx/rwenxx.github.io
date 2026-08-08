import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Turbopack is default in Next.js 16 — keep an empty config to silence warnings
  turbopack: {},
};

export default nextConfig;
