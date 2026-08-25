import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '..', '')
  const port = Number(env.FRONTEND_PORT) || 5173

  return {
    envDir: '..',
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      host: '0.0.0.0',
      port,
      strictPort: true,
      proxy: {
        '/topics': { target: 'http://localhost:8001', changeOrigin: true },
        '/cards': { target: 'http://localhost:8001', changeOrigin: true },
        '/health': { target: 'http://localhost:8001', changeOrigin: true },
      },
    },
  }
})
