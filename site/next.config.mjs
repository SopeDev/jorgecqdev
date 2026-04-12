import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
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
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
