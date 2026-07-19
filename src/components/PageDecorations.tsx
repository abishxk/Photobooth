/**
 * PageDecorations — shared ambient floating stars, hearts, and dots
 * used across all pages to create visual consistency.
 * Intentionally subtle: low opacity, small size, slow animation.
 */
import { motion } from 'framer-motion';

const STARS = [
  { x: '6%',  y: '14%', size: 14, delay: 0,   rot: 18  },
  { x: '88%', y: '11%', size: 11, delay: 0.7, rot: -14 },
  { x: '4%',  y: '78%', size: 13, delay: 1.2, rot: 10  },
  { x: '90%', y: '82%', size: 16, delay: 0.3, rot: -22 },
  { x: '50%', y: '5%',  size: 10, delay: 0.9, rot: 20  },
];

const HEARTS = [
  { x: '3%',  y: '48%', delay: 0.5 },
  { x: '91%', y: '44%', delay: 1.3 },
  { x: '48%', y: '93%', delay: 0.8 },
];

const DOTS = [
  { x: '15%', y: '8%',  size: 5, delay: 0.4 },
  { x: '78%', y: '6%',  size: 4, delay: 1.0 },
  { x: '8%',  y: '88%', size: 5, delay: 0.2 },
  { x: '85%', y: '90%', size: 4, delay: 0.6 },
  { x: '92%', y: '50%', size: 3, delay: 1.5 },
  { x: '2%',  y: '30%', size: 3, delay: 1.8 },
];

interface PageDecorationsProps {
  /** 0–1. Default 0.5 — controls how visible decorations are */
  intensity?: number;
}

export default function PageDecorations({ intensity = 0.5 }: PageDecorationsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Stars */}
      {STARS.map((s, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute"
          style={{ left: s.x, top: s.y }}
          animate={{
            rotate: [0, s.rot, 0],
            scale: [1, 1.18, 1],
            opacity: [0.35 * intensity, 0.75 * intensity, 0.35 * intensity],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
        >
          <svg width={s.size} height={s.size} viewBox="0 0 20 20" fill="none">
            <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="#F5C842"/>
          </svg>
        </motion.div>
      ))}

      {/* Hearts */}
      {HEARTS.map((h, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute"
          style={{ left: h.x, top: h.y }}
          animate={{
            y: [0, -7, 0],
            opacity: [0.3 * intensity, 0.6 * intensity, 0.3 * intensity],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: h.delay }}
        >
          <svg width="16" height="14" viewBox="0 0 18 16" fill="none">
            <path d="M9 15 C9 15 1 9.5 1 4.5 C1 2 3 0 5.5 0 C7 0 8.2 0.8 9 2 C9.8 0.8 11 0 12.5 0 C15 0 17 2 17 4.5 C17 9.5 9 15 9 15Z" fill="#FF8AB0"/>
          </svg>
        </motion.div>
      ))}

      {/* Small dots */}
      {DOTS.map((d, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute rounded-full bg-amber-vintage"
          style={{ left: d.x, top: d.y, width: d.size, height: d.size }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.25 * intensity, 0.5 * intensity, 0.25 * intensity],
          }}
          transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: d.delay }}
        />
      ))}
    </div>
  );
}
