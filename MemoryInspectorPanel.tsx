import React, { useState } from 'react';
import { useSupport } from '../context/SupportContext';
import { 
  Activity, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Terminal, 
  Flame, 
  Plus, 
  Minus, 
  Search, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCode2,
  Sparkles
} from 'lucide-react';

export const MemoryInspectorPanel: React.FC = () => {
  const {
    activePersona,
    updateFrustration,
    latestLog,
    setIsPromptModalOpen,
    highlightedNodeIds,
    newlyExtractedTags,
  } = useSupport();

  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'retrieval'>('all');

  const frustration = activePersona.frustrationLevel;
  const getFrustrationColor = (val: number) => {
    if (val > 65) return { bar: 'bg-rose-500', text: 'text-rose-400', label: 'Direct CLI Mode (>65%)' };
    if (val >= 40) return { bar: 'bg-amber-500', text: 'text-amber-400', label: 'Elevated Frustration' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-400', label: 'Calm & Methodical' };
  };

  const frustrationState = getFrustrationColor(frustration);

  const toggleTicket = (id: string) => {
    setExpandedTicketId((prev) => (prev === id ? null : id));
  };

  const isEnvHighlighted = highlightedNodeIds.includes(`env-${activePersona.id}`);
  const isSentimentHighlighted = highlightedNodeIds.includes(`sentiment-${activePersona.id}`);

  return (
    <aside className="w-full lg:w-96 border-l border-slate-800 bg-slate-900/60 flex flex-col shrink-0 h-full overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90 sticky top-0 z-10 backdrop-blur">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Live Memory Graph & Context
          </h2>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Inspector
          </button>
          <button
            onClick={() => setActiveTab('retrieval')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
              activeTab === 'retrieval'
                ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Retrieval Log
          </button>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* b) Real-Time Frustration Meter */}
        <section
          className={`bg-slate-950/70 border rounded-xl p-3.5 shadow-sm transition-all duration-500 ${
            isSentimentHighlighted
              ? 'border-cyan-400 ring-2 ring-cyan-400/40 bg-cyan-950/20 animate-pulse'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <Flame className={`w-3.5 h-3.5 ${frustrationState.text}`} />
              <span className="text-xs font-semibold text-slate-300">Real-Time Frustration Meter</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <span className={`text-xs font-bold font-mono ${frustrationState.text}`}>
                {frustration}/100
              </span>
              <span className="text-[10px] text-slate-500">({frustrationState.label})</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${frustrationState.bar}`}
              style={{ width: `${frustration}%` }}
            />
          </div>

          {/* Micro Adjustment Controls */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span className="text-[10px] text-slate-500">
              {frustration > 65
                ? '⚡ >65%: Agent skips pleasantries & outputs CLI'
                : '✓ ≤65%: Agent uses consultative step-by-step tone'}
            </span>
            <div className="flex items-center space-x-1 shrink-0 ml-2">
              <button
                onClick={() => updateFrustration(activePersona.id, -10)}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-medium flex items-center space-x-0.5"
                title="Decrease frustration (-10)"
              >
                <Minus className="w-2.5 h-2.5" />
                <span>10</span>
              </button>
              <button
                onClick={() => updateFrustration(activePersona.id, +10)}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 text-[10px] font-medium flex items-center space-x-0.5"
                title="Increase frustration (+10)"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>10</span>
              </button>
            </div>
          </div>
        </section>

        {activeTab === 'all' && (
          <>
            {/* a) Known Environment & Tech Stack */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Known Environment & Stack</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {isEnvHighlighted ? '⚡ Matched & Injected' : 'Auto-Injected'}
                </span>
              </div>

              <div
                className={`bg-slate-950/60 border rounded-xl p-3 space-y-2.5 text-xs transition-all duration-500 ${
                  isEnvHighlighted
                    ? 'border-cyan-400 ring-2 ring-cyan-400/40 bg-cyan-950/20 animate-pulse'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Operating System:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-200 font-mono text-[11px] font-medium">
                    {activePersona.environment.os}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Runtime / Engine:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-200 font-mono text-[11px] font-medium">
                    {activePersona.environment.runtime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Infrastructure:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 font-mono text-[11px] font-medium">
                    {activePersona.environment.infra}
                  </span>
                </div>

                {/* Additional Tag Badges */}
                <div className="pt-2 border-t border-slate-800/70">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Component Stack Tags</span>
                    {newlyExtractedTags.length > 0 && (
                      <span className="text-emerald-400 font-semibold animate-pulse">
                        +New Memory Saved
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activePersona.environment.additionalTags.map((tag, i) => {
                      const isJustAdded = newlyExtractedTags.includes(tag);
                      return (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all ${
                            isJustAdded
                              ? 'bg-emerald-950 border border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40 animate-pulse font-semibold'
                              : 'bg-slate-900 border border-slate-700/80 text-slate-300'
                          }`}
                        >
                          {isJustAdded ? `✨ ${tag}` : tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* c) Past Tickets & "What Worked Before" Playbooks */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Past Tickets ({activePersona.pastTickets.length})</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">Click to inspect</span>
              </div>

              <div className="space-y-2">
                {activePersona.pastTickets.map((ticket) => {
                  const isExpanded = expandedTicketId === ticket.id;
                  const isResolved = ticket.status === 'resolved';
                  const isTicketHighlighted = highlightedNodeIds.includes(
                    `ticket-${ticket.ticketNumber}`
                  );

                  return (
                    <div
                      key={ticket.id}
                      className={`bg-slate-950/70 border rounded-xl overflow-hidden text-xs transition-all duration-500 ${
                        isTicketHighlighted
                          ? 'border-cyan-400 ring-2 ring-cyan-400/50 bg-cyan-950/30 animate-pulse'
                          : ticket.isNewlyArchived
                          ? 'border-emerald-500/60 bg-emerald-950/15'
                          : 'border-slate-800'
                      }`}
                    >
                      <button
                        onClick={() => toggleTicket(ticket.id)}
                        className="w-full p-2.5 text-left flex items-start justify-between hover:bg-slate-900/60 transition-colors"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[11px] text-cyan-400 font-semibold">
                              #{ticket.ticketNumber}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9.5px] uppercase font-bold ${
                                isResolved
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {ticket.status}
                            </span>
                            {isTicketHighlighted && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500 text-slate-950 font-bold">
                                MATCHED
                              </span>
                            )}
                            {ticket.isNewlyArchived && !isTicketHighlighted && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                ARCHIVED
                              </span>
                            )}
                          </div>
                          <h4 className="text-slate-200 font-medium text-[11px] mt-1 line-clamp-1">
                            {ticket.title}
                          </h4>
                          <span className="text-[10px] text-slate-500">
                            {ticket.date} • {ticket.category}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-3 bg-slate-900/50 border-t border-slate-800 text-[11px] space-y-2">
                          <div>
                            <span className="text-slate-400 font-semibold">Incident Synopsis:</span>
                            <p className="text-slate-300 mt-0.5 leading-relaxed">{ticket.summary}</p>
                          </div>
                          {ticket.resolution && (
                            <div className="p-2 rounded bg-slate-950/80 border border-emerald-500/20 text-emerald-300">
                              <span className="font-semibold block text-[10px] uppercase text-emerald-400 mb-0.5">
                                Verified Resolution:
                              </span>
                              {ticket.resolution}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-400 italic">
                            💡 Takeaway: {ticket.keyTakeaway}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* "What Worked Before" Playbooks */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>"What Worked Before" Playbooks</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Zero-Repeat</span>
              </div>

              <div className="space-y-2">
                {activePersona.playbooks.map((playbook, idx) => {
                  const isPbHighlighted =
                    highlightedNodeIds.includes(`playbook-${activePersona.id}-${idx}`) ||
                    (idx === 0 && highlightedNodeIds.some((id) => id.startsWith('playbook-')));

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl bg-slate-950/80 border text-xs space-y-1.5 transition-all duration-500 ${
                        isPbHighlighted
                          ? 'border-cyan-400 ring-2 ring-cyan-400/50 bg-cyan-950/30 animate-pulse'
                          : playbook.isNew
                          ? 'border-emerald-500/60 bg-emerald-950/15'
                          : 'border-slate-800'
                      }`}
                    >
                      <div className="font-semibold text-slate-200 text-[11px] flex items-center justify-between">
                        <span className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{playbook.issue}</span>
                        </span>
                        {playbook.isNew && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center space-x-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>NEW</span>
                          </span>
                        )}
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[10.5px] text-cyan-300 overflow-x-auto">
                        <code>{playbook.provenFix}</code>
                      </div>
                      {playbook.cautionNote && (
                        <div className="text-[10px] text-amber-400/90 flex items-start space-x-1">
                          <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                          <span>{playbook.cautionNote}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* d) Live Memory Retrieval Log (Always visible at bottom of Full Inspector + dedicated tab) */}
        <section className="space-y-2.5 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Memory Retrieval Log</span>
            </span>
            <button
              onClick={() => setIsPromptModalOpen(true)}
              className="text-[10px] text-cyan-400 hover:underline flex items-center space-x-0.5"
            >
              <span>Inspect Prompt</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>

          {latestLog ? (
            <div className="space-y-2">
              <div
                className={`p-2.5 rounded-lg border text-[11px] transition-all ${
                  highlightedNodeIds.length > 0
                    ? 'bg-cyan-950/40 border-cyan-500/60 ring-1 ring-cyan-400/50'
                    : 'bg-slate-950/90 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Query Vector Match:</span>
                  <span className="font-mono text-cyan-400">{latestLog.timestamp}</span>
                </div>
                <div className="text-slate-200 font-mono text-[11px] mt-0.5 line-clamp-2">
                  "{latestLog.query}"
                </div>
              </div>

              <div className="space-y-2">
                {latestLog.nodes.map((node) => {
                  const isNodePulsing =
                    highlightedNodeIds.includes(node.id) || highlightedNodeIds.length > 0;

                  return (
                    <div
                      key={node.id}
                      className={`p-2.5 rounded-lg border text-xs space-y-1 transition-all duration-500 ${
                        isNodePulsing
                          ? 'bg-cyan-950/35 border-cyan-400 ring-2 ring-cyan-400/40 animate-pulse'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="px-1.5 py-0.2 rounded font-mono font-semibold bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 uppercase">
                          {node.type}
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">
                          cosine: {(node.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="font-semibold text-slate-200 text-[11px]">{node.title}</div>
                      <p className="text-slate-400 text-[10.5px] leading-relaxed">{node.snippet}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-slate-500 text-xs">
              No retrieval logs yet. Send a message to see live vector matching.
            </div>
          )}
        </section>
      </div>

      {/* Footer Info Pill */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 text-center shrink-0">
        <button
          onClick={() => setIsPromptModalOpen(true)}
          className="w-full py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center space-x-1.5"
        >
          <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Compare Raw System Prompt</span>
        </button>
      </div>
    </aside>
  );
};
