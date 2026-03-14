import React from 'react';

const ComingSoon = ({ title }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background-dark/80 p-8 text-center">
      <div className="size-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
        <span className="material-symbols-outlined text-5xl text-primary opacity-50">hourglass_empty</span>
      </div>
      <h2 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase">{title}</h2>
      <p className="text-slate-400 font-medium max-w-md">
        We're working hard to bring you the best experience. This feature is coming soon!
      </p>
      <div className="mt-8 px-6 py-2 rounded-full border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
        Under Development
      </div>
    </div>
  );
};

export default ComingSoon;
