import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionProvider';
import PhotoBooth from './PhotoBooth';

/** ms to wait for the overlay to fully cover the screen before navigating */
const TRANSITION_MS = 320;

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
}

function RoomSceneBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. White & Black Tiled Wall (Upper 74% of scene) */}
      <div
        className="absolute top-0 left-0 right-0 h-[74%] bg-[#121212]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 35%, rgba(255, 235, 200, 0.15) 0%, rgba(0, 0, 0, 0.8) 85%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23111111'/%3E%3Crect x='1' y='1' width='38' height='38' fill='%23f4f1ea' rx='1'/%3E%3Crect x='41' y='1' width='38' height='38' fill='%231a1a1a' rx='1'/%3E%3Crect x='1' y='41' width='38' height='38' fill='%231a1a1a' rx='1'/%3E%3Crect x='41' y='41' width='38' height='38' fill='%23f4f1ea' rx='1'/%3E%3Cline x1='2' y1='2' x2='38' y2='2' stroke='%23ffffff' stroke-width='1' opacity='0.8'/%3E%3Cline x1='42' y1='42' x2='78' y2='42' stroke='%23ffffff' stroke-width='1' opacity='0.8'/%3E%3C/svg%3E")
          `,
        }}
      />

      {/* 2. Brass Wall Sconces */}
      <div className="absolute left-[12%] xl:left-[16%] top-[6%] z-10 hidden md:block">
        <div className="relative flex flex-col items-center">
          <div className="absolute -inset-6 bg-[#ffe58f] opacity-25 blur-xl rounded-full" />
          <div className="w-4 h-7 bg-[#8c6b32] rounded-sm shadow-md border border-[#5c421b]" />
          <div className="w-1.5 h-5 bg-[#c49b5c]" />
          <div className="w-9 h-7 bg-gradient-to-b from-[#fff2a3] to-[#d4a853] rounded-t-full shadow-[0_0_15px_rgba(255,229,143,0.6)] border border-[#ffec99]" />
        </div>
      </div>
      <div className="absolute right-[12%] xl:right-[16%] top-[6%] z-10 hidden md:block">
        <div className="relative flex flex-col items-center">
          <div className="absolute -inset-6 bg-[#ffe58f] opacity-25 blur-xl rounded-full" />
          <div className="w-4 h-7 bg-[#8c6b32] rounded-sm shadow-md border border-[#5c421b]" />
          <div className="w-1.5 h-5 bg-[#c49b5c]" />
          <div className="w-9 h-7 bg-gradient-to-b from-[#fff2a3] to-[#d4a853] rounded-t-full shadow-[0_0_15px_rgba(255,229,143,0.6)] border border-[#ffec99]" />
        </div>
      </div>

      {/* 3. Framed Vintage Paintings on Wall */}
      {/* Left Wall Painting */}
      <div className="absolute left-[2%] sm:left-[5%] md:left-[8%] top-[14%] z-10 hidden sm:block">
        <div className="relative p-2 bg-[#3b2713] border-2 border-[#5c3e1e] rounded-sm shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-3 h-5 border-l-2 border-r-2 border-[#8c6b32] border-t-2 rounded-t-full" />
          <div className="w-24 md:w-28 h-32 md:h-36 bg-[#1a1410] border border-[#2b1f0d] flex flex-col items-center justify-center p-2 text-center overflow-hidden">
            <svg width="50" height="60" viewBox="0 0 60 70" fill="none">
              <circle cx="30" cy="25" r="14" fill="#c49b5c" opacity="0.75" />
              <path d="M 12 65 Q 30 40 48 65 Z" fill="#c49b5c" opacity="0.75" />
            </svg>
            <span className="font-vintage text-[9px] text-[#a37e3d] tracking-widest uppercase mt-1">1954 ARCHIVE</span>
          </div>
        </div>
      </div>

      {/* Right Wall Painting */}
      <div className="absolute right-[2%] sm:right-[5%] md:right-[8%] top-[16%] z-10 hidden sm:block">
        <div className="relative p-2 bg-[#2b1f0d] border-2 border-[#4a3617] rounded-sm shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-3 h-5 border-l-2 border-r-2 border-[#8c6b32] border-t-2 rounded-t-full" />
          <div className="w-24 md:w-28 h-32 md:h-36 bg-[#0f1412] border border-[#1f2b26] flex flex-col items-center justify-center p-2 text-center overflow-hidden">
            <svg width="50" height="50" viewBox="0 0 60 60" fill="none">
              <rect x="10" y="20" width="40" height="30" rx="3" stroke="#8ca396" strokeWidth="2" />
              <circle cx="30" cy="35" r="10" stroke="#8ca396" strokeWidth="2" />
              <rect x="38" y="14" width="8" height="6" fill="#8ca396" />
            </svg>
            <span className="font-vintage text-[9px] text-[#8ca396] tracking-widest uppercase mt-1">PATENT N° 402</span>
          </div>
        </div>
      </div>

      {/* 4. Wooden Baseboard Skirting Mold Trim Line */}
      <div className="absolute top-[74%] left-0 right-0 h-3 bg-gradient-to-b from-[#3b2713] via-[#1a0f05] to-[#070301] border-t border-[#543b1c] shadow-[0_4px_12px_rgba(0,0,0,0.9)] z-10" />

      {/* 5. Plain Floor (Lower 26% of scene) */}
      <div className="absolute top-[74%] left-0 right-0 bottom-0 bg-gradient-to-b from-[#1c1c1c] via-[#121212] to-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-30" />
      </div>

      {/* 6. Potted Monstera Plant on Floor (Left) */}
      <div className="absolute left-[2%] sm:left-[6%] bottom-[4%] z-20 hidden xs:block">
        <svg width="90" height="150" viewBox="0 0 110 180" fill="none">
          <ellipse cx="55" cy="172" rx="40" ry="8" fill="#000" opacity="0.6" />
          <path d="M 32 120 L 40 168 Q 55 172 70 168 L 78 120 Z" fill="#b85d38" />
          <path d="M 28 112 L 82 112 L 80 122 L 30 122 Z" fill="#9e4c2b" />
          <ellipse cx="55" cy="112" rx="27" ry="5" fill="#7d3b1f" />
          <path d="M 55 112 Q 45 70 20 45" stroke="#2d5a27" strokeWidth="4" strokeLinecap="round" />
          <path d="M 55 112 Q 60 65 85 35" stroke="#2d5a27" strokeWidth="4" strokeLinecap="round" />
          <path d="M 55 112 Q 55 50 50 15" stroke="#376930" strokeWidth="4" strokeLinecap="round" />
          <path d="M 20 45 Q 5 20 30 10 Q 40 30 20 45 Z" fill="#387a32" />
          <path d="M 85 35 Q 105 15 80 5 Q 70 20 85 35 Z" fill="#2d6328" />
          <path d="M 50 15 Q 30 -5 60 -10 Q 65 5 50 15 Z" fill="#448c3d" />
        </svg>
      </div>

      {/* 7. Vintage Brass Standing Sign on Floor (Right) */}
      <div className="absolute right-[3%] sm:right-[7%] bottom-[5%] z-20 hidden xs:block">
        <svg width="60" height="130" viewBox="0 0 70 150" fill="none">
          <ellipse cx="35" cy="144" rx="25" ry="5" fill="#000" opacity="0.6" />
          <path d="M 15 144 L 55 144 L 45 138 L 25 138 Z" fill="#8c6b32" />
          <rect x="33" y="45" width="4" height="95" fill="#8c6b32" />
          <ellipse cx="35" cy="35" rx="30" ry="20" fill="#2b1f0d" stroke="#c49b5c" strokeWidth="2" />
          <text x="35" y="38" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="8" fill="#d4a853" fontWeight="bold" letterSpacing="1">SMILE!</text>
        </svg>
      </div>

      {/* 8. Grounding Shadow beneath Photo Booth */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[71%] w-[380px] sm:w-[440px] h-14 rounded-full bg-black/85 blur-xl z-10" />
    </div>
  );
}

export default function LandingPage() {
  const { goSettings, navState, setNavState } = useSession();
  const [isEntering, setIsEntering] = useState(false);

  // Did we arrive here by exiting the booth (result → landing)?
  const fromBooth = navState === 'exiting-booth';
  useEffect(() => {
    if (fromBooth) setNavState(null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEnter = async () => {
    if (isEntering) return;
    setIsEntering(true);
    // Wait for the overlay to cover the screen, THEN navigate.
    // This is GPU-friendly: only opacity is animated — no large texture scaling.
    await sleep(TRANSITION_MS);
    goSettings();
  };

  return (
    <motion.div
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      // Entrance: simple fade-up on first load OR on returning from booth
      initial={{ opacity: 0, y: fromBooth ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <RoomSceneBackground />

      {/* ── PHOTOBOOTH (click / tap target) ── */}
      <motion.button
        className="relative w-full focus:outline-none"
        style={{
          maxWidth: 420,
          padding: '0 12px',
          cursor: isEntering ? 'default' : 'pointer',
          WebkitTapHighlightColor: 'transparent',
          background: 'none',
          border: 'none',
          // Nudge very slightly on entry — cheap, GPU-friendly
          transformOrigin: '50% 45%',
        }}
        // On entering: barely perceptible zoom nudge — cheap to render
        animate={isEntering ? { scale: 1.06, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: TRANSITION_MS / 1000, ease: 'easeIn' }}
        onClick={handleEnter}
        whileHover={isEntering ? {} : { scale: 1.02, transition: { duration: 0.22 } }}
        whileTap={isEntering ? {} : { scale: 0.97, transition: { duration: 0.1 } }}
        aria-label="Tap to enter the photo booth"
      >
        {/* Pulsing glow ring */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #d4a853 0%, transparent 68%)' }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <PhotoBooth showLive={false} />
      </motion.button>

      {/* ── TAP TO ENTER CTA ── */}
      <motion.div
        className="relative mt-2 text-center select-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isEntering ? 0 : 1, y: 0 }}
        transition={{ delay: fromBooth ? 0.1 : 0.35, duration: 0.4 }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-center gap-1 mb-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M10 16 L10 4 M4 10 L10 4 L16 10" stroke="#d4a853" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="font-vintage text-2xl font-bold text-sepia-200">
              Tap to enter
            </p>
          </div>
        </motion.div>

      </motion.div>

      {/* Ambient particles instead of cute decorations */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.5 }}>
        {/* We just removed the PageDecorations entirely for the moody look */}
      </div>

      {/* ── ENTER OVERLAY (opacity-only — GPU compositor, zero rasterisation cost) ── */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            key="enter-overlay"
            className="fixed inset-0 pointer-events-none"
            style={{
              background: '#0a0a0a',
              zIndex: 100,
              // Force GPU compositing — prevents paint during animation
              willChange: 'opacity',
              transform: 'translateZ(0)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: TRANSITION_MS / 1000, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
