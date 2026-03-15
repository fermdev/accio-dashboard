import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer
import './index.css'
import App from './App.jsx'
import { PrivyProvider } from '@privy-io/react-auth';

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
