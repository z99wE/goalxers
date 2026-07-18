import { motion } from 'framer-motion';
import { CalendarBlank, MapPin, Trophy } from '@phosphor-icons/react';

export default function MatchInfo() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel p-5 rounded-2xl max-w-sm hover:border-yellow-400/20 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(250,204,21,0.05)] transition-all duration-300"
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-nexus-accent font-semibold mb-4">
        <Trophy weight="fill" />
        <span>Global Championship Final</span>
      </div>

      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <span className="text-xl">🇺🇸</span>
          </div>
          <span className="mt-2 text-xs font-medium tracking-wider text-slate-300">USA</span>
        </div>

        <div className="text-sm font-bold tracking-widest text-white/50 px-4">VS</div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(243,244,246,0.2)]">
            <span className="text-xl">🏴󠁧󠁢󠁷󠁬󠁳󠁿</span>
          </div>
          <span className="mt-2 text-xs font-medium tracking-wider text-slate-300">WAL</span>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <CalendarBlank className="text-white/50 text-lg" />
          <span>Sun, 19 Jul 2026 • 8:30 PM EST</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="text-white/50 text-lg" />
          <span>MetLife Stadium, NY/NJ</span>
        </div>
      </div>
    </motion.div>
  );
}
