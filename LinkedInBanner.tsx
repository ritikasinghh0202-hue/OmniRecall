import React, { useState } from 'react';
import { useSupport } from '../context/SupportContext';
import { 
  Sparkles, 
  Split, 
  X, 
  ArrowRight
} from 'lucide-react';

export const LinkedInBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('omni_recall_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const { setIsCompareModalOpen } = useSupport();

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('omni_recall_banner_dismissed', 'true');
    } catch {}
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-b border-cyan-500/30 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-300 relative z-20">
      <div className="flex items-center space-x-2.5 min-w-0">
        <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div className="truncate">
          <span className="font-bold text-white">Interactive Demo:</span>{' '}
          <span className="text-slate-200">Operations & Support Memory Agent</span>
          <span className="hidden md:inline text-slate-400">
            {' '}— Switch between Stateless and Memory-Aware modes, or inspect the live Memory Graph on the right.
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={() => setIsCompareModalOpen(true)}
          className="px-2.5 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 font-semibold text-[11px] transition-all flex items-center space-x-1 shadow-sm"
        >
          <Split className="w-3 h-3 text-cyan-400" />
          <span>Launch Split Comparison</span>
          <ArrowRight className="w-2.5 h-2.5 opacity-70" />
        </button>

        <button
          onClick={handleDismiss}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Dismiss top banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
