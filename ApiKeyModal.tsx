import React, { useState, useEffect } from 'react';
import { useSupport } from '../context/SupportContext';
import type { LLMProvider } from '../types';
import { X, KeyRound, Sparkles, ShieldCheck, Cpu, CheckCircle2 } from 'lucide-react';

export const ApiKeyModal: React.FC = () => {
  const { isApiKeyModalOpen, setIsApiKeyModalOpen, llmConfig, setLlmConfig } = useSupport();

  const [provider, setProvider] = useState<LLMProvider>(llmConfig.provider);
  const [apiKey, setApiKey] = useState(llmConfig.apiKey);
  const [model, setModel] = useState(llmConfig.model);

  useEffect(() => {
    setProvider(llmConfig.provider);
    setApiKey(llmConfig.apiKey);
    setModel(llmConfig.model);
  }, [llmConfig, isApiKeyModalOpen]);

  if (!isApiKeyModalOpen) return null;

  const handleProviderChange = (next: LLMProvider) => {
    setProvider(next);
    if (next === 'gemini') {
      setModel('gemini-2.5-flash');
    } else if (next === 'openai') {
      setModel('gpt-4o-mini');
    } else {
      setModel('deterministic-v2');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLlmConfig({
      provider: provider !== 'simulated' && !apiKey.trim() ? 'simulated' : provider,
      apiKey: apiKey.trim(),
      model,
    });
    setIsApiKeyModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/90 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Dual-Mode Response Engine Config</h3>
              <p className="text-[11px] text-slate-400">
                100% Out-of-the-Box Simulated AI or Bring Your Own Gemini / OpenAI Key
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsApiKeyModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-4 space-y-4 text-xs">
          {/* Mode Selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleProviderChange('simulated')}
              className={`p-3 rounded-xl border text-left transition-all ${
                provider === 'simulated'
                  ? 'bg-cyan-950/60 border-cyan-500/70 text-cyan-200 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Cpu className="w-4 h-4 text-cyan-400" />
                {provider === 'simulated' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <div className="font-semibold text-slate-100">Built-In Engine</div>
              <div className="text-[10px] text-slate-400 mt-0.5">No API Key needed</div>
            </button>

            <button
              type="button"
              onClick={() => handleProviderChange('gemini')}
              className={`p-3 rounded-xl border text-left transition-all ${
                provider === 'gemini'
                  ? 'bg-cyan-950/60 border-cyan-500/70 text-cyan-200 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {provider === 'gemini' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <div className="font-semibold text-slate-100">Google Gemini</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Live API Generation</div>
            </button>

            <button
              type="button"
              onClick={() => handleProviderChange('openai')}
              className={`p-3 rounded-xl border text-left transition-all ${
                provider === 'openai'
                  ? 'bg-cyan-950/60 border-cyan-500/70 text-cyan-200 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                {provider === 'openai' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <div className="font-semibold text-slate-100">OpenAI</div>
              <div className="text-[10px] text-slate-400 mt-0.5">GPT-4o / Mini</div>
            </button>
          </div>

          {provider === 'simulated' ? (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 space-y-1.5 leading-relaxed">
              <div className="font-semibold text-cyan-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Deterministic Context-Aware Engine Active (Default)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Designed for LinkedIn visitors and recruiters: works 100% out-of-the-box without requiring any API keys. Performs real-time regex & keyword memory extraction, frustration-based tone adaptation, and playbook injection.
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI Secret API Key'}
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-proj-...'}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-xs focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Model Identifier</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="flex items-start space-x-2 text-[10.5px] text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Your API key stays strictly in your browser's local storage and is sent directly to {provider === 'gemini' ? 'Google Generative Language API' : 'OpenAI API'}. If an API call fails, OmniRecall automatically falls back to the built-in deterministic engine.
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsApiKeyModalOpen(false)}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-all shadow-md shadow-cyan-500/20"
            >
              Save Engine Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
