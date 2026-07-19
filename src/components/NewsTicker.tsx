import { useState, memo } from "react";

const NewsTicker = memo(function NewsTicker() {
  const [paused, setPaused] = useState(false);

  const news = [
    "BREAKING: Estadio Azteca confirmed to host the historic opening match of FIFA World Cup 2026.",
    "TICKET ALERT: Over 3.2 million ticket requests received in the first 24 hours of general sales.",
    "STADIUM UPDATE: MetLife Stadium installs state-of-the-art natural grass pitch for the Final.",
    "USA TEAM NEWS: Christian Pulisic declared fit for the opening Group Stage clash in Los Angeles.",
    "TRANSPORTATION: Host cities announce free public transit access for all match day ticket holders.",
    "FAN EXPERIENCE: CheerTribe 2026 rolls out real-time multi-lingual crowd navigation guides.",
    "MEXICO TEAM NEWS: El Tri confirms training base camp in Guadalajara for the group stage."
  ];

  const doubleNews = [...news, ...news];

  return (
    <div
      className="fixed top-0 left-0 right-0 h-9 bg-black/90 border-b border-white/8 z-[100] flex items-center overflow-hidden select-none text-[10px] font-mono tracking-wider font-semibold uppercase text-slate-300"
      role="region"
      aria-label="Breaking news ticker"
    >
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-scroll 55s linear infinite;
        }
        .ticker-track:hover,
        .ticker-track.paused {
          animation-play-state: paused;
        }
      `}</style>
      <div className="h-full px-4 bg-yellow-400 text-black font-black z-10 flex-shrink-0 flex items-center select-none text-[10px] border-r border-white/10 tracking-widest font-sans">
        LATEST NEWS
      </div>

      {/* Play / Pause button — WCAG 2.2.2 */}
      <button
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play news ticker" : "Pause news ticker"}
        aria-pressed={paused}
        className="h-full px-3 flex items-center text-slate-400 hover:text-yellow-400 focus:outline-none focus:text-yellow-400 border-r border-white/10 flex-shrink-0 transition-colors"
        title={paused ? "Play" : "Pause"}
      >
        {paused ? (
          /* Play icon */
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
            <path d="M2 1l7 4-7 4V1z" />
          </svg>
        ) : (
          /* Pause icon */
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
            <rect x="2" y="1" width="2.5" height="8" rx="0.5" />
            <rect x="5.5" y="1" width="2.5" height="8" rx="0.5" />
          </svg>
        )}
      </button>

      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <div className={`ticker-track flex items-center gap-16 whitespace-nowrap pl-4${paused ? " paused" : ""}`}>
          {doubleNews.map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span>{item}</span>
              <span className="text-yellow-400 font-bold select-none">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

export default NewsTicker;
