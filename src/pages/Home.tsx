import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MATCHES, STATS, type Match } from '../data/matches';

// ── Components ──────────────────────────────────────────────────────────────

/**
 * Renders a single match card showing the teams, flags, and venue.
 */
const MatchCard = React.memo(function MatchCard({ match, index, onClick }: { match: Match, index: number, onClick: () => void }) {
  const isLive = match.score === 'LIVE';
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={onClick}
      aria-label={`${match.home} vs ${match.away} on ${match.date} at ${match.venue}${isLive ? ' — LIVE' : ''}`}
      className="flex-shrink-0 w-56 bg-white/4 border border-white/8 rounded-xl p-4 hover:border-yellow-400/20 hover:bg-white/6 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(250,204,21,0.05)] transition-all duration-300 cursor-pointer text-left focus:outline-none focus:border-yellow-400/40"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] text-white/40 font-mono tracking-wider">{match.date} · {match.time}</span>
        {isLive && (
          <span className="text-[10px] bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20 font-mono tracking-wider">LIVE</span>
        )}
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-center flex-1">
          <div className="text-xl mb-1" aria-hidden="true">{match.homeFlag}</div>
          <div className="text-white text-xs font-bold" style={{ letterSpacing: '0.02em' }}>{match.home}</div>
        </div>
        <div className="px-3">
          <div className={`font-black text-sm ${isLive ? 'text-yellow-400' : 'text-white/20'}`} style={{ letterSpacing: '0.05em' }}>
            {isLive ? '2–1' : 'vs'}
          </div>
        </div>
        <div className="text-center flex-1">
          <div className="text-xl mb-1" aria-hidden="true">{match.awayFlag}</div>
          <div className="text-white text-xs font-bold" style={{ letterSpacing: '0.02em' }}>{match.away}</div>
        </div>
      </div>
      <p className="text-white/30 text-[10px] font-mono truncate" style={{ letterSpacing: '0.01em' }}>{match.venue}</p>
    </motion.button>
  );
});

/**
 * Hero section with a parallax background and main call-to-action buttons.
 */
function HeroSection({ 
  heroBgY, 
  heroY, 
  heroOpacity, 
  mousePos, 
  navigate 
}: { 
  heroBgY: MotionValue<number>; 
  heroY: MotionValue<number>; 
  heroOpacity: MotionValue<number>; 
  mousePos: { x: number; y: number }; 
  navigate: (path: string) => void; 
}) {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ y: heroBgY }}>
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ 
            backgroundImage: 'url(/stadium_hero.png)',
            transform: `scale(1.1) translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/70 to-[#050508]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/60 via-transparent to-[#050508]/60" />
      </motion.div>

      <motion.div 
        className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-16"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-black mb-6 leading-[1.15] py-2 px-1 tracking-tight"
        >
          <span className="text-white">Every Match.</span><br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 pb-2 inline-block">
            One Platform.
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          CheerTribe 2026 routes your questions about tickets, stadiums, and match schedules to specialized AI agents — giving you instant, accurate answers in any language.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button 
            onClick={() => navigate('/assistant')}
            className="px-8 py-4 bg-yellow-400 text-black font-black rounded-full transition-all duration-300 hover:bg-yellow-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(250,204,21,0.4)] cursor-pointer text-sm uppercase"
            style={{ letterSpacing: '0.06em' }}
          >
            Talk to AI Assistant
          </button>
          <button 
            onClick={() => navigate('/tickets')}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-105 cursor-pointer text-sm uppercase"
            style={{ letterSpacing: '0.05em' }}
          >
            Browse Tickets
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-white/40 text-xs tracking-widest uppercase font-mono">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  );
}

/**
 * A horizontal scrolling list of upcoming matches.
 */
function MatchTicker({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-[11px] font-mono font-bold text-yellow-400 tracking-widest uppercase" style={{ letterSpacing: '0.12em' }}>World Cup 2026 — Upcoming Fixtures</h2>
        </motion.div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar" role="list" aria-label="Upcoming World Cup fixtures">
          {MATCHES.map((match, i) => <MatchCard key={i} match={match} index={i} onClick={() => navigate('/tickets')} />)}
        </div>
      </div>
    </section>
  );
}

/**
 * Displays key statistical numbers for the tournament.
 */
function StatsBand() {
  return (
    <section className="py-16 border-y border-white/5">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-black text-yellow-400 mb-2">{s.value}</div>
            <div className="text-slate-500 text-sm font-mono tracking-wider uppercase">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/**
 * Highlights the main features and intelligence of the AI platform.
 */
function FeaturesSection({ mousePos, navigate }: { mousePos: { x: number; y: number }, navigate: (path: string) => void }) {
  return (
    <section className="py-28 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center order-2 lg:order-1"
          style={{ transform: `rotate(${mousePos.x * 0.5}deg)` }}
        >
          <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-3xl scale-75" />
          <img 
            src="/soccer_ball.png" 
            alt="Official match ball" 
            className="w-72 h-72 md:w-96 md:h-96 object-contain drop-shadow-2xl"
            style={{ transform: `rotate(${mousePos.x * 2}deg)` }}
          />
        </motion.div>

        <div className="order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-yellow-400 font-mono text-xs tracking-widest uppercase font-bold">CheerTribe Intelligence</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-6 leading-tight">
              Your entire World Cup,<br /><span className="text-yellow-400">one conversation.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Ask anything about tickets, routes, or schedules. Specialized AI agents handle each request — so you always get the right answer from the right source.
            </p>

            <div className="space-y-8">
              {[
                { tag: 'Multi-Agent Routing', title: 'Each question routed to the right expert', desc: 'Ticketing, navigation, and schedule queries are classified by intent and sent to a specialized agent — so you always get the most accurate answer for your specific need.' },
                { tag: 'Injection-Proof', title: 'Secure by design', desc: 'XML-delimited prompts and keyword detection block all jailbreak attempts, keeping every agent strictly focused on World Cup 2026 logistics.' },
                { tag: 'Instant Answers', title: 'Unfolding explanations', desc: 'Instantly view pre-verified answers or ask our smart orchestrator complex logistics queries with real-time feedback.' },
              ].map(({ tag, title, desc }) => (
                <div key={tag} className="pl-4 border-l border-white/10 hover:border-yellow-400/30 transition-colors">
                  <p className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest mb-1.5" style={{ letterSpacing: '0.1em' }}>{tag}</p>
                  <h3 className="text-white font-bold text-base mb-2" style={{ letterSpacing: '0.01em', lineHeight: '1.4' }}>{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed" style={{ letterSpacing: '0.01em' }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button
                onClick={() => navigate('/assistant')}
                className="text-yellow-400 font-bold text-sm cursor-pointer hover:text-yellow-300 transition-colors"
                style={{ letterSpacing: '0.02em' }}
              >
                Try the assistant now →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * A brief social proof bar.
 */
function SocialProof() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8 text-sm"
        >
          {[
            '50,000+ AI Queries Answered',
            '16 Host Cities Mapped',
            '99.9% Agent Uptime',
            'Multi-Agent System',
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-slate-400" style={{ letterSpacing: '0.01em' }}>
              <span className="text-yellow-400 font-bold flex-shrink-0">—</span>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Footer call to action with a graphical D-box arc.
 */
function FooterCTA({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="relative py-20 overflow-hidden bg-[#050508]">
      <div className="relative h-80 flex flex-col items-center justify-center">
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[160%] h-[160%]"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(34,197,94,0.12) 0%, rgba(22,163,74,0.06) 40%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl h-64 border-t-2 border-l-2 border-r-2 border-white/8 rounded-t-full"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        />
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] max-w-lg h-32 border-t-2 border-l-2 border-r-2 rounded-t-full"
          style={{ borderColor: 'rgba(250,204,21,0.08)' }}
        />

        <div className="relative z-10 text-center px-4">
          <h2 className="text-3xl font-black text-white mb-4">Ready for kick-off?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Start planning your World Cup 2026 experience now. No account required.</p>
          <button
            onClick={() => navigate('/assistant')}
            className="px-10 py-4 bg-yellow-400 text-black font-black rounded-full hover:bg-yellow-300 hover:shadow-[0_0_40px_rgba(250,204,21,0.3)] transition-all duration-300 hover:scale-105 cursor-pointer uppercase text-sm font-black"
            style={{ letterSpacing: '0.06em' }}
          >
            Chat With CheerTribe AI
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Main Page Component ─────────────────────────────────────────────────────

/**
 * The main Home page orchestrating all the sections.
 */
export default function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -120]);
  const heroBgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050508]">
      <HeroSection 
        heroBgY={heroBgY} 
        heroY={heroY} 
        heroOpacity={heroOpacity} 
        mousePos={mousePos} 
        navigate={navigate} 
      />
      <MatchTicker navigate={navigate} />
      <StatsBand />
      <FeaturesSection mousePos={mousePos} navigate={navigate} />
      <SocialProof />
      <FooterCTA navigate={navigate} />
    </div>
  );
}
