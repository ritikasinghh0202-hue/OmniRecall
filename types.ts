export type FrustrationLevel = number; // 0 to 100

export type SupportMode = 'stateless' | 'memory-aware';

export type LLMProvider = 'simulated' | 'gemini' | 'openai';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  model: string;
}

export interface MemoryToast {
  id: string;
  title: string;
  detail: string;
  category: 'environment' | 'playbook' | 'ticket' | 'sentiment';
  timestamp: string;
}

export interface PastTicket {
  id: string;
  ticketNumber: string;
  title: string;
  status: 'resolved' | 'open' | 'investigating';
  date: string;
  category: string;
  summary: string;
  resolution?: string;
  keyTakeaway: string;
  isNewlyArchived?: boolean;
}

export interface MemoryNode {
  id: string;
  type: 'environment' | 'preference' | 'solution_playbook' | 'sentiment' | 'historical_incident';
  title: string;
  content: string;
  relevanceScore: number; // e.g. 0.94
  lastUpdated: string;
  sourceTicketId?: string;
}

export interface PlaybookItem {
  issue: string;
  provenFix: string;
  cautionNote?: string;
  isNew?: boolean;
}

export interface CustomerPersona {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarSeed: string;
  initials: string;
  environment: {
    os: string;
    runtime: string;
    infra: string;
    additionalTags: string[];
  };
  frustrationLevel: FrustrationLevel; // 0 - 100
  frustrationTrend: 'increasing' | 'stable' | 'decreasing';
  personalityNotes: string;
  pastTickets: PastTicket[];
  playbooks: PlaybookItem[];
  quickPrompts: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  personaId: string;
  content: string;
  timestamp: string;
  mode: SupportMode;
  retrievedMemoryIds?: string[];
  retrievalLatencyMs?: number;
  tokensUsed?: number;
  toneAdaptation?: string;
  extractedMemories?: string[];
  llmSource?: string;
  isStreaming?: boolean;
}

export interface RetrievalLogEntry {
  id: string;
  timestamp: string;
  query: string;
  personaId: string;
  injectedNodeCount: number;
  nodes: {
    id: string;
    title: string;
    type: string;
    score: number;
    snippet: string;
    matchedKeyword?: string;
  }[];
}
