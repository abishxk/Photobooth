import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Clock, Eye, Calendar, Timer, ImagePlus } from 'lucide-react';
import { useSession } from '../context/SessionProvider';
import type { ColorMode, IntervalSeconds, PhotoCount } from '../types';

const INTERVALS: IntervalSeconds[] = [2, 3, 5, 8];
const PHOTO_COUNTS: { count: PhotoCount; label: string }[] = [
  { count: 2, label: '2' },
  { count: 3, label: '3' },
  { count: 4, label: '4' },
  { count: 6, label: '6' },
];

interface SettingsPanelProps {
  onStart: () => void;
}

export default function SettingsPanel({ onStart }: SettingsPanelProps) {
  const { settings, updateSettings } = useSession();

  return (
    <motion.div
      className="flex flex-col justify-center w-full max-w-md mx-auto"
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      {/* Desktop title — hidden on mobile (shown inline in page) */}
      <div className="hidden lg:block mb-7">
        <h1 className="font-handwritten text-6xl font-bold text-ink-900 leading-none doodle-underline">
          Photo Booth
        </h1>
        <p className="text-ink-600 text-sm mt-4 font-sans">Configure and strike a pose!</p>
      </div>
      <div className="hidden lg:flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-sepia-200" />
        <span className="font-handwritten text-ink-600 text-lg">✦</span>
        <div className="flex-1 h-px bg-sepia-200" />
      </div>

      {/* ── SETTINGS CARD ── */}
      <div className="bg-paper-100 rounded-2xl border border-sepia-200 shadow-strip p-5 space-y-5">

        {/* Color Mode */}
        <SettingRow icon={<Eye size={13} className="text-ink-600" />} label="Color Mode">
          <div className="flex gap-2">
            <button id="toggle-color"
              className={`toggle-option flex-1 py-2.5 ${settings.colorMode === 'color' ? 'active' : ''}`}
              onClick={() => updateSettings({ colorMode: 'color' as ColorMode })}
              aria-pressed={settings.colorMode === 'color'}
            >Color</button>
            <button id="toggle-mono"
              className={`toggle-option flex-1 py-2.5 ${settings.colorMode === 'monochrome' ? 'active' : ''}`}
              onClick={() => updateSettings({ colorMode: 'monochrome' as ColorMode })}
              aria-pressed={settings.colorMode === 'monochrome'}
            >B&amp;W</button>
          </div>
        </SettingRow>

        <div className="h-px bg-sepia-200" />

        {/* Number of Photos */}
        <SettingRow icon={<ImagePlus size={13} className="text-ink-600" />} label="Number of Photos">
          <div className="grid grid-cols-4 gap-2">
            {PHOTO_COUNTS.map(({ count, label }) => (
              <button
                key={count}
                id={`photos-${count}`}
                className={`interval-btn py-2.5 text-center ${settings.photoCount === count ? 'active' : ''}`}
                onClick={() => updateSettings({ photoCount: count as PhotoCount })}
                aria-pressed={settings.photoCount === count}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-ink-600 font-sans mt-1.5">
            {settings.photoCount === 2 && 'Mini — clean double-shot strip'}
            {settings.photoCount === 3 && 'Classic — timeless three-shot'}
            {settings.photoCount === 4 && 'Standard — the classic photo strip'}
            {settings.photoCount === 6 && 'Party — full six-shot strip'}
          </p>
        </SettingRow>

        <div className="h-px bg-sepia-200" />

        {/* Interval */}
        <SettingRow icon={<Clock size={13} className="text-ink-600" />} label="Interval Between Shots">
          <div className="grid grid-cols-4 gap-2">
            {INTERVALS.map(sec => (
              <button
                key={sec}
                id={`interval-${sec}`}
                className={`interval-btn py-2.5 text-center ${settings.interval === sec ? 'active' : ''}`}
                onClick={() => updateSettings({ interval: sec as IntervalSeconds })}
                aria-pressed={settings.interval === sec}
              >{sec}s</button>
            ))}
          </div>
        </SettingRow>

        <div className="h-px bg-sepia-200" />

        {/* Toggles */}
        <div className="space-y-3.5">
          <ToggleRow
            id="countdown-toggle"
            icon={<Timer size={13} className="text-ink-600" />}
            label="Show Countdown"
            sublabel={settings.showCountdown ? 'Shows 3-2-1 before each shot' : 'Jump straight to flash'}
            checked={settings.showCountdown}
            onToggle={() => updateSettings({ showCountdown: !settings.showCountdown })}
          />
          <ToggleRow
            id="timestamp-toggle"
            icon={<Calendar size={13} className="text-ink-600" />}
            label="Date &amp; Time on Strip"
            sublabel={settings.showTimestamp ? 'Date + time printed at bottom' : 'Clean strip, no timestamp'}
            checked={settings.showTimestamp}
            onToggle={() => updateSettings({ showTimestamp: !settings.showTimestamp })}
          />
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        id="start-session-btn"
        className="btn-primary flex items-center justify-center gap-3 w-full mt-5"
        onClick={onStart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        aria-label="Start photo booth session"
      >
        <Camera size={20} />
        Start Session
      </motion.button>

      <p className="text-center text-ink-600 text-xs font-sans mt-3">
        {settings.photoCount} photos · auto-captured · assembled into a strip
      </p>
    </motion.div>
  );
}

function SettingRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        {icon}
        <span className="font-handwritten text-lg font-semibold text-ink-800">{label}</span>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ id, icon, label, sublabel, checked, onToggle }: {
  id: string; icon: React.ReactNode; label: string; sublabel: string; checked: boolean; onToggle: () => void;
}) {
  return (
    <button id={id} className="flex items-center gap-3 w-full cursor-pointer" onClick={onToggle} aria-pressed={checked} role="switch">
      <div className={`relative w-11 h-6 rounded-full transition-all duration-300 border-2 flex-shrink-0 ${checked ? 'bg-ink-800 border-ink-800' : 'bg-paper-200 border-sepia-300'}`}>
        <motion.div
          className={`absolute top-0.5 w-4 h-4 rounded-full shadow-sm ${checked ? 'bg-amber-vintage' : 'bg-sepia-300'}`}
          animate={{ left: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      <div className="flex items-center gap-1.5 text-left min-w-0">
        {icon}
        <div>
          <span className="font-handwritten text-base font-semibold text-ink-800 block leading-tight">{label}</span>
          <span className="text-xs text-ink-600 font-sans block leading-tight mt-0.5">{sublabel}</span>
        </div>
      </div>
    </button>
  );
}
