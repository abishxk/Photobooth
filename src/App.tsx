import { AnimatePresence } from 'framer-motion';
import { SessionProvider, useSession } from './context/SessionProvider';
import LandingPage from './components/LandingPage';
import SettingsPage from './components/SettingsPage';
import CameraCapture from './components/CameraCapture';
import ResultPage from './components/ResultPage';

function AppInner() {
  const { phase } = useSession();

  return (
    // overflow-hidden prevents any flash of scrollbar during transitions
    <div className="relative min-h-[100dvh] overflow-hidden bg-paper-100">
      <AnimatePresence mode="wait">
        {phase === 'landing'  && <LandingPage   key="landing"  />}
        {phase === 'settings' && <SettingsPage  key="settings" />}
        {phase === 'capture'  && <CameraCapture key="capture"  />}
        {phase === 'result'   && <ResultPage    key="result"   />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <AppInner />
    </SessionProvider>
  );
}
