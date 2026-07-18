import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateTextResponse } from '../services/aiService';
import StadiumMap from '../components/StadiumMap';

import { useMemo } from 'react';
import { STADIUMS, COUNTRY_COLORS, type Stadium } from '../data/stadiums';
import ChatPanel from '../components/ChatPanel';

// ── Navigation AI ─────────────────────────────────────────────────────────────
function NavigationAssistant({ selectedStadium }: { selectedStadium: Stadium | null }) {
  const initialMessages = [
    { role: 'ai' as const, content: selectedStadium
      ? `How can I help you get to ${selectedStadium.name}? I can suggest the best transport route, nearby hotels, or parking options.`
      : 'Select a stadium on the left or click a marker on the map, or ask me how to navigate to any World Cup 2026 venue.' }
  ];

  const quickQueries = selectedStadium
    ? [`Best route to ${selectedStadium.name}`, `Parking near ${selectedStadium.name}`, `Hotels within 1 mile`]
    : ['How to get to MetLife Stadium', 'Transport from NYC to AT&T Stadium', 'Accessibility at Azteca'];

  return (
    <ChatPanel
      agentName="Navigation Agent"
      title={selectedStadium ? selectedStadium.name : 'Stadium Navigator'}
      subtitle={selectedStadium ? `${selectedStadium.city} · ${selectedStadium.capacity} cap` : undefined}
      placeholder="Ask about transport, parking, access…"
      quickQueries={quickQueries}
      initialMessages={initialMessages}
      onSend={async (_text: string, history: any[]) => {
        const apiMsgs = history.map(m => ({ role: m.role === 'ai' ? 'assistant' as const : 'user' as const, content: m.content }));
        return await generateTextResponse(apiMsgs);
      }}
      className="h-full"
    />
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MapPage() {
  const [selected, setSelected] = useState<Stadium | null>(null);
  const [filter, setFilter] = useState<'All' | 'USA' | 'Mexico' | 'Canada'>('All');

  const filtered = useMemo(() => filter === 'All' ? STADIUMS : STADIUMS.filter(s => s.country === filter), [filter]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-[#050508]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest mb-3">16 Host Cities · 3 Countries</p>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-0.02em' }}>
            Stadiums &amp; Navigation
          </h1>
          {/* Dynamic Open Street Map */}
          <div className="mb-8">
            <StadiumMap
              stadiums={filtered}
              selectedStadium={selected}
              onSelectStadium={(s) => setSelected(s)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(['All', 'USA', 'Mexico', 'Canada'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  filter === f
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'bg-white/4 text-white/50 border-white/10 hover:border-white/20 hover:text-white'
                }`}
                style={{ letterSpacing: '0.05em' }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

          {/* Stadium list */}
          <div 
            className="xl:col-span-3 space-y-2 overflow-y-auto focus:outline-none focus:ring-1 focus:ring-yellow-400/30 rounded-xl" 
            style={{ maxHeight: '70vh' }}
            tabIndex={0}
            role="region"
            aria-label="Host stadiums list"
          >
            {filtered.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(s)}
                className={`w-full text-left flex items-center justify-between px-5 py-4 rounded-xl border transition-all cursor-pointer hover:-translate-y-0.5 hover:border-yellow-400/20 hover:shadow-[0_8px_30px_rgba(250,204,21,0.04)] ${
                  selected?.id === s.id
                    ? 'border-yellow-400/40 bg-yellow-400/5'
                    : 'border-white/6 bg-white/2 hover:border-white/14 hover:bg-white/4'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <span className="text-white font-bold text-sm truncate" style={{ letterSpacing: '0.01em' }}>{s.name}</span>
                    {s.highlight !== 'Group Stage' && (
                      <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20 uppercase tracking-wider flex-shrink-0">
                        {s.highlight}
                      </span>
                    )}
                  </div>
                  <p className="text-white/35 text-xs" style={{ letterSpacing: '0.01em' }}>{s.city} · {s.capacity} capacity</p>
                </div>
                <div className="flex-shrink-0 ml-4 text-right">
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border uppercase tracking-wider ${COUNTRY_COLORS[s.country]}`}>
                    {s.country}
                  </span>
                  <p className="text-white/30 text-[10px] mt-1.5 font-mono">{s.matches} matches</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right panel */}
          <div className="xl:col-span-2 flex flex-col gap-4" style={{ height: '70vh' }}>
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a10] border border-white/8 rounded-2xl p-5 flex-shrink-0 hover:border-yellow-400/20 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(250,204,21,0.05)] transition-all duration-300"
              >
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-3">Stadium Details</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Opened', selected.open],
                    ['Surface', selected.surface],
                    ['Capacity', selected.capacity],
                    ['Matches', `${selected.matches} games`],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider mb-0.5">{label}</p>
                      <p className="text-white text-sm font-semibold" style={{ letterSpacing: '0.01em' }}>{val}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/6">
                  <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider mb-1">Public Transport</p>
                  <p className="text-white/60 text-xs leading-relaxed" style={{ letterSpacing: '0.01em' }}>{selected.transport}</p>
                </div>
              </motion.div>
            )}
            <div className="flex-1 min-h-0">
              <NavigationAssistant selectedStadium={selected} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
