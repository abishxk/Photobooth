import { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { AlertCircle, Camera, RefreshCw } from 'lucide-react';
import { useSession } from '../context/SessionProvider';
import Countdown from './Countdown';

function playShutterSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.09, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.012));
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = 0.45;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    setTimeout(() => ctx.close(), 400);
  } catch {
    // silently ignore on browsers that block audio
  }
}

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

// Vintage screw component for the camera body
function Screw({ className }: { className?: string }) {
  return (
    <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#777] to-[#222] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center border border-[#111] ${className || ''}`}>
      <div className="w-2.5 h-px bg-[#111] rotate-45 shadow-[0_1px_0_rgba(255,255,255,0.2)]" />
    </div>
  );
}

export default function CameraCapture() {
  const {
    settings,
    capturedPhotos,
    addPhoto,
    endSession,
    setCurrentCountdown,
    setCurrentPhotoIndex,
    currentCountdown,
    cameraPermission,
    setCameraPermission,
    setIsCapturing,
    isCapturing,
  } = useSession();

  const webcamRef = useRef<Webcam>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showCountdownOverlay, setShowCountdownOverlay] = useState(false);
  const [countdownPhotoIndex, setCountdownPhotoIndex] = useState(1);
  const captureStarted = useRef(false);

  const applyColorFilter = useCallback(async (dataUrl: string): Promise<string> => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0);

        const w = canvas.width;
        const h = canvas.height;
        const imageData = ctx.getImageData(0, 0, w, h);
        const d = imageData.data;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const r = d[idx], g = d[idx + 1], b = d[idx + 2];

            let gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            if (settings.colorMode === 'monochrome') {
              d[idx] = d[idx + 1] = d[idx + 2] = gray;
            } else {
              const t = gray / 255;
              const curved =
                t < 0.5
                  ? 2.3 * t * t
                  : 1 - Math.pow(-2 * t + 2, 2) * 0.42;
              gray = Math.max(0, Math.min(255, curved * 255));

              const grain = (Math.random() - 0.5) * 15;
              gray = Math.max(0, Math.min(255, gray + grain));

              const tR = Math.min(255, Math.max(0, gray * 1.05 + 6));
              const tG = Math.min(255, Math.max(0, gray * 0.97));
              const tB = Math.min(255, Math.max(0, gray * 0.82 - 8));

              const dx = (x / w - 0.5) * 2;
              const dy = (y / h - 0.5) * 2;
              const dist2 = dx * dx + dy * dy;
              const vig = Math.max(0, 1 - dist2 * 0.52);

              d[idx]     = Math.round(tR * vig);
              d[idx + 1] = Math.round(tG * vig);
              d[idx + 2] = Math.round(tB * vig);
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.src = dataUrl;
    });
  }, [settings.colorMode]);

  const captureNative = useCallback((): string | null => {
    const video = webcamRef.current?.video;
    if (!video || video.readyState < 2) return null;

    const outW = 1080;
    const outH = 1440;

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d')!;
    
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return null;

    const videoRatio = vw / vh;
    const targetRatio = outW / outH;
    
    let sx = 0, sy = 0, sw = vw, sh = vh;
    
    if (videoRatio > targetRatio) {
      // Source video is wider, crop sides
      sw = vh * targetRatio;
      sx = (vw - sw) / 2;
    } else {
      // Source video is taller, crop top/bottom
      sh = vw / targetRatio;
      sy = (vh - sh) / 2;
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, outW, outH);
    return canvas.toDataURL('image/jpeg', 0.92);
  }, []);

  const runCaptureLoop = useCallback(async () => {
    if (captureStarted.current) return;
    captureStarted.current = true;
    setIsCapturing(true);

    for (let i = 0; i < settings.photoCount; i++) {
      const photoNum = i + 1;
      setCountdownPhotoIndex(photoNum);
      setCurrentPhotoIndex(i);
      setShowCountdownOverlay(true);

      if (settings.showCountdown) {
        for (let c = settings.interval; c >= 1; c--) {
          setCurrentCountdown(c);
          await sleep(1000);
        }
      } else {
        setCurrentCountdown(0);
        await sleep(400);
      }

      setCurrentCountdown(0);
      await sleep(280);

      setShowCountdownOverlay(false);
      setIsFlashing(true);
      playShutterSound();
      await sleep(90);
      setIsFlashing(false);

      const screenshot = captureNative();
      
      if (screenshot) {
        const filtered = await applyColorFilter(screenshot);
        addPhoto(filtered);
      }

      if (i < settings.photoCount - 1) {
        await sleep(settings.interval * 1000);
      }
    }

    await sleep(500);
    endSession();
  }, [settings, addPhoto, endSession, applyColorFilter, captureNative, setCurrentCountdown, setCurrentPhotoIndex, setIsCapturing]);

  useEffect(() => {
    if (cameraPermission === 'granted' && !captureStarted.current) {
      const timer = setTimeout(runCaptureLoop, 1000);
      return () => clearTimeout(timer);
    }
  }, [cameraPermission, runCaptureLoop]);

  const handleUserMedia = useCallback(() => setCameraPermission('granted'), [setCameraPermission]);
  const handleUserMediaError = useCallback(() => setCameraPermission('denied'), [setCameraPermission]);

  if (cameraPermission === 'denied') {
    return (
      <div
        className="min-h-[100dvh] flex items-center justify-center p-6 bg-[#0a0402]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <motion.div
          className="bg-gradient-to-br from-[#c49b5c] via-[#8c6b36] to-[#4a3617] rounded-xl p-2 shadow-[0_15px_30px_rgba(0,0,0,0.8)] border border-[#fce3a2] max-w-sm w-full text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
           <div className="bg-[#120804] rounded-lg p-8 shadow-[inset_0_10px_20px_rgba(0,0,0,0.9)] border border-[#26130b] flex flex-col items-center">
            <AlertCircle size={44} className="text-[#c49b5c] mx-auto mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            <h2 className="font-vintage text-2xl font-bold text-[#e6d0a3] mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
              LENS ACCESS DENIED
            </h2>
            <p className="text-[#a37e3d] font-sans text-xs font-bold mb-6 leading-relaxed uppercase tracking-widest drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
              Please allow camera access in your browser settings to continue.
            </p>
            <button
              className="bg-gradient-to-b from-[#b01e23] to-[#5c0b11] rounded shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_4px_6px_rgba(0,0,0,0.6)] border border-[#3b0408] w-full flex items-center justify-center gap-2 py-4 text-[#ffebd6] font-vintage text-lg font-bold tracking-widest active:translate-y-1 active:shadow-none"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} strokeWidth={3} />
              REBOOT SYSTEM
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-[#0a0402]"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* ── INTERIOR BACKGROUND: WOOD PANELING & CURTAINS ── */}
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

      {/* Flash overlay */}
      {isFlashing && (
        <motion.div
          className="fixed inset-0 bg-[#fff5e6] pointer-events-none"
          style={{ zIndex: 999 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.95, 0] }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Countdown overlay */}
      <Countdown
        value={currentCountdown}
        isActive={showCountdownOverlay}
        photoIndex={countdownPhotoIndex}
        totalPhotos={settings.photoCount}
      />

      {/* ── HEADER ── */}
      <div className="relative z-10 flex items-center justify-end px-6 py-4 flex-shrink-0">
        <div className="flex gap-2.5 items-center">
          {Array.from({ length: settings.photoCount }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] border border-[#000] ${
                i < capturedPhotos.length
                  ? 'bg-gradient-to-br from-[#f23d3d] to-[#8a0000] w-3 h-3 shadow-[0_0_8px_rgba(255,0,0,0.6)]' // Lit red bulb
                  : i === capturedPhotos.length
                  ? 'bg-gradient-to-br from-[#c49b5c] to-[#4a3617] w-2.5 h-2.5' // Active standby
                  : 'bg-[#110502] w-2 h-2' // Off
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── CAMERA BODY ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2 gap-6 min-h-0">
        <motion.div
          className="relative w-full rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.9),0_0_0_4px_rgba(20,10,5,0.8)] border-2 border-[#110502] p-2 sm:p-3 flex flex-col gap-2"
          style={{ maxWidth: 520, aspectRatio: '4/3', background: 'linear-gradient(135deg, #4A2616, #1A0A05)' }} // Mahogany box camera
          initial={{ scale: 0.9, opacity: 0, rotateX: 10 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          {/* Wooden texture overlay for the camera body */}
          <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.02 0.8\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'400\' height=\'400\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

          {/* Inner Brass Rim & Screen */}
          <div className="relative flex-1 rounded border-2 border-[#8c6b36] shadow-[inset_0_15px_30px_rgba(0,0,0,1)] bg-[#050201] flex flex-col overflow-hidden z-10">
            
            {/* Top Brass Plate */}
            <div className="bg-gradient-to-b from-[#c49b5c] via-[#8a6b32] to-[#5c421b] border-b-2 border-[#2b1f0d] px-3 py-1.5 flex items-center justify-between shadow-[0_4px_10px_rgba(0,0,0,0.8)] z-20">
              <div className="flex items-center gap-3">
                 <Screw />
                 <div className="px-2 py-0.5 bg-[#120804] border border-[#2b1f0d] rounded-[2px] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] flex items-center gap-2">
                   {/* Mechanical status indicator */}
                   <div className={`w-2 h-2 rounded-full border border-black ${isCapturing ? 'bg-[#ff3b30] shadow-[0_0_5px_#ff3b30]' : 'bg-[#120804]'}`} />
                   <span className="font-vintage text-[10px] font-black text-[#a37e3d] tracking-widest uppercase">
                     {isCapturing ? 'RECORDING' : 'READY'}
                   </span>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <span className="font-vintage text-[10px] font-black text-[#a37e3d] tracking-widest uppercase">
                   LENS F/2.8
                 </span>
                 <Screw />
              </div>
            </div>

            {/* Viewfinder Lens (Webcam) */}
            <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
              <Webcam
                ref={webcamRef}
                audio={false}
                videoConstraints={{
                  width:  { ideal: 1080 },
                  height: { ideal: 1080 },
                  facingMode: 'user',
                }}
                mirrored={false}
                playsInline
                onUserMedia={handleUserMedia}
                onUserMediaError={handleUserMediaError}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transform: 'scaleX(-1)',
                  filter:
                    settings.colorMode === 'monochrome'
                      ? 'grayscale(100%)'
                      : settings.colorMode === 'retro'
                      ? 'grayscale(1) sepia(0.55) contrast(1.35) brightness(0.86)'
                      : 'none',
                }}
              />
              
              {/* Heavy Vignette for Viewfinder feel */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,5,0,0.9) 100%)' }}
              />
            </div>

            {/* Bottom Brass Plate */}
            <div className="bg-gradient-to-t from-[#c49b5c] via-[#8a6b32] to-[#5c421b] border-t-2 border-[#2b1f0d] px-3 py-1.5 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.8)] z-20">
              <Screw />
              <div className="flex items-center gap-2 text-[#2b1f0d] font-vintage text-[11px] font-black tracking-widest drop-shadow-[0_1px_0_rgba(255,255,255,0.3)]">
                <Camera size={14} strokeWidth={2.5} />
                <span>
                  {cameraPermission === 'idle' ? 'CALIBRATING...' : 'READY'}
                </span>
              </div>
              <Screw />
            </div>
          </div>
        </motion.div>

        {/* ── CAPTURED FILM STRIP THUMBNAILS ── */}
        {capturedPhotos.length > 0 && (
          <motion.div
            className="flex gap-3 bg-[#110502] p-2 rounded border border-[#26130b] shadow-[0_5px_15px_rgba(0,0,0,0.8)]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {capturedPhotos.map((photo, i) => (
              <motion.div
                key={i}
                className="w-16 h-16 bg-[#000] p-1 rounded-sm border border-[#222] shadow-[0_2px_4px_rgba(0,0,0,1)] flex-shrink-0"
                initial={{ scale: 0, rotate: -15, y: -20 }}
                animate={{ scale: 1, rotate: (i % 2 === 0 ? -3 : 4) + (Math.random()*2 - 1), y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <img
                  src={photo}
                  alt={`Exposure ${i + 1}`}
                  className="w-full h-full object-cover rounded-sm border border-[#333]"
                  style={{
                    filter: settings.colorMode === 'monochrome' ? 'grayscale(100%)' : 'none',
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
