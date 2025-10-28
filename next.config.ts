import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable type checking and linting during builds for better code quality
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
