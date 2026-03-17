import React, { useState } from 'react';
import iconLogo from '../assets/iconlogo.PNG';

const Header = ({ onExport, currentView, setCurrentView, theme, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'market', label: 'Market' },
    { id: 'editor', label: 'Editor' },
    { id: 'campaign', label: 'Campaign' },
    { id: 'analytics', label: 'Analytics' },
  ];

  const handleNavClick = (view) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="relative flex items-center justify-between border-b border-primary/20 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 md:px-8 py-3 md:py-4 z-50 shrink-0">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-lg flex items-center justify-center overflow-hidden">
          <img src={iconLogo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-2xl tracking-tight text-slate-900 dark:text-white font-logo">
          acc<span className="text-primary">io</span>
        </h2>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 h-full">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`text-sm font-medium transition-colors cursor-pointer pb-1 border-b-2 ${
              currentView === item.id ? 'text-primary dark:text-white border-primary' : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={toggleTheme}
          className="size-10 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden size-10 rounded-xl flex items-center justify-center text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
        >
          <span className="material-symbols-outlined text-[24px]">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-background-dark border-b border-primary/20 p-4 flex flex-col gap-2 md:hidden animate-in slide-in-from-top duration-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                currentView === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
