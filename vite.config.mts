import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    viteSingleFile(), // THIS IS THE KEY. Creating single file to ease asset loading in React Native WebView. By default it was required to load via server. Now direct index.html file can be loaded to browser with iife scripts/styles.
  ],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  build: {
    target: "es2015",
  },
});
