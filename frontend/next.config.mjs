import withPWAInit from "@ducanh2912/next-pwa";

// const withPWA = withPWAInit({
//   dest: "public",
//   cacheOnFrontEndNav: true,
//   aggressiveFrontEndNavCaching: true,
//   reloadOnOnline: true,
//   disable: false, // Force enable for user testing
//   workboxOptions: {
//     disableDevLogs: true,
//   },
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ['react', 'react-dom']
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'galerismkn5web-production.up.railway.app',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://galerismkn5web-production.up.railway.app/api',
  }
};

export default nextConfig;
// export default withPWA(nextConfig);
