import React from 'react';
import { Sparkles, Mic2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-slate-900 border-b border-brand-600/30 p-6 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg shadow-[0_0_15px_rgba(77,210,208,0.3)]">
            <Mic2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Voz de <span className="text-brand-400">AdrIA</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">Powered by Código AdrIA</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-brand-400 bg-brand-900/30 px-3 py-1.5 rounded-full border border-brand-600/30">
          <Sparkles className="w-4 h-4" />
          <span className="font-medium">Texto a Voz IA</span>
        </div>
      </div>
    </header>
  );
};