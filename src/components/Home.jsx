import React, { useRef, useState } from 'react';
import iconLogo from '../assets/iconlogo.PNG';
import HomeFloatingLogos from './HomeFloatingLogos';
import ScrollReveal from './ScrollReveal';
import { HomeScrollContext } from '../context/HomeScrollContext';

const FAQ_ITEMS = [
  {
    q: 'What is Accio?',
    a: 'Accio is a dashboard for the Access Protocol ecosystem on Solana. It combines an AI assistant, creator card editor, and campaign discovery in one place.',
  },
  {
    q: 'What is Access Protocol?',
    a: 'Access Protocol lets fans stake ACS tokens into creator pools to unlock content and rewards. Creators run stake pools; stakers earn yield while supporting who they follow.',
  },
  {
    q: 'What can I ask Accio AI?',
    a: 'Ask about creators, pool stats (total staked, supporters, minimum stake), staking basics, or how to use Accio features. Accio pulls live data from the Access Hub API when you mention a creator or pool.',
  },
  {
    q: 'How does the Card Editor work?',
    a: 'Paste a Solana pool address (creator) or wallet address (staker), fetch live on-chain data, customize the card look, then export a shareable image for social media.',
  },
  {
    q: 'Where does the data come from?',
    a: 'Pool and supporter stats come from the public Access Hub API and Solana RPC. Always verify important amounts on hub.accessprotocol.co before making financial decisions.',
  },
  {
    q: 'Do I need a wallet to use Accio?',
    a: 'You can browse Home, read FAQs, and chat with Accio without connecting. Staking and some Hub actions require a Solana wallet with ACS.',
  },
];

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-200 dark:border-white/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-slate-900 dark:text-white font-medium text-sm md:text-base group-hover:text-primary transition-colors">
          {question}
        </span>
        <span
          className={`material-symbols-outlined text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''
            }`}
        >
          expand_more
        </span>
      </button>
      <div
        className={`grid transition-all duration-200 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0'
          }`}
      >
        <div className="overflow-hidden">
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed text-left pr-8">{answer}</p>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    id: 'dashboard',
    icon: 'smart_toy',
    title: 'AI Dashboard',
    description: 'Chat with Accio about creators, pools, and Access Protocol on-chain data.',
  },
  {
    id: 'editor',
    icon: 'palette',
    title: 'Card Editor',
    description: 'Build and export branded creator or staker cards from live pool data.',
  },
  {
    id: 'campaign',
    icon: 'campaign',
    title: 'Campaigns',
    description: 'Discover active earning campaigns across the ecosystem.',
  },
];

const Home = ({ onExplore, onNavigate }) => {
  const [openFaq, setOpenFaq] = useState(0);
  const scrollRef = useRef(null);

  return (
    <HomeScrollContext.Provider value={scrollRef}>
      <div
        ref={scrollRef}
        className="home-page flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-[#131314] relative"
      >
        <HomeFloatingLogos />
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 20%, rgba(101, 145, 255, 0.18) 0%, transparent 65%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center">
          <ScrollReveal direction="up" delay={0}>
            <div className="size-20 md:size-24 rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-primary/20 ring-1 ring-slate-200 dark:ring-white/10 mx-auto">
              <img src={iconLogo} alt="Accio" className="w-full h-full object-contain" />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={80}>
            <p className="text-primary text-xs font-bold uppercase tracking-[0.25em] mb-4">
              Access Protocol
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={160}>
            <h1 className="text-4xl md:text-6xl font-medium text-slate-900 dark:text-white tracking-tight mb-4">
              Your tools for{' '}
              <span className="font-logo">
                acc<span className="text-primary">io</span>
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={240}>
            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl leading-relaxed mb-10">
              Your hub for Access Protocol on Solana — explore creators, design shareable cards,
              and ask Accio anything about staking and pools.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={320}>
            <button
              type="button"
              onClick={onExplore}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold text-base shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all mb-16"
            >
              Let&apos;s explore
              <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </button>
          </ScrollReveal>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {FEATURES.map((f, i) => (
              <ScrollReveal
                key={f.id}
                direction={i % 2 === 0 ? 'left' : 'right'}
                delay={i * 100}
              >
                <button
                  type="button"
                  onClick={() => onNavigate(f.id)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] backdrop-blur-sm p-5 text-left hover:border-primary/40 hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all"
                >
                  <span className="material-symbols-outlined text-primary text-2xl mb-3 block">
                    {f.icon}
                  </span>
                  <h3 className="text-slate-900 dark:text-white font-semibold mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
                </button>
              </ScrollReveal>
            ))}
          </div>

          <section className="w-full mt-16 md:mt-20 text-left">
            <ScrollReveal direction="up" className="text-center">
              <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-white mb-2">
                Frequently asked questions
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={100} className="text-center">
              <p className="text-slate-500 text-sm mb-8 max-w-lg mx-auto">
                Quick answers about Accio and Access Protocol. Still stuck? Ask Accio in the
                Dashboard.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={180}>
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] backdrop-blur-sm px-5 md:px-6">
                {FAQ_ITEMS.map((item, index) => (
                  <FaqItem
                    key={item.q}
                    question={item.q}
                    answer={item.a}
                    isOpen={openFaq === index}
                    onToggle={() => setOpenFaq(openFaq === index ? -1 : index)}
                  />
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="fade" delay={260} className="mt-6 text-center">
              <button
                type="button"
                onClick={onExplore}
                className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 transition-colors"
              >
                Go to Dashboard
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </ScrollReveal>
          </section>

          <ScrollReveal direction="up" delay={100}>
            <a
              href="https://hub.accessprotocol.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 text-sm text-slate-500 hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              Open Access Hub
              <span className="material-symbols-outlined text-base">open_in_new</span>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </HomeScrollContext.Provider>
  );
};

export default Home;
