# Accio Dashboard & Creator Card Generator 🪄

Welcome to **Accio**, a sleek and interactive dashboard built for the **Access Protocol** ecosystem on Solana. Accio empowers creators and users by providing real-time on-chain data visualization and a customizable creator card generator.

## ✨ Features

- **Dashboard & Analytics:** Accio fetches live, on-chain data directly from the Solana blockchain, presenting vital statistics such as total staked ACS, min stake requirements, and subscriber counts in an intuitive interface.
- **Creator Card Generator:** Instantly generate branded, custom, and visually appealing profile cards. Creators can select different art backgrounds, adjust typography, and see a live preview of their card before exporting it as an image (`html-to-image`).
- **Web3 Native Authentication:** Seamlessly integrates with [Privy](https://privy.io/) (`@privy-io/react-auth`) for frictionless onboarding, supporting both traditional and Web3 login methods.
- **Optimized for Solana:** Built with the latest `@solana/web3.js` and `@solana/kit` to fetch and decode on-chain pool data rapidly and reliably.

## 🛠️ Technology Stack

Accio is crafted with a modern, high-performance web stack:
- **Frontend Framework:** React 19 powered by Vite for lightning-fast HMR and optimized builds.
- **Styling:** Tailwind CSS v4 for rapid, responsive, and beautiful utility-first design.
- **Web3 & Solana:** `@solana/web3.js`, `@solana-program/*`, and Privy for wallet authentication and RPC interactions.
- **Exporting:** `html-to-image` for capturing and sharing customizable creator cards.

## 🚀 Getting Started

To run Accio locally:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd acscard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---
*Built with ❤️ for the Access Protocol community.*
