import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,

    // 👇 Add this part
    allowedHosts: [
      ".csb.app",        // Codesandbox
      ".stackblitz.io",  // StackBlitz
      ".gitpod.io",      // Gitpod (optional)
      "localhost",       // Localhost access
      "127.0.0.1",       // Localhost IP access
    ],
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
