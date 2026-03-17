import React from 'react';
import Workspace from './Workspace';

const Sidebar = ({ 
  inputAddress, 
  setInputAddress, 
  handleRefresh, 
  isLoading, 
  error, 
  customizer, 
  handleCustomizerChange,
  isMobile,
  onExport,
  onPreview,
  loadingStatus,
  poolData,
  stakerData
}) => {
  return (
    <aside className={`${isMobile ? 'w-full' : 'w-96'} border-r border-slate-200 dark:border-primary/10 bg-white/50 dark:bg-background-dark/50 overflow-y-auto custom-scrollbar z-10 shrink-0`}>
      <div className="p-6 flex flex-col gap-8">
        
        {/* Mode Selector */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-base">style</span>
            <h3 className="text-xs font-bold uppercase tracking-widest">Mode Selector</h3>
          </div>
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-black/20 rounded-xl">
            <button 
              onClick={() => handleCustomizerChange('type', 'creator')}
              className={`flex-1 py-3 text-sm font-semibold tracking-wide rounded-lg transition-all ${
                customizer.type === 'creator' 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-white hover:bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-white/40 dark:hover:bg-white/10'
              }`}
            >
              Creator
            </button>
            <button
              onClick={() => handleCustomizerChange('type', 'staker')}
              className={`flex-1 py-3 text-sm font-semibold tracking-wide rounded-lg transition-all ${
                customizer.type === 'staker' 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-white hover:bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-white/40 dark:hover:bg-white/10'
              }`}
            >
              Staker
            </button>
          </div>
        </section>

        {/* Step 1: Data Source */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-base">hub</span>
            <h3 className="text-xs font-bold uppercase tracking-widest">1. Fetch From Network</h3>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-slate-700 dark:text-slate-400 font-bold ml-1">
              {customizer.type === 'creator' ? 'Solana Pool Address' : 'Subscriber Wallet Address'}
            </label>
            <div className="relative group">
              <input 
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-primary/20 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all pr-10 disabled:opacity-50 font-mono" 
                type="text" 
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                placeholder={customizer.type === 'creator' ? "Paste pool address..." : "Paste wallet address..."}
                disabled={isLoading}
              />
              {inputAddress && (
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                  onClick={() => setInputAddress('')}
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
            {error && <p className="text-red-500 text-[10px] ml-1 mt-1 font-medium">{error}</p>}
          </div>

          <button 
            onClick={handleRefresh}
            disabled={isLoading || !inputAddress}
            className="w-full bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 text-primary dark:text-white border border-primary/20 dark:border-primary/30 py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-1 group"
          >
            <div className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-sm ${isLoading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`}>
                {isLoading ? 'progress_activity' : 'sync'}
              </span>
              {isLoading ? 'Syncing...' : customizer.type === 'creator' ? 'Fetch Pool Stats' : 'Sync Wallet Data'}
            </div>
            {isLoading && loadingStatus && (
              <span className="text-[10px] text-primary/80 font-mono animate-pulse uppercase tracking-wider italic">
                {loadingStatus}
              </span>
            )}
          </button>
        </section>

        {/* Step 3: Global Styles */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-base">auto_fix_high</span>
            <h3 className="text-xs font-bold uppercase tracking-widest">3. Appearance</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-primary/40 dark:hover:border-primary/20 transition-colors">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wide">Glassmorphism</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  checked={customizer.glassEffect} 
                  onChange={(e) => handleCustomizerChange('glassEffect', e.target.checked)}
                  className="sr-only peer" 
                  type="checkbox"
                />
                <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {customizer.glassEffect && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] text-slate-600 font-bold uppercase">Blur Intensity</span>
                  <span className="text-[10px] text-primary font-mono">{customizer.blurAmount ?? 12}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="40" 
                  value={customizer.blurAmount ?? 12}
                  onChange={(e) => handleCustomizerChange('blurAmount', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-primary/40 dark:hover:border-primary/20 transition-colors">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wide">QR Info Card</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  checked={customizer.showQr} 
                  onChange={(e) => handleCustomizerChange('showQr', e.target.checked)}
                  className="sr-only peer" 
                  type="checkbox"
                />
                <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>


            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5">
              <span className="text-[10px] text-slate-600 font-bold uppercase block mb-3">Background Style</span>
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-black/20 rounded-lg">
                <button 
                  onClick={() => handleCustomizerChange('backgroundType', 'color')}
                  className={`flex-1 py-3 text-sm font-semibold tracking-wide rounded-lg transition-all ${
                    customizer.backgroundType === 'color' 
                  ? 'bg-primary text-white shadow-lg' 
                      : 'bg-white hover:bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-white/40 dark:hover:bg-white/10'
                  }`}
                >
                  Gradient
                </button>
                <button
                  onClick={() => handleCustomizerChange('backgroundType', 'image')}
                  className={`flex-1 py-3 text-sm font-semibold tracking-wide rounded-lg transition-all ${
                    customizer.backgroundType === 'image' 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-white hover:bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-white/40 dark:hover:bg-white/10'
                  }`}
                >
                  Art
                </button>
              </div>

              {customizer.backgroundType === 'image' && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5">
                  <span className="text-[10px] text-slate-600 font-bold uppercase block mb-3">Select Art</span>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleCustomizerChange('selectedBg', 'bg1')}
                      className={`size-10 rounded-full border-2 transition-all flex items-center justify-center text-xs font-semibold ${
                        customizer.selectedBg === 'bg1' 
                          ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20 shadow-[0_0_15px_rgba(101,145,255,0.3)]' 
                          : 'border-slate-400 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white/40 hover:border-slate-600 dark:hover:border-white/20'
                      }`}
                    >
                      1
                    </button>
                    <button 
                      onClick={() => handleCustomizerChange('selectedBg', 'bg2')}
                      className={`size-10 rounded-full border-2 transition-all flex items-center justify-center text-xs font-semibold ${
                        customizer.selectedBg === 'bg2' 
                          ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20 shadow-[0_0_15px_rgba(101,145,255,0.3)]' 
                          : 'border-slate-400 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white/40 hover:border-slate-600 dark:hover:border-white/20'
                      }`}
                    >
                      2
                    </button>
                    <button 
                      onClick={() => handleCustomizerChange('selectedBg', 'bg3')}
                      className={`size-10 rounded-full border-2 transition-all flex items-center justify-center text-xs font-semibold ${
                        customizer.selectedBg === 'bg3' 
                          ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20 shadow-[0_0_15px_rgba(101,145,255,0.3)]' 
                          : 'border-slate-400 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white/40 hover:border-slate-600 dark:hover:border-white/20'
                      }`}
                    >
                      3
                    </button>
                    <button 
                      onClick={() => handleCustomizerChange('selectedBg', 'bg4')}
                      className={`size-10 rounded-full border-2 transition-all flex items-center justify-center text-xs font-semibold ${
                        customizer.selectedBg === 'bg4' 
                          ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20 shadow-[0_0_15px_rgba(101,145,255,0.3)]' 
                          : 'border-slate-400 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white/40 hover:border-slate-600 dark:hover:border-white/20'
                      }`}
                    >
                      4
                    </button>
                  </div>
                </div>
              )}

              {customizer.backgroundType === 'color' && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-600 font-bold uppercase">Gradient Start</span>
                    <input 
                      type="color" 
                      value={customizer.gradientColor1 || '#1B1A1A'}
                      onChange={(e) => handleCustomizerChange('gradientColor1', e.target.value)}
                      className="size-6 bg-transparent cursor-pointer rounded overflow-hidden"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-600 font-bold uppercase">Gradient End</span>
                    <input 
                      type="color" 
                      value={customizer.gradientColor2 || '#1e2440'}
                      onChange={(e) => handleCustomizerChange('gradientColor2', e.target.value)}
                      className="size-6 bg-transparent cursor-pointer rounded overflow-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5">
              <span className="text-[10px] text-slate-600 font-bold uppercase block mb-3">Brand Colors</span>
              <div className="flex justify-between items-center">
                <div className="flex gap-2.5">
                  {['#8A2CE2', '#3B82F6', '#EC4899', '#F59E0B'].map(color => (
                    <button 
                      key={color}
                      onClick={() => handleCustomizerChange('accentColor', color)}
                      className={`size-6 rounded-full transition-all ${customizer.accentColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-background-dark scale-110' : 'opacity-60 hover:opacity-100'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-white/10"></div>
                <input 
                  type="color" 
                  value={customizer.accentColor}
                  onChange={(e) => handleCustomizerChange('accentColor', e.target.value)}
                  className="size-6 bg-transparent cursor-pointer rounded overflow-hidden"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5">
          {isMobile && (
            <div className="mb-8 -mx-2">
              <span className="text-[10px] text-slate-600 font-bold uppercase block mb-3 ml-2">Card Preview</span>
              <div className="rounded-2xl overflow-hidden border border-primary/20 bg-slate-100 dark:bg-black/20 p-1">
                <Workspace 
                  poolData={poolData}
                  stakerData={stakerData}
                  customizer={customizer}
                />
              </div>
            </div>
          )}
          <button 
            onClick={onExport}
            className="w-full bg-slate-800 text-white font-semibold py-4 rounded-xl text-sm tracking-wide hover:bg-slate-900 active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">download</span>
            Export Full Card
          </button>
          <p className="text-[10px] text-center text-slate-600 mt-4 uppercase font-bold tracking-widest">
            PNG High Quality • 1200x630
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
