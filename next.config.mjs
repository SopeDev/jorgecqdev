const rawBase = process.env.NEXT_PUBLIC_BASE_PATH || ''
const basePath =
  !rawBase || rawBase === '/' ? '' : rawBase.replace(/\/$/, '')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath } : {}),
}

export default nextConfig
