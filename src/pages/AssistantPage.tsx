import { motion } from 'framer-motion';
import GenAIAssistant from '../components/GenAIAssistant';

export default function AssistantPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center"
    >
      <div className="w-full max-w-4xl h-[75vh] flex flex-col relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-nexus-primary to-nexus-accent">
          Nexus GenAI Assistant
        </h1>
        <p className="text-slate-300 text-center mb-8">Multi-Agent Intelligence for Ticketing, Navigation, and Support.</p>
        
        {/* We reuse the GenAIAssistant component but modify its container context slightly if needed. */}
        {/* By default GenAIAssistant renders its own container, so we just wrap it. */}
        <div className="flex-1 w-full max-w-2xl mx-auto flex items-center justify-center">
             <GenAIAssistant embedded={true} />
        </div>
      </div>
    </motion.div>
  );
}
