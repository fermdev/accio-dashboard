import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
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
      }
    }
  }
})

