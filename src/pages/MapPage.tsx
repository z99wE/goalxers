import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateTextResponse } from '../services/aiService';
import StadiumMap from '../components/StadiumMap';

// ── World Cup 2026 Stadium Data ───────────────────────────────────────────────
const STADIUMS = [
  { id: 1, name: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', capacity: '82,500', matches: 8, highlight: 'Final', lat: 40.8128, lng: -74.0742, transport: 'NJ Transit rail to Meadowlands Station (8 min from Penn Station)', open: '2010', surface: 'Bermuda grass' },
  { id: 2, name: 'AT&T Stadium', city: 'Arlington, TX', country: 'USA', capacity: '80,000', matches: 7, highlight: 'Semifinal', lat: 32.7479, lng: -97.0945, transport: 'TRE Rail to CentrePort/DFW, free shuttle. From Dallas Union Station: 35 min', open: '2009', surface: 'Hybrid grass' },
  { id: 3, name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: '83,264', matches: 5, highlight: 'Opener', lat: 19.303, lng: -99.1505, transport: 'Metro Line 2 to Tasqueña, then Metrobús to stadium. 45 min from Centro', open: '1966', surface: 'Natural grass' },
  { id: 4, name: 'SoFi Stadium', city: 'Inglewood, CA', country: 'USA', capacity: '70,240', matches: 7, highlight: 'Quarterfinal', lat: 33.9535, lng: -118.3392, transport: 'Metro E Line to Downtown Inglewood + shuttle. 35 min from downtown LA', open: '2020', surface: 'Bermuda grass' },
  { id: 5, name: 'Rose Bowl', city: 'Pasadena, CA', country: 'USA', capacity: '88,565', matches: 5, highlight: 'Semifinal', lat: 34.1614, lng: -118.1676, transport: 'Metro Gold Line to Memorial Park + shuttle. 20 min from downtown Pasadena', open: '1922', surface: 'Bermuda grass' },
  { id: 6, name: 'NRG Stadium', city: 'Houston, TX', country: 'USA', capacity: '72,220', matches: 5, highlight: 'Quarterfinal', lat: 29.6847, lng: -95.4107, transport: 'MetroRail Red Line to Reliant Park. 25 min from downtown Houston', open: '2002', surface: 'FieldTurf' },
  { id: 7, name: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', country: 'USA', capacity: '71,000', matches: 5, highlight: 'Round of 16', lat: 33.7554, lng: -84.401, transport: 'MARTA Green/Blue Line to GWCC/CNN Center. 10 min walk from station', open: '2017', surface: 'FieldTurf' },
  { id: 8, name: 'Levi\'s Stadium', city: 'Santa Clara, CA', country: 'USA', capacity: '68,500', matches: 4, highlight: 'Group Stage', lat: 37.4032, lng: -121.9698, transport: 'VTA light rail to Great America station. 15 min walk from Caltrain', open: '2014', surface: 'Bermuda grass' },
  { id: 9, name: 'Gillette Stadium', city: 'Foxborough, MA', country: 'USA', capacity: '65,878', matches: 4, highlight: 'Group Stage', lat: 42.0909, lng: -71.2643, transport: 'MBTA Commuter Rail Providence/Stoughton Line to Foxboro station on match days only', open: '2002', surface: 'FieldTurf' },
  { id: 10, name: 'Lincoln Financial Field', city: 'Philadelphia, PA', country: 'USA', capacity: '69,596', matches: 4, highlight: 'Group Stage', lat: 39.9008, lng: -75.1675, transport: 'SEPTA Broad Street Line to NRG/AT&T Station. 5 min walk to stadium', open: '2003', surface: 'Natural grass' },
  { id: 11, name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: '45,000', matches: 4, highlight: 'Group Stage', lat: 43.6332, lng: -79.4189, transport: 'TTC Streetcar 509 Harbourfront from Union Station. 15 min', open: '2007', surface: 'Hybrid grass' },
  { id: 12, name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: '54,500', matches: 4, highlight: 'Group Stage', lat: 49.2768, lng: -123.1118, transport: 'SkyTrain Expo/Millennium Line to Stadium-Chinatown station. 2 min walk', open: '1983', surface: 'FieldTurf' },
  { id: 13, name: 'Arrowhead Stadium', city: 'Kansas City, MO', country: 'USA', capacity: '76,416', matches: 4, highlight: 'Group Stage', lat: 39.0489, lng: -94.484, transport: 'KCATA game day express bus from downtown Kansas City. 25 min', open: '1972', surface: 'Bermuda grass' },
  { id: 14, name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', capacity: '53,500', matches: 4, highlight: 'Group Stage', lat: 25.6697, lng: -100.2436, transport: 'Monterrey Metro Line 1 to Sendero + taxi. 35 min from city center', open: '2015', surface: 'Hybrid grass' },
  { id: 15, name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', capacity: '46,232', matches: 3, highlight: 'Group Stage', lat: 20.6837, lng: -103.4671, transport: 'Guadalajara Macrobús from city center. 40 min from Guadalajara downtown', open: '2010', surface: 'Bermuda grass' },
  { id: 16, name: 'Q2 Stadium', city: 'Austin, TX', country: 'USA', capacity: '20,738', matches: 2, highlight: 'Group Stage', lat: 30.3877, lng: -97.7195, transport: 'Capital Metro CapRail to Q2 Stadium station. 20 min from downtown Austin', open: '2021', surface: 'Bermuda grass' },
];

const COUNTRY_COLORS: Record<string, string> = {
  USA: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Mexico: 'text-green-400 bg-green-400/10 border-green-400/20',
  Canada: 'text-red-400 bg-red-400/10 border-red-400/20',
};

// ── Navigation AI ─────────────────────────────────────────────────────────────
function NavigationAssistant({ selectedStadium }: { selectedStadium: typeof STADIUMS[0] | null }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: selectedStadium
      ? `How can I help you get to ${selectedStadium.name}? I can suggest the best transport route, nearby hotels, or parking options.`
      : 'Select a stadium on the left or click a marker on the map, or ask me how to navigate to any World Cup 2026 venue.' }
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
      setMessages(prev => [...prev, { role: 'ai', content: 'Navigation service temporarily unavailable.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQueries = selectedStadium
    ? [`Best route to ${selectedStadium.name}`, `Parking near ${selectedStadium.name}`, `Hotels within 1 mile`]
    : ['How to get to MetLife Stadium', 'Transport from NYC to AT&T Stadium', 'Accessibility at Azteca'];

  return (
    <div className="bg-[#0a0a10] border border-white/8 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-white/6 flex-shrink-0">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-0.5">Navigation Agent</p>
        <h3 className="text-white font-black text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.02em' }}>
          {selectedStadium ? selectedStadium.name : 'Stadium Navigator'}
        </h3>
        {selectedStadium && (
          <p className="text-white/35 text-xs mt-0.5" style={{ letterSpacing: '0.01em' }}>{selectedStadium.city} · {selectedStadium.capacity} cap</p>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 no-scrollbar min-h-0">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-[90%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
            m.role === 'ai'
              ? 'self-start bg-white/5 border border-white/8 text-slate-200'
              : 'self-end bg-yellow-400 text-black font-semibold'
          }`} style={{ letterSpacing: '0.01em' }}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="self-start flex gap-1.5 px-4 py-3 bg-white/5 border border-white/8 rounded-xl">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-yellow-400/60 rounded-full typing-dot" />
            <span className="w-1.5 h-1.5 bg-yellow-400/30 rounded-full typing-dot" />
          </div>
        )}
      </div>
      <div className="px-3 py-2 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
        {quickQueries.map(q => (
          <button key={q} onClick={() => send(q)} disabled={loading}
            className="flex-shrink-0 px-3 py-1.5 text-[11px] rounded-full bg-white/4 text-white/45 border border-white/8 hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400/25 transition-all cursor-pointer font-mono whitespace-nowrap disabled:opacity-30">
            {q}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 px-4 py-3 border-t border-white/6 flex-shrink-0">
        <input
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="Ask about transport, parking, access…"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-yellow-400/40 transition-all font-sans"
          style={{ letterSpacing: '0.015em' }}
        />
        <button type="submit" disabled={!input.trim() || loading}
          className="w-9 h-9 bg-yellow-400 text-black rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-yellow-300 transition-all cursor-pointer text-sm font-bold flex-shrink-0">
          ↑
        </button>
      </form>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MapPage() {
  const [selected, setSelected] = useState<typeof STADIUMS[0] | null>(null);
  const [filter, setFilter] = useState<'All' | 'USA' | 'Mexico' | 'Canada'>('All');

  const filtered = filter === 'All' ? STADIUMS : STADIUMS.filter(s => s.country === filter);

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
          <div className="xl:col-span-3 space-y-2 overflow-y-auto" style={{ maxHeight: '70vh' }}>
            {filtered.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(s)}
                className={`w-full text-left flex items-center justify-between px-5 py-4 rounded-xl border transition-all cursor-pointer ${
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
                className="bg-[#0a0a10] border border-white/8 rounded-2xl p-5 flex-shrink-0"
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
