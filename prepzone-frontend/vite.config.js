import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 👇 Add proxy for backend
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // 🟢 your backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
