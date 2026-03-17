import React from 'react';
import iconLogo from '../assets/iconlogo.PNG';

const Header = ({ onExport, currentView, setCurrentView, theme, toggleTheme }) => {
  return (
    <header className="flex items-center justify-between border-b border-primary/20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 md:px-8 py-3 md:py-4 z-50 shrink-0">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-lg flex items-center justify-center overflow-hidden">
          <img src={iconLogo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-2xl tracking-tight text-slate-900 dark:text-white font-logo">
          acc<span className="text-primary">io</span>
        </h2>
      </div>
      
      <nav className="hidden md:flex items-center gap-8 h-full">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={`text-sm font-medium transition-colors cursor-pointer pb-1 border-b-2 ${
            currentView === 'dashboard' ? 'text-white border-primary' : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setCurrentView('market')}
          className={`text-sm font-medium transition-colors cursor-pointer pb-1 border-b-2 ${
            currentView === 'market' ? 'text-white border-primary' : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          Market
        </button>
        <button 
          onClick={() => setCurrentView('editor')}
          className={`text-sm font-medium transition-colors cursor-pointer pb-1 border-b-2 ${
            currentView === 'editor' ? 'text-white border-primary' : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          Editor
        </button>
        <button 
          onClick={() => setCurrentView('templates')}
          className={`text-sm font-medium transition-colors cursor-pointer pb-1 border-b-2 ${
            currentView === 'templates' ? 'text-white border-primary' : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          Templates
        </button>
        <button 
          onClick={() => setCurrentView('analytics')}
          className={`text-sm font-medium transition-colors cursor-pointer pb-1 border-b-2 ${
            currentView === 'analytics' ? 'text-primary dark:text-white border-primary' : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Analytics
        </button>
      </nav>
      
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="size-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
