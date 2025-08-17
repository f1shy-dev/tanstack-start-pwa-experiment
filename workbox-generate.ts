import { injectManifest } from 'workbox-build'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export async function workboxGenerate(buildId: string) {
  const clientDist = resolve(__dirname, '.tanstack/start/build/client-dist')
  const swDest = resolve(clientDist, 'sw.js')
  const swImplDest = resolve(clientDist, 'sw.module.js')
  
  await build({
    entryPoints: [resolve(__dirname, 'src/sw.module.ts')],
    bundle: true,
    outfile: swImplDest,
    format: 'iife',
    target: 'es2020',
    minify: true,
    define: {
      'import.meta.env.DEV': 'false'
    }
  })

  await build({
    entryPoints: [resolve(__dirname, 'src/sw.ts')],
    bundle: true,
    outfile: swDest,
    format: 'esm',
    target: 'es2020',
    minify: true,
    define: {
      'import.meta.env.DEV': 'false',
      'self.__WB_BUILD_ID': `"${buildId}"`
    }
  })

  const { count, warnings, size } = await injectManifest({
    swSrc: swDest,
    swDest: swDest,
    globDirectory: clientDist,
    globPatterns: [
      '**/*.{js,css,html,svg,png,ico,webmanifest,json}',
    ],
  });

  if (warnings.length) {
    console.warn('[workbox] warnings:', warnings)
  }
  console.log(`[workbox] generated sw.js with ${count} precached files (${(size/1024).toFixed(1)} KiB)`)
}

