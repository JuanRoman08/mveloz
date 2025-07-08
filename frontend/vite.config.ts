import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: isDev
    ? {
        proxy: {
          '/api': {
            target: 'http://127.0.0.1:8000',
            changeOrigin: true,
          },
        },
      }
    : undefined,
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
})
