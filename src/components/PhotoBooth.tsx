import { forwardRef } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionProvider';

interface PhotoBoothProps {
  showLive?: boolean;
}

/**
 * Cute modern photobooth illustration — pink & blush, white flowy curtains,
 * pink bows, fairy lights, flowers, hearts and stars.
 *
 * viewBox 440 × 400
 * Webcam preview window:
 *   left:   115/440 = 26.1%
 *   top:    70/400  = 17.5%
 *   width:  210/440 = 47.7%
 *   height: 254/400 = 63.5%
 */
const PhotoBooth = forwardRef<Webcam, PhotoBoothProps>(
  ({ showLive = false }, ref) => {
    const { settings } = useSession();

    const videoConstraints = {
      width: { ideal: 1280 },
      height: { ideal: 960 },
      facingMode: 'user',
    };

    const lightColors = ['#FFD6E7', '#FFEC99', '#D9C2FF', '#B8E8FF', '#FFD6E7', '#FFEC99', '#D9C2FF', '#B8E8FF', '#FFD6E7'];

    return (
      <div className="relative flex items-center justify-center w-full select-none">
        <motion.div
          className="relative w-full"
          style={{ maxWidth: 440 }}
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <svg
            viewBox="0 0 440 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            aria-label="Cute pink photo booth"
          >
            <defs>
              <linearGradient id="frameGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FDE8F3" />
                <stop offset="55%" stopColor="#F9CEDF" />
                <stop offset="100%" stopColor="#F4AAC8" />
              </linearGradient>
              <linearGradient id="colGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F0A0C0" />
                <stop offset="100%" stopColor="#F9CEDF" />
              </linearGradient>
              <linearGradient id="colGradR" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F9CEDF" />
                <stop offset="100%" stopColor="#F0A0C0" />
              </linearGradient>
              <linearGradient id="curtainL" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#FFF5FA" />
                <stop offset="100%" stopColor="#FFD6E8" />
              </linearGradient>
              <linearGradient id="curtainR" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFF5FA" />
                <stop offset="100%" stopColor="#FFD6E8" />
              </linearGradient>
              <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="frameShadow" x="-5%" y="-5%" width="110%" height="115%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#E070A0" floodOpacity="0.14" />
              </filter>
            </defs>

            {/* Floor shadow */}
            <ellipse cx="220" cy="396" rx="180" ry="5.5" fill="#E8A0C0" opacity="0.18" />

            {/* ── MAIN FRAME ── */}
            <rect x="24" y="10" width="392" height="380" rx="30" fill="url(#frameGrad)" filter="url(#frameShadow)" />
            <rect x="24" y="10" width="392" height="380" rx="30" fill="none" stroke="#E8A0C0" strokeWidth="2" />
            <rect x="32" y="18" width="376" height="364" rx="24" fill="none" stroke="#F4C0D8" strokeWidth="1.2" strokeDasharray="5 4" />

            {/* ── LEFT COLUMN ── */}
            <rect x="24" y="10" width="92" height="380" rx="30" fill="url(#colGrad)" />
            <rect x="60" y="10" width="56" height="380" fill="url(#colGrad)" />

            {/* ── RIGHT COLUMN ── */}
            <rect x="324" y="10" width="92" height="380" rx="30" fill="url(#colGradR)" />
            <rect x="324" y="10" width="56" height="380" fill="url(#colGradR)" />

            {/* ── TOP HEADER ── */}
            <rect x="24" y="10" width="392" height="62" rx="30" fill="#F4AAC8" />
            <rect x="24" y="40" width="392" height="32" fill="#F4AAC8" />
            <rect x="24" y="62" width="392" height="6" fill="#E890B8" opacity="0.45" />

            {/* ── BANNER — single line ── */}
            <path d="M 118,23 L 322,23 L 330,38 L 322,53 L 118,53 L 110,38 Z" fill="#FFF0F8" opacity="0.92" />
            <path d="M 118,23 L 322,23 L 330,38 L 322,53 L 118,53 L 110,38 Z" fill="none" stroke="#E890B8" strokeWidth="1.5" />
            <text x="220" y="43" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fill="#C0508A" fontStyle="italic" fontWeight="bold" letterSpacing="2">Photobooth</text>

            {/* ── LEFT COLUMN DECORATIONS ── */}
            {/* Flower 1 */}
            <g transform="translate(62, 115)">
              {([0,60,120,180,240,300] as number[]).map((a, i) => (
                <ellipse key={i} cx={Math.round(Math.cos(a*Math.PI/180)*7)} cy={Math.round(Math.sin(a*Math.PI/180)*7)} rx="5" ry="5" fill={i%2===0?'#FFB7C8':'#FFCDD8'} />
              ))}
              <circle cx="0" cy="0" r="4" fill="#FFEC99" />
            </g>
            {/* Star */}
            <path d="M 58,165 L 60,159 L 62,165 L 68,162 L 62,160 L 60,154 L 58,160 L 52,162 Z" fill="#F5C842" opacity="0.8" />
            {/* Heart */}
            <path d="M 62,222 C 62,217 57,215 57,220 C 57,225 62,229 62,229 C 62,229 67,225 67,220 C 67,215 62,217 62,222 Z" fill="#FF8AB0" opacity="0.6" />
            {/* Flower 2 (lavender) */}
            <g transform="translate(65, 292)">
              {([0,60,120,180,240,300] as number[]).map((a, i) => (
                <ellipse key={i} cx={Math.round(Math.cos(a*Math.PI/180)*6)} cy={Math.round(Math.sin(a*Math.PI/180)*6)} rx="4.5" ry="4.5" fill={i%2===0?'#D4A8E8':'#E8C8F8'} />
              ))}
              <circle cx="0" cy="0" r="3.5" fill="#FFEC99" />
            </g>
            {[182, 252, 340, 362].map(y => (
              <circle key={y} cx={55} cy={y} r={2.5} fill="#E890B8" opacity="0.38" />
            ))}

            {/* ── RIGHT COLUMN DECORATIONS ── */}
            <g transform="translate(378, 115)">
              {([0,60,120,180,240,300] as number[]).map((a, i) => (
                <ellipse key={i} cx={Math.round(Math.cos(a*Math.PI/180)*7)} cy={Math.round(Math.sin(a*Math.PI/180)*7)} rx="5" ry="5" fill={i%2===0?'#FFB7C8':'#FFCDD8'} />
              ))}
              <circle cx="0" cy="0" r="4" fill="#FFEC99" />
            </g>
            <path d="M 382,165 L 384,159 L 386,165 L 392,162 L 386,160 L 384,154 L 382,160 L 376,162 Z" fill="#F5C842" opacity="0.8" />
            <path d="M 378,222 C 378,217 373,215 373,220 C 373,225 378,229 378,229 C 378,229 383,225 383,220 C 383,215 378,217 378,222 Z" fill="#FF8AB0" opacity="0.6" />
            <g transform="translate(375, 292)">
              {([0,60,120,180,240,300] as number[]).map((a, i) => (
                <ellipse key={i} cx={Math.round(Math.cos(a*Math.PI/180)*6)} cy={Math.round(Math.sin(a*Math.PI/180)*6)} rx="4.5" ry="4.5" fill={i%2===0?'#D4A8E8':'#E8C8F8'} />
              ))}
              <circle cx="0" cy="0" r="3.5" fill="#FFEC99" />
            </g>
            {[182, 252, 340, 362].map(y => (
              <circle key={y} cx={385} cy={y} r={2.5} fill="#E890B8" opacity="0.38" />
            ))}

            {/* ── PREVIEW FRAME ── */}
            <rect x="107" y="64" width="226" height="262" rx="18" fill="#F090B8" opacity="0.35" />
            <rect x="109" y="66" width="222" height="258" rx="16" fill="#E890B8" />
            <rect x="112" y="69" width="216" height="252" rx="14" fill="#C0508A" />
            {/* Preview opening */}
            <rect x="115" y="70" width="210" height="254" rx="12" fill="#060606" />

            {/* ── FAIRY LIGHTS WIRE ── */}
            <path d="M 115,70 Q 155,60 195,70 Q 220,60 245,70 Q 285,60 325,70"
              fill="none" stroke="#D4A0B8" strokeWidth="1.2" opacity="0.55" />
            {/* Bulbs */}
            {([130, 156, 183, 208, 220, 242, 270, 298, 318] as number[]).map((cx, i) => (
              <g key={i}>
                <circle cx={cx} cy={67} r={5.5} fill={lightColors[i]} filter="url(#glow)" opacity={0.9} />
                <circle cx={cx} cy={67} r={2.5} fill="white" opacity={0.55} />
              </g>
            ))}

            {/* ── LEFT CURTAIN ── */}
            <path
              d="M 115,70 L 190,70 C 218,92 214,145 190,194 C 166,238 134,254 118,264 L 118,324 L 115,324 Z"
              fill="url(#curtainL)"
              opacity="0.93"
            />
            <path d="M 152,74 C 168,102 165,156 148,202" fill="none" stroke="#FFB8D4" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
            <path d="M 132,74 C 144,100 143,150 130,194" fill="none" stroke="#FFB8D4" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
            <path d="M 190,70 C 218,92 214,145 190,194 C 166,238 134,254 118,264"
              fill="none" stroke="#F0A0C0" strokeWidth="1.8" opacity="0.38" />

            {/* Left bow */}
            <g transform="translate(116, 264)">
              <path d="M 0,0 C -4,-2 -15,-13 -9,0 C -15,13 -4,2 0,0 Z" fill="#E8639B" />
              <path d="M 0,0 C 4,-2 15,-13 9,0 C 15,13 4,2 0,0 Z" fill="#E8639B" />
              <circle cx="0" cy="0" r="3.5" fill="#C0508A" />
              <circle cx="0" cy="0" r="1.5" fill="#FFB8D4" />
            </g>

            {/* ── RIGHT CURTAIN ── */}
            <path
              d="M 325,70 L 250,70 C 222,92 226,145 250,194 C 274,238 306,254 322,264 L 322,324 L 325,324 Z"
              fill="url(#curtainR)"
              opacity="0.93"
            />
            <path d="M 288,74 C 272,102 275,156 292,202" fill="none" stroke="#FFB8D4" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
            <path d="M 308,74 C 296,100 297,150 310,194" fill="none" stroke="#FFB8D4" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
            <path d="M 250,70 C 222,92 226,145 250,194 C 274,238 306,254 322,264"
              fill="none" stroke="#F0A0C0" strokeWidth="1.8" opacity="0.38" />

            {/* Right bow */}
            <g transform="translate(324, 264)">
              <path d="M 0,0 C -4,-2 -15,-13 -9,0 C -15,13 -4,2 0,0 Z" fill="#E8639B" />
              <path d="M 0,0 C 4,-2 15,-13 9,0 C 15,13 4,2 0,0 Z" fill="#E8639B" />
              <circle cx="0" cy="0" r="3.5" fill="#C0508A" />
              <circle cx="0" cy="0" r="1.5" fill="#FFB8D4" />
            </g>

            {/* ── BOTTOM ── */}
            <rect x="24" y="362" width="392" height="28" rx="30" fill="url(#frameGrad)" />
            <rect x="24" y="362" width="392" height="10" fill="#F0A0C0" opacity="0.3" />

            {/* ── CORNER STARS ── */}
            <path d="M 38,26 L 40,20 L 42,26 L 48,24 L 42,22 L 40,16 L 38,22 L 32,24 Z" fill="#F5C842" opacity="0.9" />
            <path d="M 396,26 L 398,20 L 400,26 L 406,24 L 400,22 L 398,16 L 396,22 L 390,24 Z" fill="#F5C842" opacity="0.9" />
            <circle cx="35" cy="53" r="2.5" fill="#F5C842" opacity="0.65" />
            <circle cx="405" cy="48" r="2" fill="#F5C842" opacity="0.6" />
            <circle cx="105" cy="16" r="2" fill="#F5C842" opacity="0.5" />
            <circle cx="335" cy="16" r="2" fill="#F5C842" opacity="0.5" />

            {/* Bottom hearts */}
            <path d="M 48,354 C 48,350 44,348 44,352 C 44,357 48,360 48,360 C 48,360 52,357 52,352 C 52,348 48,350 48,354 Z" fill="#FF8AB0" opacity="0.5" />
            <path d="M 392,354 C 392,350 388,348 388,352 C 388,357 392,360 392,360 C 392,360 396,357 396,352 C 396,348 392,350 392,354 Z" fill="#FF8AB0" opacity="0.5" />
            {/* Header hearts */}
            <path d="M 100,38 C 100,35 97,34 97,37 C 97,40 100,43 100,43 C 100,43 103,40 103,37 C 103,34 100,35 100,38 Z" fill="#FFB8D4" opacity="0.7" />
            <path d="M 340,38 C 340,35 337,34 337,37 C 337,40 340,43 340,43 C 340,43 343,40 343,37 C 343,34 340,35 340,38 Z" fill="#FFB8D4" opacity="0.7" />
          </svg>

          {/* ── LIVE WEBCAM ── */}
          {showLive && (
            <div
              style={{
                position: 'absolute',
                left: '26.1%',
                top: '17.5%',
                width: '47.7%',
                height: '63.5%',
                overflow: 'hidden',
                borderRadius: 12,
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
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(18,4,12,0.45) 100%)',
                pointerEvents: 'none',
                borderRadius: 12,
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
