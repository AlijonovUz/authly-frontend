import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    // Lokal ishlashda CORS muammosiz: /api so'rovlari VITE_API_PROXY manziliga uzatiladi
    server: env.VITE_API_PROXY
      ? { proxy: { '/api': { target: env.VITE_API_PROXY, changeOrigin: true } } }
      : undefined,
  }
})
