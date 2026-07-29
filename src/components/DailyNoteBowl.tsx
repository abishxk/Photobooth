import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getDailyNote } from '../data/notes';
import stoolImg from '../assets/stool.png';
import paperImg from '../assets/paper.png';

// ── CRUMPLED PAPER NOTE OVERLAY ───────────────────────────────────────────────
function CrumpledNote({ note, onClose }: { note: string; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black md:bg-[#060402]/90"
      style={{
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
        className="relative mx-4 max-w-[700px] w-[95vw] sm:w-[85vw]"
        initial={{ scale: 0.2, rotate: -22, opacity: 0, y: 120 }}
        animate={{ scale: 1, rotate: ['-22deg', '5deg', '-2deg', '0.5deg'], opacity: 1, y: 0 }}
        exit={{ scale: 0.15, rotate: 24, opacity: 0, y: -90 }}
        transition={{ duration: 0.60, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => { e.stopPropagation(); onClose(); }}
      >
        <img 
          src={paperImg} 
          alt="Crumpled paper" 
          className="w-full h-auto"
          style={{
            filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.92)) drop-shadow(0 0 1px rgba(0,0,0,0.4))'
          }}
        />

        {/* Note text */}
        <div
          className="absolute inset-0"
          style={{ padding: '18% 12% 22%' }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <p
              className="font-vintage text-center text-[#1c1204] leading-relaxed"
              style={{
                fontSize: 'clamp(1.25rem, 6.5vw, 1.75rem)',
                fontStyle: 'italic',
                textShadow: '0 1px 2px rgba(255,244,210,0.4)',
              }}
            >
              {note}
            </p>
          </div>
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
            className="relative z-10"
            style={{
              width: 192,
              height: 'auto',
              display: 'block',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              // Strong directional shadow to the bottom-left mimicking reference
              filter: 'drop-shadow(-40px 20px 20px rgba(0,0,0,0.85))',
            }}
          />
        </motion.div>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <CrumpledNote
              note={noteRef.current ?? ''}
              onClose={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
