import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateTextResponse, transcribeAudio } from '../services/aiService';
import { orchestrator } from '../services/agents/Orchestrator';
import type { AgentActivity } from '../services/agents/Orchestrator';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

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

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('cheertribe_ai_chat_v3');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [{
      id: '1',
      role: 'ai',
      content: 'Welcome to CheerTribe 2026. Ask me anything about World Cup tickets, stadium directions, match schedules, or travel tips across 16 host cities.',
    }];
  });

  useEffect(() => {
    try { localStorage.setItem('cheertribe_ai_chat_v3', JSON.stringify(messages)); }
    catch (_) {}
  }, [messages]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to agent activity events
  useEffect(() => {
    const unsub = orchestrator.onActivity((activity) => {
      setActivities(prev => [...prev.slice(-10), activity]);
    });
    return unsub;
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSendText = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setActivities([]); // Reset activity log for new query

    try {
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content,
      }));

      const aiContent = await generateTextResponse(apiMessages);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiContent,
      }]);
    } catch {
      toast.error('Could not reach AI. Check your API keys or connection.');
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, messages]);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(t => t.stop());
        setIsTyping(true);
        try {
          const transcript = await transcribeAudio(audioBlob);
          if (transcript) handleSendText(transcript);
          else { setIsTyping(false); toast.error('No speech detected. Try again.'); }
        } catch {
          toast.error('Voice transcription unavailable — Deepgram key required.');
          setIsTyping(false);
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast.error('Microphone permission denied.');
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1', role: 'ai',
      content: 'Chat cleared. What World Cup 2026 question can I help you with?',
    }]);
    setActivities([]);
    localStorage.removeItem('cheertribe_ai_chat_v3');
  };

  const chatPanel = (
    <div
      className={
        embedded
          ? 'w-full max-w-2xl h-[680px] bg-[#0a0a10] border border-white/8 rounded-2xl flex flex-col overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.7)]'
          : 'fixed bottom-24 right-6 w-[400px] h-[580px] bg-[#0a0a10] border border-white/8 rounded-2xl flex flex-col overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.7)] z-50'
      }
      role="dialog"
      aria-label="CheerTribe AI Assistant"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/6 flex-shrink-0">
        <div>
          <h3 className="font-black text-white text-sm tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em' }}>
            CHEERTRIBE AI
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[10px] font-mono tracking-wider">Multi-Agent Online</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={clearChat} className="text-white/25 hover:text-white/50 text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors">
            Clear
          </button>
          {!embedded && (
            <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white cursor-pointer transition-colors text-lg leading-none">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3" role="log" aria-live="polite">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`max-w-[87%] text-sm leading-[1.65] ${
              msg.role === 'ai'
                ? 'self-start text-slate-200 bg-white/5 border border-white/8 px-4 py-3 rounded-2xl rounded-tl-sm'
                : 'self-end text-black bg-yellow-400 px-4 py-3 rounded-2xl rounded-tr-sm font-semibold shadow-[0_4px_20px_rgba(250,204,21,0.15)]'
            }`}
            style={{ letterSpacing: '0.01em' }}
          >
            {msg.content}
          </motion.div>
        ))}
        {isTyping && (
          <div className="self-start flex items-center gap-1.5 px-4 py-3 bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-yellow-400/60 rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-yellow-400/30 rounded-full typing-dot" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Agent Activity Feed */}
      <AgentActivityFeed activities={activities} />

      {/* Prompt snippets */}
      <div className="px-3 py-2 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
        {SNIPPETS.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSendText(s)}
            disabled={isTyping}
            className="flex-shrink-0 px-3 py-1.5 text-[11px] rounded-full bg-white/4 text-white/50 border border-white/8 hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400/25 transition-all disabled:opacity-30 cursor-pointer font-mono whitespace-nowrap"
            style={{ letterSpacing: '0.01em' }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-white/6 bg-black/10 flex-shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); handleSendText(input); }} className="flex gap-2.5">
          <button
            type="button"
            onClick={toggleRecording}
            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all cursor-pointer ${
              isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/8 text-white/40 hover:bg-white/15 hover:text-white'
            }`}
            aria-label={isRecording ? 'Stop recording' : 'Voice input'}
          >
            {isRecording ? '⏹' : '🎤'}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about tickets, stadiums, schedules…"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-400/40 focus:bg-white/7 transition-all min-w-0"
            style={{ letterSpacing: '0.015em' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-9 h-9 bg-yellow-400 text-black rounded-xl flex items-center justify-center disabled:opacity-35 hover:bg-yellow-300 transition-all cursor-pointer text-sm font-bold"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
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
