import React from 'react';
import accessLogo from '../assets/access-logo.png';
import cardBg1 from '../assets/card-bg.png';
import cardBg2 from '../assets/card-bg2.png';

const Workspace = ({ poolData, customizer, exportId = "social-card-export", isExportOnly = false }) => {
  const containerRef = React.useRef(null);
  const [scale, setScale] = React.useState(0.75);

  React.useEffect(() => {
    if (isExportOnly) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        const isMobile = width < 768;
        if (isMobile) {
          // On mobile: scale purely from width with minimal padding
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

  const isPlaceholder = !poolData;
  const displayData = poolData || {
    creatorName: 'Galang Ferm',
    totalLocked: 22450120,
    stakers: 1240,
    rank: 14,
    poolAddress: '0x71C765...d897'
  };

  const useImageBg = customizer?.backgroundType === 'image';
  const activeArt = customizer?.selectedBg === 'bg2' ? cardBg2 : cardBg1;

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
          '--color-primary': customizer?.accentColor || '#8a2ce2',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          fontSmooth: 'always'
        }}
      >
        {useImageBg ? (
          <div className="absolute inset-0">
            <img src={activeArt} alt="Background" className="w-full h-full object-cover" crossOrigin="anonymous" />
            <div className="absolute inset-0 bg-black/30"></div>
            {/* Horizontal gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
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
            className="absolute inset-0 z-0 bg-black/60"
          ></div>
        )}
        
        <div className="relative z-10 w-full h-full flex flex-col p-10 justify-between text-left">
          <div className="flex flex-col justify-center flex-1">
            <div className="mb-4">
              <p className="text-primary text-[14px] font-black uppercase tracking-[0.3em] mb-3">Creator Profile</p>
              <h1 className="text-5xl font-black text-white tracking-[-0.02em] leading-none soft-text-shadow">{displayData.creatorName}</h1>
            </div>
            
            <div className="mb-6">
              <p className="text-white/40 text-[14px] font-black uppercase tracking-[0.15em] mb-2">Total ACS Locked</p>
              <h2 className="text-6xl font-black text-white tracking-[-0.02em] leading-none drop-shadow-2xl soft-text-shadow">
                {displayData.totalLocked.toLocaleString()} <span className="text-primary text-6xl ml-2 tracking-normal">ACS</span>
              </h2>
            </div>
            
            <div className="flex gap-20">
              <div className="flex flex-col">
                <p className="text-white/40 text-[13px] font-black uppercase tracking-widest mb-1.5">Stakers</p>
                <p className="text-4xl font-black text-white leading-none tracking-tight soft-text-shadow">{displayData.stakers.toLocaleString()}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-white/40 text-[13px] font-black uppercase tracking-widest mb-1.5">Global Rank</p>
                <p className="text-4xl font-black text-white leading-none tracking-tight soft-text-shadow">#{displayData.rank}</p>
              </div>
            </div>
          </div>
      
          <div className="flex justify-between items-end border-t border-white/10 pt-6 mt-auto">
            <div className="flex flex-col gap-1.5">
              <p className="text-white/30 text-[8px] font-bold uppercase tracking-[0.4em]">Powered by</p>
              <img src={accessLogo} alt="Access Protocol" className="h-4 opacity-90 w-auto object-contain" crossOrigin="anonymous" />
            </div>
            
            {customizer?.showQr && (
              <div className="flex gap-6 items-center flex-row-reverse text-right">
                <div className="size-16 bg-white p-1 rounded-xl shadow-2xl shrink-0 flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://hub.accessprotocol.co/creators/${displayData.poolAddress}`)}`}
                    alt="Stake Now"
                    className="w-full h-full object-contain"
                    crossOrigin="anonymous"
                  />
                </div>
                <div className="flex flex-col items-end justify-center mb-0.5">
                  <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest mb-1.5">Stake & Subscribe</p>
                  <p className="text-white/50 text-[10px] font-mono">
                    {isPlaceholder ? 'hub.accessprotocol.co/pool/galang' : `hub.accessprotocol.co/...${displayData.poolAddress.slice(-6)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-6 right-8 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 select-none">
          access protocol
        </div>
      </div>
    );
  }

  return (
    <main 
      ref={containerRef}
      className="w-full h-full bg-background-dark/80 overflow-hidden flex items-center justify-center p-2 md:p-12"
      style={{ 
        '--color-primary': customizer?.accentColor || '#8a2ce2',
        '--workspace-scale': scale
      }}
    >
      {/* Layout Wrapper - Takes up the EXACT scaled space in the flex layout */}
      <div 
        style={{ 
          width: `${1000 * scale}px`, 
          height: `${525 * scale}px`,
          position: 'relative',
          flexShrink: 0
        }}
        className="flex items-center justify-center"
      >
        {/* Scaling Container - The actual transform happens here */}
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
          <div className="relative w-[1000px] h-[525px] flex-shrink-0 social-card-preview rounded-none shadow-[0_30px_90px_-15px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden">
            
            {/* Background Layer */}
            {useImageBg ? (
              <div className="absolute inset-0">
                <img src={activeArt} alt="Background" className="w-full h-full object-cover" crossOrigin="anonymous" />
                <div className="absolute inset-0 bg-black/30"></div>
                {/* Horizontal gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
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

            {/* Glass Overlay Layer - Now correctly blurs the background */}
            {customizer?.glassEffect && (
              <div 
                className="absolute inset-0 z-0 bg-white/[0.03]"
                style={{ 
                  backdropFilter: `blur(${customizer.blurAmount}px)`,
                  WebkitBackdropFilter: `blur(${customizer.blurAmount}px)`
                }}
              ></div>
            )}
            
            {/* Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col p-10 justify-between">
          
                <div className="mb-4">
                  <p className="text-primary text-[14px] font-black uppercase tracking-[0.3em] mb-3">
                    Creator Profile
                  </p>
                  <h1 className="text-5xl font-black text-white tracking-[-0.02em] leading-none soft-text-shadow">{displayData.creatorName}</h1>
                </div>
                
                <div className="mb-6">
                  <p className="text-white/40 text-[14px] font-black uppercase tracking-[0.15em] mb-2">Total ACS Locked</p>
                  <h2 className="text-6xl font-black text-white tracking-[-0.02em] leading-none drop-shadow-2xl soft-text-shadow">
                    {displayData.totalLocked.toLocaleString()} <span className="text-primary text-6xl ml-2 tracking-normal">ACS</span>
                  </h2>
                </div>
                
                <div className="flex gap-20">
                  <div className="flex flex-col">
                    <p className="text-white/40 text-[13px] font-black uppercase tracking-widest mb-1.5">Stakers</p>
                    <p className="text-4xl font-black text-white leading-none tracking-tight soft-text-shadow">{displayData.stakers.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-white/40 text-[13px] font-black uppercase tracking-widest mb-1.5">Global Rank</p>
                    <p className="text-4xl font-black text-white leading-none tracking-tight soft-text-shadow">#{displayData.rank}</p>
                  </div>
                </div>
          
              {/* Footer Info - Compacted and mt-auto to sit at bottom */}
              <div className="flex justify-between items-end border-t border-white/10 pt-6 mt-auto">
                <div className="flex flex-col gap-1.5">
                  <p className="text-white/30 text-[8px] font-bold uppercase tracking-[0.4em]">Powered by</p>
                  <img src={accessLogo} alt="Access Protocol" className="h-4 opacity-90 w-auto object-contain" crossOrigin="anonymous" />
                </div>
                
                {customizer?.showQr && (
                  <div className="flex gap-6 items-center flex-row-reverse text-right">
                    <div className="size-16 bg-white p-1 rounded-xl shadow-2xl shrink-0 flex items-center justify-center overflow-hidden">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://hub.accessprotocol.co/creators/${displayData.poolAddress}`)}`}
                        alt="Stake Now"
                        className="w-full h-full object-contain"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="flex flex-col items-end justify-center mb-0.5">
                      <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest mb-1.5">Stake & Subscribe</p>
                      <p className="text-white/50 text-[10px] font-mono">
                        {isPlaceholder ? 'hub.accessprotocol.co/pool/galang' : `hub.accessprotocol.co/...${displayData.poolAddress.slice(-6)}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
        
        {/* Watermark/Indicator */}
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
