import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [], // Empty array disables specific domain restrictions
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This allows all domains
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
