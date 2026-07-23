import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Download, RefreshCw, LogOut, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useSession } from '../context/SessionProvider';
import PhotoStrip from './PhotoStrip';

// Reusable interior background component
function BoothInterior() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-90">
        <defs>
          <linearGradient id="wallWood" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0a0402" />
            <stop offset="20%" stopColor="#1a0a05" />
            <stop offset="80%" stopColor="#1a0a05" />
            <stop offset="100%" stopColor="#0a0402" />
          </linearGradient>
          <linearGradient id="redCurtain" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a0204" />
            <stop offset="25%" stopColor="#660010" />
            <stop offset="50%" stopColor="#990018" />
            <stop offset="75%" stopColor="#660010" />
            <stop offset="100%" stopColor="#1a0204" />
          </linearGradient>
          <filter id="velvetTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.25 0" in="noise" result="coloredNoise" />
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="textured" />
            <feBlend mode="multiply" in="textured" in2="SourceGraphic" />
          </filter>
          <filter id="shadowCurtain">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#000" floodOpacity="0.8" />
          </filter>
        </defs>

        <rect width="100" height="100" fill="url(#wallWood)" />
        <line x1="25" y1="0" x2="25" y2="100" stroke="#050201" strokeWidth="0.5" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#050201" strokeWidth="0.5" />
        <line x1="75" y1="0" x2="75" y2="100" stroke="#050201" strokeWidth="0.5" />
        
        <circle cx="50" cy="-20" r="80" fill="#d4a853" opacity="0.05" filter="blur(10px)" />
        
        <g filter="url(#shadowCurtain)">
          <path d="M 0 0 Q 15 50 0 100 Z" fill="url(#redCurtain)" filter="url(#velvetTexture)" />
          <path d="M 0 0 Q 15 50 0 100" fill="none" stroke="#1a0204" strokeWidth="1.5" filter="url(#velvetTexture)" opacity="0.9" />
        </g>
        <g filter="url(#shadowCurtain)">
          <path d="M 100 0 Q 85 50 100 100 Z" fill="url(#redCurtain)" filter="url(#velvetTexture)" />
          <path d="M 100 0 Q 85 50 100 100" fill="none" stroke="#1a0204" strokeWidth="1.5" filter="url(#velvetTexture)" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}

export default function ResultPage() {
  const {
    capturedPhotos,
    settings,
    generatedStrip,
    setGeneratedStrip,
    isGeneratingStrip,
    setIsGeneratingStrip,
    goSettings,
    goLanding,
  } = useSession();

  const stripRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  
  // New state to track if the user has pulled the strip from the machine
  const [isPulled, setIsPulled] = useState(false);

  // Generate the strip PNG once on mount
  useEffect(() => {
    if (generatedStrip || isGeneratingStrip) return;
    const generate = async () => {
      if (!stripRef.current) return;
      setIsGeneratingStrip(true);
      await new Promise(r => setTimeout(r, 900));
      try {
        const dataUrl = await toPng(stripRef.current, {
          quality: 1,
          pixelRatio: 3,
          cacheBust: true,
        });
        setGeneratedStrip(dataUrl);
      } catch {
        try {
          const dataUrl = await toPng(stripRef.current!, { quality: 1, pixelRatio: 3 });
          setGeneratedStrip(dataUrl);
        } catch {
          if (capturedPhotos[0]) setGeneratedStrip(capturedPhotos[0]);
        }
      } finally {
        setIsGeneratingStrip(false);
      }
    };
    generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownload = async () => {
    if (!generatedStrip) return;
    setIsDownloading(true);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const filename = `retromatica-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}.png`;
    
    try {
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile && navigator.share) {
        const res = await fetch(generatedStrip);
        const blob = await res.blob();
        const file = new File([blob], filename, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Retromatica Photo Strip',
          });
          setIsDownloading(false);
          setDownloadDone(true);
          setTimeout(() => setDownloadDone(false), 2500);
          return;
        }
      }
      
      const link = document.createElement('a');
      link.href = generatedStrip;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadDone(true);
        setTimeout(() => setDownloadDone(false), 2500);
      }, 800);
    } catch (err) {
      console.error('Download/Share failed:', err);
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      className="relative min-h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-[#0a0402]"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5 }}
    >
      <BoothInterior />

      {/* Off-screen strip for html-to-image capture */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', zIndex: -1, pointerEvents: 'none' }}>
        <PhotoStrip
          ref={stripRef}
          photos={capturedPhotos}
          colorMode={settings.colorMode}
          showTimestamp={settings.showTimestamp}
          stripStyle={settings.stripStyle}
          roundedEdges={settings.roundedEdges}
        />
      </div>

      <LayoutGroup>
        {/* ── FINAL STATE: STRIP IS PULLED AND CENTERED ── */}
        <div className="relative z-10 flex flex-col flex-1 max-w-md mx-auto w-full px-5 py-4 overflow-hidden pointer-events-none">
          
          <AnimatePresence>
            {isPulled && (
              <motion.div
                className="text-center flex-shrink-0 pt-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="px-4 py-1.5 bg-[#1a0a05] rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border-b border-[#3b1d11] inline-block mb-3">
                  <h2 className="font-vintage text-2xl font-bold tracking-widest text-[#a37e3d] drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                    YOUR EXPOSURES
                  </h2>
                </div>
                <p className="text-[#c49b5c] font-vintage text-[10px] tracking-widest uppercase">
                  {settings.photoCount} SHOTS · READY TO ARCHIVE
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Centered Image (Only exists here if pulled) */}
          <div className="flex-1 flex items-center justify-center min-h-0 py-4 z-20 pointer-events-auto">
            {isPulled && generatedStrip && (
              <motion.div
                layoutId="photo-strip-container"
                className="relative inline-block cursor-default drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
                animate={{ rotate: [-1, 1, -1], scale: 1 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                initial={{ scale: 0.8 }}
              >
                <motion.img
                  layoutId="photo-strip-img"
                  src={generatedStrip}
                  alt="Your photo strip"
                  className="relative rounded-xl border border-[#222]"
                  style={{
                    maxHeight: `calc(100dvh - ${settings.photoCount >= 6 ? 340 : 310}px)`,
                    maxWidth: 'min(240px, 60vw)',
                    width: 'auto',
                  }}
                />
                {/* Corner sparkle */}
                <motion.div
                  className="absolute -top-3 -right-3 text-[#c49b5c] drop-shadow-md"
                  animate={{ rotate: [0, 18, -18, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Sparkles size={22} fill="currentColor" />
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <AnimatePresence>
            {isPulled && (
              <motion.div
                className="flex-shrink-0 flex flex-col gap-3 pb-2 pointer-events-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {/* Mechanical Download Plunger */}
                <button
                  id="download-strip-btn"
                  className="group w-full focus:outline-none"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  aria-label="Download photo strip as PNG"
                >
                  <div className="w-full bg-gradient-to-b from-[#e6d0a3] to-[#8c6b36] rounded shadow-[0_10px_20px_rgba(0,0,0,0.8)] border border-[#4a3617] p-1.5 flex items-center justify-center">
                    <div className={`w-full ${downloadDone ? 'bg-gradient-to-b from-[#2e7a27] to-[#14420f]' : 'bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]'} rounded shadow-[inset_0_2px_5px_rgba(255,255,255,0.2),0_4px_0px_#000,0_10px_10px_rgba(0,0,0,0.6)] border border-[#000] transition-all duration-75 group-active:translate-y-[4px] group-active:shadow-[inset_0_2px_5px_rgba(255,255,255,0.2),0_0px_0px_#000,0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center py-4`}>
                      <div className="flex items-center gap-3 text-[#c49b5c] font-vintage text-xl font-black tracking-widest drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)] uppercase">
                        <Download size={20} strokeWidth={2.5} />
                        {downloadDone ? 'SAVED TO ARCHIVE' : isDownloading ? 'SAVING...' : 'DISPENSE COPY'}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Secondary Mechanical Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={goSettings}
                    className="relative flex items-center justify-center gap-2 bg-[#3b1d11] text-[#e8d5b5] border-x-2 border-t-2 border-[#542d1c] border-b-[6px] border-b-[#110502] hover:bg-[#4a2617] active:translate-y-[4px] active:border-b-[2px] font-vintage font-bold tracking-widest text-xs uppercase py-4 rounded-sm shadow-[0_5px_10px_rgba(0,0,0,0.6)]"
                  >
                    <RefreshCw size={14} />
                    <span>NEW COIN</span>
                  </button>
                  <button
                    onClick={goLanding}
                    className="relative flex items-center justify-center gap-2 bg-[#1a0a05] text-[#a37e3d] border-x-2 border-t-2 border-[#2b1f0d] border-b-[6px] border-b-[#050201] hover:bg-[#26130b] active:translate-y-[4px] active:border-b-[2px] font-vintage font-bold tracking-widest text-xs uppercase py-4 rounded-sm shadow-[0_5px_10px_rgba(0,0,0,0.6)]"
                  >
                    <LogOut size={14} />
                    <span>EXIT BOOTH</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── INITIAL STATE: STRIP DISPENSING FROM SLOT ── */}
        {!isPulled && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-[8vh] sm:pt-[10vh] pointer-events-none">
            
            {/* Wooden shelf above slot */}
            <div className="w-[340px] h-12 bg-gradient-to-t from-[#3b1d11] to-[#110502] border-b-2 border-[#542d1c] shadow-[0_20px_40px_rgba(0,0,0,0.9)] rounded-t-md z-20" />
            {/* The physical metal lip of the dispenser slot */}
            <div className="relative w-[320px] h-6 bg-gradient-to-t from-[#777] via-[#444] to-[#111] border-b-2 border-[#999] shadow-[0_15px_30px_rgba(0,0,0,1)] rounded-b-sm z-30 flex items-center justify-between px-4">
              <Screw className="w-2.5 h-2.5 bg-gradient-to-br from-[#555] to-[#111]" />
              <div className="w-48 h-1.5 bg-[#000] rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)]" />
              <Screw className="w-2.5 h-2.5 bg-gradient-to-br from-[#555] to-[#111]" />
            </div>

            {/* The Slot Container (overflow hidden so strip slides out of it) */}
            <div className="relative w-[320px] h-[85vh] overflow-hidden flex flex-col items-center justify-start">
              
              {isGeneratingStrip && (
                <div className="absolute top-8 left-0 right-0 flex justify-center z-10">
                  <div className="px-4 py-2 bg-[#0a0402] border border-[#2b1f0d] rounded shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    <span className="font-vintage text-xs font-black text-[#ff3b30] tracking-widest animate-pulse uppercase">
                      DEVELOPING FILM...
                    </span>
                  </div>
                </div>
              )}

              {/* The Strip emerging from the slot */}
              {generatedStrip && !isGeneratingStrip && (
                <motion.div
                  layoutId="photo-strip-container"
                  className="relative z-0 origin-top cursor-pointer pointer-events-auto"
                  onClick={() => setIsPulled(true)}
                  initial={{ y: "-100%" }}
                  animate={{ y: "-15%" }} // Stop 15% before the top so user can grab it
                  transition={{ type: "tween", duration: 2, ease: "easeOut" }}
                  whileHover={{ y: "-12%" }}
                >
                  <motion.img
                    layoutId="photo-strip-img"
                    src={generatedStrip}
                    alt="Dispensing strip"
                    className="relative rounded-xl border border-[#222]"
                    style={{
                      maxHeight: `calc(100dvh - ${settings.photoCount >= 6 ? 340 : 310}px)`,
                      maxWidth: 'min(240px, 60vw)',
                      width: 'auto',
                    }}
                  />

                </motion.div>
              )}
            </div>
            
          </div>
        )}
      </LayoutGroup>

    </motion.div>
  );
}

// Vintage screw component for the dispenser slot
function Screw({ className }: { className?: string }) {
  return (
    <div className={`rounded-full flex items-center justify-center border border-[#111] ${className}`}>
      <div className="w-1.5 h-px bg-[#111] rotate-45 shadow-[0_1px_0_rgba(255,255,255,0.2)]" />
    </div>
  );
}
