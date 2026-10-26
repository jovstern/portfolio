import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // A request-time render (an unknown slug, a cold cache) still reads the content folders.
  outputFileTracingIncludes: { '/projects/[slug]': ['./content/**'] },
  images: { formats: ['image/avif', 'image/webp'] },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

// Plugins are named by string: Turbopack cannot receive JavaScript functions.
const withMDX = createMDX({ options: { remarkPlugins: ['remark-gfm'] } })

export default withMDX(nextConfig)
