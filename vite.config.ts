import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  base:"./",
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
