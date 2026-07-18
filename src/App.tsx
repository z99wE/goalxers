import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import Navigation from './components/Navigation';
import NewsTicker from './components/NewsTicker';
import { FocusRail } from './components/ui/focus-rail';

import ErrorBoundary from './components/ErrorBoundary';

// Lazy-load all pages so each gets its own async chunk (code-splitting)
const Home = lazy(() => import('./pages/Home'));
const MapPage = lazy(() => import('./pages/MapPage'));
const TicketsPage = lazy(() => import('./pages/TicketsPage'));
const AssistantPage = lazy(() => import('./pages/AssistantPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

const CAROUSEL_ITEMS = [
  {
    id: "fan-1",
    title: "Vibrant Celebrations",
    description: "Spanish supporters bringing unmatched energy to the stadiums.",
    meta: "Supporters • Spain",
    imageSrc: "/fan_chat_1.jpg",
  },
  {
    id: "fan-2",
    title: "Albiceleste Passion",
    description: "Argentine fans singing and waving flags in massive crowds.",
    meta: "Supporters • Argentina",
    imageSrc: "/fan_chat_2.jpg",
  },
  {
    id: "fan-3",
    title: "Die Mannschaft Unity",
    description: "German fans cheering in unity with passion under stadium lights.",
    meta: "Supporters • Germany",
    imageSrc: "/fan_chat_3.jpg",
  },
  {
    id: "fan-4",
    title: "Navegadores Pride",
    description: "Portuguese fans celebrating historical match moments together.",
    meta: "Supporters • Portugal",
    imageSrc: "/fan_chat_4.jpg",
  },
];

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function RouteWrapper() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/map" element={<PageWrapper><MapPage /></PageWrapper>} />
        <Route path="/tickets" element={<PageWrapper><TicketsPage /></PageWrapper>} />
        <Route path="/assistant" element={<PageWrapper><AssistantPage /></PageWrapper>} />
        <Route path="/how-it-works" element={<PageWrapper><HowItWorksPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="relative w-screen min-h-screen overflow-x-hidden bg-[#050508] text-white font-sans">
          {/* Ambient glow blobs — always visible */}
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
          </div>

          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#0c0c12',
                color: '#f8fafc',
                border: '1px solid rgba(250,204,21,0.2)',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
              },
              success: {
                iconTheme: { primary: '#facc15', secondary: '#000' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />

          <NewsTicker />
          <Navigation />

          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
            </div>
          }>
            <RouteWrapper />
          </Suspense>

          <section className="relative z-10 w-full py-12 bg-[#050508] border-t border-white/5 flex flex-col items-center justify-center overflow-hidden">
            <FocusRail 
              items={CAROUSEL_ITEMS}
              autoPlay={true}
              interval={4000}
              loop={true}
              className="h-[500px]"
            />
          </section>

          {/* Footer with faded penalty box */}
          <footer className="relative w-full h-44 border-t border-white/5 bg-[#050508] overflow-hidden mt-12 flex items-center justify-center">
            <div className="absolute inset-0 flex justify-center pointer-events-none opacity-[0.03] select-none">
              <svg className="w-full max-w-4xl h-full" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="200" x2="800" y2="200" stroke="white" strokeWidth="2" />
                <rect x="200" y="50" width="400" height="150" stroke="white" strokeWidth="2" />
                <rect x="320" y="150" width="160" height="50" stroke="white" strokeWidth="2" />
                <circle cx="400" cy="110" r="4" fill="white" />
                <path d="M 340 50 A 70 70 0 0 1 460 50" stroke="white" strokeWidth="2" strokeDasharray="6,6" />
              </svg>
            </div>

            <div className="text-center relative z-10 text-[9px] font-mono tracking-[0.2em] text-white/20 uppercase select-none">
              © 2026 CHEERTRIBE · EVERY MATCH. ONE PLATFORM.
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
