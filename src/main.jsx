// Comprehensive Buffer & Global Polyfills for Solana Wallet Signing
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer
window.global = window.global || window
window.process = window.process || { env: {} }

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Deployment trigger: Privy Solana Integration v1.0.5
import './index.css'
import App from './App.jsx'
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrivyProvider
      appId="cmmrih71w03gq0cl5uiwrc12h"
      config={{
        loginMethods: ['email', 'wallet', 'google'],
        appearance: {
          theme: 'dark',
          accentColor: '#3B82F6',
          walletChainType: 'solana-only',
        },
        externalWallets: {
          solana: {
            connectors: toSolanaWalletConnectors(),
          },
        },
        solana: {
          rpcs: {
            'solana:mainnet': 'https://api.mainnet-beta.solana.com',
          },
        },
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>,
)
