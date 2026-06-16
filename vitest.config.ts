import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.spec.ts"],
    pool: "threads",
  },
  resolve: {
    alias: {
      "~": new URL(".", import.meta.url).pathname,
      "@": new URL(".", import.meta.url).pathname,
    },
  },
});
