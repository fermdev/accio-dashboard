import React, { useState } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import Footer from './components/Footer';
import ComingSoon from './components/ComingSoon';
import { useAccessPool } from './hooks/useAccessPool';
import { useExport } from './hooks/useExport';
import './index.css';

function App() {
  const [inputAddress, setInputAddress] = useState('');
  const { fetchPoolData, poolData, isLoading, error } = useAccessPool();
  const { handleExport, isExporting, exportImage, setExportImage } = useExport();
  const [mobileTab, setMobileTab] = useState('edit'); // 'edit' | 'preview'
  const [currentView, setCurrentView] = useState('editor'); // 'editor' | 'dashboard' | 'templates' | 'analytics'
  
  const [customizer, setCustomizer] = useState({
    showQr: true,
    glassEffect: false,
    accentColor: '#6591FF',
    backgroundType: 'image',
    blurAmount: 12,
    gradientColor1: '#1B1A1A',
    gradientColor2: '#1e2440'
  });

  const handleRefresh = () => {
    if (inputAddress.trim()) {
      fetchPoolData(inputAddress.trim());
    }
  };

  const onExport = () => handleExport('social-card-export', `accio-${poolData?.creatorName || 'card'}.png`);

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
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center flex-col gap-6">
          <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-white font-bold tracking-widest uppercase text-sm animate-pulse">Generating Card...</p>
        </div>
      )}

      {/* Image Save Overlay (Mobile Fallback) */}
      {exportImage && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-6 max-w-lg w-full flex flex-col items-center gap-6 shadow-2xl relative">
            <button 
              onClick={() => setExportImage(null)}
              className="absolute -top-4 -right-4 size-10 bg-white text-black rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="w-full overflow-hidden rounded-xl shadow-2xl border border-white/5">
              <img src={exportImage} alt="Exported Card" className="w-full h-auto" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Image Ready!</h3>
              <p className="text-slate-400 text-sm font-medium p-2 bg-primary/10 rounded-lg border border-primary/20">
                <span className="md:hidden text-primary font-bold">Tekan lama gambar di atas</span> lalu pilih <span className="text-primary font-bold">"Simpan Gambar" (Save Image)</span> untuk mengunduh ke galeri HP Anda.
              </p>
              <p className="hidden md:block text-slate-400 text-sm font-medium">
                Your download should have started. If not, right-click and save the image above.
              </p>
            </div>
            <button 
              onClick={() => setExportImage(null)}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg transition-all cursor-pointer"
            >
              Tutup / Done
            </button>
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
        ) : (
          <ComingSoon title={currentView} />
        )}
      </div>

      <Footer />
    </Layout>
  );
}

export default App;
