/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: isDev,
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    viewTransition: true,
  },
}

export default nextConfig
