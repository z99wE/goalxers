import { useState, useRef, useEffect } from 'react';

/**
 * Represents a single message in the chat history.
 */
export interface ChatMessage {
  id?: string;
  role: 'user' | 'ai';
  content: string;
}

/**
 * Props for the ChatPanel component.
 */
interface ChatPanelProps {
  /** The display name of the AI agent (e.g., 'Ticketing Agent') */
  agentName: string;
  /** The main title of the chat panel */
  title: string;
  /** Optional subtitle for additional context */
  subtitle?: string;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Array of predefined queries the user can click to send instantly */
  quickQueries: string[];
  /** Initial conversation history */
  initialMessages: ChatMessage[];
  /** Callback fired when the user sends a message. Must return a Promise resolving to the AI response. */
  onSend: (text: string, history: ChatMessage[]) => Promise<string>;
  /** Callback fired when the chat is cleared */
  onClear?: () => void;
  /** Callback fired when the close button is clicked */
  onClose?: () => void;
  /** Additional CSS classes to apply to the panel container */
  className?: string;
  /** If true, hides the 'Multi-Agent Online' status indicator. Defaults to false. */
  embedded?: boolean;
  /** Optional child elements to render above the quick queries */
  children?: React.ReactNode;
  /** Callback fired whenever the message history changes */
  onMessagesChange?: (messages: ChatMessage[]) => void;
}

/**
 * A reusable, standalone chat interface for interacting with specialized AI agents.
 * Features auto-scrolling, quick queries, a typing indicator, and responsive design.
 */

export default function ChatPanel({
  agentName,
  title,
  subtitle,
  placeholder = "Type your message...",
  quickQueries,
  initialMessages,
  onSend,
  onClear,
  onClose,
  className = "",
  embedded = false,
  children,
  onMessagesChange,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (onMessagesChange) onMessagesChange(messages);
  }, [messages, loading, onMessagesChange]);

  const handleSend = async (text?: string) => {
    const query = text || input;
    if (!query.trim() || loading) return;

    setInput('');
    const userMsg: ChatMessage = { role: 'user', content: query.trim() };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setLoading(true);

    try {
      const responseText = await onSend(query.trim(), updatedHistory);
      setMessages(prev => [...prev, { role: 'ai', content: responseText }]);
    } catch (error) {
      console.warn('Chat interaction failed:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Service temporarily unavailable. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages(initialMessages);
    if (onClear) onClear();
  };

  return (
    <div 
      className={`bg-[#0a0a10] border border-white/8 rounded-2xl flex flex-col overflow-hidden hover:border-yellow-400/20 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(250,204,21,0.05)] transition-all duration-300 ${className}`}
      role="region"
      aria-label={`${agentName} Chat Interface`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/6 flex-shrink-0">
        <div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-0.5">{agentName}</p>
          <h3 className="font-black text-white text-lg tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.02em' }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-white/35 text-xs mt-0.5" style={{ letterSpacing: '0.01em' }}>{subtitle}</p>
          )}
          {embedded === false && !subtitle && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-[10px] font-mono tracking-wider">Multi-Agent Online</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onClear && (
            <button
              onClick={handleClear}
              aria-label="Clear chat history"
              className="text-white/25 hover:text-white/50 text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors focus:outline-none focus:text-white/70"
            >
              Clear
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close AI Assistant"
              className="text-white/30 hover:text-white cursor-pointer transition-colors text-lg leading-none focus:outline-none focus:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0 focus:outline-none focus:ring-1 focus:ring-yellow-400/30"
        tabIndex={0}
        role="log"
        aria-live="polite"
        aria-label={`${title} chat history`}
      >
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[88%] px-4 py-2.5 rounded-xl text-sm leading-[1.65] ${
            m.role === 'ai'
              ? 'self-start bg-white/5 border border-white/8 text-slate-200 rounded-tl-sm'
              : 'self-end bg-yellow-400 text-black font-semibold rounded-tr-sm shadow-[0_4px_20px_rgba(250,204,21,0.15)]'
          }`} style={{ letterSpacing: '0.01em' }}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="self-start flex gap-1.5 px-4 py-3 bg-white/5 border border-white/8 rounded-xl rounded-tl-sm" role="status" aria-label="Agent is typing">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-yellow-400/60 rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-yellow-400/30 rounded-full typing-dot" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {children}

      {/* Quick Queries */}
      {quickQueries.length > 0 && (
        <div className="px-3 py-2 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {quickQueries.map((q, i) => (
            <button key={i} onClick={() => handleSend(q)} disabled={loading}
              className="flex-shrink-0 px-3 py-1.5 text-[11px] rounded-full bg-white/4 text-white/45 border border-white/8 hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400/25 transition-all cursor-pointer font-mono whitespace-nowrap disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 px-4 py-3 border-t border-white/6 bg-black/10 flex-shrink-0">
        <input
          value={input} onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          aria-label="Message to agent"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-400/40 focus:bg-white/7 transition-all font-sans min-w-0"
          style={{ letterSpacing: '0.015em' }}
        />
        <button type="submit" disabled={!input.trim() || loading}
          aria-label="Send message"
          className="w-9 h-9 bg-yellow-400 text-black rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-yellow-300 transition-all cursor-pointer text-sm font-bold flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
          ↑
        </button>
      </form>
    </div>
  );
}
