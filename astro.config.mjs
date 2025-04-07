import { defineConfig } from "astro/config";
import path from "path";

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
