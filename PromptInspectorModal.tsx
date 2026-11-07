import React, { useState } from 'react';
import { useSupport } from '../context/SupportContext';
import { X, Copy, Check, Sparkles, AlertTriangle, Code2 } from 'lucide-react';

export const PromptInspectorModal: React.FC = () => {
  const { isPromptModalOpen, setIsPromptModalOpen, activePersona } = useSupport();
  const [copiedMode, setCopiedMode] = useState<string | null>(null);

  if (!isPromptModalOpen) return null;

  const statelessPrompt = `SYSTEM PROMPT (Cold Start Stateless Tier-1 Bot):
--------------------------------------------------
You are a general customer support assistant.
You have NO access to previous customer history, session data, or past tickets.
Always begin by asking the customer for:
- Their full name and account ID
- Operating system version and environment specs
- A complete step-by-step reproduction of their issue
Never assume solutions or mention past incidents. Advise basic troubleshooting (reboots, cache clearing).`;

  const memoryAwarePrompt = `SYSTEM PROMPT (OmniRecall Memory-Augmented Engine):
--------------------------------------------------
You are OmniRecall, an advanced Tier-3 Support Engineer Agent with persistent context.
The customer's memory graph has been retrieved and injected into your prompt below.
DO NOT ask for information already present in <customer_context>.
Tailor your response tone to <frustration_level> and jump directly into actionable fixes.

<customer_context>
  <profile>
    <name>${activePersona.name}</name>
    <role>${activePersona.role}</role>
    <company>${activePersona.company}</company>
    <communication_preference>${activePersona.personalityNotes}</communication_preference>
    <frustration_level score="${activePersona.frustrationLevel}/100" trend="${activePersona.frustrationTrend}" />
  </profile>

  <technical_environment>
    <os>${activePersona.environment.os}</os>
    <runtime>${activePersona.environment.runtime}</runtime>
    <infra>${activePersona.environment.infra}</infra>
    <tags>${activePersona.environment.additionalTags.join(', ')}</tags>
  </technical_environment>

  <historical_incidents count="${activePersona.pastTickets.length}">
${activePersona.pastTickets
  .map(
    (t) => `    <ticket id="${t.ticketNumber}" status="${t.status}">
      <title>${t.title}</title>
      <resolution>${t.resolution || 'Pending'}</resolution>
      <key_takeaway>${t.keyTakeaway}</key_takeaway>
    </ticket>`
  )
  .join('\n')}
  </historical_incidents>

  <proven_playbooks>
${activePersona.playbooks
  .map(
    (pb) => `    <playbook issue="${pb.issue}">
      <proven_fix>${pb.provenFix}</proven_fix>
      ${pb.cautionNote ? `<caution>${pb.cautionNote}</caution>` : ''}
    </playbook>`
  )
  .join('\n')}
  </proven_playbooks>
</customer_context>

GUIDELINES:
1. Immediately acknowledge known environment without asking user to repeat.
2. If the user's issue matches a past ticket or playbook, propose the verified fix with exact CLI snippets.
3. If frustration is >= 70, eliminate introductory pleasantries and provide direct copy-paste solutions.`;

  const handleCopy = (text: string, mode: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMode(mode);
    setTimeout(() => setCopiedMode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>RAG & Context Injection Inspector</span>
                <span className="px-2 py-0.2 rounded text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
                  Active: {activePersona.name}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Comparing prompt payloads sent to the LLM backend
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPromptModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 flex-1 overflow-y-auto">
          {/* Left: Stateless Bot */}
          <div className="flex flex-col rounded-xl border border-rose-900/40 bg-slate-950 p-3.5">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-rose-950/60">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-300">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Stateless Cold-Start Prompt</span>
              </div>
              <button
                onClick={() => handleCopy(statelessPrompt, 'stateless')}
                className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1"
              >
                {copiedMode === 'stateless' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed flex-1 overflow-y-auto">
              {statelessPrompt}
            </pre>
            <div className="mt-3 pt-2 border-t border-rose-950/40 text-[10.5px] text-rose-400">
              ❌ No customer context • Repetitive questions • Maximum customer churn
            </div>
          </div>

          {/* Right: Memory-Aware Agent */}
          <div className="flex flex-col rounded-xl border border-cyan-800/60 bg-slate-950 p-3.5">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-950/80">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Memory-Augmented RAG Prompt</span>
              </div>
              <button
                onClick={() => handleCopy(memoryAwarePrompt, 'memory')}
                className="text-[11px] px-2 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 flex items-center space-x-1"
              >
                {copiedMode === 'memory' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-cyan-100/90 whitespace-pre-wrap leading-relaxed flex-1 overflow-y-auto">
              {memoryAwarePrompt}
            </pre>
            <div className="mt-3 pt-2 border-t border-cyan-950/60 text-[10.5px] text-cyan-400">
              ✨ Dynamic XML injection • Zero-repetition fixes • Empathetic tone calibration
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <span>In a live system, memories are retrieved using cosine similarity over pgvector or Milvus.</span>
          <button
            onClick={() => setIsPromptModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
