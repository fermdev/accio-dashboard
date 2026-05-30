import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { createChatCompletion } from './api/lib/mimo.js'

// https://vite.dev/config/
function accioChatDevPlugin() {
  return {
    name: 'accio-chat-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', async () => {
          try {
            const payload = JSON.parse(body || '{}')
            const { messages, model } = payload
            if (!Array.isArray(messages) || messages.length === 0) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'messages array is required' }))
              return
            }
            const reply = await createChatCompletion({ messages, model })
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: reply }))
          } catch (error) {
            res.statusCode = error.statusCode || 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: error.message || 'Chat request failed' }))
          }
        })
        req.on('error', next)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
  plugins: [
    react(), 
    tailwindcss(),
    accioChatDevPlugin(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  optimizeDeps: {
    include: ['buffer', '@solana/web3.js'],
  },
  server: {
    proxy: {
      // Proxy DAS API calls to bypass CORS (mainnet-beta blocks browser Origin headers)
      // Proxy DAS API calls to bypass CORS (consistent with /api/das serverless function)
      '/api/das': {
        target: 'https://wrpc.accessprotocol.co/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/das/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
            proxyReq.setHeader('Origin', 'https://hub.accessprotocol.co');
            proxyReq.setHeader('Referer', 'https://hub.accessprotocol.co/');
          });
        }
      },
      '/api/supporters': {
        target: 'https://go-api.accessprotocol.co/supporters/',
        changeOrigin: true,
        rewrite: (path) => {
          // Translate query params to path params for local dev: ?wallet=W&type=T -> /W/T
          try {
            const url = new URL(path, 'http://localhost');
            const wallet = url.searchParams.get('wallet');
            const type = url.searchParams.get('type');
            if (wallet && type) return `/${wallet}/${type}`;
          } catch (e) {}
          return path.replace(/^\/api\/supporters/, '');
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('referer');
            proxyReq.setHeader('Origin', 'https://hub.accessprotocol.co');
            proxyReq.setHeader('Referer', 'https://hub.accessprotocol.co/');
          });
        }
      }
    }
  }
}})

