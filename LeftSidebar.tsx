import React from 'react';
import { useSupport } from '../context/SupportContext';
import { 
  UserPlus, 
  Sparkles, 
  AlertTriangle, 
  Server, 
  Layers, 
  Flame, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const LeftSidebar: React.FC = () => {
  const {
    personas,
    activePersonaId,
    setActivePersonaId,
    mode,
    setMode,
    setIsNewCustomerModalOpen,
  } = useSupport();

  const getFrustrationBadge = (level: number) => {
    if (level >= 70) {
      return {
        bg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
        label: 'Critical',
        icon: Flame,
      };
    }
    if (level >= 45) {
      return {
        bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
        label: 'Elevated',
        icon: AlertTriangle,
      };
    }
    return {
      bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
      label: 'Calm',
      icon: CheckCircle2,
    };
  };

  return (
    <aside className="w-full lg:w-80 border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0 h-full overflow-y-auto">
      {/* Mode Switch Card */}
      <div className="p-4 border-b border-slate-800">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Agent Intelligence Mode</span>
          <span className="text-[10px] text-cyan-400">Click to compare</span>
        </div>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('stateless')}
            className={`p-2.5 rounded-lg text-left transition-all relative ${
              mode === 'stateless'
                ? 'bg-rose-950/50 border border-rose-700/60 text-rose-200 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <AlertTriangle className={`w-3.5 h-3.5 ${mode === 'stateless' ? 'text-rose-400' : 'text-slate-500'}`} />
              <span className="text-xs font-semibold">Stateless Bot</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Zero memory. Re-asks OS, stack & scripts.
            </p>
          </button>

          <button
            onClick={() => setMode('memory-aware')}
            className={`p-2.5 rounded-lg text-left transition-all relative ${
              mode === 'memory-aware'
                ? 'bg-cyan-950/60 border border-cyan-500/60 text-cyan-200 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <Sparkles className={`w-3.5 h-3.5 ${mode === 'memory-aware' ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className="text-xs font-semibold">Memory-First</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Injects tickets, stack & past fixes instantly.
            </p>
          </button>
        </div>
      </div>

      {/* Customer Switcher Section */}
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Customer Personas
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {personas.length} Loaded
          </span>
        </div>

        {/* Customer List */}
        <div className="space-y-2.5">
          {personas.map((persona) => {
            const isSelected = persona.id === activePersonaId;
            const badge = getFrustrationBadge(persona.frustrationLevel);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={persona.id}
                onClick={() => setActivePersonaId(persona.id)}
                className={`group relative p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-950/20'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Initials Avatar */}
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-inner'
                          : 'bg-slate-800 text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {persona.initials}
                    </div>

                    <div>
                      <h3
                        className={`text-xs font-semibold leading-none ${
                          isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                        }`}
                      >
                        {persona.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
                        <span>{persona.role}</span>
                      </p>
                    </div>
                  </div>

                  {/* Frustration Badge */}
                  <div
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium border flex items-center space-x-1 ${badge.bg}`}
                    title={`Frustration score: ${persona.frustrationLevel}/100`}
                  >
                    <BadgeIcon className="w-2.5 h-2.5" />
                    <span>{persona.frustrationLevel}</span>
                  </div>
                </div>

                {/* Sub-info: Environment tags preview */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center space-x-1.5 truncate max-w-[180px]">
                    <Server className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{persona.environment.infra.split('(')[0]}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {persona.pastTickets.length} tickets
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Customer Button */}
        <button
          onClick={() => setIsNewCustomerModalOpen(true)}
          className="mt-3 w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-700/80 hover:border-cyan-500/60 bg-slate-900/30 hover:bg-slate-850 text-slate-400 hover:text-cyan-300 text-xs font-medium transition-all flex items-center justify-center space-x-2"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Custom Persona</span>
        </button>
      </div>

      {/* Portfolio Callout Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 m-3 rounded-xl border border-slate-800/80">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <div className="text-[11px] text-slate-400 leading-relaxed">
            <span className="text-slate-200 font-medium">Demonstration Value:</span> In enterprise tech support, 68% of churn stems from repeat explanations. OmniRecall embeds vector memory directly into the LLM system prompt.
          </div>
        </div>
      </div>
    </aside>
  );
};
