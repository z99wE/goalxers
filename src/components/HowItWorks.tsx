import { motion } from 'framer-motion';
import { Map, MessageSquare, Layers, Sparkles, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HowItWorks() {
  const navigate = useNavigate();

  const handlePromptClick = (prompt: string) => {
    // In a real implementation with global state, we would pass this prompt to the Assistant.
    // For now, we'll navigate to the assistant page which could read it from context/url.
    navigate('/assistant');
  };

  const steps = [
    {
      icon: <Map className="w-8 h-8 text-nexus-accent" />,
      title: 'Navigation Agent',
      description: 'Provides real-time routing, congestion updates, and accessibility mapping across the venue.',
      prompts: ['Where is Gate C at MetLife?', 'Show me the accessible route for USA vs WAL', 'Is there a line at Azteca North entrance?']
    },
    {
      icon: <Layers className="w-8 h-8 text-nexus-secondary" />,
      title: 'Ticketing Agent',
      description: 'Handles hospitality upgrades, seating charts, and VIP access rules with specialized knowledge.',
      prompts: ['How much is a VIP upgrade for the Final?', 'What is included in Elite Hospitality?', 'Where are the premium seats in Toronto?']
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-purple-400" />,
      title: 'General FAQ Agent',
      description: 'Answers all other inquiries regarding venue operations, transport, and match day schedules.',
      prompts: ['What items are prohibited?', 'When do the gates open?', 'How do I get to the stadium by train?']
    }
  ];

  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="glass-panel p-8 rounded-3xl flex flex-col gap-6 border border-white/5 hover:border-white/20 transition-all bg-nexus-dark/60 backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed min-h-[60px]">{step.description}</p>
            
            <div className="mt-auto space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Sparkles size={14} /> Try asking:
              </div>
              {step.prompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handlePromptClick(prompt)}
                  className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{prompt}</span>
                  <Send size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-nexus-accent" />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
