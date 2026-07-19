import { motion } from 'framer-motion';
import { useSession } from '../context/SessionProvider';
import PhotoBooth from './PhotoBooth';
import SettingsPanel from './SettingsPanel';

export default function HomePage() {
  const { startSession, setCameraPermission } = useSession();

  const handleStart = () => {
    setCameraPermission('idle');
    startSession();
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* ── DESKTOP: two-column, no header, centered ── */}
      <main className="hidden lg:flex flex-1 items-center justify-center gap-10 px-12 py-8 max-w-6xl mx-auto w-full">
        {/* Left: Booth */}
        <div className="w-1/2 flex items-center justify-center">
          <PhotoBooth showLive={false} />
        </div>

        {/* Vertical divider */}
        <div className="w-px self-stretch bg-gradient-to-b from-transparent via-sepia-200 to-transparent flex-shrink-0" />

        {/* Right: Settings */}
        <div className="w-1/2 flex items-center justify-center">
          <SettingsPanel onStart={handleStart} />
        </div>
      </main>

      {/* ── MOBILE: single column, no header/footer ── */}
      <div className="flex lg:hidden flex-col flex-1 overflow-y-auto">

        {/* Booth illustration — compact on mobile */}
        <motion.div
          className="flex-shrink-0 px-4 pt-5 flex items-center justify-center"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          {/* Height-constrained so the booth doesn't eat the whole screen */}
          <div style={{ width: '100%', maxWidth: 370, maxHeight: 260, overflow: 'hidden' }}>
            <PhotoBooth showLive={false} />
          </div>
        </motion.div>

        {/* Mobile title below booth */}
        <motion.div
          className="text-center px-5 pt-3 pb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
        >
          <h1 className="font-handwritten text-4xl font-bold text-ink-900 doodle-underline">
            Photo Booth
          </h1>
          <p className="text-ink-600 text-xs font-sans mt-3 leading-relaxed">
            Snap · Capture · Download your strip
          </p>
        </motion.div>

        {/* Settings + Start */}
        <motion.div
          className="px-4 pb-5 pt-3"
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <SettingsPanel onStart={handleStart} />
        </motion.div>
      </div>
    </div>
  );
}
