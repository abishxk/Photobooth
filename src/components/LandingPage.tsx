import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionProvider';
import PhotoBooth from './PhotoBooth';
import DailyNoteJar from './DailyNoteBowl';
// Using unified scene
import bgsceneImg from '../assets/tryscene.png';

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
      {/* ── UNIFIED SCENE CONTAINER ── */}
      {/* This container locks to the 3:2 aspect ratio and scales to cover the viewport. */}
      <style>{`
        :root {
          /* --- DESKTOP OVERLAY BASE SETTINGS --- */
          --stool-left: 20.75%;
          --stool-top: 64.40%;
          --stool-width: 26%;

          --booth-left: 30.5%;
          --booth-top: 34.5%;
          --booth-width: 44.25%;
        }

        
        .scene-scaler {
          /* Desktop/Landscape: Anchor to the bottom center (floor fully visible, ceiling cropped) */
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        @media (max-aspect-ratio: 1/1) {
          /* --- MOBILE OVERLAY TWEAKS --- */
          /* NOTE: The room background has the booth/stool baked into it!
             Tweaking these variables changes the interactive overlays ONLY. */
          :root {
            /* 1. SCENE ZOOM (Zoom the entire room in/out) */
            --mobile-scene-scale: 1.0; /* Decrease this to make everything smaller on mobile */
            --mobile-scene-x: -47.75%; /* Move the entire room left/right */
            --mobile-scene-y: -50%;    /* Move the entire room up/down */

            /* 2. STOOL OVERLAY ADJUSTMENTS */
            /* reset to perfectly match the baked background */
            --mobile-stool-scale: 1.0; /* adjust here */
            --mobile-stool-x: 0%;      /* adjust here */
            --mobile-stool-y: 0%;      /* adjust here */

            /* 3. BOOTH OVERLAY ADJUSTMENTS */
            /* reset to perfectly match the baked background */
            --mobile-booth-scale: 0.70 /* adjust here */
            --mobile-booth-x: 0%;      /* adjust here */
            --mobile-booth-y: 0%;      /* adjust here */
          }

          .scene-scaler {
            bottom: auto;
            top: 50%;
            left: 50%;
            transform: translate(var(--mobile-scene-x), var(--mobile-scene-y)) scale(var(--mobile-scene-scale));
          }
          
          .mobile-stool {
            transform-origin: bottom center;
            transform: scale(var(--mobile-stool-scale)) translate(var(--mobile-stool-x), var(--mobile-stool-y));
          }
          
          .mobile-booth {
            transform-origin: top center;
            transform: scale(var(--mobile-booth-scale)) translate(var(--mobile-booth-x), var(--mobile-booth-y));
          }
        }
      `}</style>
      <div
        className="absolute inset-0 overflow-hidden z-0 pointer-events-none"
      >
        <div
          className="scene-scaler absolute pointer-events-auto"
          style={{
            // 2192 / 1461 = 1.5003
            aspectRatio: '2192 / 1461',
            minWidth: '100vw',
            minHeight: '100dvh',
            width: 'max(100vw, calc(100dvh * 1.5003))',
            height: 'max(100dvh, calc(100vw / 1.5003))',
            flexShrink: 0,
          }}
        >
          {/* Base baked scene */}
          <img
            src={bgsceneImg}
            alt="Room scene"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          />


          {/* Interactive Stool Overlay */}
          <div
            className="absolute z-20 mobile-stool"
            style={{
              left: 'var(--stool-left)',
              top: 'var(--stool-top)',
              width: 'var(--stool-width)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isEntering ? 0 : 1, y: 0 }}
              transition={{ delay: fromBooth ? 0.12 : 0.50, duration: 0.50, ease: 'easeOut' }}
            >
              <DailyNoteJar />
            </motion.div>
          </div>

          {/* Interactive Booth Overlay */}
          <div
            className="absolute z-10 mobile-booth"
            style={{
              left: 'var(--booth-left)',
              top: 'var(--booth-top)',
              width: 'var(--booth-width)',
            }}
          >
            <motion.button
              className="relative w-full focus:outline-none block"
              style={{
                cursor: isEntering ? 'default' : 'pointer',
                WebkitTapHighlightColor: 'transparent',
                background: 'none',
                border: 'none',
                transformOrigin: '50% 50%',
              }}
              animate={isEntering ? { scale: 1.06, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: TRANSITION_MS / 1000, ease: 'easeIn' }}
              onClick={handleEnter}
              whileHover={isEntering ? {} : { scale: 1.02, transition: { duration: 0.22 } }}
              whileTap={isEntering ? {} : { scale: 0.97, transition: { duration: 0.1 } }}
              aria-label="Tap to enter the photo booth"
            >
              <PhotoBooth showLive={false} />
            </motion.button>
          </div>

          {/* Tap to enter CTA over the booth */}
          <motion.div
            className="absolute z-30 pointer-events-none select-none w-full flex justify-center top-[82%] md:top-[90%]"
            style={{ left: '0%' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isEntering ? 0 : 1, y: 0 }}
            transition={{ delay: fromBooth ? 0.1 : 0.35, duration: 0.4 }}
          >
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <div className="flex flex-col items-center gap-1">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M10 16 L10 4 M4 10 L10 4 L16 10" stroke="#d4a853" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="font-vintage text-2xl font-bold text-[#d4a853] drop-shadow-md">
                  Tap to enter
                </p>
              </div>
            </motion.div>
          </motion.div>


        </div>
      </div>

      {/* ── ENTER OVERLAY ── */}
      <AnimatePresence>
        {isEntering && (
          <motion.div
            key="enter-overlay"
            className="fixed inset-0 pointer-events-none"
            style={{
              background: '#0a0a0a',
              zIndex: 100,
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
