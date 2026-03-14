import React from 'react';

const CardPreview = () => {
  return (
    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">visibility</span>
          Live Preview
        </h2>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors tooltip relative" data-tip="Download PNG">
            <span className="material-symbols-outlined text-gray-300 text-sm">download</span>
          </button>
          <button className="w-10 h-10 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors tooltip relative" data-tip="Share to X">
            <svg className="w-4 h-4 fill-gray-300" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="w-full max-w-sm aspect-[4/5] rounded-2xl relative overflow-hidden group shadow-2xl shadow-primary/20 border border-white/10" id="proof-card">
        {/* Card Background Image/Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#191121] to-[#311b4a] z-0"></div>
        <div className="absolute inset-0 social-card-preview opacity-60 mix-blend-overlay z-0"></div>
        
        {/* Card Content Layer - z-10 for raising above background */}
        <div className="relative z-10 w-full h-full p-8 flex flex-col pt-12">
          {/* Top subtle badge */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">Verified Proof</span>
          </div>

          {/* User Info Section */}
          <div className="flex flex-col items-center mt-6 mb-8 relative">
            <div className="w-24 h-24 rounded-full border-2 border-primary/50 p-1 mb-4 relative z-20">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20 flex items-center justify-center overflow-hidden">
                 <span className="material-symbols-outlined text-4xl text-gray-500">person</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#1da1f2] border-2 border-[#191121] flex items-center justify-center">
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-1">
              @SnoopDogg
              <span className="material-symbols-outlined text-blue-400 text-lg">verified</span>
            </h3>
            <p className="text-primary font-medium">Access Protocol Pool</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 w-full mt-auto mb-8">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-black/50 transition-colors">
              <div className="absolute top-0 right-0 w-8 h-8 bg-primary/20 blur-xl rounded-full"></div>
              <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Position</span>
              <span className="text-3xl font-black text-white bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">#1</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-black/50 transition-colors">
              <div className="absolute top-0 left-0 w-8 h-8 bg-primary/20 blur-xl rounded-full"></div>
              <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Time Locked</span>
              <span className="text-xl font-bold text-white">6 Mo</span>
            </div>
          </div>

          <div className="w-full bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-xl p-4 border border-primary/20 flex items-center justify-between relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50"></div>
             <div className="relative z-10 w-full text-center">
                 <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Locked ACS</span>
                 <span className="block text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-300 to-white drop-shadow-[0_0_10px_rgba(138,44,226,0.8)] font-mono">100,000</span>
             </div>
          </div>

          {/* Footer watermark */}
          <div className="absolute bottom-4 left-0 w-full text-center text-[10px] text-gray-500 flex justify-center items-center gap-1 font-medium">
             <span className="material-symbols-outlined text-[12px]">lock</span>
             Secured by Access Protocol
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        <span className="w-2 h-2 rounded-full bg-gray-600"></span>
        <span className="w-2 h-2 rounded-full bg-gray-600"></span>
      </div>
    </div>
  );
};

export default CardPreview;
