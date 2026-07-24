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
        className="absolute top-0 left-0 right-0 h-[74%] bg-[#141414]"
        style={{
          backgroundImage: `
            /* Soft overhead ambient light wash from ceiling */
            radial-gradient(ellipse 130% 80% at 50% 0%, rgba(255, 230, 185, 0.22) 0%, rgba(180, 130, 70, 0.08) 50%, rgba(5, 2, 1, 0.78) 100%),
            /* Warm spotlight glow behind photobooth header */
            radial-gradient(circle at 50% 28%, rgba(212, 168, 83, 0.2) 0%, transparent 65%),
            /* Tiled wall SVG pattern */
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23111111'/%3E%3Crect x='1' y='1' width='38' height='38' fill='%23f4f1ea' rx='1'/%3E%3Crect x='41' y='1' width='38' height='38' fill='%231a1a1a' rx='1'/%3E%3Crect x='1' y='41' width='38' height='38' fill='%231a1a1a' rx='1'/%3E%3Crect x='41' y='41' width='38' height='38' fill='%23f4f1ea' rx='1'/%3E%3Cline x1='2' y1='2' x2='38' y2='2' stroke='%23ffffff' stroke-width='1' opacity='0.8'/%3E%3Cline x1='42' y1='42' x2='78' y2='42' stroke='%23ffffff' stroke-width='1' opacity='0.8'/%3E%3C/svg%3E")
          `,
          backgroundPosition: 'center bottom, center bottom, center bottom',
          backgroundSize: '100% 100%, 100% 100%, 80px 80px',
        }}
      />

      {/* 2. Wooden Baseboard Skirting Mold Trim Line */}
      <div className="absolute top-[74%] left-0 right-0 h-3.5 bg-gradient-to-b from-[#3d2712] via-[#211408] to-[#0a0502] border-t border-[#5e3f1b] shadow-[0_4px_14px_rgba(0,0,0,0.92)] z-10" />

      {/* 3. Plain Floor (Lower 26% of scene) */}
      <div
        className="absolute top-[74%] left-0 right-0 bottom-0 bg-[#161412]"
        style={{
          backgroundImage: `
            /* Warm light pool on floor in front of photobooth */
            radial-gradient(ellipse 75% 65% at 50% 0%, rgba(212, 168, 83, 0.16) 0%, transparent 80%),
            /* Linear floor shadow depth gradient */
            linear-gradient(to bottom, #1d1916 0%, #13100e 55%, #080706 100%)
          `,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.02] to-white/[0.05] opacity-40" />
      </div>

      {/* 4. Multi-layer Natural Ground Contact Shadows under Photo Booth */}
      {/* Tight sharp contact shadow */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[72.5%] w-[330px] sm:w-[380px] h-4 rounded-full bg-black/95 blur-sm z-10" />
      {/* Soft ambient occlusion shadow pool */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[70.5%] w-[420px] sm:w-[490px] h-16 rounded-full bg-black/75 blur-xl z-10" />
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
