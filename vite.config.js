// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: ["ware-thesaurus-five-pioneer.trycloudflare.com"],
    proxy: {
      "/api": {
        target: "http://172.31.44.120:3001", // use localhost (avoids firewall on LAN IP)
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
