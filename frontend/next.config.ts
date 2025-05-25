import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  eslint:{

    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  } ,
  // Configuration to allow images from all sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    // Alternatively, you can uncomment this for an even simpler approach:
    // unoptimized: true,
      // You can also use domains (less secure but simpler)
      // domains: ['images.unsplash.com', 'picsum.photos']
    
  },
};

export default nextConfig;