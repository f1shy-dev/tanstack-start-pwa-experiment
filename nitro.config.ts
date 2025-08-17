import { defineNitroConfig } from "nitropack/config";
import { resolve } from "node:path";

// https://github.com/TanStack/router/issues/4404#issuecomment-2971434717
export default defineNitroConfig({
  preset: "node-server",

  publicAssets: [
    {
      baseURL: "/",
      dir: resolve(__dirname, '.workbox-build'),
      maxAge: 31536000
    }
  ],
});
