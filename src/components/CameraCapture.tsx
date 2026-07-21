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

            // ── Step 1: BT.709 perceptual grayscale ──
            let gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            if (settings.colorMode === 'monochrome') {
              d[idx] = d[idx + 1] = d[idx + 2] = gray;

            } else {
              // ── RETRO pipeline ──

              // Step 2: High-contrast S-curve (deep blacks, punchy mids)
              // Pulls shadows down and lifts highlights — classic analog print look
              const t = gray / 255;
              const curved =
                t < 0.5
                  ? 2.3 * t * t           // compress shadows aggressively
                  : 1 - Math.pow(-2 * t + 2, 2) * 0.42; // open midtones/highlights
              gray = Math.max(0, Math.min(255, curved * 255));

              // Step 3: Film grain — coarser than BW, matches vintage photobooth film
              const grain = (Math.random() - 0.5) * 28;
              gray = Math.max(0, Math.min(255, gray + grain));

              // Step 4: Warm silver-gelatin toning
              // Classic photobooth paper (Ilford warm-tone): slight amber in shadows,
              // neutral-to-cool in highlights — NOT orange sepia, more warm-gray
              const tR = Math.min(255, Math.max(0, gray * 1.05 + 6));
              const tG = Math.min(255, Math.max(0, gray * 0.97));
              const tB = Math.min(255, Math.max(0, gray * 0.82 - 8));

              // Step 5: Radial vignette (squared dist — no sqrt, faster)
              const dx = (x / w - 0.5) * 2;
              const dy = (y / h - 0.5) * 2;
              const dist2 = dx * dx + dy * dy;
              // Gentle vignette: starts at edges, heaviest at corners
              const vig = Math.max(0, 1 - dist2 * 0.52);

              d[idx]     = Math.round(tR * vig);
              d[idx + 1] = Math.round(tG * vig);
              d[idx + 2] = Math.round(tB * vig);
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = dataUrl;
    });
  }, [settings.colorMode]);

  /**
   * Capture a frame directly from the video element at its native resolution.
   * This bypasses react-webcam's getScreenshot() which may apply its own
   * quality cap. We draw to a canvas sized to the actual video stream
   * dimensions (videoWidth × videoHeight) for maximum fidelity.
   */
  const captureNative = useCallback((): string | null => {
    const video = webcamRef.current?.video;
    if (!video || video.readyState < 2) return null;

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return null;

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    // Mirror to match the webcam preview (mirrored={true})
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    return canvas.toDataURL('image/png');
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

      // Brief "smile" moment
      setCurrentCountdown(0);
      await sleep(280);

      setShowCountdownOverlay(false);
      setIsFlashing(true);
      playShutterSound();
      await sleep(90);
      setIsFlashing(false);

      // Capture at native video resolution (bypasses react-webcam quality cap)
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
        className="min-h-[100dvh] flex items-center justify-center p-6"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <motion.div
          className="card p-8 max-w-sm w-full text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <AlertCircle size={44} className="text-amber-vintage mx-auto mb-4" />
          <h2 className="font-handwritten text-3xl font-bold text-ink-900 mb-2">
            Camera Access Needed
          </h2>
          <p className="text-ink-600 font-sans text-sm mb-6 leading-relaxed">
            Please allow camera access in your browser settings, then try again.
          </p>
          <button
            className="btn-primary w-full flex items-center justify-center gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Flash overlay */}
      {isFlashing && (
        <motion.div
          className="fixed inset-0 bg-white pointer-events-none"
          style={{ zIndex: 999 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.95, 0] }}
          transition={{ duration: 0.38 }}
        />
      )}

      {/* Countdown overlay */}
      <Countdown
        value={currentCountdown}
        isActive={showCountdownOverlay}
        photoIndex={countdownPhotoIndex}
        totalPhotos={settings.photoCount}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-sepia-200 flex-shrink-0">
        <div className="font-handwritten text-xl font-bold text-ink-800">
          RETRO<span className="text-amber-vintage">MATICA</span>
        </div>
        <div className="flex gap-2 items-center">
          {Array.from({ length: settings.photoCount }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < capturedPhotos.length
                  ? 'bg-amber-vintage w-2.5 h-2.5'
                  : i === capturedPhotos.length
                  ? 'bg-ink-800 w-2 h-2'
                  : 'bg-sepia-200 w-1.5 h-1.5'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Webcam — takes up as much space as possible */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 gap-4 min-h-0">
        <motion.div
          className="relative w-full rounded-2xl overflow-hidden border-2 border-ink-800 shadow-camera"
          style={{ maxWidth: 520, aspectRatio: '4/3' }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          {/* Camera top bar */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-ink-800/90 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-3 rounded bg-amber-vintage" />
              <span className="font-handwritten text-xs text-paper-200 tracking-widest uppercase">
                {isCapturing ? 'Recording' : 'Ready'}
              </span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: settings.photoCount }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i < capturedPhotos.length ? 'bg-amber-vintage' : 'bg-ink-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Webcam */}
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={{
              // Request the maximum resolution the device supports.
              // Browser will grant the closest available (e.g. 12MP on iPhone).
              width:  { ideal: 4096 },
              height: { ideal: 4096 },
              facingMode: 'user',
              // Disable any hardware noise-reduction that reduces sharpness
              noiseSuppression: false,
              // Request highest frame rate for a crisper freeze frame
              frameRate: { ideal: 60, max: 60 },
            }}
            screenshotFormat="image/png"
            screenshotQuality={1}
            mirrored={true}
            playsInline
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              // Live preview CSS approximation — actual captured frames
              // are processed via canvas for full quality
              filter:
                settings.colorMode === 'monochrome'
                  ? 'grayscale(100%)'
                  : settings.colorMode === 'retro'
                  ? 'grayscale(1) sepia(0.55) contrast(1.35) brightness(0.86)'
                  : 'none',
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(26,18,9,0.4) 100%)' }}
          />

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-ink-800/70 backdrop-blur-sm px-4 py-2 flex items-center justify-center gap-2">
            <Camera size={13} className="text-amber-vintage" />
            <span className="font-handwritten text-xs text-paper-200">
              {cameraPermission === 'idle' ? 'Connecting camera...' : `Photo ${Math.min(capturedPhotos.length + 1, settings.photoCount)} of ${settings.photoCount}`}
            </span>
          </div>
        </motion.div>

        {/* Captured thumbnails */}
        {capturedPhotos.length > 0 && (
          <motion.div
            className="flex gap-2.5"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {capturedPhotos.map((photo, i) => (
              <motion.div
                key={i}
                className="w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-vintage shadow-vintage flex-shrink-0"
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: i % 2 === 0 ? -2 : 2 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                <img
                  src={photo}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                  style={{
                    // Retro images are already canvas-processed — no extra CSS needed
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
