import React from 'react';
import accessLogo from '../assets/access-logo.png';

const Footer = () => {
  return (
    <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 pb-12 w-full">
      <div className="flex items-center gap-6">
        <a 
          href="https://x.com/accio_access" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-primary dark:text-white/20 dark:hover:text-white transition-colors"
          title="Follow us on X"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a 
          href="https://accio.mintlify.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] font-bold text-slate-500 hover:text-primary dark:text-white/30 dark:hover:text-white transition-colors uppercase tracking-[0.2em]"
        >
          Documentation
        </a>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-slate-400 dark:text-white/20 font-bold uppercase tracking-[0.2em]">Powered by</span>
        <img src={accessLogo} alt="Access Protocol" className="h-3.5 dark:invert opacity-100 dark:opacity-90" />
      </div>
    </footer>
  );
};

export default Footer;
