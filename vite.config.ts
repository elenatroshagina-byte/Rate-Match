import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const reactorPackage = (name: string) =>
  resolve(__dirname, `node_modules/@reactor/${name}/dist/index.js`);

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@reactor/reactor": reactorPackage("reactor"),
      "@reactor/core": reactorPackage("core"),
      "@reactor/hooks": reactorPackage("hooks"),
      "@reactor/browser": reactorPackage("browser"),
      "@reactor/style": reactorPackage("style"),
      "@reactor/theme": reactorPackage("theme"),
      "@reactor/windows": reactorPackage("windows")
    }
  },
  build: {
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    chunkSizeWarningLimit: 20000,
    cssCodeSplit: false,
    sourcemap: false,
    rolldownOptions: {
      output: {
        codeSplitting: false
      }
    }
  }
});
