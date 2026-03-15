import React, { useEffect, useState } from 'react';

const JupiterSwap = () => {
  const [loading, setLoading] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    let timer;
    
    const init = () => {
      if (!walletConnected) return;

      if (window.Jupiter && window.Jupiter.init) {
        try {
          window.Jupiter.init({
            displayMode: 'integrated',
            integratedTargetId: 'jupiter-terminal',
            endpoint: 'https://api.mainnet-beta.solana.com',
            strictTokenList: false,
            formProps: {
              fixedInputMint: false,
              fixedOutputMint: true,
              initialInputMint: 'So11111111111111111111111111111111111111112', // SOL
              initialOutputMint: '5MAYDfq5yxtudAhtfyuMBuHZjgAbaS9tbEyEQYAhDS5y', // ACS
            },
            containerStyles: { zIndex: 100 },
          });
          setLoading(false);
          console.log('Jupiter Terminal Initialized');
        } catch (e) {
          console.error('Jupiter Init Error:', e);
          timer = setTimeout(init, 1000);
        }
      } else {
        timer = setTimeout(init, 500);
      }
    };

    if (walletConnected) {
      init();
    }
    
    return () => {
      clearTimeout(timer);
      const el = document.getElementById('jupiter-terminal');
      if (el) el.innerHTML = '';
    };
  }, [walletConnected]);

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 md:py-12 bg-background-dark/50 overflow-y-auto">
      <div className="w-full max-w-[440px] px-4 space-y-6">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-4xl font-black text-white uppercase tracking-tight">Get ACS</h1>
        </div>

        {!walletConnected ? (
          <div className="bg-[#1a1515] rounded-2xl border border-white/10 p-8 space-y-8 shadow-2xl">
            <div className="flex flex-col items-start gap-4">
              <div className="size-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <span className="material-symbols-outlined text-blue-500 text-4xl">wallet</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">Wallet Not Connected</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  To buy ACS on Accio, please connect your wallet.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setWalletConnected(true)}
              className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 text-xs"
            >
              Connect wallet
            </button>
          </div>
        ) : (
          <div className="bg-[#13141b] rounded-[2.5rem] border border-white/5 shadow-2xl relative min-h-[500px] overflow-hidden">
            <div id="jupiter-terminal" className="w-full h-full"></div>
            
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-[#13141b] z-10">
                <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                  Connection Stable...
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
          <p className="text-slate-500 text-[10px] font-medium leading-relaxed uppercase tracking-wider">
            Direct Swap • Low Slippage • Jupiter Verified
          </p>
        </div>
      </div>
    </div>
  );
};

export default JupiterSwap;

