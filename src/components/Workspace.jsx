import React from 'react';
import accessLogo from '../assets/access-logo.png';
import accioLogo from '../assets/iconlogo.PNG';
import cardBg1 from '../assets/card-bg.png';
import cardBg2 from '../assets/card-bg2.png';
import cardBg3 from '../assets/card-bg3.png';
import cardBg4 from '../assets/card-bg4.png';

const Workspace = ({ poolData, stakerData, customizer, exportId = "social-card-export", isExportOnly = false }) => {
  const containerRef = React.useRef(null);
  const [scale, setScale] = React.useState(0.75);

  React.useEffect(() => {
    if (isExportOnly) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        const isMobile = width < 768;
        if (isMobile) {
          const scaleW = (width - 16) / 1000;
          setScale(Math.min(scaleW, 1));
        } else {
          const scaleW = (width - 150) / 1000;
          const scaleH = (height - 150) / 525;
          setScale(Math.min(scaleW, scaleH, 1));
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const isStakerMode = customizer?.type === 'staker';
  
  // Handlers for Creator Data
  const creatorDisplay = poolData || {
    creatorName: 'Creator Name',
    totalLocked: 100000000,
    stakers: 5000,
    rank: 5,
    poolAddress: '3x5J...TTUf'
  };

  const stakerDisplay = stakerData || {
    address: '3x5J...TTUf',
    name: 'Subscriber Name',
    totalStaked: 500000,
    poolCount: 12,
    stakeApy: 28.55
  };

  const apyValue = stakerDisplay.stakeApy || 28.55;

  const useImageBg = customizer?.backgroundType === 'image';
  const activeArt = customizer?.selectedBg === 'bg4' ? cardBg4 : customizer?.selectedBg === 'bg3' ? cardBg3 : customizer?.selectedBg === 'bg2' ? cardBg2 : cardBg1;

  const renderCardContent = () => (
    <div className="relative z-10 w-full h-full flex flex-col pt-6 pb-10 px-8 justify-between text-left">
      <div className="flex flex-col justify-start flex-1">
        {isStakerMode ? (
          <>
            <div className="mb-1">
              <div className="flex items-center gap-2.5 mb-2">
                <img src={accioLogo} alt="Accio" className="w-9 h-9 object-contain" />
                <span className="text-white text-[22px] font-black tracking-tight leading-none" style={{fontFamily: 'AllRoundGothic, sans-serif'}}>accio</span>
              </div>
              <p className="text-primary text-[14px] font-black uppercase tracking-[0.3em] mb-1.5">Subscriber Profile</p>
              <h1 className="text-5xl font-black text-white tracking-[-0.02em] leading-none soft-text-shadow">
                {stakerDisplay.name || (stakerDisplay.address.length > 20 ? `${stakerDisplay.address.slice(0, 6)}...${stakerDisplay.address.slice(-6)}` : stakerDisplay.address)}
              </h1>
            </div>
            
            <div className="mb-3">
              <p className="text-white/40 text-[14px] font-black uppercase tracking-[0.15em] mb-2">Total ACS Staked</p>
              <h2 className="text-6xl font-black text-white tracking-[-0.02em] leading-none drop-shadow-2xl soft-text-shadow">
                {stakerDisplay.totalStaked.toLocaleString()} <span className="text-primary text-6xl ml-2 tracking-normal">ACS</span>
              </h2>
            </div>
            
            <div className="flex gap-20">
              <div className="flex flex-col">
                <p className="text-white/40 text-[13px] font-black uppercase tracking-widest mb-1.5">Active Pools</p>
                <p className="text-4xl font-black text-white leading-none tracking-tight soft-text-shadow">{stakerDisplay.poolCount.toLocaleString()}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-primary text-[13px] font-black uppercase tracking-[0.15em] mb-1.5">Stake Rewards APY</p>
                <p className="text-4xl font-black text-white leading-none tracking-tight soft-text-shadow">
                  {apyValue.toFixed(2)} <span className="text-primary text-2xl">%</span>
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-1">
              <div className="flex items-center gap-2.5 mb-2">
                <img src={accioLogo} alt="Accio" className="w-9 h-9 object-contain" />
                <span className="text-white text-[22px] font-black tracking-tight leading-none" style={{fontFamily: 'AllRoundGothic, sans-serif'}}>accio</span>
              </div>
              <p className="text-primary text-[14px] font-black uppercase tracking-[0.3em] mb-1.5">Creator Profile</p>
              <h1 className="text-5xl font-black text-white tracking-[-0.02em] leading-none soft-text-shadow">{creatorDisplay.creatorName}</h1>
            </div>
            
            <div className="mb-3">
              <p className="text-white/40 text-[14px] font-black uppercase tracking-[0.15em] mb-2">Total ACS Locked</p>
              <h2 className="text-6xl font-black text-white tracking-[-0.02em] leading-none drop-shadow-2xl soft-text-shadow">
                {creatorDisplay.totalLocked.toLocaleString()} <span className="text-primary text-6xl ml-2 tracking-normal">ACS</span>
              </h2>
            </div>
            
            <div className="flex gap-20">
              <div className="flex flex-col">
                <p className="text-white/40 text-[13px] font-black uppercase tracking-widest mb-1.5">Stakers</p>
                <p className="text-4xl font-black text-white leading-none tracking-tight soft-text-shadow">{creatorDisplay.stakers.toLocaleString()}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-white/40 text-[13px] font-black uppercase tracking-widest mb-1.5">Global Rank</p>
                <p className="text-4xl font-black text-white leading-none tracking-tight soft-text-shadow">#{creatorDisplay.rank}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-auto">
        <div className="flex flex-col gap-1.5">
          <p className="text-white/30 text-[8px] font-bold uppercase tracking-[0.4em]">Powered by</p>
          <img src={accessLogo} alt="Access Protocol" className="h-4 opacity-90 w-auto object-contain" crossOrigin="anonymous" />
        </div>
        
        {customizer?.showQr && (
          <div className="flex gap-6 items-center flex-row-reverse text-right">
            <div className="size-16 bg-white p-1 rounded-xl shadow-2xl shrink-0 flex items-center justify-center overflow-hidden">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                  isStakerMode 
                    ? `https://hub.accessprotocol.co/en`
                    : `https://hub.accessprotocol.co/creators/${creatorDisplay.poolAddress}`
                )}`}
                alt="Stake Now"
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div className="flex flex-col items-end justify-center mb-0.5">
              <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest mb-1.5">
                {isStakerMode ? 'View on Hub' : 'Stake & Subscribe'}
              </p>
              <p className="text-white/50 text-[10px] font-mono">
                {isStakerMode 
                  ? `hub.accessprotocol.co/en`
                  : `hub.accessprotocol.co/...${creatorDisplay.poolAddress.slice(-6)}`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderBackground = () => (
    <>
      {useImageBg ? (
        <div className="absolute inset-0">
          <img src={activeArt} alt="Background" className="w-full h-full object-cover" crossOrigin="anonymous" />
          {customizer?.selectedBg === 'bg2' && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-red-500/10 to-transparent to-60%"></div>
          )}
          {customizer?.selectedBg === 'bg3' && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#be185d]/30 via-[#be185d]/10 to-transparent to-55%"></div>
          )}
          {customizer?.selectedBg === 'bg4' && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-blue-900/50 to-transparent to-65%"></div>
          )}
        </div>
      ) : (
        <div 
          className="absolute inset-0 opacity-100 transition-colors duration-500"
          style={{ 
            background: `linear-gradient(135deg, ${customizer.gradientColor1 || '#1B1A1A'} 0%, ${customizer.gradientColor2 || '#1e2440'} 100%)` 
          }}
        >
          <div className="absolute inset-0 gradient-mesh opacity-40"></div>
        </div>
      )}
      {customizer?.glassEffect && (
        <div 
          className="absolute inset-0 z-0 bg-white/[0.03]"
          style={{ 
            backdropFilter: `blur(${customizer.blurAmount}px)`,
            WebkitBackdropFilter: `blur(${customizer.blurAmount}px)`
          }}
        ></div>
      )}
    </>
  );

  if (isExportOnly) {
    return (
      <div 
        id={exportId} 
        className="relative social-card-preview rounded-none overflow-hidden"
        style={{ 
          width: '1000px',
          height: '525px',
          minWidth: '1000px',
          minHeight: '525px',
          '--color-primary': customizer?.accentColor || '#8a2ce2'
        }}
      >
        {renderBackground()}
        {renderCardContent()}
        <div className="absolute top-6 right-8 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 select-none">
          access protocol
        </div>
      </div>
    );
  }

  return (
    <main 
      ref={containerRef}
      className="w-full h-full bg-slate-100 dark:bg-background-dark/80 overflow-hidden flex items-center justify-center p-2 md:p-12 transition-colors duration-300"
      style={{ 
        '--color-primary': customizer?.accentColor || '#8a2ce2',
        '--workspace-scale': scale
      }}
    >
      <div 
        style={{ 
          width: `${1000 * scale}px`, 
          height: `${525 * scale}px`,
          position: 'relative',
          flexShrink: 0
        }}
        className="flex items-center justify-center"
      >
        <div 
          className="transition-transform duration-300 ease-out flex-shrink-0" 
          style={{ 
            transform: `scale(${scale})`,
            width: '1000px',
            height: '525px',
            position: 'absolute',
            top: 0,
            left: 0,
            transformOrigin: 'top left'
          }}
        >
          <div className="relative w-[1000px] h-[525px] flex-shrink-0 social-card-preview bg-black rounded-none shadow-[0_30px_90px_-15px_rgba(0,0,0,0.6)] dark:shadow-[0_30px_90px_-15px_rgba(0,0,0,0.8)] border border-slate-700/50 dark:border-white/10 overflow-hidden">
            {renderBackground()}
            {renderCardContent()}
            <div className="absolute top-6 right-8 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 select-none">
              access protocol
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Workspace;
