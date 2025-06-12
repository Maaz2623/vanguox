import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "nuh2gys8cs.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
