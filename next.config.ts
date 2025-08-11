// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Firebase Storage
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/**" },
      // Google profile photos (if you add Google sign-in)
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
