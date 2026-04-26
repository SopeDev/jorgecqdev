import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname)
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
    // Lock project root to this app (avoids wrong root when the editor opens the parent folder)
    root: siteRoot,
  },
}

export default nextConfig
