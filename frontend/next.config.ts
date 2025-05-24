import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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