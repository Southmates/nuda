import { defineConfig } from "astro/config";

export default defineConfig({
  style: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/styles/global.scss" as *;`,
      },
    },
  },
});
