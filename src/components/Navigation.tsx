import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Home, Map, Ticket, Bot, HelpCircle } from 'lucide-react';

export default function Navigation() {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Map', path: '/map', icon: Map },
    { name: 'Tickets', path: '/tickets', icon: Ticket },
    { name: 'AI Assistant', path: '/assistant', icon: Bot },
    { name: 'How it Works', path: '/how-it-works', icon: HelpCircle },
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-14 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-full px-2 py-2 flex items-center gap-1 shadow-[0_8px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      {/* Brand */}
      <div className="pl-4 pr-4 py-2 flex items-center gap-2 border-r border-white/8 mr-1">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
        <span className="text-xs font-black tracking-widest uppercase text-white font-display">CheerTribe</span>
      </div>
      
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => `
            flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400/50
            ${isActive 
              ? 'bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)]' 
              : 'text-slate-400 hover:text-white hover:bg-white/8'
            }
          `}
          aria-label={`Navigate to ${item.name}`}
        >
          <item.icon size={14} />
          <span className="hidden md:inline">{item.name}</span>
        </NavLink>
      ))}
    </motion.nav>
  );
}
