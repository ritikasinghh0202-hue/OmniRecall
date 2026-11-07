import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  CustomerPersona,
  SupportMode,
  ChatMessage,
  RetrievalLogEntry,
  LLMConfig,
  MemoryToast,
} from '../types';
import { INITIAL_PERSONAS, INITIAL_CHAT_MESSAGES, INITIAL_RETRIEVAL_LOGS } from '../data/defaultPersonas';
import { generateSupportResponseAsync, summarizeConversationToTicket } from '../utils/aiSimulator';

interface SupportContextType {
  personas: CustomerPersona[];
  activePersona: CustomerPersona;
  activePersonaId: string;
  setActivePersonaId: (id: string) => void;
  mode: SupportMode;
  setMode: (mode: SupportMode) => void;
  toggleMode: () => void;
  activeMessages: ChatMessage[];
  retrievalLogs: RetrievalLogEntry[];
  latestLog?: RetrievalLogEntry;
  isTyping: boolean;
  sendMessage: (content: string) => void;
  resetDemoData: () => void;
  updateFrustration: (personaId: string, delta: number) => void;
  addPersona: (persona: CustomerPersona) => void;
  clearChat: (personaId: string) => void;
  resolveAndArchiveChat: () => void;
  highlightedNodeIds: string[];
  newlyExtractedTags: string[];
  toasts: MemoryToast[];
  dismissToast: (id: string) => void;
  llmConfig: LLMConfig;
  setLlmConfig: (config: LLMConfig) => void;
  isApiKeyModalOpen: boolean;
  setIsApiKeyModalOpen: (open: boolean) => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  isNewCustomerModalOpen: boolean;
  setIsNewCustomerModalOpen: (open: boolean) => void;
  isPromptModalOpen: boolean;
  setIsPromptModalOpen: (open: boolean) => void;
}

const STORAGE_KEYS = {
  PERSONAS: 'omni_recall_personas_v3',
  ACTIVE_ID: 'omni_recall_active_id_v3',
  MODE: 'omni_recall_mode_v3',
  CHATS: 'omni_recall_chats_v3',
  LOGS: 'omni_recall_logs_v3',
  LLM_CONFIG: 'omni_recall_llm_config_v3',
};

const DEFAULT_LLM_CONFIG: LLMConfig = {
  provider: 'simulated',
  apiKey: '',
  model: 'gemini-2.5-flash',
};

const SupportContext = createContext<SupportContextType | undefined>(undefined);

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personas, setPersonas] = useState<CustomerPersona[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PERSONAS);
      return saved ? JSON.parse(saved) : INITIAL_PERSONAS;
    } catch {
      return INITIAL_PERSONAS;
    }
  });

  const [activePersonaId, setActivePersonaId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
      return saved || 'alex-rivera';
    } catch {
      return 'alex-rivera';
    }
  });

  const [mode, setMode] = useState<SupportMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODE);
      return saved === 'stateless' || saved === 'memory-aware' ? saved : 'memory-aware';
    } catch {
      return 'memory-aware';
    }
  });

  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  const [retrievalLogs, setRetrievalLogs] = useState<RetrievalLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_RETRIEVAL_LOGS;
    } catch {
      return INITIAL_RETRIEVAL_LOGS;
    }
  });

  const [llmConfig, setLlmConfig] = useState<LLMConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LLM_CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_LLM_CONFIG;
    } catch {
      return DEFAULT_LLM_CONFIG;
    }
  });

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [newlyExtractedTags, setNewlyExtractedTags] = useState<string[]>([]);
  const [toasts, setToasts] = useState<MemoryToast[]>([]);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState<boolean>(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERSONAS, JSON.stringify(personas));
  }, [personas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, activePersonaId);
  }, [activePersonaId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODE, mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(retrievalLogs));
  }, [retrievalLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LLM_CONFIG, JSON.stringify(llmConfig));
  }, [llmConfig]);

  const activePersona = personas.find((p) => p.id === activePersonaId) || personas[0];
  const activeMessages = chats[activePersonaId] || [];
  const latestLog = retrievalLogs.find((l) => l.personaId === activePersonaId) || retrievalLogs[0];

  const pushToasts = (newToasts: MemoryToast[]) => {
    if (newToasts.length === 0) return;
    setToasts((prev) => [...newToasts, ...prev].slice(0, 5));
    setTimeout(() => {
      const idsToRemove = new Set(newToasts.map((t) => t.id));
      setToasts((prev) => prev.filter((t) => !idsToRemove.has(t.id)));
    }, 5500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'memory-aware' ? 'stateless' : 'memory-aware'));
  };

  const updateFrustration = (personaId: string, delta: number) => {
    setPersonas((prev) =>
      prev.map((p) => {
        if (p.id === personaId) {
          const newLevel = Math.max(0, Math.min(100, p.frustrationLevel + delta));
          return {
            ...p,
            frustrationLevel: newLevel,
            frustrationTrend: delta > 0 ? 'increasing' : delta < 0 ? 'decreasing' : p.frustrationTrend,
          };
        }
        return p;
      })
    );
  };

  const sendMessage = (content: string) => {
    if (!content.trim() || isTyping) return;

    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      personaId: activePersonaId,
      content: content.trim(),
      timestamp: timeShort,
      mode: mode,
    };

    setChats((prev) => ({
      ...prev,
      [activePersonaId]: [...(prev[activePersonaId] || []), userMsg],
    }));

    setIsTyping(true);

    const delay = mode === 'stateless' ? 550 : 800;
    setTimeout(async () => {
      const { message: agentMsg, logEntry, highlightedNodeIds: matchedIds, mutation } =
        await generateSupportResponseAsync(content, activePersona, mode, llmConfig);

      // Apply Live Memory Mutations (Environment tags, Playbooks, Frustration shift)
      setPersonas((prev) =>
        prev.map((p) => {
          if (p.id !== activePersonaId) return p;

          const updatedTags =
            mutation.newEnvTags.length > 0
              ? [...p.environment.additionalTags, ...mutation.newEnvTags]
              : p.environment.additionalTags;

          const updatedPlaybooks =
            mutation.newPlaybooks.length > 0
              ? [...mutation.newPlaybooks, ...p.playbooks]
              : p.playbooks;

          const newFrustration = Math.max(
            0,
            Math.min(100, p.frustrationLevel + mutation.frustrationDelta)
          );

          return {
            ...p,
            frustrationLevel: newFrustration,
            frustrationTrend:
              mutation.frustrationDelta > 0
                ? 'increasing'
                : mutation.frustrationDelta < 0
                ? 'decreasing'
                : p.frustrationTrend,
            environment: {
              ...p.environment,
              additionalTags: updatedTags,
            },
            playbooks: updatedPlaybooks,
          };
        })
      );

      // Trigger toast notifications for new memories + sentiment shifts
      const timeStr = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const sentimentToast: MemoryToast =
        mode === 'stateless'
          ? {
              id: `toast-sent-${Date.now()}`,
              title: 'Frustration Spiked (+20 pts)',
              detail: `Stateless Bot asked ${activePersona.name} to repeat known OS/version specs`,
              category: 'sentiment',
              timestamp: timeStr,
            }
          : {
              id: `toast-sent-${Date.now()}`,
              title: 'Sentiment Improved (-12 pts)',
              detail: `Memory-Aware resolution reduced ${activePersona.name}'s frustration`,
              category: 'sentiment',
              timestamp: timeStr,
            };

      pushToasts([...mutation.toasts, sentimentToast]);

      if (mutation.newEnvTags.length > 0) {
        setNewlyExtractedTags(mutation.newEnvTags);
        setTimeout(() => setNewlyExtractedTags([]), 6000);
      }

      if (matchedIds.length > 0) {
        setHighlightedNodeIds(matchedIds);
        setTimeout(() => setHighlightedNodeIds([]), 5000);
      }

      setChats((prev) => ({
        ...prev,
        [activePersonaId]: [...(prev[activePersonaId] || []), agentMsg],
      }));

      if (logEntry) {
        setRetrievalLogs((prev) => [logEntry, ...prev.slice(0, 19)]);
      }

      setIsTyping(false);
    }, delay);
  };

  const resolveAndArchiveChat = () => {
    const { ticket } = summarizeConversationToTicket(activePersona, activeMessages);
    const timeShort = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Prepend new ticket to active persona & reduce frustration by 15 points
    setPersonas((prev) =>
      prev.map((p) => {
        if (p.id !== activePersonaId) return p;
        return {
          ...p,
          frustrationLevel: Math.max(5, p.frustrationLevel - 15),
          frustrationTrend: 'decreasing',
          pastTickets: [ticket, ...p.pastTickets],
        };
      })
    );

    // Add a system confirmation message in chat
    const sysMsg: ChatMessage = {
      id: `msg-sys-${Date.now()}`,
      sender: 'system',
      personaId: activePersonaId,
      content: `✅ **Session Resolved & Archived to Long-Term Memory** as **#${ticket.ticketNumber}** (*"${ticket.title}"*). Future sessions for ${activePersona.name} will automatically retrieve this resolution.`,
      timestamp: timeShort,
      mode: 'memory-aware',
    };

    setChats((prev) => ({
      ...prev,
      [activePersonaId]: [...(prev[activePersonaId] || []), sysMsg],
    }));

    // Highlight the newly archived ticket node in the right panel
    const newTicketNodeId = `ticket-${ticket.ticketNumber}`;
    setHighlightedNodeIds([newTicketNodeId]);
    setTimeout(() => setHighlightedNodeIds([]), 5500);

    pushToasts([
      {
        id: `toast-arch-${Date.now()}`,
        title: `Archived to Memory • #${ticket.ticketNumber}`,
        detail: `Conversation summarized & saved to ${activePersona.name}'s Past Tickets`,
        category: 'ticket',
        timestamp: timeStr,
      },
    ]);
  };

  const clearChat = (personaId: string) => {
    setChats((prev) => ({
      ...prev,
      [personaId]: [],
    }));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PERSONAS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
    localStorage.removeItem(STORAGE_KEYS.MODE);
    localStorage.removeItem(STORAGE_KEYS.CHATS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);

    setPersonas(INITIAL_PERSONAS);
    setActivePersonaId('alex-rivera');
    setMode('memory-aware');
    setChats(INITIAL_CHAT_MESSAGES);
    setRetrievalLogs(INITIAL_RETRIEVAL_LOGS);
    setHighlightedNodeIds([]);
    setNewlyExtractedTags([]);
    setIsTyping(false);

    pushToasts([
      {
        id: `toast-reset-${Date.now()}`,
        title: 'Demo Data Reset',
        detail: 'Restored all 3 customer personas, tickets, and memory graphs to initial state.',
        category: 'environment',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    ]);
  };

  const addPersona = (newPersona: CustomerPersona) => {
    setPersonas((prev) => [newPersona, ...prev]);
    setActivePersonaId(newPersona.id);
  };

  return (
    <SupportContext.Provider
      value={{
        personas,
        activePersona,
        activePersonaId,
        setActivePersonaId,
        mode,
        setMode,
        toggleMode,
        activeMessages,
        retrievalLogs,
        latestLog,
        isTyping,
        sendMessage,
        resetDemoData,
        updateFrustration,
        addPersona,
        clearChat,
        resolveAndArchiveChat,
        highlightedNodeIds,
        newlyExtractedTags,
        toasts,
        dismissToast,
        llmConfig,
        setLlmConfig,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isNewCustomerModalOpen,
        setIsNewCustomerModalOpen,
        isPromptModalOpen,
        setIsPromptModalOpen,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) {
    throw new Error('useSupport must be used within a SupportProvider');
  }
  return context;
};
