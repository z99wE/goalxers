import { motion } from 'framer-motion';
import HowItWorks from '../components/HowItWorks';

export default function HowItWorksPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center"
    >
      <div className="w-full max-w-5xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary to-nexus-accent">
          System Architecture
        </h1>
        <p className="text-slate-300 text-center mb-12">Discover the multi-agent technology powering the Nexus Stadium Assistant.</p>
        
        <HowItWorks />
      </div>
    </motion.div>
  );
}
