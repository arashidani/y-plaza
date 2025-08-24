import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Docker環境でのホットリロード対応
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config: any) => {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
      return config
    },
  }),
};

export default nextConfig;
