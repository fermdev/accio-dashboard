# Accio — Access Protocol Dashboard & Creator Card Generator

<p align="center">
  <img src="public/favicon.svg" alt="Accio Logo" width="80" />
</p>

<p align="center">
  <strong>Real-time on-chain analytics & customizable creator cards for the Access Protocol ecosystem on Solana.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Solana-Web3.js-9945FF?logo=solana&logoColor=white" />
</p>

---

## ✨ Features

- **Live On-Chain Dashboard** — Fetches real-time data directly from the Solana blockchain: total staked ACS, min-stake requirements, subscriber counts, and more.
- **Creator Card Generator** — Generate branded, shareable profile cards with customizable backgrounds, typography, and live preview. Export as PNG via `html-to-image`.
- **Light & Dark Mode** — Full theme support with a polished UI for both modes.
- **Web3 Authentication** — Frictionless onboarding via [Privy](https://privy.io/), supporting both traditional and wallet-based login.
- **Campaigns** — Browse and discover active earning campaigns with token reward details.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Styling | Tailwind CSS v4 |
| Solana | `@solana/web3.js`, `@solana/kit`, `@solana-program/*` |
| Auth | Privy (`@privy-io/react-auth`) |
| Export | `html-to-image` |

## 🚀 Getting Started

### Prerequisites
- Node.js **v20+**
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/fermdev/accio-dashboard.git
cd accio-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

*Built with ❤️ for the [Access Protocol](https://accessprotocol.co/) community.*
