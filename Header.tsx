import React from 'react';
import { useSupport } from '../context/SupportContext';
import { 
  BrainCircuit, 
  RotateCcw, 
  Code2, 
  Sparkles, 
  AlertCircle,
  KeyRound,
  Cpu,
  Split
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    mode,
    toggleMode,
    resetDemoData,
    setIsPromptModalOpen,
    setIsCompareModalOpen,
    llmConfig,
    setIsApiKeyModalOpen,
  } = useSupport();

  const isLiveKeyActive = llmConfig.provider !== 'simulated' && Boolean(llmConfig.apiKey);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur px-3 sm:px-6 flex items-center justify-between z-30 shrink-0">
      {/* Brand & Concept */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/50 shrink-0">
          <BrainCircuit className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-slate-100 text-base lg:text-lg tracking-tight">OmniRecall</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              Memory-First Support
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Persistent Context, Sentiment Adaptation & Auto-Memory Extraction
          </p>
        </div>
      </div>

      {/* Middle: Mode Switch Pill */}
      <div className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
        <button
          onClick={toggleMode}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-2 ${
            mode === 'memory-aware'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Memory-Aware Agent</span>
        </button>
        <button
          onClick={toggleMode}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-2 ${
            mode === 'stateless'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Stateless Tier-1 Bot</span>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2">
        {/* 1-Click Split Comparison Demo Button */}
        <button
          onClick={() => setIsCompareModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 border border-cyan-400/40"
          title="Open side-by-side split comparison of Stateless Bot vs Memory-Aware Agent"
        >
          <Split className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">1-Click Split Demo</span>
          <span className="sm:hidden">Split</span>
        </button>

        <button
          onClick={() => setIsApiKeyModalOpen(true)}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center space-x-1.5 ${
            isLiveKeyActive
              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
              : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200'
          }`}
          title="Configure Dual-Mode Engine (Built-In Simulated AI or Bring Your Own Gemini/OpenAI Key)"
        >
          {isLiveKeyActive ? (
            <>
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">
                Live {llmConfig.provider === 'gemini' ? 'Gemini' : 'OpenAI'}
              </span>
            </>
          ) : (
            <>
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">BYO Key</span>
            </>
          )}
        </button>

        <button
          onClick={() => setIsPromptModalOpen(true)}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all hidden xl:flex items-center space-x-1.5"
          title="Inspect RAG Prompt & Context Injection"
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Prompt Inspector</span>
        </button>

        <button
          onClick={resetDemoData}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-amber-300 text-xs font-medium transition-all flex items-center space-x-1.5"
          title="Reset Personas and Chats to initial clean state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Reset</span>
        </button>
      </div>
    </header>
  );
};
