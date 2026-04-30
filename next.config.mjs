import { readFileSync } from 'node:fs'

const { version: appVersion } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
)

const rawBase = process.env.NEXT_PUBLIC_BASE_PATH || ''
const basePath =
  !rawBase || rawBase === '/' ? '' : rawBase.replace(/\/$/, '')

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath } : {}),
}

export default nextConfig
