import { defineConfig } from "astro/config";

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  style: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/styles/global.scss" as *;`,
      },
    },
  },
});
