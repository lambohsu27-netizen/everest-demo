import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'
import { version } from './package.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    allowedHosts: ['*'],
    proxy: {
      '/api-wilayah': {
        target: 'https://emsifa.github.io/api-wilayah-indonesia/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-wilayah/, ''),
      },
    },
  },
  build: {
    sourcemap: true, // <-- Enable source maps
  },
  resolve: {
    alias: {
      '@interstellar-component': path.resolve(__dirname, './interstellar-component'),
      '@src': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@services': path.resolve(__dirname, 'src/services'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
})
