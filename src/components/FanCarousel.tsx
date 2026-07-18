import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAN_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
    quote: 'Sport has the power to change the world. It has the power to inspire. It has the power to unite people in a way that little else does.',
    author: 'Nelson Mandela',
  },
  {
    url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800',
    quote: 'Some people think football is a matter of life and death. I assure you, it is much more serious than that.',
    author: 'Bill Shankly',
  },
  {
    url: 'https://images.unsplash.com/photo-1431324155629-1a6edd1d1315?auto=format&fit=crop&q=80&w=800',
    quote: 'The more difficult the victory, the greater the happiness in winning.',
    author: 'Pelé',
  },
  {
    url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&q=80&w=800',
    quote: 'Football is the ballet of the masses.',
    author: 'Dmitri Shostakovich',
  },
];

export default function FanCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % FAN_IMAGES.length);
    }, 5000);
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
            alt="CheerTribe Supporter"
            className="w-full h-full object-cover brightness-[0.55]"
          />
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          {/* Text Quote overlay — no badges, no icons */}
          <div className="absolute bottom-6 left-6 right-6 text-left">
            <p className="text-white text-sm font-semibold leading-relaxed mb-1.5" style={{ letterSpacing: '0.015em' }}>
              "{FAN_IMAGES[index].quote}"
            </p>
            <p className="text-yellow-400 text-xs font-mono tracking-widest uppercase">
              — {FAN_IMAGES[index].author}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators — clean dots, no icons */}
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
