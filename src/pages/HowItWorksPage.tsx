import { motion } from 'framer-motion';
import HowItWorks from '../components/HowItWorks';
import FanCarousel from '../components/FanCarousel';

export default function HowItWorksPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-16 px-4 bg-[#050508]"
    >
      <div className="w-full max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            System Architecture
          </h1>
          <p className="text-slate-400 text-sm tracking-wide max-w-xl mx-auto leading-relaxed">
            Discover the multi-agent technology powering the CheerTribe Stadium Assistant.
          </p>
        </div>
        
        <HowItWorks />

        {/* Supporters section under architecture */}
        <div className="mt-16 border-t border-white/8 pt-12 max-w-3xl mx-auto">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest text-center mb-6" style={{ letterSpacing: '0.12em' }}>
            CheerTribe Fan Spirit
          </p>
          <FanCarousel />
        </div>
      </div>
    </motion.div>
  );
}
