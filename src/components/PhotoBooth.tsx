import { forwardRef } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionProvider';
import boothImg from '../assets/booth.png';

interface PhotoBoothProps {
  showLive?: boolean;
}

/**
 * 1950s Photoautomat - Fully Wooden Vintage Build.
 * Features textured wood grain framing, eliminating metallic elements 
 * for an authentic, premium wooden aesthetic.
 */
const PhotoBooth = forwardRef<Webcam, PhotoBoothProps>(
  ({ showLive = false }, ref) => {
    const { settings } = useSession();

    const videoConstraints = {
      width: { ideal: 1280 },
      height: { ideal: 960 },
      facingMode: 'user',
    };

    return (
      <div className="relative flex items-center justify-center w-full select-none">
        <motion.div
          className="relative w-full"
          style={{ maxWidth: 380 }}
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <img
            src={boothImg}
            alt="Vintage Wooden Photoautomat"
            className="w-full pointer-events-none relative z-10"
            style={{ 
              display: 'block', 
              width: '100%', 
              height: 'auto',
              // Strong directional shadow to the bottom-right
              filter: 'drop-shadow(80px 40px 30px rgba(0,0,0,0.85))'
            }}
          />
          {/* ── LIVE WEBCAM ── */}
          {showLive && (
            <div
              style={{
                position: 'absolute',
                left: '30.88%',
                top: '32.6%',
                width: '38.23%',
                height: '63.04%',
                overflow: 'hidden',
                borderRadius: 4,
              }}
            >
              <Webcam
                ref={ref}
                audio={false}
                videoConstraints={videoConstraints}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.95}
                mirrored={true}
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: settings.colorMode === 'monochrome' ? 'grayscale(100%)' : 'none',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(5,2,1,0.7) 100%)',
                pointerEvents: 'none',
                borderRadius: 4,
                boxShadow: 'inset 0px 4px 12px rgba(0,0,0,0.9)'
              }} />
            </div>
          )}
        </motion.div>
      </div>
    );
  }
);

PhotoBooth.displayName = 'PhotoBooth';
export default PhotoBooth;
