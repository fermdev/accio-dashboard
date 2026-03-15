import React, { useEffect, useRef, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

const JupiterSwap = () => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const initRef = useRef(false);
  
  const { login, authenticated, logout } = usePrivy();

  useEffect(() => {
    let script;
    let isMounted = true;

    const initJupiter = () => {
      if (!isMounted || initRef.current || !authenticated) return;
      
      if (window.Jupiter && window.Jupiter.init) {
        try {
          if (containerRef.current) {
            containerRef.current.innerHTML = '';
          }

          window.Jupiter.init({
            displayMode: 'integrated',
            integratedTargetId: 'jupiter-terminal-container',
            endpoint: 'https://api.mainnet-beta.solana.com', 
            strictTokenList: false,
            formProps: {
              fixedInputMint: true,
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
        } catch (err) {
          console.error('Jupiter Initialization Error:', err);
          setError('Market connection failed. Please refresh.');
        }
      }
    };

    // Load script dynamically
    if (!document.querySelector('script[src*="terminal.jup.ag"]')) {
      script = document.createElement('script');
      script.src = 'https://terminal.jup.ag/main-v2.js';
      script.async = true;
      script.onload = () => {
        if (authenticated) {
          setTimeout(initJupiter, 500);
        }
      };
      script.onerror = () => setError('Failed to load connection script.');
      document.head.appendChild(script);
    } else if (authenticated) {
      setTimeout(initJupiter, 500);
    }

    return () => {
      isMounted = false;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      initRef.current = false;
    };
  }, [authenticated]);

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 md:py-12 bg-background-dark/50 overflow-y-auto">
      <div className="w-full max-w-[440px] px-4 space-y-6">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-4xl font-black text-white uppercase tracking-tight">Get ACS</h1>
            {authenticated && (
              <button 
                onClick={logout}
                className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Logout
              </button>
            )}
          </div>
          {authenticated && (
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <span className={`size-2 rounded-full ${isLoaded ? 'bg-primary animate-pulse' : 'bg-slate-600'}`}></span>
              {isLoaded ? 'Powered by Jupiter' : 'Connecting to Market...'}
            </p>
          )}
        </div>

        {!authenticated ? (
          <div className="bg-[#1a1515] rounded-[2.5rem] border border-white/10 p-10 space-y-10 shadow-2xl relative overflow-hidden group text-center">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            
            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="size-24 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-blue-500 text-6xl">account_circle</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white tracking-tight uppercase italic text-white text-center">Welcome to Accio</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Sign in with Email or Google to start swapping SOL to ACS securely.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => login({
                onError: (err) => {
                  console.error('Login Error:', err);
                  // Check if it's a domain/origin issue
                  if (err.toString().includes('origin')) {
                    alert('Login failed: Please ensure https://accio-v1.vercel.app is whitelisted in Privy Dashboard -> Domains');
                  } else {
                    alert('Login failed: ' + err);
                  }
                }
              })}
              className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all active:scale-95 text-[10px] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
            >
              Sign In / Login
            </button>

            <div className="flex items-center justify-center gap-2 text-slate-600">
              <span className="material-symbols-outlined text-xs">lock</span>
              <p className="text-[10px] font-bold uppercase tracking-widest">Protected by Privy</p>
            </div>
          </div>
        ) : (
          <div className="bg-[#13141b] rounded-[2.5rem] border border-white/5 shadow-2xl relative min-h-[600px] flex flex-col overflow-hidden">
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
                  className="px-8 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 shadow-xl"
                >
                  Retry Connection
                </button>
              </div>
            )}
          </div>
        )}
        
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
