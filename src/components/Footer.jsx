import React from 'react';

const Footer = () => {
  return (
    <footer className="h-10 border-t border-primary/10 bg-white dark:bg-background-dark px-6 flex items-center justify-between z-50">
      <div className="flex items-center gap-4 text-[10px] text-slate-700 dark:text-slate-500 font-bold">
        <div className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Data Connected
        </div>
        <span>|</span>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">history</span>
          Last saved 2m ago
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[10px] text-slate-700 dark:text-slate-500 font-bold">
          <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
          Preview Scale: 85%
        </div>
        <a 
          href="https://accio.mintlify.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[10px] text-primary font-bold cursor-pointer hover:underline border-r border-primary/20 pr-4"
        >
          <span className="material-symbols-outlined text-[14px]">description</span>
          Docs
        </a>
        <a 
          href="https://x.com/accio_access" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[10px] text-primary font-bold cursor-pointer hover:underline"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          accio_access
        </a>
      </div>
    </footer>
  );
};

export default Footer;
