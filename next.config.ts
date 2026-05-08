import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so Next doesn't pick up the
  // ancestor lockfile in C:\Users\Matt Bomeisl\.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
