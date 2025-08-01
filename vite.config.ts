import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin to handle WASM files properly
    {
      name: "wasm-support",
      configureServer(server) {
        // Set proper MIME type for WASM files
        server.middlewares.use((req: any, res: any, next: any) => {
          if (req.url?.endsWith(".wasm")) {
            res.setHeader("Content-Type", "application/wasm");
          }
          next();
        });
      },
    },
  ],
  server: {
    fs: {
      // Allow serving files from node_modules and parent directories
      allow: ["..", "./node_modules"],
    },
  },
  // Configure WASM as assets and include in processing
  assetsInclude: ["**/*.wasm"],
  optimizeDeps: {
    // Don't pre-bundle WASM-related packages
    exclude: ["@rustreexo/rustreexo-wasm-web", "@rustreexo/wasm"],
  },
});
