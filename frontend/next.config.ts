import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Active les formats modernes (WebP, AVIF)
    formats: ["image/avif", "image/webp"],

    // Qualité de compression (1-100, défaut: 75)
    // Plus bas = fichiers plus petits mais qualité réduite
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Si vous utilisez des images depuis le backend
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
