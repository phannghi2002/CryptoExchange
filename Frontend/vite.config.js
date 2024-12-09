import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("./src"), // Remove __dirname and use a relative path
    },
  },
  server: {
    open: "/overview", // Automatically open the /overview page
  },
});
