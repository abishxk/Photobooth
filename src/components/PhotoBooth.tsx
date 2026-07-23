import { forwardRef } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionProvider';

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
          <svg
            viewBox="0 0 340 460"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full drop-shadow-2xl"
            aria-label="Vintage Wooden Photoautomat"
          >
            <defs>
              {/* ── RICH WOOD COLOR GRADIENTS ── */}
              
              <linearGradient id="walnutWood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A2616" />
                <stop offset="50%" stopColor="#3A1C0E" />
                <stop offset="100%" stopColor="#220F06" />
              </linearGradient>

              <linearGradient id="trimWood" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2E160A" />
                <stop offset="100%" stopColor="#140803" />
              </linearGradient>

              <linearGradient id="lightWood" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8C5C38" />
                <stop offset="100%" stopColor="#5E371C" />
              </linearGradient>

              <linearGradient id="creamAcrylic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#FFFDF5" />
                <stop offset="100%" stopColor="#F5E8C9" />
              </linearGradient>

              <linearGradient id="amberGlass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F9D490" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#D99E45" stopOpacity="0.5" />
              </linearGradient>

              <linearGradient id="velvetFold" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#200308" />
                <stop offset="35%" stopColor="#800014" />
                <stop offset="70%" stopColor="#D4384B" />
                <stop offset="90%" stopColor="#800014" />
                <stop offset="100%" stopColor="#200308" />
              </linearGradient>

              <linearGradient id="wornLeather" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2A2A2A" />
                <stop offset="30%" stopColor="#1A1A1A" />
                <stop offset="100%" stopColor="#0D0D0D" />
              </linearGradient>

              <linearGradient id="mirrorGlass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#e2e8f0" stopOpacity="0.3" />
                <stop offset="60%" stopColor="#cbd5e1" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#475569" stopOpacity="0.6" />
              </linearGradient>

              <radialGradient id="incandescentLeak" cx="0.5" cy="0.4" r="0.6">
                <stop offset="0%" stopColor="#FFE58F" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#D97A2E" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#1A0A04" stopOpacity="0" />
              </radialGradient>

              {/* ── SHADOWS & TEXTURE FILTERS ── */}
              
              <filter id="woodTexture">
                <feTurbulence type="fractalNoise" baseFrequency="0.015 0.35" numOctaves="3" result="woodNoise" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.22 0" in="woodNoise" result="coloredNoise" />
                <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="textured" />
                <feBlend mode="multiply" in="textured" in2="SourceGraphic" />
              </filter>

              <filter id="woodWithShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feTurbulence type="fractalNoise" baseFrequency="0.015 0.35" numOctaves="3" result="woodNoise" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.22 0" in="woodNoise" result="coloredNoise" />
                <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="textured" />
                <feBlend mode="multiply" in="textured" in2="SourceGraphic" result="woodOut" />
                <feDropShadow dx="0" dy="12" stdDeviation="15" floodColor="#000" floodOpacity="0.6" in="woodOut" />
              </filter>

              <filter id="woodWithInnerBevel" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.015 0.35" numOctaves="3" result="woodNoise" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.22 0" in="woodNoise" result="coloredNoise" />
                <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="textured" />
                <feBlend mode="multiply" in="textured" in2="SourceGraphic" result="woodOut" />
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.85" in="woodOut" />
              </filter>
              
              <filter id="sharpDropShadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.6" />
              </filter>

              <filter id="innerBevel">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.8" />
              </filter>

              <filter id="glowTransom" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="innerShadow">
                <feOffset dx="0" dy="4"/>
                <feGaussianBlur stdDeviation="6" result="offset-blur"/>
                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                <feFlood floodColor="black" floodOpacity="0.95" result="color"/>
                <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
              </filter>

              <filter id="velvetTexture">
                <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise" />
                <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0" in="noise" result="coloredNoise" />
                <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="textured" />
                <feBlend mode="multiply" in="textured" in2="SourceGraphic" />
              </filter>
            </defs>

            {/* ── BACKGROUND ── */}
            <rect x="0" y="0" width="340" height="460" fill="#0A0604" />
            
            {/* ── WOODEN CABINETRY FRAME ── */}
            <rect x="15" y="10" width="310" height="440" rx="4" fill="url(#walnutWood)" filter="url(#woodWithShadow)" />
            {/* Dark wood outer trim (replacing chrome) */}
            <rect x="15" y="10" width="310" height="440" rx="4" fill="none" stroke="url(#trimWood)" strokeWidth="3" opacity="0.9" />
            <rect x="22" y="17" width="296" height="426" rx="2" fill="none" stroke="url(#trimWood)" strokeWidth="1" opacity="0.8" />

            {/* ── FROSTED LEADED GLASS TRANSOMS ── */}
            <rect x="30" y="25" width="280" height="50" rx="2" fill="#0A0604" filter="url(#innerShadow)" />
            <rect x="30" y="25" width="280" height="50" rx="2" fill="url(#incandescentLeak)" opacity="0.8" />
            {[0, 1, 2, 3, 4, 5].map((col) => (
              <g key={`transom-${col}`}>
                {/* Frosted pane */}
                <rect x={34 + col * 46} y={28} width="40" height="44" rx="1" fill="url(#amberGlass)" filter="url(#glowTransom)" opacity="0.8" />
                {/* Wooden leaded lines intersecting the pane */}
                <rect x={34 + col * 46} y={49} width="40" height="2" fill="#1A0F08" />
                <rect x={53 + col * 46} y={28} width="2" height="44" fill="#1A0F08" />
              </g>
            ))}
            {/* Thick wood dividers between main window sections */}
            {[1, 2, 3, 4, 5].map(col => (
              <rect key={`div-${col}`} x={31 + col * 46} y={25} width="4" height="50" fill="url(#trimWood)" filter="url(#woodTexture)" />
            ))}

            <rect x="15" y="80" width="310" height="12" fill="url(#walnutWood)" stroke="#111" strokeWidth="1" />
            <rect x="15" y="85" width="310" height="2" fill="url(#trimWood)" opacity="0.9" />

            {/* ── INTERIOR CAVITY & LIGHTING ── */}
            <rect x="105" y="150" width="130" height="290" fill="#050201" filter="url(#innerShadow)" />
            {/* Ambient light leaking onto stool and inner walls */}
            <rect x="105" y="150" width="130" height="290" fill="url(#incandescentLeak)" opacity="0.6" />
            
            {/* Wooden Swivel Stool (Replacing Chrome) */}
            <rect x="145" y="325" width="50" height="14" rx="6" fill="url(#wornLeather)" stroke="#000" strokeWidth="1" />
            <ellipse cx="170" cy="328" rx="20" ry="4" fill="#444" opacity="0.4" />
            {/* Wooden column */}
            <rect x="166" y="339" width="8" height="85" fill="url(#trimWood)" filter="url(#woodTexture)" />
            {/* Wooden swivel rings */}
            <ellipse cx="170" cy="342" rx="8" ry="3" fill="#1A0A04" />
            <ellipse cx="170" cy="346" rx="10" ry="3" fill="url(#trimWood)" filter="url(#woodTexture)" />
            <path d="M 145 425 Q 170 410 195 425 L 145 425 Z" fill="url(#trimWood)" filter="url(#woodTexture)" />

            {/* ── WALNUT DOOR PANELS ── */}
            <rect x="30" y="150" width="75" height="290" rx="2" fill="url(#walnutWood)" filter="url(#woodWithInnerBevel)" />
            <rect x="30" y="150" width="75" height="290" rx="2" fill="none" stroke="url(#trimWood)" strokeWidth="2" opacity="0.9" />
            
            <rect x="235" y="150" width="75" height="290" rx="2" fill="url(#walnutWood)" filter="url(#woodWithInnerBevel)" />
            <rect x="235" y="150" width="75" height="290" rx="2" fill="none" stroke="url(#trimWood)" strokeWidth="2" opacity="0.9" />

            {/* ── 1950S ILLUMINATED SIGNAGE ── */}
            <g filter="url(#sharpDropShadow)">
              {/* Wooden Sign Box */}
              <rect x="65" y="95" width="210" height="45" rx="10" fill="url(#trimWood)" filter="url(#woodTexture)" />
              <rect x="69" y="99" width="202" height="37" rx="8" fill="url(#creamAcrylic)" />
              <rect x="69" y="99" width="202" height="37" rx="8" fill="none" stroke="url(#lightWood)" strokeWidth="1.5" />
              
              <text 
                x="170" y="125" 
                textAnchor="middle" 
                fontFamily="'Playfair Display', serif" 
                fontSize="20" 
                fill="#FFF7D6" 
                fontWeight="900" 
                letterSpacing="3"
                filter="url(#softGlow)"
              >
                RETROMATICA
              </text>
              <text 
                x="170" y="125" 
                textAnchor="middle" 
                fontFamily="'Playfair Display', serif" 
                fontSize="20" 
                fill="#8B0018" 
                fontWeight="900" 
                letterSpacing="3"
              >
                RETROMATICA
              </text>
            </g>

            {/* ── LEFT PANEL: WOODEN INSTRUCTION PLAQUE ── */}
            {/* Lighter Wood Board */}
            <g filter="url(#sharpDropShadow)">
              <rect x="35" y="170" width="65" height="90" rx="2" fill="url(#lightWood)" />
              <rect x="35" y="170" width="65" height="90" rx="2" fill="none" stroke="#3E1C0A" strokeWidth="1" filter="url(#woodTexture)" />
            </g>
            {/* Wooden pegs replacing rivets */}
            <circle cx="39" cy="174" r="1.5" fill="#3E1C0A" />
            <circle cx="96" cy="174" r="1.5" fill="#3E1C0A" />
            <circle cx="39" cy="256" r="1.5" fill="#3E1C0A" />
            <circle cx="96" cy="256" r="1.5" fill="#3E1C0A" />
            {/* Paper/Painted face */}
            <rect x="38" y="173" width="59" height="84" rx="1" fill="#FFFDF5" opacity="0.9" />
            <text x="67.5" y="188" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="5" fill="#200308" fontWeight="900" letterSpacing="0.5">PHOTO BOOTH</text>
            <rect x="42" y="194" width="51" height="1" fill="#D4384B" />
            
            {/* 3-pose photo strips graphic */}
            {/* Strip 1 */}
            <rect x="47" y="204" width="10" height="28" fill="#FFF" stroke="#555" strokeWidth="0.5" />
            <rect x="48" y="206" width="8" height="7" fill="#1A1A1A" />
            <rect x="48" y="214" width="8" height="7" fill="#1A1A1A" />
            <rect x="48" y="222" width="8" height="7" fill="#1A1A1A" />
            {/* Strip 2 */}
            <rect x="62" y="204" width="10" height="28" fill="#FFF" stroke="#555" strokeWidth="0.5" />
            <rect x="63" y="206" width="8" height="7" fill="#1A1A1A" />
            <rect x="63" y="214" width="8" height="7" fill="#1A1A1A" />
            <rect x="63" y="222" width="8" height="7" fill="#1A1A1A" />
            {/* Pricing label */}
            <text x="59" y="248" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="7" fill="#1A1A1A" fontWeight="bold">3 POSES - 25¢</text>

            {/* ── LEFT PANEL: WOODEN COIN ACCEPTOR UNIT ── */}
            <g filter="url(#sharpDropShadow)">
              <rect x="54" y="280" width="28" height="46" rx="3" fill="url(#trimWood)" filter="url(#woodTexture)" />
              <rect x="58" y="284" width="20" height="38" rx="2" fill="#1A0A04" filter="url(#innerBevel)" />
              {/* Dual coin slots */}
              <rect x="63" y="288" width="2.5" height="14" rx="1" fill="#000" />
              <rect x="71" y="288" width="2.5" height="14" rx="1" fill="#000" />
              <text x="68" y="311" textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize="5.5" fill="#FFF" fontWeight="bold">25¢</text>
              {/* Painted red wood coin return push button */}
              <rect x="63" y="315" width="10" height="4" rx="1" fill="#8B0018" />
            </g>

            {/* ── RIGHT PANEL: WOOD FRAMED MIRROR ── */}
            <g filter="url(#sharpDropShadow)">
              <rect x="255" y="170" width="34" height="90" rx="2" fill="url(#trimWood)" filter="url(#woodTexture)" />
              <rect x="257" y="172" width="30" height="86" rx="1" fill="url(#mirrorGlass)" />
              <path d="M 257 195 L 287 175 L 287 185 L 257 205 Z" fill="#FFF" opacity="0.4" />
              <path d="M 257 210 L 287 190 L 287 195 L 257 215 Z" fill="#FFF" opacity="0.2" />
            </g>

            {/* ── RIGHT PANEL: WOODEN CHUTE PHOTO SLOT ── */}
            <g filter="url(#sharpDropShadow)">
              <rect x="245" y="275" width="54" height="65" rx="4" fill="url(#trimWood)" filter="url(#woodTexture)" />
              <rect x="248" y="278" width="48" height="59" rx="2" fill="url(#lightWood)" />
              <rect x="252" y="285" width="40" height="45" rx="2" fill="#1A0A04" filter="url(#innerShadow)" />
              <rect x="257" y="295" width="30" height="25" rx="2" fill="#000" filter="url(#innerShadow)" />
              {/* Wooden dispensing lip/flap */}
              <path d="M 254 316 L 290 316 L 290 322 L 254 322 Z" fill="url(#trimWood)" filter="url(#woodTexture)" />
            </g>

            {/* ── VELVET RED CURTAINS ── */}
            <g filter="url(#velvetTexture)">
              {/* Overlapping wavy paths simulating heavy draped velvet */}
              <path d="M 105 150 Q 115 220 100 310 Q 115 310 135 305 Q 145 220 140 150 Z" fill="url(#velvetFold)" />
              <path d="M 130 150 Q 140 220 125 307 Q 145 305 160 297 Q 165 220 160 150 Z" fill="url(#velvetFold)" />
              <path d="M 150 150 Q 160 220 145 301 Q 165 295 180 285 Q 185 210 180 150 Z" fill="url(#velvetFold)" />
              <path d="M 170 150 Q 185 210 165 290 Q 190 280 210 270 Q 225 220 220 150 Z" fill="url(#velvetFold)" />
              <path d="M 100 310 Q 112 315 125 307 Q 135 310 145 301 Q 155 302 165 290 Q 190 285 210 270" fill="none" stroke="#200308" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* ── FLOOR PLATES ── */}
            <rect x="30" y="440" width="75" height="10" fill="url(#trimWood)" opacity="0.9" filter="url(#woodTexture)" />
            <rect x="235" y="440" width="75" height="10" fill="url(#trimWood)" opacity="0.9" filter="url(#woodTexture)" />
            <rect x="105" y="445" width="130" height="5" fill="#000" />
            <rect x="15" y="450" width="310" height="10" rx="2" fill="url(#trimWood)" filter="url(#woodTexture)" />
          </svg>

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
