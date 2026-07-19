import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionProvider';
import PhotoBooth from './PhotoBooth';
import PageDecorations from './PageDecorations';

/** ms to wait for the overlay to fully cover the screen before navigating */
const TRANSITION_MS = 320;

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
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
      className="min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-paper-100"
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
      {/* ── AMBIENT BACKGROUND GLOWS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {[
          { x: '8%',  y: '12%', size: 140, delay: 0   },
          { x: '80%', y: '7%',  size: 100, delay: 0.4 },
          { x: '5%',  y: '76%', size: 110, delay: 0.8 },
          { x: '84%', y: '80%', size: 95,  delay: 0.2 },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: dot.x, top: dot.y,
              width: dot.size, height: dot.size,
              background: 'radial-gradient(circle, #F4C0D8 0%, transparent 70%)',
              opacity: 0.2,
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.28, 0.2] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: dot.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

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
          style={{ background: 'radial-gradient(ellipse, #F9CEDF 0%, transparent 68%)' }}
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
              <path d="M10 16 L10 4 M4 10 L10 4 L16 10" stroke="#E8639B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="font-handwritten text-2xl font-bold text-ink-900">
              Tap to enter
            </p>
          </div>
        </motion.div>
        <motion.p
          className="text-ink-600 text-xs font-sans"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Tap the booth to start your session
        </motion.p>
      </motion.div>

      {/* ── SHARED FLOATING DECORATIONS ── */}
      <PageDecorations intensity={0.75} />

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
