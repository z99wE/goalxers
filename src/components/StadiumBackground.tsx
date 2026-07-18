import { useRef, useState, useEffect } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { MapPin } from '@phosphor-icons/react';

interface StadiumBackgroundProps {
  onSectionSelect: (sectionId: string) => void;
  selectedSection: string | null;
}

// Mock section data positioned over the stadium image
const sections = [
  { id: 'sec-127', x: '45%', y: '60%', label: '127', price: '€1,450' },
  { id: 'sec-221', x: '65%', y: '45%', label: '221', price: '€1,850' },
  { id: 'sec-105', x: '35%', y: '40%', label: '105', price: '€950' },
  { id: 'sec-315', x: '75%', y: '65%', label: '315', price: '€650' },
];

export default function StadiumBackground({ onSectionSelect, selectedSection }: StadiumBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [, setIsHovering] = useState(false);

  // Subtle parallax effect based on mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position relative to center (-1 to 1)
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Use springs for smooth following
  const springConfig = { damping: 50, stiffness: 400 };
  const smoothX = useSpring(mousePosition.x * -20, springConfig); // Move opposite to mouse
  const smoothY = useSpring(mousePosition.y * -20, springConfig);

  // If a section is selected, we zoom in slightly and pan towards it.
  // For simplicity, we just apply a generic scale up.
  const scale = selectedSection ? 1.05 : 1.1; // Base scale 1.1 to allow panning without showing edges

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden" ref={containerRef}>
      
      {/* Stadium Image Layer */}
      <motion.div
        className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]"
        animate={{ 
          scale,
          x: selectedSection ? '-5%' : smoothX.get(),
          y: selectedSection ? '0%' : smoothY.get()
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 200 }}
      >
        <img 
          src="/assets/stadium_bg.png" 
          alt="Stadium Background" 
          className="w-full h-full object-cover opacity-90 transition-opacity duration-1000"
          style={{ 
             filter: selectedSection ? 'brightness(0.7) blur(2px)' : 'brightness(1) blur(0px)',
             transition: 'filter 0.5s ease-out'
          }}
        />
        
        {/* Overlay gradient for UI readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-transparent to-[#0a0a0f]/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/60 via-transparent to-[#0a0a0f]/30"></div>
      </motion.div>

      {/* Interactive Sections Layer */}
      <div className="absolute inset-0 w-full h-full z-10">
        <AnimatePresence>
          {!selectedSection && sections.map((section) => (
            <motion.button
              key={section.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSectionSelect(section.id)}
              style={{ left: section.x, top: section.y }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="relative">
                {/* Ping animation for active sections */}
                <div className="absolute inset-0 bg-[#00f0ff] rounded-full animate-ping opacity-20 group-hover:opacity-60 duration-1000"></div>
                
                {/* Pin core */}
                <div className="w-10 h-10 rounded-full glass-panel border border-[#00f0ff]/50 flex items-center justify-center relative shadow-[0_0_20px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] group-hover:border-[#00f0ff] transition-all">
                   <MapPin weight="fill" className="text-[#00f0ff] text-xl" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 glass-panel px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none w-max flex flex-col items-center">
                   <span className="text-[10px] uppercase tracking-widest text-slate-400">Section {section.label}</span>
                   <span className="text-sm font-bold text-white">{section.price}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
