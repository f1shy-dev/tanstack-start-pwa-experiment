import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { workboxGenerate } from './workbox-generate'
const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
      target:'node-server'
    }),
    viteReact(),
    {
      name: 'workbox',
       applyToEnvironment(e) {
        return e.name === 'ssr'
      },
      buildStart: workboxGenerate
    }
  ],
})

export default config
