import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateTextResponse } from '../services/aiService';

// ── Data ─────────────────────────────────────────────────────────────────────
const TICKET_CATEGORIES = [
  {
    id: 'cat1',
    label: 'Category 1',
    description: 'Prime center-pitch view — lower tier, central sections',
    price: '$750–$1,450',
    badge: 'Best View',
    available: true,
  },
  {
    id: 'cat2',
    label: 'Category 2',
    description: 'Side stands, upper tier — excellent value sightlines',
    price: '$400–$750',
    badge: 'Popular',
    available: true,
  },
  {
    id: 'cat3',
    label: 'Category 3',
    description: 'Behind-goal stands — full atmosphere, budget-friendly',
    price: '$150–$350',
    badge: 'Value',
    available: true,
  },
  {
    id: 'vip',
    label: 'VIP Hospitality',
    description: 'Executive suites, gourmet dining, pitch-view lounge, dedicated concierge',
    price: '$2,500–$6,500',
    badge: 'Premium',
    available: true,
  },
  {
    id: 'family',
    label: 'Family Zone',
    description: 'Sheltered family sections with dedicated facilities and kids programming',
    price: '$200–$500',
    badge: 'Family',
    available: true,
  },
];

const FEATURED_MATCHES = [
  { match: 'Opening Match', teams: 'Mexico vs TBD', date: 'Jun 11, 2026', venue: 'Estadio Azteca', price: '$480', country: '🇲🇽' },
  { match: 'Group Stage — USA Home', teams: 'USA vs TBD', date: 'Jun 12, 2026', venue: 'MetLife Stadium', price: '$520', country: '🇺🇸' },
  { match: 'Group Stage', teams: 'Argentina vs TBD', date: 'Jun 18, 2026', venue: 'AT&T Stadium', price: '$650', country: '🇦🇷' },
  { match: 'Round of 32', teams: 'TBD vs TBD', date: 'Jun 29, 2026', venue: 'SoFi Stadium', price: '$380', country: '⚽' },
  { match: 'Quarterfinal', teams: 'TBD vs TBD', date: 'Jul 4, 2026', venue: 'NRG Stadium', price: '$620', country: '⚽' },
  { match: 'Semifinal', teams: 'TBD vs TBD', date: 'Jul 14, 2026', venue: 'AT&T Stadium', price: '$940', country: '⚽' },
  { match: 'Third Place', teams: 'TBD vs TBD', date: 'Jul 18, 2026', venue: 'Rose Bowl', price: '$720', country: '⚽' },
  { match: 'World Cup Final', teams: 'TBD vs TBD', date: 'Jul 19, 2026', venue: 'MetLife Stadium', price: '$1,400', country: '🏆' },
];

// ── AI Ticket Assistant ───────────────────────────────────────────────────────
function TicketAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Tell me what match you want to attend, your budget, and how many tickets — I\'ll find the best options for you.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (text?: string) => {
    const query = text || input;
    if (!query.trim() || loading) return;
    setInput('');
    const updated = [...messages, { role: 'user', content: query }];
    setMessages(updated);
    setLoading(true);
    try {
      const apiMsgs = updated.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));
      const res = await generateTextResponse(apiMsgs);
      setMessages(prev => [...prev, { role: 'ai', content: res }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Service temporarily unavailable. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a10] border border-white/8 rounded-2xl overflow-hidden hover:border-yellow-400/20 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(250,204,21,0.05)] transition-all duration-300">
      <div className="px-6 py-4 border-b border-white/6">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-0.5">Ticketing Agent</p>
        <h3 className="text-white font-black text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.02em' }}>
          Find Your Perfect Ticket
        </h3>
      </div>
      <div 
        className="h-56 overflow-y-auto px-4 py-4 flex flex-col gap-3 no-scrollbar focus:outline-none focus:ring-1 focus:ring-yellow-400/30"
        tabIndex={0}
        role="log"
        aria-live="polite"
        aria-label="Ticket agent chat history"
      >
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[88%] px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
            m.role === 'ai'
              ? 'self-start bg-white/5 border border-white/8 text-slate-200'
              : 'self-end bg-yellow-400 text-black font-semibold'
          }`} style={{ letterSpacing: '0.01em' }}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="self-start flex gap-1.5 px-4 py-2.5 bg-white/5 border border-white/8 rounded-xl" role="status" aria-label="Agent is typing">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-yellow-400/60 rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-yellow-400/30 rounded-full typing-dot" />
          </div>
        )}
      </div>
      <div className="px-3 py-2 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
        {['World Cup Final tickets', 'Family tickets under $300', 'VIP hospitality options'].map(s => (
          <button key={s} onClick={() => send(s)} disabled={loading}
            className="flex-shrink-0 px-3 py-1.5 text-[11px] rounded-full bg-white/4 text-white/45 border border-white/8 hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400/25 transition-all disabled:opacity-30 cursor-pointer font-mono whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
            {s}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 px-4 py-3 border-t border-white/6">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. 2 tickets USA vs Mexico, budget $600…"
          aria-label="Message to ticketing agent"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-400/40 transition-all font-sans"
          style={{ letterSpacing: '0.015em' }}
        />
        <button type="submit" disabled={!input.trim() || loading}
          aria-label="Send message"
          className="w-9 h-9 bg-yellow-400 text-black rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-yellow-300 transition-all cursor-pointer font-bold text-sm flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-yellow-400/50">
          ↑
        </button>
      </form>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TicketsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-[#050508]">

      {/* Hero band with pitch photo */}
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-16 max-w-7xl mx-auto">
        <img src="/vip_seats.png" alt="VIP stadium seats" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/50 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <p className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest mb-2">Hospitality &amp; Tickets</p>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-0.02em' }}>
            World Cup 2026<br />Tickets
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left — Match listing + categories */}
        <div className="lg:col-span-2 space-y-10">

          {/* Ticket Categories */}
          <section>
            <h2 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.02em' }}>
              Ticket Categories
            </h2>
            <div className="space-y-3">
              {TICKET_CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`w-full text-left flex items-center justify-between px-6 py-4 rounded-xl border transition-all cursor-pointer hover:-translate-y-0.5 hover:border-yellow-400/20 hover:shadow-[0_8px_30px_rgba(250,204,21,0.04)] ${
                    selectedCategory === cat.id
                      ? 'border-yellow-400/40 bg-yellow-400/5'
                      : 'border-white/8 bg-white/3 hover:border-white/16 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white font-bold text-sm" style={{ letterSpacing: '0.01em' }}>{cat.label}</span>
                      <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20 uppercase tracking-wider">
                        {cat.badge}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed" style={{ letterSpacing: '0.01em' }}>{cat.description}</p>
                  </div>
                  <div className="flex-shrink-0 ml-6 text-right">
                    <p className="text-yellow-400 font-black text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{cat.price}</p>
                    <p className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">per ticket</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Match Listing */}
          <section>
            <h2 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.02em' }}>
              Featured Matches
            </h2>
            <div className="space-y-2">
              {FEATURED_MATCHES.map((m, i) => (
                <motion.button
                  key={i}
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="w-full text-left group flex items-center justify-between px-6 py-4 rounded-xl border border-white/6 bg-white/2 hover:border-yellow-400/20 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(250,204,21,0.04)] transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  onClick={() => {}}
                  aria-label={`Select match ${m.teams} at ${m.venue} on ${m.date}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl" role="img" aria-label="Flag or Ball">{m.country}</span>
                    <div>
                      <p className="text-[10px] text-white/35 font-mono uppercase tracking-wider mb-0.5">{m.match}</p>
                      <p className="text-white text-sm font-semibold" style={{ letterSpacing: '0.01em' }}>{m.teams}</p>
                      <p className="text-white/40 text-xs mt-0.5" style={{ letterSpacing: '0.01em' }}>{m.date} · {m.venue}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-yellow-400 font-black text-base" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>From {m.price}</p>
                    <p className="text-[10px] text-slate-600 font-mono uppercase tracking-wider group-hover:text-yellow-400/60 transition-colors">Select →</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        </div>

        {/* Right — AI Ticket Assistant */}
        <div className="space-y-6">
          <TicketAssistant />

          {/* Pitch photo */}
          {/* Pitch photo */}
          <div className="rounded-2xl overflow-hidden">
            <img src="/pitch_closeup.png" alt="Football pitch" className="w-full h-44 object-cover" />
          </div>



          {/* Info box */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-yellow-400/20 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(250,204,21,0.05)] transition-all duration-300">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-3">Purchase Info</p>
            <div className="space-y-3">
              {[
                ['Resale policy', 'Official transfers only via CheerTribe platform'],
                ['Payment', 'Cashless — Visa, Mastercard, Apple Pay'],
                ['Delivery', 'Digital smart pass to your phone'],
                ['Refunds', 'Full refund up to 30 days before match'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-white/40 text-xs font-mono flex-shrink-0" style={{ letterSpacing: '0.01em' }}>{label}</span>
                  <span className="text-white/70 text-xs text-right leading-relaxed" style={{ letterSpacing: '0.01em' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
