import React from 'react';

const GeneratorForm = () => {
  return (
    <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">edit_square</span>
            Card Details
          </h2>
          <p className="text-gray-400 text-sm">Enter your pool details to generate proof</p>
        </div>
        <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center">
          <span className="material-symbols-outlined text-gray-300">auto_awesome</span>
        </div>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300 ml-1">Creator Twitter Handle</label>
          <div className="relative group/input">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 group-focus-within/input:text-primary transition-colors">@</span>
            </div>
            <input 
              type="text" 
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder-gray-600" 
              placeholder="SnoopDogg"
              defaultValue="SnoopDogg" 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 z-10 relative">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 ml-1">Pool Position #</label>
            <div className="relative group/input">
              <input 
                type="number" 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder-gray-600" 
                placeholder="e.g. 1"
                defaultValue="1" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 ml-1">ACS Locked</label>
            <div className="relative group/input">
              <input 
                type="text" 
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-mono placeholder-gray-600" 
                placeholder="100,000"
                defaultValue="100,000" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 ml-1">Time Locked</label>
                <div className="relative group/input">
                    <input 
                        type="text" 
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder-gray-600" 
                        placeholder="e.g. 6 Months"
                        defaultValue="6 Months" 
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 ml-1">Theme</label>
                <div className="relative">
                    <select className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 appearance-none cursor-pointer">
                        <option value="purple">Neon Purple (Default)</option>
                        <option value="blue">Cyber Blue</option>
                        <option value="green">Matrix Green</option>
                        <option value="gold">Gold Elite</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400">expand_more</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-4">
          <button type="button" className="w-full bg-gradient-to-r from-primary to-[#6a1b9a] hover:from-[#7b1fa2] hover:to-[#4a148c] text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group">
            <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">generating_tokens</span>
            Generate Proof Card
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneratorForm;
