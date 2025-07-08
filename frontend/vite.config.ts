import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Detectar si es entorno de desarrollo
const isDev = process.env.NODE_ENV === 'development'

// URL del backend para Codespaces
const codespacesBackend =
  'https://super-enigma-wr5wg6rv7gr4354g6-8000.app.github.dev'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      '/api': {
        target: isDev ? 'http://127.0.0.1:8000' : codespacesBackend,
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '/api'),
      },
    },
    port: 5173,
    strictPort: true,
    open: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
})