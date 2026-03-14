import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      <div className="flex flex-col h-screen overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Layout;
