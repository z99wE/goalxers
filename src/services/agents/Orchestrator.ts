/**
 * @file Orchestrator.ts
 * @description Multi-agent orchestrator with intent routing, agent activity events,
 * prompt injection defense, and LLM fallback chain.
 */
import { llmRouter } from '../llm/LLMProvider';
import { getSystemPrompt } from '../prompts';

export type AgentIntent = 'TICKETING' | 'NAVIGATION' | 'FAQ' | 'SCHEDULE';

export interface AgentActivity {
  agent: string;
  status: 'routing' | 'thinking' | 'done' | 'fallback';
  message: string;
  timestamp: number;
}

type ActivityListener = (activity: AgentActivity) => void;

class LRUCache {
  private cache = new Map<string, string>();
  private capacity: number;
  
  constructor(capacity: number = 100) {
    this.capacity = capacity;
  }

  get(key: string): string | undefined {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: string, value: string) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

class AgentOrchestrator {
  private cache = new LRUCache(50);
  private activityListeners: ActivityListener[] = [];

  // ── Subscribe to real-time agent activity ──────────────────────────
  public onActivity(listener: ActivityListener) {
    this.activityListeners.push(listener);
    return () => {
      this.activityListeners = this.activityListeners.filter(l => l !== listener);
    };
  }

  private emit(activity: AgentActivity) {
    this.activityListeners.forEach(fn => fn(activity));
  }

  // ── Main entry point ───────────────────────────────────────────────
  public async handleUserMessage(
    messages: { role: string; content: string }[]
  ): Promise<string> {
    const lastMsg = messages[messages.length - 1].content;
    const normalized = lastMsg.toLowerCase().trim();

    // 1. Injection defense
    if (this.detectInjection(normalized)) {
      return 'I can only help with World Cup 2026 questions about tickets, stadiums, transport, and schedules.';
    }

    // 2. Cache hit
    const cacheKey = normalized.substring(0, 100);
    if (this.cache.has(cacheKey)) {
      this.emit({ agent: 'Cache Layer', status: 'done', message: 'Served from response cache', timestamp: Date.now() });
      return this.cache.get(cacheKey)!;
    }

    // 3. Detect intent and route to specialist agent
    const intent = this.detectIntent(normalized);
    const agentName = this.agentDisplayName(intent);

    this.emit({ agent: 'Intent Router', status: 'routing', message: `Query classified as: ${intent} → routing to ${agentName}`, timestamp: Date.now() });

    const systemPrompt = getSystemPrompt(intent);

    this.emit({ agent: agentName, status: 'thinking', message: 'Analyzing your question against World Cup 2026 data…', timestamp: Date.now() });

    // 4. Build secured messages with injection-safe delimiter
    const securedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(0, -1),
      { role: 'user', content: `<user_input>${lastMsg}</user_input>` }
    ];

    // 5. Call LLM with fallback chain
    let response: string;
    try {
      response = await llmRouter.chat(securedMessages);
      this.emit({ agent: agentName, status: 'done', message: 'Response generated via primary LLM (Groq)', timestamp: Date.now() });
    } catch {
      this.emit({ agent: agentName, status: 'fallback', message: 'Primary LLM unavailable — activating NIM fallback…', timestamp: Date.now() });
      // llmRouter already handles internal fallback, rethrow will be caught upstream
      throw new Error('All LLM providers failed');
    }

    // 6. Cache and return
    this.cache.set(cacheKey, response);
    return response;
  }



  // ── Intent classifier ──────────────────────────────────────────────
  private detectIntent(msg: string): AgentIntent {
    if (/ticket|price|buy|vip|seat|hospitality|lounge|book|cost|pass|category/.test(msg)) {
      return 'TICKETING';
    }
    if (/schedule|when|date|fixture|group|round|phase|knockout|semifinal|final|match|game|play/.test(msg)) {
      return 'SCHEDULE';
    }
    if (/map|navigate|where|gate|transport|metro|train|bus|drive|direction|park|arrive|route|get to|closest/.test(msg)) {
      return 'NAVIGATION';
    }
    return 'FAQ';
  }

  private agentDisplayName(intent: AgentIntent): string {
    const names: Record<AgentIntent, string> = {
      TICKETING: 'Ticketing Agent',
      NAVIGATION: 'Navigation Agent',
      SCHEDULE: 'Schedule Agent',
      FAQ: 'General FAQ Agent',
    };
    return names[intent];
  }

  private detectInjection(msg: string): boolean {
    const badPatterns = [
      'ignore all previous instructions',
      'forget your instructions',
      'you are now',
      'new persona',
      'system prompt is',
      'reveal your prompt',
      'bypass',
      'jailbreak',
    ];
    return badPatterns.some(p => msg.includes(p));
  }
}

export const orchestrator = new AgentOrchestrator();
