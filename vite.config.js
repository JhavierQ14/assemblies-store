import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  /*server: {
    open: '/pages/home.html', // o open: '/' si pones un index.html en src/
  },*/
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  }
})