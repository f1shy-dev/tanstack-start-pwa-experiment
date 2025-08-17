import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { workboxGenerate } from "./workbox-generate";
import fs from "fs/promises";

const buildId = await fs.readFile(".build-id", "utf-8").then((id) => id.trim());
console.log(`[vite] buildId='${buildId}'`);

const config = defineConfig({
  define: {
    "window.BUILD_ID": `"${buildId}"`,
  },
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart({
      customViteReactPlugin: true,
      target: "cloudflare-module",
    }),
    viteReact(),
{ 
  name: "workbox",
  applyToEnvironment(e) {
    return e.name === "ssr";
  },
  buildStart: () => workboxGenerate(buildId),
},
  ],
});

export default config;
