import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, Star, Armchair, Wine } from 'lucide-react';

interface TicketPanelProps {
  sectionId?: string;
  onClose?: () => void;
}

export default function TicketPanel({ sectionId = 'SEC-VIP', onClose }: TicketPanelProps) {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className={`${onClose ? 'absolute right-0 top-0 bottom-0 z-20' : 'relative w-full max-w-lg mx-auto rounded-3xl my-8'} w-full md:w-[450px] glass-panel border border-white/10 p-8 flex flex-col shadow-2xl overflow-y-auto bg-nexus-dark/95 backdrop-blur-xl`}
      role="dialog"
      aria-label={`Ticket Details for Section ${sectionId.replace('sec-', '')}`}
    >
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-nexus-accent hover:bg-white/20 transition-colors"
          aria-label="Close Ticket Panel"
        >
          ✕
        </button>
      )}

      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-nexus-accent font-bold mb-3">
        <Star size={14} className="fill-current" />
        <span>Premium VIP Match Package</span>
      </div>
      
      <h2 className="text-4xl font-extrabold mb-1 tracking-tight">ESTADIO AZTECA - SEC 124</h2>
      <p className="text-slate-400 text-sm tracking-wide mb-8">Opening Match 2026 • VIP Club Access</p>

      {/* Ticket Details Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Row</span>
          <span className="text-2xl font-bold text-white">14</span>
        </div>
        <div className="flex flex-col border-l border-white/10 pl-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Seats</span>
          <span className="text-2xl font-bold text-white">1-4</span>
        </div>
        <div className="flex flex-col border-l border-white/10 pl-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Price</span>
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary to-nexus-accent">$1,450</span>
        </div>
      </div>

      {/* Pass Texture preview */}
      <div className="w-full h-48 rounded-2xl overflow-hidden mb-8 relative border border-white/20 shadow-[0_0_30px_rgba(0,184,255,0.15)] group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] transition-transform duration-700 group-hover:scale-105 opacity-80" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
          <div className="flex items-center gap-2 mb-1">
             <ShieldCheck size={20} className="text-nexus-accent" />
             <span className="text-xs font-bold tracking-wider uppercase text-white">Match Day Smart Pass</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">Blockchain Verified</span>
        </div>
      </div>

      {/* Perks */}
      <div className="space-y-5 mb-auto">
        <h3 className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold">Included Perks</h3>
        
        {[
          { icon: <Armchair size={18} />, text: 'Padded executive seating' },
          { icon: <Star size={18} />, text: 'Unrestricted center-pitch view' },
          { icon: <Wine size={18} />, text: 'Exclusive VIP lounge access' },
          { icon: <CheckCircle size={18} />, text: 'Complimentary gourmet dining' }
        ].map((perk, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
            <span className="text-nexus-accent p-2 rounded-full bg-nexus-accent/10">{perk.icon}</span>
            <span className="font-medium">{perk.text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold">Total (4 Tickets)</span>
          <span className="text-3xl font-extrabold text-white">$5,800</span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-nexus-primary to-nexus-accent text-nexus-dark font-extrabold tracking-wider uppercase text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all"
        >
          Secure Allocation &rarr;
        </motion.button>
        <p className="text-center text-[10px] text-slate-500 mt-4 flex items-center justify-center gap-1 font-medium tracking-wide">
           <ShieldCheck size={12} /> SECURE CHECKOUT PROVIDED BY BLOCKCHAIN TICKETING
        </p>
      </div>
    </motion.div>
  );
}
