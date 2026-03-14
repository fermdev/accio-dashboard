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
  const { handleExport } = useExport();
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
