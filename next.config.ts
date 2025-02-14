import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  },
output: "standalone",
};

export default nextConfig;
