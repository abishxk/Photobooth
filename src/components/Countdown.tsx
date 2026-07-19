import { AnimatePresence, motion } from 'framer-motion';

interface CountdownProps {
  value: number;
  isActive: boolean;
  photoIndex: number;
  totalPhotos: number;
}

export default function Countdown({ value, isActive, photoIndex, totalPhotos }: CountdownProps) {
  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-900/45 backdrop-blur-sm" />

      <div className="relative flex flex-col items-center gap-5">
        {/* Photo index */}
        <motion.div
          key={`label-${photoIndex}`}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-handwritten text-2xl text-paper-100 tracking-wide"
        >
          Photo {photoIndex} of {totalPhotos}
        </motion.div>

        {/* Number or "Smile" icon */}
        <AnimatePresence mode="wait">
          {value > 0 ? (
            <motion.div
              key={`count-${value}-${photoIndex}`}
              initial={{ scale: 0.2, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              className="font-handwritten font-bold text-center leading-none select-none"
              style={{
                fontSize: 'clamp(100px, 20vw, 160px)',
                color: '#d4a853',
                textShadow: '3px 5px 0px rgba(26,18,9,0.3)',
                lineHeight: 1,
              }}
            >
              {value}
            </motion.div>
          ) : (
            <motion.div
              key="smile-star"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              className="flex flex-col items-center gap-2"
            >
              {/* CSS smiley — no emoji */}
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  background: '#d4a853',
                  position: 'relative',
                  boxShadow: '3px 5px 0px rgba(26,18,9,0.3)',
                }}
              >
                {/* Eyes */}
                <div style={{ position: 'absolute', top: 26, left: 22, width: 12, height: 12, borderRadius: '50%', background: '#2c2018' }} />
                <div style={{ position: 'absolute', top: 26, right: 22, width: 12, height: 12, borderRadius: '50%', background: '#2c2018' }} />
                {/* Smile */}
                <div style={{
                  position: 'absolute',
                  bottom: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 44,
                  height: 22,
                  borderBottomLeftRadius: 22,
                  borderBottomRightRadius: 22,
                  borderBottom: '4px solid #2c2018',
                  borderLeft: '4px solid #2c2018',
                  borderRight: '4px solid #2c2018',
                }} />
              </div>
              <div className="font-handwritten text-3xl text-paper-100 font-semibold">
                Smile! ✦
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dot progress */}
        <div className="flex gap-3 mt-1">
          {Array.from({ length: totalPhotos }).map((_, i) => {
            const num = i + 1;
            return (
              <div
                key={num}
                className={`rounded-full transition-all duration-300 ${
                  num < photoIndex
                    ? 'bg-amber-vintage w-3 h-3'
                    : num === photoIndex
                    ? 'bg-paper-100 w-3.5 h-3.5 scale-110'
                    : 'bg-paper-100/30 w-2.5 h-2.5'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
