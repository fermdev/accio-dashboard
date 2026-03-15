import React, { useEffect, useRef, useState } from 'react';

const JupiterSwap = () => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const initRef = useRef(false);

  useEffect(() => {
    let script;
    let isMounted = true;

    const initJupiter = () => {
      if (!isMounted || initRef.current) return;
      
      if (window.Jupiter && window.Jupiter.init) {
        try {
          // Clear any previous attempts
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }

          window.Jupiter.init({
            displayMode: 'integrated',
            integratedTargetId: 'jupiter-terminal-container',
            endpoint: 'https://api.mainnet-beta.solana.com',
            strictTokenList: false,
            formProps: {
              fixedInputMint: false,
              fixedOutputMint: true,
              initialInputMint: 'So11111111111111111111111111111111111111112', // SOL
              initialOutputMint: '5MAYDfq5yxtudAhtfyuMBuHZjgAbaS9tbEyEQYAhDS5y', // ACS
            },
            containerStyles: { 
              width: '100%', 
              height: '100%',
              zIndex: 10 
            }
          });
          
          initRef.current = true;
          setIsLoaded(true);
          console.log('Jupiter Terminal successfully initialized');
        } catch (err) {
          console.error('Jupiter Initialization Error:', err);
          setError('Failed to start swap widget. Please refresh.');
        }
      } else {
        setError('Jupiter library not detected.');
      }
    };

    // Load script dynamically
    if (!document.querySelector('script[src*="terminal.jup.ag"]')) {
      script = document.createElement('script');
      script.src = 'https://terminal.jup.ag/main-v2.js';
      script.async = true;
      script.onload = () => {
        // Wait a tiny bit for the global to be ready
        setTimeout(initJupiter, 500);
      };
      script.onerror = () => setError('Failed to load Jupiter script.');
      document.head.appendChild(script);
    } else {
      // Script already exists, wait for DOM then init
      setTimeout(initJupiter, 500);
    }

    return () => {
      isMounted = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      initRef.current = false;
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 md:py-12 bg-background-dark/50 overflow-y-auto">
      <div className="w-full max-w-[440px] px-4 space-y-6">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-4xl font-black text-white uppercase tracking-tight">Get ACS</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <span className={`size-2 rounded-full ${isLoaded ? 'bg-primary animate-pulse' : 'bg-slate-600'}`}></span>
            {isLoaded ? 'Powered by Jupiter' : 'Connecting to Market...'}
          </p>
        </div>

        <div className="bg-[#13141b] rounded-[2.5rem] border border-white/5 shadow-2xl relative min-h-[600px] flex flex-col overflow-hidden">
          {/* Target for Jupiter */}
          <div 
            id="jupiter-terminal-container" 
            ref={containerRef} 
            className="w-full flex-1 min-h-[600px] z-10"
          ></div>
          
          {!isLoaded && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-[#13141b] z-20">
              <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                Establishing Secure Link...
              </p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#13141b] z-30">
              <span className="material-symbols-outlined text-red-500 text-4xl mb-4">error</span>
              <p className="text-white text-sm font-bold mb-2">Market Unavailable</p>
              <p className="text-slate-400 text-xs mb-6 max-w-[200px] mx-auto leading-relaxed">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 shadow-xl"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>
        
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
          <p className="text-slate-500 text-[10px] font-medium leading-relaxed uppercase tracking-widest">
            Protocol Secure • Direct ACS Swap • Verified
          </p>
        </div>
      </div>
    </div>
  );
};

export default JupiterSwap;
