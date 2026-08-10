import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Le route di generazione fanno chiamate lunghe (OpenAI + ElevenLabs).
    proxyTimeout: 120_000,
  },
};

export default nextConfig;
