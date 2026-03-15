// Comprehensive Buffer & Global Polyfills for Solana Wallet Signing
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer
window.global = window.global || window

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Deployment trigger: Privy Solana Integration v1.0.3
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
          showWalletLoginFirst: false,
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
        solanaClusters: [{
          name: 'mainnet-beta',
          rpcUrl: 'https://api.mainnet-beta.solana.com',
        }],
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>,
)
