import React from 'react';
import { useSupport } from '../context/SupportContext';
import { Sparkles, Cpu, Archive, Flame, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useSupport();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isEnv = toast.category === 'environment';
        const isPlaybook = toast.category === 'playbook';
        const isTicket = toast.category === 'ticket';

        const borderClass =
          isEnv || isPlaybook
            ? 'border-cyan-500/60 bg-slate-900/95 shadow-cyan-950/50'
            : isTicket
            ? 'border-emerald-500/60 bg-slate-900/95 shadow-emerald-950/50'
            : 'border-amber-500/50 bg-slate-900/95 shadow-amber-950/40';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3 rounded-xl border shadow-xl backdrop-blur-md flex items-start justify-between space-x-3 transition-all duration-300 animate-pulse ${borderClass}`}
          >
            <div className="flex items-start space-x-2.5">
              <div className="mt-0.5 shrink-0">
                {isEnv && <Cpu className="w-4 h-4 text-cyan-400" />}
                {isPlaybook && <Sparkles className="w-4 h-4 text-cyan-400" />}
                {isTicket && <Archive className="w-4 h-4 text-emerald-400" />}
                {toast.category === 'sentiment' && <Flame className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center space-x-2">
                  <span>{toast.title}</span>
                  <span className="text-[9.5px] font-mono text-slate-400 font-normal">
                    {toast.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.detail}</p>
              </div>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
