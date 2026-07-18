export default function FanTicker() {
  const images = [
    "/fan_chat_1.jpg",
    "/fan_chat_2.jpg",
    "/fan_chat_3.jpg",
    "/fan_chat_1.jpg",
    "/fan_chat_2.jpg",
    "/fan_chat_3.jpg"
  ];

  return (
    <div 
      className="relative w-full h-32 bg-black/20 border-y border-white/5 overflow-hidden select-none flex items-center mt-12"
      role="marquee"
    >
      <style>{`
        @keyframes fan-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .fan-track {
          display: flex;
          width: max-content;
          animation: fan-scroll 35s linear infinite;
        }
        .fan-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Side fades */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050508] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050508] to-transparent z-10 pointer-events-none" />

      <div className="fan-track flex gap-6 px-4">
        {images.map((src, idx) => (
          <div 
            key={idx} 
            className="w-48 h-24 rounded-xl overflow-hidden border border-white/10 opacity-30 hover:opacity-90 hover:scale-105 hover:border-yellow-400/30 hover:shadow-[0_8px_30px_rgba(250,204,21,0.15)] transition-all duration-300 flex-shrink-0 cursor-pointer"
          >
            <img 
              src={src} 
              alt="CheerTribe Supporter Ticker" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
