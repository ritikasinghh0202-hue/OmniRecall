import React, { useState, useRef, useEffect } from 'react';
import { useSupport } from '../context/SupportContext';
import { 
  Send, 
  Sparkles, 
  AlertTriangle, 
  Trash2, 
  Copy, 
  Check, 
  Terminal, 
  Database,
  ArrowRight,
  Archive,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export const ChatPanel: React.FC = () => {
  const {
    activePersona,
    activeMessages,
    isTyping,
    sendMessage,
    clearChat,
    resolveAndArchiveChat,
    mode,
    toggleMode,
    setIsPromptModalOpen,
  } = useSupport();

  const [inputVal, setInputVal] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isTyping) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  const handleChipClick = (prompt: string) => {
    if (isTyping) return;
    sendMessage(prompt);
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderFormattedMessage = (content: string, msgId: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const lang = hasLang ? firstLine : 'CLI';
        const code = hasLang ? lines.slice(1).join('\n') : lines.join('\n');
        const codeBlockId = `${msgId}-code-${i}`;

        return (
          <div key={i} className="my-2.5 rounded-lg overflow-hidden border border-slate-700/80 bg-slate-950 font-mono text-xs">
            <div className="bg-slate-900/90 px-3 py-1.5 flex items-center justify-between border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span className="uppercase text-slate-300 font-semibold">{lang}</span>
              </span>
              <button
                onClick={() => handleCopyCode(code, codeBlockId)}
                className="hover:text-slate-200 transition-colors flex items-center space-x-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-800"
              >
                {copiedIndex === codeBlockId ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-slate-200 overflow-x-auto text-[11.5px] leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      const lines = part.split('\n');
      return (
        <span key={i}>
          {lines.map((line, lineIdx) => {
            const boldParts = line.split(/(\*\*.*?\*\*)/g);
            return (
              <span key={lineIdx} className="block min-h-[1.2em]">
                {boldParts.map((bp, bpIdx) => {
                  if (bp.startsWith('**') && bp.endsWith('**')) {
                    return (
                      <strong key={bpIdx} className="font-semibold text-slate-100">
                        {bp.slice(2, -2)}
                      </strong>
                    );
                  }
                  return bp;
                })}
              </span>
            );
          })}
        </span>
      );
    });
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-950 min-w-0 overflow-hidden relative">
      {/* Top Session Bar */}
      <div className="h-14 border-b border-slate-800/90 bg-slate-900/40 px-4 flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center space-x-3 truncate">
          <div className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200 shrink-0">
            {activePersona.initials}
          </div>
          <div className="truncate">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs text-slate-200">{activePersona.name}</span>
              <span className="text-slate-500 text-xs hidden sm:inline">•</span>
              <span className="text-slate-400 text-xs truncate hidden sm:inline">{activePersona.company}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">
              {activePersona.environment.os} • {activePersona.environment.runtime}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {/* Resolve & Archive to Memory Button */}
          <button
            onClick={resolveAndArchiveChat}
            disabled={activeMessages.length === 0 || isTyping}
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/50 text-emerald-300 transition-all flex items-center space-x-1.5 shadow-sm disabled:opacity-40"
            title="Summarize current conversation into a new Past Ticket card in the Right Panel"
          >
            <Archive className="w-3 h-3 text-emerald-400" />
            <span>Resolve & Archive to Memory</span>
          </button>

          {/* Mode Indicator Pill */}
          <button
            onClick={toggleMode}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border hidden sm:flex items-center space-x-1.5 transition-all ${
              mode === 'memory-aware'
                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/40'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300 hover:bg-rose-900/40'
            }`}
            title="Click to toggle between Memory-Aware and Stateless Bot"
          >
            {mode === 'memory-aware' ? (
              <>
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Memory Active</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>Stateless Bot</span>
              </>
            )}
          </button>

          <button
            onClick={() => clearChat(activePersona.id)}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
            title="Clear Chat History for this Persona"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Notice Banner */}
      <div
        className={`px-4 py-2 border-b text-[11px] flex items-center justify-between ${
          mode === 'memory-aware'
            ? 'bg-cyan-950/20 border-cyan-500/20 text-cyan-200/90'
            : 'bg-rose-950/20 border-rose-500/20 text-rose-200/90'
        }`}
      >
        <div className="flex items-center space-x-2 truncate mr-2">
          {mode === 'memory-aware' ? (
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          )}
          <span className="truncate">
            {mode === 'memory-aware' ? (
              <span>
                <strong>Memory-Aware + Write-Back Loop:</strong> Recalls {activePersona.pastTickets.length} tickets, adapts tone to Frustration ({activePersona.frustrationLevel}%), and auto-extracts new stack/fixes.
              </span>
            ) : (
              <span>
                <strong>Stateless Bot Mode:</strong> Asks {activePersona.name} for OS/version from scratch and suggests basic troubleshooting already tried (+20 Frustration).
              </span>
            )}
          </span>
        </div>

        <button
          onClick={() => setIsPromptModalOpen(true)}
          className="underline text-[10px] shrink-0 font-medium hover:text-white"
        >
          View System Prompt
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Database className="w-10 h-10 mb-3 text-slate-600" />
            <p className="text-sm font-medium text-slate-300">No active conversation</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Select one of the persona quick prompts below to see how {mode === 'memory-aware' ? 'memory retrieval & auto-extraction' : 'a stateless bot'} responds.
            </p>
          </div>
        ) : (
          activeMessages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div
                  key={msg.id}
                  className="flex items-center justify-center my-2"
                >
                  <div className="px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2 max-w-xl shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>{renderFormattedMessage(msg.content, msg.id)}</div>
                  </div>
                </div>
              );
            }

            const isCustomer = msg.sender === 'customer';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'} max-w-full`}
              >
                {/* Meta info header */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 mb-1 px-1">
                  <span className="font-semibold text-slate-400">
                    {isCustomer ? activePersona.name : msg.mode === 'memory-aware' ? 'OmniRecall Agent' : 'Stateless Bot'}
                  </span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                  {!isCustomer && msg.mode === 'memory-aware' && msg.retrievalLatencyMs && (
                    <>
                      <span>•</span>
                      <span className="text-cyan-400 font-mono font-medium">
                        Retrieved in {msg.retrievalLatencyMs}ms
                      </span>
                    </>
                  )}
                  {!isCustomer && msg.toneAdaptation && (
                    <>
                      <span>•</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1">
                        <Sliders className="w-2.5 h-2.5 text-cyan-400" />
                        <span>{msg.toneAdaptation}</span>
                      </span>
                    </>
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className={`rounded-xl px-4 py-3 text-xs leading-relaxed max-w-[90%] md:max-w-[85%] border shadow-sm ${
                    isCustomer
                      ? 'bg-slate-800/90 border-slate-700/80 text-slate-100 rounded-tr-none'
                      : msg.mode === 'memory-aware'
                      ? 'bg-slate-900/95 border-slate-800 text-slate-200 rounded-tl-none ring-1 ring-cyan-500/20'
                      : 'bg-slate-900/95 border-slate-800 text-slate-200 rounded-tl-none ring-1 ring-rose-500/20'
                  }`}
                >
                  {renderFormattedMessage(msg.content, msg.id)}

                  {/* Newly Extracted Memories Write-Back badge */}
                  {!isCustomer && msg.extractedMemories && msg.extractedMemories.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-800/40 flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Write-Back Saved:</span>
                      </span>
                      {msg.extractedMemories.map((mem, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-mono"
                        >
                          +{mem}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Memory nodes footer for agent messages */}
                  {!isCustomer && msg.mode === 'memory-aware' && msg.retrievedMemoryIds && msg.retrievedMemoryIds.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="text-slate-500 flex items-center space-x-1">
                        <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                        <span>Injected context:</span>
                      </span>
                      {msg.retrievedMemoryIds.map((nodeId, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 font-mono"
                        >
                          {nodeId}
                        </span>
                      ))}
                    </div>
                  )}

                  {!isCustomer && msg.mode === 'stateless' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-rose-400 font-mono">
                      <span className="flex items-center space-x-1.5">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>Zero customer memory injected (Session Amnesia)</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-950/70 border border-rose-700/50 text-rose-300">
                        Frustration +20 pts
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="text-[10px] text-slate-500 mb-1 px-1 flex items-center space-x-1.5">
              <span className="font-semibold text-cyan-400">
                {mode === 'memory-aware' ? 'OmniRecall Agent' : 'Stateless Bot'}
              </span>
              <span>•</span>
              <span className="font-mono text-cyan-300">
                {mode === 'memory-aware'
                  ? 'Matching vector playbooks & extracting live memory...'
                  : 'Running generic tier-1 script...'}
              </span>
            </div>
            <div className="rounded-xl px-4 py-3 bg-slate-900 border border-slate-800 rounded-tl-none flex items-center space-x-1.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>Quick Persona Prompts (Includes Live Memory Write-Back Test):</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {activePersona.quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(prompt)}
              disabled={isTyping}
              className="px-2.5 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-200 text-xs whitespace-nowrap transition-all flex items-center space-x-1.5 shrink-0 shadow-sm disabled:opacity-50"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-2 shrink-0"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Message as ${activePersona.name} (try: "We added Redis 7.2 today; setting timeout=5s fixed the drop")...`}
            disabled={isTyping}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={!inputVal.trim() || isTyping}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 font-semibold text-xs transition-all flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 disabled:shadow-none"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </main>
  );
};
