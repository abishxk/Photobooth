import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowLeft, Eye, Clock, Timer, Calendar, ImagePlus, Layers, Scan } from 'lucide-react';
import { useSession } from '../context/SessionProvider';
import PageDecorations from './PageDecorations';
import type { ColorMode, IntervalSeconds, PhotoCount, StripStyle } from '../types';

const PHOTO_COUNTS: { count: PhotoCount; label: string; sub: string }[] = [
  { count: 2, label: '2', sub: 'Mini' },
  { count: 3, label: '3', sub: 'Classic' },
  { count: 4, label: '4', sub: 'Strip' },
  { count: 6, label: '6', sub: 'Party' },
];
const INTERVALS: IntervalSeconds[] = [2, 3, 5, 8];
const STRIP_STYLES: { value: StripStyle; label: string; sub: string }[] = [
  { value: 'white', label: 'White', sub: 'Classic' },
  { value: 'black', label: 'Black', sub: 'Moody' },
  { value: 'film',  label: 'Film',  sub: 'Raw' },
];

export default function SettingsPage() {
  const { settings, updateSettings, startSession, goLanding } = useSession();

  const handleStart = () => {
    startSession();
  };

  return (
    <motion.div
      className="min-h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-paper-100"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <PageDecorations intensity={0.55} />
      {/* Inner container — centered, max-width, fills height */}
      <div className="flex flex-col flex-1 w-full max-w-md mx-auto px-5 py-4 overflow-hidden">

        {/* ── TOP: back + title ── */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <motion.button
            onClick={goLanding}
            className="flex items-center gap-1.5 text-ink-600 font-handwritten text-lg active:scale-95 transition-transform focus:outline-none"
            whileTap={{ scale: 0.93 }}
            aria-label="Back to lobby"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back
          </motion.button>

          <div className="font-handwritten text-3xl font-bold text-ink-900 leading-none">
            Photo<span className="text-amber-vintage">Booth</span>
          </div>

          {/* Spacer to balance back button */}
          <div style={{ width: 64 }} />
        </div>

      {/* ── Everything centered as one group ── */}
      <div className="flex-1 flex flex-col justify-center gap-3 min-h-0 overflow-hidden">

        {/* SETTINGS CARD */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-sepia-200 shadow-strip px-4 py-3 flex flex-col gap-3 flex-shrink-0">

          {/* Color Mode */}
          <CompactRow icon={<Eye size={12} />} label="Color">
            <div className="flex gap-1.5">
              <Chip
                id="color-btn"
                active={settings.colorMode === 'color'}
                onClick={() => updateSettings({ colorMode: 'color' as ColorMode })}
              >Color</Chip>
              <Chip
                id="mono-btn"
                active={settings.colorMode === 'monochrome'}
                onClick={() => updateSettings({ colorMode: 'monochrome' as ColorMode })}
              >B&amp;W</Chip>
              <Chip
                id="retro-btn"
                active={settings.colorMode === 'retro'}
                onClick={() => updateSettings({ colorMode: 'retro' as ColorMode })}
                subtitle="film"
              >Retro</Chip>
            </div>
          </CompactRow>

          <Divider />

          {/* Photo Count */}
          <CompactRow icon={<ImagePlus size={12} />} label="Photos">
            <div className="flex gap-1.5">
              {PHOTO_COUNTS.map(({ count, label, sub }) => (
                <Chip
                  key={count}
                  id={`count-${count}`}
                  active={settings.photoCount === count}
                  onClick={() => updateSettings({ photoCount: count as PhotoCount })}
                  subtitle={sub}
                >
                  {label}
                </Chip>
              ))}
            </div>
          </CompactRow>

          <Divider />

          {/* Interval */}
          <CompactRow icon={<Clock size={12} />} label="Interval">
            <div className="flex gap-1.5">
              {INTERVALS.map(sec => (
                <Chip
                  key={sec}
                  id={`interval-${sec}`}
                  active={settings.interval === sec}
                  onClick={() => updateSettings({ interval: sec as IntervalSeconds })}
                >
                  {sec}s
                </Chip>
              ))}
            </div>
          </CompactRow>


          <Divider />

          {/* Strip Style */}
          <CompactRow icon={<Layers size={12} />} label="Strip">
            <div className="flex gap-1.5">
              {STRIP_STYLES.map(({ value, label, sub }) => (
                <Chip
                  key={value}
                  id={`strip-${value}`}
                  active={settings.stripStyle === value}
                  onClick={() => updateSettings({ stripStyle: value })}
                  subtitle={sub}
                  dark={value === 'black'}
                >
                  {label}
                </Chip>
              ))}
            </div>
          </CompactRow>

          <Divider />

          {/* Toggles — Timestamp and Rounded disabled for Film style */}
          <div className="flex gap-2">
            <ToggleChip
              id="countdown-toggle"
              icon={<Timer size={11} />}
              label="Countdown"
              checked={settings.showCountdown}
              onToggle={() => updateSettings({ showCountdown: !settings.showCountdown })}
            />

            {/* Timestamp */}
            {settings.stripStyle !== 'film' ? (
              <ToggleChip
                id="timestamp-toggle"
                icon={<Calendar size={11} />}
                label="Timestamp"
                checked={settings.showTimestamp}
                onToggle={() => updateSettings({ showTimestamp: !settings.showTimestamp })}
              />
            ) : (
              <DisabledToggle id="timestamp-toggle-disabled" icon={<Calendar size={11} />} label="Timestamp" />
            )}

            {/* Rounded edges */}
            {settings.stripStyle !== 'film' ? (
              <ToggleChip
                id="rounded-toggle"
                icon={<Scan size={11} />}
                label="Rounded"
                checked={settings.roundedEdges}
                onToggle={() => updateSettings({ roundedEdges: !settings.roundedEdges })}
              />
            ) : (
              <DisabledToggle id="rounded-toggle-disabled" icon={<Scan size={11} />} label="Rounded" />
            )}
          </div>
        </div>

        {/* SESSION SUMMARY */}
        <motion.p
          className="text-center text-ink-500 text-xs font-sans flex-shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {settings.photoCount} photos · {settings.interval}s apart ·{' '}
          {settings.colorMode === 'monochrome' ? 'B&W' : 'Color'}
          {settings.showCountdown ? ' · Countdown on' : ''}
        </motion.p>

        {/* START BUTTON — part of the centered group, not pinned to bottom */}
        <motion.button
          id="start-session-btn"
          className="btn-primary w-full flex items-center justify-center gap-3 text-2xl py-5 flex-shrink-0"
          onClick={handleStart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Start photo booth session"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Camera size={22} />
          Let's Go!
        </motion.button>

        <p className="text-center text-ink-600 font-sans text-[11px] flex-shrink-0">
          {settings.photoCount} shots will be taken automatically
        </p>

      </div>

      </div>
    </motion.div>
  );
}

/* ── SUB-COMPONENTS ── */

function Divider() {
  return <div className="h-px bg-sepia-200" />;
}

function CompactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 min-w-[72px] flex-shrink-0">
        <span className="text-ink-500">{icon}</span>
        <span className="font-handwritten text-base font-semibold text-ink-800">{label}</span>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Chip({
  id,
  active,
  onClick,
  children,
  subtitle,
  dark = false,
}: {
  id: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      aria-pressed={active}
      className={`flex-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 active:scale-95 select-none border-2 focus:outline-none ${
        active
          ? dark
            ? 'bg-[#0f0f0f] text-paper-100 border-[#0f0f0f] shadow-vintage'
            : 'bg-ink-800 text-paper-100 border-ink-800 shadow-vintage'
          : 'bg-paper-100 text-ink-600 border-sepia-200 hover:border-ink-800'
      }`}
      style={{ minHeight: 40, paddingTop: subtitle ? 4 : 0, paddingBottom: subtitle ? 4 : 0 }}
    >
      <span className="font-handwritten text-base font-semibold leading-none">{children}</span>
      {subtitle && (
        <span className={`text-[9px] font-sans leading-none mt-0.5 ${active ? 'text-paper-300' : 'text-ink-500'}`}>
          {subtitle}
        </span>
      )}
    </button>
  );
}

function ToggleChip({
  id,
  icon,
  label,
  checked,
  onToggle,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      id={id}
      onClick={onToggle}
      aria-pressed={checked}
      role="switch"
      className="flex-1 flex items-center gap-2 cursor-pointer focus:outline-none active:scale-95 transition-transform select-none"
    >
      {/* Mini toggle pill */}
      <div
        className={`relative w-9 h-5 rounded-full transition-all duration-300 border-2 flex-shrink-0 ${
          checked ? 'bg-ink-800 border-ink-800' : 'bg-paper-200 border-sepia-300'
        }`}
      >
        <motion.div
          className={`absolute top-0.5 w-3 h-3 rounded-full ${checked ? 'bg-amber-vintage' : 'bg-sepia-300'}`}
          animate={{ left: checked ? 16 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-ink-500">{icon}</span>
        <span className="font-handwritten text-sm font-semibold text-ink-800">{label}</span>
      </div>
    </button>
  );
}

function DisabledToggle({
  id,
  icon,
  label,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      id={id}
      className="flex-1 flex items-center gap-1.5 opacity-30 select-none cursor-not-allowed"
      aria-disabled="true"
    >
      <div className="relative w-9 h-5 rounded-full border-2 bg-paper-200 border-sepia-300 flex-shrink-0">
        <div className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-sepia-300" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-ink-500">{icon}</span>
        <span className="font-handwritten text-sm font-semibold text-ink-800">{label}</span>
      </div>
    </div>
  );
}
