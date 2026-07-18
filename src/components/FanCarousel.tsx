import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAN_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    caption: 'La Albiceleste supporters bringing the absolute passion of South America',
    team: 'Argentina Fans',
  },
  {
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
    caption: 'The vibrant yellow wall of Brazil supporters filling the stands',
    team: 'Brazil Fans',
  },
  {
    url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800',
    caption: 'European fans chanting in unison at the grand stadium gates',
    team: 'Europe Supporters',
  },
  {
    url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800',
    caption: 'Supporters waving flags and igniting the stadium atmosphere',
    team: 'Cheering Crowd',
  },
];

export default function FanCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % FAN_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[240px] rounded-2xl overflow-hidden border border-white/8 bg-[#0a0a10]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={FAN_IMAGES[index].url}
            alt={FAN_IMAGES[index].team}
            className="w-full h-full object-cover brightness-[0.65]"
          />
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          
          {/* Info Card overlay */}
          <div className="absolute bottom-5 left-5 right-5 text-left">
            <span className="text-[10px] font-mono font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {FAN_IMAGES[index].team}
            </span>
            <p className="text-white text-xs font-semibold mt-2 leading-relaxed" style={{ letterSpacing: '0.015em' }}>
              "{FAN_IMAGES[index].caption}"
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute top-5 right-5 flex gap-1.5 z-20">
        {FAN_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
              index === i ? 'bg-yellow-400 w-3' : 'bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
