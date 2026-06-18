import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/amt/",
  server: {
    proxy: {
      "/api": {
        target: "https://k0q6vtfdf3.execute-api.eu-west-2.amazonaws.com/",
        changeOrigin: true,
      },
    },
  },
});
