// Final Production Sync: 2026-03-15T01:13:00
import React, { useState } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import Footer from './components/Footer';
import ComingSoon from './components/ComingSoon';
import JupiterSwap from './components/JupiterSwap';
import { useAccessPool } from './hooks/useAccessPool';
import { useExport } from './hooks/useExport';
import './index.css';

function App() {
  const [inputAddress, setInputAddress] = useState('');
  const { fetchPoolData, poolData, isLoading, error } = useAccessPool();
  const { 
    handleExport, 
    isExporting, 
    exportImage, 
    setExportImage,
    exportBlob,
    exportError,
    setExportError 
  } = useExport();
  const [mobileTab, setMobileTab] = useState('edit'); // 'edit' | 'preview'
  const [currentView, setCurrentView] = useState('editor'); // 'editor' | 'dashboard' | 'templates' | 'analytics'
  
  const [customizer, setCustomizer] = useState({
    showQr: true,
    glassEffect: false,
    accentColor: '#6591FF',
    backgroundType: 'image',
    selectedBg: 'bg1', // 'bg1' | 'bg2'
    blurAmount: 12,
    gradientColor1: '#1B1A1A',
    gradientColor2: '#1e2440'
  });

  const onExport = () => handleExport('social-card-export', `accio-${poolData?.creatorName || 'card'}.jpg`);

  const handleRefresh = () => {
    if (inputAddress.trim()) {
      fetchPoolData(inputAddress.trim());
    }
  };

  const handleCustomizerChange = (key, value) => {
    setCustomizer(prev => ({ ...prev, [key]: value }));
  };

  const effectiveData = poolData;

  return (
    <Layout>
      <Header 
        onExport={onExport} 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Exporting Loader Overlay */}
      {isExporting && (
        <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-center justify-center flex-col gap-6">
          <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="text-center">
            <p className="text-white font-black tracking-widest uppercase text-lg animate-pulse mb-1">Preparing Your Card...</p>
            <p className="text-white/40 text-xs font-medium italic">High quality export takes a moment...</p>
          </div>
        </div>
      )}

      {/* Export Error Overlay */}
      {exportError && (
        <div className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-red-500/30 rounded-[2rem] p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-red-500 text-4xl">warning</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Export Issue</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{exportError}</p>
            </div>
            <button 
              onClick={() => setExportError(null)}
              className="w-full py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Image Save Overlay (Mobile Fallback) */}
      {exportImage && (
        <div className="fixed inset-0 z-[550] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-6 max-w-lg w-full flex flex-col items-center gap-6 shadow-2xl relative">
            <button 
              onClick={() => {
                URL.revokeObjectURL(exportImage);
                setExportImage(null);
              }}
              className="absolute -top-4 -right-4 size-10 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="w-full overflow-hidden rounded-xl shadow-2xl border border-white/5 bg-slate-800">
              <img src={exportImage} alt="Exported Card" className="w-full h-auto" />
            </div>
            <div className="text-center w-full space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Card Ready!</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Your image has been downloaded.
                </p>
              </div>
              
              <button 
                onClick={() => {
                  URL.revokeObjectURL(exportImage);
                  setExportImage(null);
                }}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {currentView === 'editor' ? (
          <>
            <Sidebar 
              inputAddress={inputAddress}
              setInputAddress={setInputAddress}
              handleRefresh={handleRefresh}
              isLoading={isLoading}
              error={error}
              customizer={customizer}
              handleCustomizerChange={handleCustomizerChange}
              onExport={onExport}
            />
            <Workspace 
              poolData={effectiveData}
              customizer={customizer}
            />
          </>
        ) : currentView === 'market' ? (
          <JupiterSwap key="jupiter-market-desktop" />
        ) : (
          <ComingSoon title={currentView} />
        )}
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden flex-1 overflow-hidden flex-col">
        {currentView === 'editor' ? (
          <>
            {mobileTab === 'edit' ? (
              <div className="flex-1 overflow-y-auto">
                <Sidebar 
                  inputAddress={inputAddress}
                  setInputAddress={setInputAddress}
                  handleRefresh={handleRefresh}
                  isLoading={isLoading}
                  error={error}
                  customizer={customizer}
                  handleCustomizerChange={handleCustomizerChange}
                  isMobile
                />
              </div>
            ) : (
              <div className="flex-1 flex overflow-hidden">
                <Workspace 
                  poolData={effectiveData}
                  customizer={customizer}
                />
              </div>
            )}

            {/* Mobile Tab Bar */}
            <div className="flex border-t border-primary/20 bg-background-dark shrink-0">
              <button
                onClick={() => setMobileTab('edit')}
                className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  mobileTab === 'edit' ? 'text-primary border-t-2 border-primary -mt-px' : 'text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-lg">tune</span>
                Edit
              </button>
              <button
                onClick={() => setMobileTab('preview')}
                className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  mobileTab === 'preview' ? 'text-primary border-t-2 border-primary -mt-px' : 'text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-lg">credit_card</span>
                Preview
              </button>
            </div>
          </>
        ) : currentView === 'market' ? (
          <>
            <JupiterSwap key="jupiter-market-mobile" />
            <div className="flex border-t border-primary/20 bg-background-dark shrink-0">
              <button
                onClick={() => setCurrentView('editor')}
                className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest transition-colors"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to Editor
              </button>
            </div>
          </>
        ) : (
          <ComingSoon title={currentView} />
        )}
      </div>

      <Footer />

      {/* Hidden Export Target - Robust semi-visibility fix */}
      <div 
        className="fixed z-[-1000] pointer-events-none select-none opacity-[0.01]" 
        style={{ 
          top: 0,
          left: 0,
          width: '1000px',
          height: '525px',
          overflow: 'hidden'
        }}
        aria-hidden="true"
      >
        <Workspace 
          poolData={effectiveData}
          customizer={customizer}
          isExportOnly={true}
          exportId="social-card-export"
        />
      </div>
    </Layout>
  );
}

export default App;
