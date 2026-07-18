import { motion } from 'framer-motion';
import GenAIAssistant from '../components/GenAIAssistant';

export default function AssistantPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-12 px-4"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            CheerTribe GenAI Assistant
          </h1>
          <p className="text-slate-400 text-sm tracking-wide max-w-xl mx-auto leading-relaxed">
            Instant guidance on tickets, stadium directions, rules, and schedules. Ask anything or speak directly to our specialized agents.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Chat Assistant (spans 2 columns on large screens) */}
          <div className="lg:col-span-2 flex justify-center">
            <GenAIAssistant embedded={true} />
          </div>


          <div className="space-y-6">
            {/* Premium Supporter Card */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-yellow-400/20 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(250,204,21,0.05)] transition-all duration-300">
              <h2 className="text-white font-bold text-sm mb-3" style={{ letterSpacing: '0.01em' }}>Join the Tribe</h2>
              <p className="text-slate-400 text-xs leading-relaxed mb-4" style={{ letterSpacing: '0.01em' }}>
                CheerTribe connects fans across all 16 host cities. Tap into live stadium guides, match fixtures, and transport details.
              </p>
              <div className="space-y-2">
                {[
                  '16 Host Cities Supported',
                  'Instant Multi-Agent Routing',
                  'Grounded World Cup 2026 Data',
                ].map((perk) => (
                  <div key={perk} className="flex items-center gap-2 text-slate-300 text-xs">
                    <span className="text-yellow-400 font-bold">—</span>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
