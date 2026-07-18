import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateTextResponse } from '../services/aiService';

import { TICKET_CATEGORIES, FEATURED_MATCHES } from '../data/tickets';
import ChatPanel from '../components/ChatPanel';

// ── AI Ticket Assistant ───────────────────────────────────────────────────────
function TicketAssistant() {
  const initialMessages = [
    { role: 'ai' as const, content: 'Tell me what match you want to attend, your budget, and how many tickets — I\'ll find the best options for you.' }
  ];

  return (
    <div className="h-[400px]">
      <ChatPanel
        agentName="Ticketing Agent"
        title="Find Your Perfect Ticket"
        placeholder="e.g. 2 tickets USA vs Mexico, budget $600…"
        quickQueries={['World Cup Final tickets', 'Family tickets under $300', 'VIP hospitality options']}
        initialMessages={initialMessages}
        onSend={async (_text, history) => {
          const apiMsgs = history.map(m => ({ role: m.role === 'ai' ? 'assistant' as const : 'user' as const, content: m.content }));
          return await generateTextResponse(apiMsgs);
        }}
        className="h-full"
      />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TicketsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">

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
