import type { NextConfig } from "next";

const nextConfig: NextConfig = {
<<<<<<< Updated upstream
  images: {
    domains: [], // Empty array disables specific domain restrictions
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This allows all domains
      },
    ],
  },
=======
  output: 'export',
>>>>>>> Stashed changes
  /* config options here */
};

export default nextConfig;
