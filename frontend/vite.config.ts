import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Detectar si estamos en desarrollo
const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: isDev
      ? {
          '/api': {
            target: 'http://127.0.0.1:8000', // backend local
            changeOrigin: true,
          },
        }
      : undefined,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
})
