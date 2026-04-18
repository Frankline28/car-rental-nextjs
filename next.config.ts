import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '192.168.29.124:3000'],
    },
  },
};

export default nextConfig;
