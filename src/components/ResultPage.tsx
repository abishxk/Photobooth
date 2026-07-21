import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, LogOut, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useSession } from '../context/SessionProvider';
import PhotoStrip from './PhotoStrip';
import PageDecorations from './PageDecorations';

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
          pixelRatio: 3,   // 3× = crisp on any Retina / OLED screen
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

  const handleDownload = () => {
    if (!generatedStrip) return;
    setIsDownloading(true);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const filename = `retromatica-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}.png`;
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
  };

  return (
    <motion.div
      className="min-h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-paper-100"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
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

      {/* Inner layout */}
      <div className="flex flex-col flex-1 max-w-md mx-auto w-full px-5 py-4 overflow-hidden">

        {/* ── Title row ── */}
        <motion.div
          className="text-center mb-4 flex-shrink-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h2 className="font-handwritten text-4xl font-bold text-ink-900 doodle-underline inline-block">
            Your Strip!
          </h2>
          <p className="text-ink-600 font-sans text-xs mt-3">
            {settings.photoCount} photo{settings.photoCount > 1 ? 's' : ''} · ready to download
          </p>
        </motion.div>

        {/* ── Strip preview ── centered, flex-1 but min-height controlled */}
        <motion.div
          className="flex-1 flex items-center justify-center min-h-0 overflow-hidden"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <StripDisplay
            isGenerating={isGeneratingStrip}
            strip={generatedStrip}
            photoCount={settings.photoCount}
          />
        </motion.div>

        {/* ── Action buttons ── always visible at bottom ── */}
        <motion.div
          className="flex-shrink-0 flex flex-col gap-2.5 pt-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
        >
          {/* Download */}
          <motion.button
            id="download-strip-btn"
            className={`btn-primary w-full flex items-center justify-center gap-3 py-4 text-xl ${
              downloadDone ? '!bg-green-700' : ''
            }`}
            onClick={handleDownload}
            disabled={!generatedStrip || isDownloading}
            whileTap={{ scale: 0.96 }}
            aria-label="Download photo strip as PNG"
          >
            <Download size={20} />
            {downloadDone ? 'Saved!' : isDownloading ? 'Saving...' : 'Download Strip'}
          </motion.button>

          {/* Two secondary options side by side */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* New Session → back to settings */}
            <motion.button
              id="new-session-btn"
              className="btn-secondary flex items-center justify-center gap-2 py-3"
              onClick={goSettings}
              whileTap={{ scale: 0.96 }}
              aria-label="Start a new session with settings"
            >
              <RefreshCw size={15} />
              <span>New Session</span>
            </motion.button>

            {/* Exit booth → back to landing */}
            <motion.button
              id="exit-booth-btn"
              className="btn-secondary flex items-center justify-center gap-2 py-3"
              onClick={goLanding}
              whileTap={{ scale: 0.96 }}
              aria-label="Exit photo booth and return to lobby"
            >
              <LogOut size={15} />
              <span>Exit Booth</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      <PageDecorations intensity={0.45} />
    </motion.div>
  );
}

/* ── Strip display with loading / preview states ── */
function StripDisplay({
  isGenerating,
  strip,
  photoCount,
}: {
  isGenerating: boolean;
  strip: string | null;
  photoCount: number;
}) {
  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center gap-3">
        <motion.div
          className="w-10 h-10 border-4 border-sepia-200 border-t-amber-vintage rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        <span className="font-handwritten text-xl text-ink-600">Developing…</span>
      </div>
    );
  }

  if (strip) {
    return (
      <motion.div
        className="relative inline-block"
        animate={{ rotate: [-1, 1, -1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Drop shadow */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{ background: 'rgba(44,32,24,0.12)', transform: 'translate(5px, 8px)', borderRadius: 12 }}
        />
        {/* Strip image — height constrained so it never pushes buttons off screen */}
        <img
          src={strip}
          alt="Your photo strip"
          className="relative rounded-xl"
          style={{
            maxHeight: `calc(100dvh - ${photoCount >= 6 ? 320 : 290}px)`,
            maxWidth: 'min(220px, 55vw)',
            width: 'auto',
            boxShadow: '0 8px 32px rgba(44,32,24,0.18)',
          }}
        />
        {/* Corner sparkle */}
        <motion.div
          className="absolute -top-2 -right-2 text-amber-vintage"
          animate={{ rotate: [0, 18, -18, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Sparkles size={18} />
        </motion.div>
      </motion.div>
    );
  }

  // Skeleton
  return (
    <div
      className="rounded-xl bg-paper-200 animate-pulse"
      style={{ width: 160, height: photoCount * 80 + 40 }}
    />
  );
}
