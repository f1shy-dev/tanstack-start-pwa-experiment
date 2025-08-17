import { generateSW } from 'workbox-build'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function main() {
  const dist = resolve(__dirname,  '.workbox-build')

  const { count, warnings, size } = await generateSW({
    swDest: resolve(dist, 'sw.js'),
    globDirectory: dist,
    globPatterns: [
      '**/*.{js,css,html,svg,png,ico,webmanifest,json}',
      'offline.html'
    ],
    skipWaiting: true,
    clientsClaim: true,
    navigateFallback: '/offline.html',
    navigateFallbackAllowlist: [/^\/$/ , /^(?!\/api\/)/],
    runtimeCaching: [
      {
        urlPattern: ({ url }) => /\/api\//.test(url.pathname),
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api',
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
          cacheableResponse: { statuses: [0, 200] }
        }
      },
      {
        // Images
        urlPattern: ({ request }) => request.destination === 'image',
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'images',
          expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 }
        }
      },
      {
        // Google Fonts stylesheets & font files
        urlPattern: ({ url }) => /^(https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com))\//.test(url.href),
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts',
          expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 }
        }
      }
    ]
  })

  if (warnings.length) {
    console.warn('[workbox] warnings:', warnings)
  }
  console.log(`[workbox] generated sw.js with ${count} precached files (${(size/1024).toFixed(1)} KiB)`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})