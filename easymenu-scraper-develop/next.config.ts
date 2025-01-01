import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Existing fallback for fs module
    config.resolve.fallback = { fs: false };

    if (!isServer) {
      // Prevent puppeteer-real-browser from being bundled client-side
      config.resolve.alias['puppeteer-real-browser'] = false;
      config.resolve.alias['sleep'] = false;
    }

    // Add a loader for .node files
    config.module.rules.push({
      test: /\.node$/,
      loader: 'node-loader',
    });

    return config;
  },
};

export default nextConfig;