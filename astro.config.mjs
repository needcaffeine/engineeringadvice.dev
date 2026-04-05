import { defineConfig, fontProviders } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    imageService: 'passthrough',
    prerenderEnvironment: 'node'
  }),
  build: {
    inlineStylesheets: 'always'
  },
  experimental: {
    clientPrerender: true
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Manrope',
      cssVariable: '--astro-font-manrope',
      formats: ['woff2'],
      styles: ['normal'],
      subsets: ['latin'],
      weights: ['300 800']
    },
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--astro-font-space-grotesk',
      formats: ['woff2'],
      styles: ['normal'],
      subsets: ['latin'],
      weights: ['400 700']
    }
  ],
  image: {
    remotePatterns: [
      {
        protocol: 'https'
      },
      {
        protocol: 'http'
      }
    ]
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  site: 'https://engineeringadvice.dev',
  trailingSlash: 'never',
  integrations: [
    preact(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        // Exclude episode number pages and only include slug pages.
        return !/^\/\d+\/?$/.test(pathname);
      }
    })
  ],
  vite: {
    optimizeDeps: {
      ignoreOutdatedRequests: true,
      exclude: [
        '@astrojs/cloudflare/entrypoints/server',
        '@astrojs/cloudflare/entrypoints/server.js',
        '@astrojs/cloudflare/entrypoints/preview'
      ]
    },
    ssr: {
      optimizeDeps: {
        noDiscovery: true,
        ignoreOutdatedRequests: true,
        exclude: [
          '@astrojs/cloudflare/entrypoints/server',
          '@astrojs/cloudflare/entrypoints/server.js',
          '@astrojs/cloudflare/entrypoints/preview'
        ]
      }
    },
    server: {
      allowedHosts: ['brick.local'],
      watch: {
        ignored: ['**/.vercel/**', '**/dist/**']
      }
    },
    plugins: [tailwindcss()]
  }
});
