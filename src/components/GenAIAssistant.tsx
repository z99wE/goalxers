import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateTextResponse } from '../services/aiService';
import { orchestrator } from '../services/agents/Orchestrator';
import type { AgentActivity } from '../services/agents/Orchestrator';
import toast from 'react-hot-toast';
import ChatPanel, { type ChatMessage } from './ChatPanel';

const SNIPPETS = [
  'Find tickets for the World Cup Final',
  'Which stadiums are in California?',
  'USA match schedule 2026',
  'How to get to MetLife Stadium by train',
  'VIP hospitality options at Azteca',
  'Best value seats for a family',
];

// ── Agent Activity Feed ───────────────────────────────────────────────────────
function AgentActivityFeed({ activities }: { activities: AgentActivity[] }) {
  if (activities.length === 0) return null;
  return (
    <div className="border-t border-white/5 px-4 py-3 bg-black/30 flex-shrink-0 space-y-1.5 max-h-28 overflow-y-auto">
      <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Agent Activity</p>
      {activities.slice(-4).map((a, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
            a.status === 'done' ? 'bg-green-400' :
            a.status === 'fallback' ? 'bg-amber-400' :
            a.status === 'routing' ? 'bg-blue-400 animate-pulse' :
            'bg-yellow-400 animate-pulse'
          }`} />
          <div className="min-w-0">
            <span className="text-[10px] font-mono font-bold text-white/60 mr-1">{a.agent}</span>
            <span className="text-[10px] text-white/35 leading-tight">{a.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function GenAIAssistant({ embedded = false }: { embedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [activities, setActivities] = useState<AgentActivity[]>([]);

  const [initialMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('cheertribe_ai_chat_v3');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore JSON parse error
    }
    return [{
      role: 'ai',
      content: 'Welcome to CheerTribe 2026. Ask me anything about World Cup tickets, stadium directions, match schedules, or travel tips across 16 host cities.',
    }];
  });

  // Subscribe to agent activity events
  useEffect(() => {
    const unsub = orchestrator.onActivity((activity) => {
      setActivities(prev => [...prev.slice(-10), activity]);
    });
    return unsub;
  }, []);

  // Close assistant on Escape key press
  useEffect(() => {
    if (embedded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [embedded]);

  const handleMessagesChange = useCallback((newMessages: ChatMessage[]) => {
    try { 
      localStorage.setItem('cheertribe_ai_chat_v3', JSON.stringify(newMessages)); 
    } catch {
      // ignore quota exceeded or other errors
    }
  }, []);

  const clearChat = () => {
    setActivities([]);
    localStorage.removeItem('cheertribe_ai_chat_v3');
  };

  const handleSend = async (_text: string, history: ChatMessage[]) => {
    setActivities([]); // Reset activity log for new query
    try {
      const apiMessages = history.map(m => ({
        role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
        content: m.content,
      }));
      return await generateTextResponse(apiMessages);
    } catch {
      toast.error('Could not reach AI. Check your API keys or connection.');
      throw new Error('Service unavailable');
    }
  };

  const chatPanelClass = embedded
    ? 'w-full max-w-2xl h-[680px] shadow-[0_20px_80px_rgba(0,0,0,0.7)]'
    : 'fixed bottom-24 right-6 w-[400px] h-[580px] shadow-[0_20px_80px_rgba(0,0,0,0.7)] z-50';

  const chatPanel = (
    <ChatPanel
      agentName="CHEERTRIBE AI"
      title="CHEERTRIBE AI"
      placeholder="Ask about tickets, stadiums, schedules…"
      quickQueries={SNIPPETS}
      initialMessages={initialMessages}
      onSend={handleSend}
      onClear={clearChat}
      onClose={embedded ? undefined : () => setIsOpen(false)}
      onMessagesChange={handleMessagesChange}
      className={chatPanelClass}
      embedded={embedded}
    >
      <AgentActivityFeed activities={activities} />
    </ChatPanel>
  );

  return (
    <>
      {!embedded && (
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="fixed bottom-6 right-6 w-12 h-12 bg-yellow-400 text-black rounded-full shadow-[0_8px_30px_rgba(250,204,21,0.35)] flex items-center justify-center hover:scale-110 hover:bg-yellow-300 transition-all z-50 cursor-pointer text-lg"
          aria-label="Open AI Assistant"
        >
          ✦
        </button>
      )}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {chatPanel}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
