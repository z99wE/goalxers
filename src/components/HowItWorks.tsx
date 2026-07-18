import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptDetail {
  q: string;
  a: string;
}

interface Step {
  title: string;
  description: string;
  prompts: PromptDetail[];
}

export default function HowItWorks() {
  const [openPrompt, setOpenPrompt] = useState<string | null>(null);

  const steps: Step[] = [
    {
      title: 'Navigation Agent',
      description: 'Provides real-time routing, congestion updates, and accessibility mapping across the venue.',
      prompts: [
        {
          q: 'Where is Gate C at MetLife?',
          a: 'Gate C is located on the East Side of the stadium, directly adjacent to the train station transit loop. Follow the gold wayfinding markers.'
        },
        {
          q: 'Show me the accessible route for USA vs WAL',
          a: 'Accessible routes run from Lot G directly to Elevator Lobby 3. Dedicated ADA shuttle service is active 3 hours pre-match.'
        },
        {
          q: 'Is there a line at Azteca North entrance?',
          a: 'Azteca North entrance is currently at 15% capacity. Estimated queue time is under 4 minutes. Highly recommended route.'
        }
      ]
    },
    {
      title: 'Ticketing Agent',
      description: 'Handles hospitality upgrades, seating charts, and VIP access rules with specialized knowledge.',
      prompts: [
        {
          q: 'How much is a VIP upgrade for the Final?',
          a: 'VIP Club upgrades start at $950 per seat. Includes private lounge access, complimentary gourmet catering, and prime halfway-line views.'
        },
        {
          q: 'What is included in Elite Hospitality?',
          a: 'Elite Hospitality packages include pitch-side pre-match passes, multi-course dining, premium open bar, host service, and premium parking.'
        },
        {
          q: 'Where are the premium seats in Toronto?',
          a: 'Premium suites and club seats are in the West Stand (Sections 105-109), offering heated executive seating and lounge access.'
        }
      ]
    },
    {
      title: 'General FAQ Agent',
      description: 'Answers all other inquiries regarding venue operations, transport, and match day schedules.',
      prompts: [
        {
          q: 'What items are prohibited?',
          a: 'Prohibited items: Bags larger than 12x6x12 inches, professional cameras, banners larger than 3x5 feet, and outside food/beverages.'
        },
        {
          q: 'When do the gates open?',
          a: 'Stadium gates open exactly 3 hours prior to kickoff. VIP hospitality areas open 4 hours prior to kickoff.'
        },
        {
          q: 'How do I get to the stadium by train?',
          a: 'NJ Transit runs express trains directly from Secaucus Junction to Meadowlands Station starting 4 hours before the match.'
        }
      ]
    }
  ];

  const handleToggle = (q: string) => {
    setOpenPrompt(prev => (prev === q ? null : q));
  };

  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="glass-panel p-8 rounded-3xl flex flex-col gap-5 border border-white/5 bg-[#0a0a10] backdrop-blur-md hover:border-yellow-400/20 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(250,204,21,0.05)] transition-all duration-300"
          >
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-wide uppercase font-sans mb-2 border-b border-white/5 pb-2">
                {step.title}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed min-h-[50px]">{step.description}</p>
            </div>
            
            <div className="space-y-2.5 pt-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 font-mono">
                TRY ASKING:
              </div>
              {step.prompts.map((prompt, pIdx) => {
                const isOpen = openPrompt === prompt.q;
                const accordionId = `faq-content-${idx}-${pIdx}`;
                return (
                  <div key={pIdx} className="w-full border-b border-white/5 pb-2.5 last:border-b-0">
                    <button
                      onClick={() => handleToggle(prompt.q)}
                      aria-expanded={isOpen}
                      aria-controls={accordionId}
                      className="w-full text-left py-1 text-xs text-slate-300 hover:text-white transition-colors flex items-center justify-between font-medium cursor-pointer focus:outline-none focus:text-yellow-400"
                    >
                      <span className="pr-4">{prompt.q}</span>
                      <span className="text-[9px] text-yellow-400 font-mono transition-transform duration-200">
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={accordionId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-[11px] text-slate-400 leading-relaxed pt-2 pl-2 border-l border-yellow-400/50 mt-1 font-sans">
                            {prompt.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
