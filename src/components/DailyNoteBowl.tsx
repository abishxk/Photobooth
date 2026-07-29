import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDailyNote } from '../data/notes';
import stoolImg from '../assets/stool.png';

// ── CRUMPLED PAPER NOTE OVERLAY ───────────────────────────────────────────────
function CrumpledNote({ note, onClose }: { note: string; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background: 'rgba(6,4,2,0.90)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        cursor: 'pointer',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="relative mx-8 max-w-[320px] w-full"
        initial={{ scale: 0.2, rotate: -22, opacity: 0, y: 120 }}
        animate={{ scale: 1, rotate: ['-22deg', '5deg', '-2deg', '0.5deg'], opacity: 1, y: 0 }}
        exit={{ scale: 0.15, rotate: 24, opacity: 0, y: -90 }}
        transition={{ duration: 0.60, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => { e.stopPropagation(); onClose(); }}
      >
        {/* Crumpled paper SVG — unruled */}
        <svg
          viewBox="0 0 300 280"
          className="w-full"
          style={{
            filter:
              'drop-shadow(0 32px 64px rgba(0,0,0,0.92)) drop-shadow(0 0 1px rgba(0,0,0,0.4))',
          }}
        >
          <defs>
            <radialGradient id="pgBase" cx="44%" cy="36%" r="72%">
              <stop offset="0%"   stopColor="#F8F0DC" />
              <stop offset="38%"  stopColor="#EFDFBE" />
              <stop offset="72%"  stopColor="#E2CCA0" />
              <stop offset="100%" stopColor="#D4B885" />
            </radialGradient>
            <radialGradient id="crA" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(0,0,0,0.14)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <radialGradient id="crB" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <radialGradient id="crC" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(0,0,0,0.10)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          {/* Main irregular crumpled outline */}
          <polygon
            points="
              14,38  32,10  60,4   96,14  130,6  164,2
              198,10 230,5  260,16 288,7  298,28
              294,56 300,90 296,124 300,158
              294,192 298,222 288,256 270,272
              234,278 196,272 158,278 120,272 82,276
              44,268 16,252 4,220 12,188 2,156
              8,122  2,90   8,60
            "
            fill="url(#pgBase)"
          />

          {/* Shadow pockets */}
          <ellipse cx="150" cy="140" rx="62" ry="44" fill="url(#crA)" />
          <ellipse cx="258" cy="58"  rx="36" ry="25" fill="url(#crA)" />
          <ellipse cx="62"  cy="230" rx="34" ry="24" fill="url(#crC)" />
          <ellipse cx="38"  cy="130" rx="28" ry="42" fill="url(#crC)" />
          <ellipse cx="270" cy="220" rx="28" ry="20" fill="url(#crA)" />

          {/* Raised highlights */}
          <ellipse cx="72"  cy="52"  rx="48" ry="30" fill="url(#crB)" />
          <ellipse cx="240" cy="200" rx="32" ry="22" fill="url(#crB)" />

          {/* Crease lines */}
          <line x1="14"  y1="38"  x2="288" y2="256" stroke="#B89A52" strokeWidth="1.1" opacity="0.28" />
          <line x1="298" y1="28"  x2="4"   y2="220" stroke="#B08E4A" strokeWidth="0.9" opacity="0.26" />
          <line x1="32"  y1="10"  x2="270" y2="272" stroke="#C0A560" strokeWidth="0.7" opacity="0.20" />
          <line x1="164" y1="2"   x2="158" y2="278" stroke="#B89A52" strokeWidth="0.8" opacity="0.18" />
          <line x1="2"   y1="90"  x2="300" y2="182" stroke="#B08E4A" strokeWidth="0.7" opacity="0.17" />
          <line x1="8"   y1="182" x2="294" y2="92"  stroke="#C0A560" strokeWidth="0.6" opacity="0.15" />
          <line x1="58"  y1="28"  x2="96"  y2="56"  stroke="#A88A42" strokeWidth="0.7" opacity="0.22" />
          <line x1="220" y1="18"  x2="256" y2="52"  stroke="#A88A42" strokeWidth="0.6" opacity="0.20" />
          <line x1="38"  y1="175" x2="82"  y2="212" stroke="#B09450" strokeWidth="0.6" opacity="0.20" />
          <line x1="240" y1="215" x2="284" y2="198" stroke="#A88A42" strokeWidth="0.6" opacity="0.18" />
          <line x1="136" y1="5"   x2="112" y2="52"  stroke="#B09450" strokeWidth="0.6" opacity="0.18" />
          <line x1="192" y1="7"   x2="210" y2="56"  stroke="#A88A42" strokeWidth="0.5" opacity="0.16" />
          <line x1="76"  y1="96"  x2="124" y2="112" stroke="#BCA260" strokeWidth="0.5" opacity="0.16" />
          <line x1="200" y1="76"  x2="238" y2="96"  stroke="#BCA260" strokeWidth="0.5" opacity="0.16" />
          <line x1="68"  y1="186" x2="116" y2="176" stroke="#B69A58" strokeWidth="0.5" opacity="0.14" />

          {/* Folded corner flaps */}
          <polygon points="260,16 298,28 280,54 248,34" fill="rgba(0,0,0,0.065)" />
          <line x1="260" y1="16" x2="280" y2="54" stroke="#A88A42" strokeWidth="0.9" opacity="0.40" />
          <polygon points="44,268 4,220 32,208 50,252"  fill="rgba(0,0,0,0.055)" />
          <line x1="44"  y1="268" x2="32" y2="208" stroke="#A88A42" strokeWidth="0.8" opacity="0.36" />
          <polygon points="32,10 62,4 56,34 24,36" fill="rgba(255,255,255,0.09)" />

          {/* Edge stroke */}
          <polygon
            points="
              14,38  32,10  60,4   96,14  130,6  164,2
              198,10 230,5  260,16 288,7  298,28
              294,56 300,90 296,124 300,158
              294,192 298,222 288,256 270,272
              234,278 196,272 158,278 120,272 82,276
              44,268 16,252 4,220 12,188 2,156
              8,122  2,90   8,60
            "
            fill="none"
            stroke="#A88A42"
            strokeWidth="1.4"
            opacity="0.35"
          />
        </svg>

        {/* Note text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ padding: '18% 12% 22%' }}
        >
          <p
            className="font-vintage text-center text-[#2c1a06] leading-loose"
            style={{
              fontSize: 'clamp(0.90rem, 3.8vw, 1.12rem)',
              fontStyle: 'italic',
              textShadow: '0 1px 4px rgba(255,244,210,0.55)',
            }}
          >
            {note}
          </p>

          <motion.p
            className="mt-6 font-vintage text-[8px] tracking-[0.32em] text-[#9a7838] uppercase select-none"
            animate={{ opacity: [0.35, 0.85, 0.35] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          >
            tap to close
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function DailyNoteJar() {
  const [isOpen, setIsOpen] = useState(false);
  const noteRef = useRef<string | null>(null);

  const handleOpen = () => {
    if (!noteRef.current) noteRef.current = getDailyNote();
    setIsOpen(true);
  };

  return (
    <>
      <motion.div
        className="select-none"
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        onClick={handleOpen}
        role="button"
        aria-label="Open your daily note"
      >
        <img
          src={stoolImg}
          alt="Daily note jar on stool"
          draggable={false}
          style={{
            width: 192,
            height: 'auto',
            display: 'block',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.70))',
          }}
        />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <CrumpledNote
            note={noteRef.current ?? ''}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
