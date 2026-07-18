import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUOTES = [
  { text: "Some people think football is a matter of life and death. I assure you, it's much more serious than that.", author: "Bill Shankly" },
  { text: "I learned all about life with a ball at my feet.", author: "Ronaldinho" },
  { text: "I don't have time for hobbies. At the end of the day, I treat my job as a hobby. It's something I love doing.", author: "David Beckham" },
  { text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing or learning to do.", author: "Pelé" },
  { text: "The more difficult the victory, the greater the happiness in winning.", author: "Pelé" },
  { text: "I am constantly being asked about individuals. The only way to win is as a team. Football is not about one or two or three star players.", author: "Pelé" },
  { text: "I just hate losing and that gives you an extra determination to work harder.", author: "Wayne Rooney" },
  { text: "I have to keep working hard and playing well because I don't like to be second.", author: "Cristiano Ronaldo" },
  { text: "There is no pressure when you are making a dream come true.", author: "Neymar" },
  { text: "You have to fight to reach your dream. You have to sacrifice and work hard for it.", author: "Lionel Messi" }
];

export function SoccerQuotes() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, 6000); // Change quote every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative z-10 w-full py-16 bg-[#050508] border-t border-white/5 flex flex-col items-center justify-center overflow-hidden h-[300px]">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <p className="text-white/50 italic font-serif text-xl md:text-2xl tracking-wide leading-relaxed">
              "{QUOTES[index].text}"
            </p>
            <p className="text-yellow-400/60 text-xs font-mono uppercase tracking-[0.2em]">
              — {QUOTES[index].author}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
