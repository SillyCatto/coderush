import type { NextConfig } from 'next';

const nextConfig: NextConfig = {

  eslint:{

    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  } ,
  // Your existing config
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Add other image sources as needed:
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      // You can also use domains (less secure but simpler)
      // domains: ['images.unsplash.com', 'picsum.photos']
    ],
  },
};

export default nextConfig;