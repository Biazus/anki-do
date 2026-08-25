import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import type { ProxyOptions } from 'vite'
import { defineConfig, loadEnv } from 'vite'

function createApiProxy(target: string): ProxyOptions {
  return {
    target,
    changeOrigin: true,
    bypass(req) {
      // Navegação do browser (F5 em /topics, /cards/new) pede HTML — não proxy para a API.
      if (req.headers.accept?.includes('text/html')) {
        return '/index.html'
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '..', '')
  const port = Number(env.FRONTEND_PORT) || 5173
  const backendTarget = `http://localhost:${env.BACKEND_PORT || 8001}`

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
        '/topics': createApiProxy(backendTarget),
        '/cards': createApiProxy(backendTarget),
        '/health': createApiProxy(backendTarget),
      },
    },
  }
})
