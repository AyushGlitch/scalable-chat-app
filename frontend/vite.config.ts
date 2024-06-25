import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
   },
   server: {
    port: 5173,
    strictPort: true,
    host: "0.0.0.0",
    cors: {
      origin: "http://localhost:3000", // Ensure this matches your backend's URL
      credentials: true,
    },
  },
})

// origin: "http://0.0.0.0:8080",
// cors: {
//   origin: ["http://localhost:3000", "http://localhost:8080"], // Ensure this matches your backend's URL
//   credentials: true,
// },