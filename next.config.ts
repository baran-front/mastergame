import type { NextConfig } from "next";

import { brand } from "./brand";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: brand.apiHostname as string
      },
    ],
  },
};

export default nextConfig;
