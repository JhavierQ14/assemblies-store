import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  server: {
    // open: '/pages/home.html', // descomenta si lo necesitas
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  }
})