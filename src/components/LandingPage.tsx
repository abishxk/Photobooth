import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionProvider';
import PhotoBooth from './PhotoBooth';
import DailyNoteJar from './DailyNoteBowl';
import bgwallImg from '../assets/newbgwall.png';
import floorImg from '../assets/newfloor.png';

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
        className="absolute top-0 left-0 right-0 h-[74%] bg-[#121212] bg-tiles"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 35%, rgba(255, 235, 200, 0.15) 0%, rgba(0, 0, 0, 0.8) 85%),
            url("${bgwallImg}")
          `,
          backgroundSize: '100% 100%, auto auto',
        }}
      />


      {/* 3. Floor Image (Lower 26% of scene) */}
      <div 
        className="absolute top-[74%] left-0 right-0 bottom-0 bg-[#0a0a0a]"
        style={{
          backgroundImage: `
            linear-gradient(to top, transparent, rgba(255,255,255,0.05)),
            url("${floorImg}")
          `,
          backgroundSize: '100% 100%, auto auto',
        }}
      />

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

      {/* ── PHOTOBOOTH + STOOL COMPOSITION ── */}
      {/*
        On phones: scale to 75% anchored at the bottom so the booth stays
        grounded. The negative margin-top collapses the 25% of empty space
        that CSS scaling leaves above the element.
        On md+ (≥768 px): full size, stool appears to the left overlapping slightly.
      */}
      <style>{`
        .bg-tiles {
          background-position: calc(50% + 80px) bottom, calc(50% + 80px) bottom !important;
        }
        .grounding-shadow {
          left: calc(50% + 80px) !important;
          transform: translateX(-50%) !important;
        }
        /* LAPTOP & DESKTOP (Default) */
        .scene-wrapper {
          transform: scale(0.95);
          margin-top: -40px;
        }
        @media (max-width: 767px) {
          .bg-tiles {
            background-position: calc(50% + 35px) bottom, calc(50% + 35px) bottom !important;
          }
          .scene-wrapper {
            transform: scale(0.70);
            margin-top: 0px !important;
            margin-left: 80px !important;
          }
          .daily-note-stool {
            left: -150px !important;
            bottom: -20px !important;
            z-index: 30 !important;
          }
          .cta-label {
            top: 3rem !important;
          }
        }
      `}</style>

      {/* Wrapper gives us a positioned context so the stool can overlap */}
      <div className="scene-wrapper relative z-10" style={{ width: '100%', maxWidth: 420, marginLeft: '80px' }}>

        {/* ── DAILY NOTE STOOL ── */}
        <motion.div
          className="absolute z-20 daily-note-stool"
          style={{ left: '-160px', bottom: '-26px' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isEntering ? 0 : 1, y: 0 }}
          transition={{ delay: fromBooth ? 0.12 : 0.50, duration: 0.50, ease: 'easeOut' }}
        >
          <DailyNoteJar />
        </motion.div>

        <motion.button
        className="photobooth-btn relative w-full focus:outline-none"
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

      </div> {/* end photobooth wrapper */}

      {/* ── TAP TO ENTER CTA ── */}
      <motion.div
        className="cta-label relative mt-2 text-center select-none"
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
