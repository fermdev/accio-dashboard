import { Buffer } from 'buffer'
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer
}
if (typeof global !== 'undefined' && !global.Buffer) {
  global.Buffer = Buffer
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Deployment trigger: Privy Solana Integration v1.0.2
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
