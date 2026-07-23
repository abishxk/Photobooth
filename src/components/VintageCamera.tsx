import { forwardRef } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionProvider';

interface VintageCameraProps {
  showLive?: boolean;
  isFlashing?: boolean;
}

const VintageCamera = forwardRef<Webcam, VintageCameraProps>(
  ({ showLive = false, isFlashing = false }, ref) => {
    const { settings } = useSession();

    const videoConstraints = {
      width: { ideal: 1280 },
      height: { ideal: 960 },
      facingMode: 'user',
    };

    return (
      <div className="relative flex items-center justify-center w-full select-none">
        {/* Flash overlay */}
        {isFlashing && <div className="flash-overlay" />}

        <motion.div
          className="relative"
          style={{ width: '100%', maxWidth: 480 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <svg
            viewBox="0 0 480 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full drop-shadow-2xl"
            aria-label="Vintage photo booth camera illustration"
          >
            <defs>
              <clipPath id="lensClip">
                <ellipse cx="240" cy="248" rx="116" ry="116" />
              </clipPath>
            </defs>

            {/* Camera body */}
            <rect x="48" y="120" width="384" height="340" rx="36" fill="#2c2018" />
            <rect x="48" y="120" width="384" height="340" rx="36" fill="none" stroke="#1a1209" strokeWidth="4" strokeLinejoin="round" />

            {/* Strap loop */}
            <path d="M160 120 Q160 60 240 60 Q320 60 320 120" stroke="#2c2018" strokeWidth="28" strokeLinecap="round" fill="none" />
            <path d="M160 120 Q160 60 240 60 Q320 60 320 120" stroke="#3d2e1f" strokeWidth="22" strokeLinecap="round" fill="none" />
            <path d="M165 108 Q165 65 240 65 Q315 65 315 108" stroke="#5a4433" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="6 4" />

            {/* Camera top strip */}
            <rect x="48" y="110" width="384" height="30" rx="10" fill="#3d2e1f" />

            {/* Flash */}
            <rect x="72" y="122" width="50" height="28" rx="8" fill="#d4a853" />
            <rect x="72" y="122" width="50" height="28" rx="8" stroke="#1a1209" strokeWidth="2" />
            <ellipse cx="90" cy="132" rx="8" ry="5" fill="white" opacity="0.4" />

            {/* Brand label */}
            <rect x="144" y="124" width="120" height="22" rx="5" fill="#5a4433" />
            <text x="204" y="139" textAnchor="middle" fontFamily="serif" fontSize="11" fill="#d4a853" fontWeight="bold" letterSpacing="2">RETROMATICA</text>

            {/* Shutter button */}
            <circle cx="392" cy="132" r="16" fill="#d4a853" />
            <circle cx="392" cy="132" r="16" stroke="#1a1209" strokeWidth="2" />
            <circle cx="392" cy="132" r="8" fill="#a07830" />
            <circle cx="392" cy="132" r="4" fill="#d4a853" />

            {/* Front body */}
            <rect x="60" y="155" width="360" height="290" rx="24" fill="#3d2e1f" />
            <rect x="60" y="155" width="360" height="290" rx="24" stroke="#1a1209" strokeWidth="2" />

            {/* Lens outer ring */}
            <ellipse cx="240" cy="248" rx="138" ry="138" fill="#2c2018" />
            <ellipse cx="240" cy="248" rx="138" ry="138" stroke="#1a1209" strokeWidth="3" />
            <ellipse cx="240" cy="248" rx="130" ry="130" fill="none" stroke="#5a4433" strokeWidth="2" strokeDasharray="8 5" />
            <ellipse cx="240" cy="248" rx="122" ry="122" fill="#1a1209" />

            {/* Static lens look when no feed */}
            {!showLive && (
              <>
                <ellipse cx="240" cy="248" rx="116" ry="116" fill="#0d0d0d" />
                <ellipse cx="240" cy="248" rx="80" ry="80" fill="#141414" />
                <ellipse cx="240" cy="248" rx="50" ry="50" fill="#1a1a1a" />
                <ellipse cx="240" cy="248" rx="28" ry="28" fill="#222" />
                <ellipse cx="212" cy="224" rx="18" ry="12" fill="white" opacity="0.06" transform="rotate(-30 212 224)" />
              </>
            )}

            {/* Lens chrome overlay */}
            <ellipse cx="240" cy="248" rx="116" ry="116" fill="none" stroke="#5a4433" strokeWidth="4" />
            <ellipse cx="240" cy="248" rx="110" ry="110" fill="none" stroke="#3d2e1f" strokeWidth="2" strokeDasharray="4 6" />

            {/* Focus dial — left */}
            <circle cx="100" cy="248" r="20" fill="#2c2018" stroke="#1a1209" strokeWidth="2" />
            <line x1="100" y1="232" x2="100" y2="240" stroke="#d4a853" strokeWidth="3" strokeLinecap="round" />
            <line x1="108" y1="240" x2="116" y2="240" stroke="#d4a853" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="248" r="12" fill="none" stroke="#5a4433" strokeWidth="1.5" strokeDasharray="2 4" />

            {/* Aperture dial — right */}
            <circle cx="380" cy="248" r="20" fill="#2c2018" stroke="#1a1209" strokeWidth="2" />
            <line x1="380" y1="232" x2="380" y2="240" stroke="#d4a853" strokeWidth="3" strokeLinecap="round" />
            <line x1="380" y1="256" x2="380" y2="264" stroke="#d4a853" strokeWidth="3" strokeLinecap="round" />
            <circle cx="380" cy="248" r="12" fill="none" stroke="#5a4433" strokeWidth="1.5" strokeDasharray="2 4" />

            {/* Film counter */}
            <rect x="160" y="400" width="160" height="36" rx="10" fill="#2c2018" stroke="#1a1209" strokeWidth="2" />
            <text x="240" y="422" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="12" fill="#d4a853" letterSpacing="1">● ● ● ●</text>

            {/* Bottom grip */}
            <rect x="72" y="448" width="336" height="32" rx="10" fill="#2c2018" />
            {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
              <line key={i} x1={84 + i * 30} y1="452" x2={84 + i * 30} y2="475" stroke="#5a4433" strokeWidth="2.5" strokeLinecap="round" />
            ))}

            {/* Doodle sparkles */}
            <text x="60" y="170" fontSize="18" fill="#d4a853" opacity="0.6">✦</text>
            <text x="416" y="420" fontSize="14" fill="#d4a853" opacity="0.5">✦</text>
            <text x="430" y="185" fontSize="10" fill="#d4a853" opacity="0.4">★</text>
          </svg>

          {/* Live webcam overlaid inside the lens */}
          {showLive && (
            <div
              className="absolute overflow-hidden rounded-full"
              style={{
                left: '25.8%',
                top: '38.4%',
                width: '48.3%',
                paddingBottom: '48.3%',
              }}
            >
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <Webcam
                  ref={ref}
                  audio={false}
                  videoConstraints={videoConstraints}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.95}
                  mirrored={true}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: settings.colorMode === 'monochrome' ? 'grayscale(100%)' : 'none',
                    transform: 'scaleX(-1)',
                  }}
                />
                {/* Vignette */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(26,18,9,0.6) 100%)',
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }
);

VintageCamera.displayName = 'VintageCamera';
export default VintageCamera;
