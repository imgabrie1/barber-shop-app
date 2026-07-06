import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) return "vendor-react";
            if (id.includes("react-router-dom")) return "vendor-router";
            if (id.includes("@tanstack/react-query")) return "vendor-query";
            if (id.includes("react-icons")) return "vendor-icons";
            if (id.includes("axios") || id.includes("zod") || id.includes("@hookform/resolvers")) return "vendor-libs";
            return "vendor";
          }
        },
      },
    },
  },
});
