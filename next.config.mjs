/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/web-app',
  assetPrefix: '/web-app/',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
