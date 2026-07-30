import React from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionProvider';
import type { ColorMode, IntervalSeconds, StripStyle } from '../types';
import woodenbgImg from '../assets/woodenbg.png';
import exitImg from '../assets/exit.png';

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
      className="relative min-h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-cover bg-center"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        backgroundImage: `url("${woodenbgImg}")`
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5 }}
    >

      {/* ── TOP NAV ── */}
      <div className="relative z-10 w-full px-5 py-4 flex-shrink-0">
        <div className="flex justify-start">
          <motion.button
            onClick={goLanding}
            className="active:scale-95 transition-transform focus:outline-none drop-shadow-md"
            whileTap={{ scale: 0.93 }}
            aria-label="Exit booth"
          >
            <img src={exitImg} alt="Exit Booth" className="h-12 sm:h-16 w-auto object-contain" />
          </motion.button>
        </div>
      </div>

      {/* ── MAIN CONTENT (VINTAGE TICKET/PAPER PANEL) ── */}
      <div className="relative z-10 flex-1 w-full max-w-md mx-auto px-4 flex flex-col justify-center min-h-0 overflow-hidden">
        
        {/* Paper Plate Container */}
        <motion.div 
          className="relative bg-[#f4ebd8] rounded-xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-[#e5d5b5] flex flex-col gap-5 sm:gap-7"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ backgroundImage: 'radial-gradient(#dccba3 1px, transparent 1px)', backgroundSize: '16px 16px' }}
        >
          {/* Inner border to look like a ticket */}
          <div className="absolute inset-2 border-2 border-[#d3c9b7] rounded-lg pointer-events-none opacity-50" />

          {/* Color Mode */}
          <MechanicalRow label="TONE">
            <div className="flex gap-2">
              <MechanicalChip
                id="mono-btn"
                active={settings.colorMode === 'monochrome'}
                onClick={() => updateSettings({ colorMode: 'monochrome' as ColorMode })}
              >B&amp;W</MechanicalChip>
              <MechanicalChip
                id="retro-btn"
                active={settings.colorMode === 'retro'}
                onClick={() => updateSettings({ colorMode: 'retro' as ColorMode })}
                subtitle="FILM"
              >RETRO</MechanicalChip>
            </div>
          </MechanicalRow>

          <Divider />

          {/* Interval */}
          <MechanicalRow label="DELAY">
            <div className="flex gap-2">
              {INTERVALS.map(sec => (
                <MechanicalChip
                  key={sec}
                  id={`interval-${sec}`}
                  active={settings.interval === sec}
                  onClick={() => updateSettings({ interval: sec as IntervalSeconds })}
                >
                  {sec}s
                </MechanicalChip>
              ))}
            </div>
          </MechanicalRow>

          <Divider />

          {/* Strip Style */}
          <MechanicalRow label="STRIP">
            <div className="flex gap-2">
              {STRIP_STYLES.map(({ value, label, sub }) => (
                <MechanicalChip
                  key={value}
                  id={`strip-${value}`}
                  active={settings.stripStyle === value}
                  onClick={() => updateSettings({ stripStyle: value })}
                  subtitle={sub}
                >
                  {label}
                </MechanicalChip>
              ))}
            </div>
          </MechanicalRow>

          <Divider />

          {/* Toggles */}
          <div className="flex flex-col sm:flex-row gap-4">
            <MechanicalToggle
              id="countdown-toggle"
              label="COUNTDOWN"
              checked={settings.showCountdown}
              onToggle={() => updateSettings({ showCountdown: !settings.showCountdown })}
            />

            <MechanicalToggle
              id="timestamp-toggle"
              label="DATE STAMP"
              checked={settings.showTimestamp}
              disabled={settings.stripStyle === 'film'}
              onToggle={() => updateSettings({ showTimestamp: !settings.showTimestamp })}
            />
          </div>
          
        </motion.div>

        {/* ── SUMMARY TEXT ── */}
        <motion.p
          className="text-center text-[#dccba3] text-[10px] font-typewriter font-bold tracking-[0.2em] mt-5 mb-2 uppercase drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {settings.interval}s DELAY · {settings.colorMode === 'monochrome' ? 'B&W TONE' : 'RETRO TONE'}
          {settings.showCountdown ? ' · COUNTDOWN ON' : ''}
        </motion.p>

        {/* ── STAMP START BUTTON ── */}
        <motion.div
          className="mt-2 mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={handleStart}
            className="group w-full focus:outline-none"
            aria-label="Start photo booth session"
          >
            <div className="w-full bg-[#2b251d] rounded-xl shadow-lg border-2 border-[#1a1611] transition-all duration-75 group-active:scale-[0.98] flex items-center justify-center py-4 sm:py-5 hover:bg-[#1f1b15]">
              <div className="flex items-center gap-3 text-[#f4ebd8] font-typewriter text-xl sm:text-2xl font-black tracking-[0.3em] uppercase">
                 START
              </div>
            </div>
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
}

/* ── SUB-COMPONENTS ── */

function Divider() {
  return <div className="h-px border-b-[2px] border-dotted border-[#d3c9b7] mx-2 opacity-60" />;
}

function MechanicalRow({ label, children }: { label: string; children: React.ReactNode; }) {
  return (
    <div className="flex items-center gap-4 relative z-10">
      <div className="flex items-center gap-1.5 min-w-[70px] flex-shrink-0">
        <span className="font-typewriter text-sm font-bold text-[#2b251d] tracking-widest opacity-80 uppercase">{label}</span>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function MechanicalChip({ id, active, onClick, children, subtitle }: any) {
  return (
    <button
      id={id}
      onClick={onClick}
      aria-pressed={active}
      className={`
        relative flex-1 flex flex-col items-center justify-center
        font-typewriter font-bold rounded-md transition-all duration-150 select-none focus:outline-none uppercase tracking-wider border-2
        ${active 
          ? 'bg-[#2b251d] text-[#f4ebd8] border-[#2b251d] shadow-sm' 
          : 'bg-transparent text-[#5c5040] border-[#d3c9b7] hover:bg-[#ede5d1] active:bg-[#e3d8c1]'
        }
      `}
      style={{ height: subtitle ? 52 : 46 }}
    >
      <span className="text-[13px] leading-none">{children}</span>
      {subtitle && <span className={`text-[9px] mt-1 tracking-widest ${active ? 'opacity-80' : 'opacity-60'}`}>{subtitle}</span>}
    </button>
  );
}

function MechanicalToggle({ id, label, checked, disabled, onToggle }: any) {
  return (
    <button 
      id={id}
      onClick={disabled ? undefined : onToggle} 
      disabled={disabled}
      className={`flex-1 flex items-center justify-between p-3 px-4 bg-transparent border-2 border-[#d3c9b7] rounded-md ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-[#ede5d1] transition-colors'}`}
    >
      <span className="font-typewriter text-[12px] font-bold text-[#2b251d] opacity-80 tracking-widest uppercase">{label}</span>
      <div className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-[#2b251d]' : 'bg-[#c2b6a1]'}`}>
        <motion.div 
          className="absolute top-[2px] w-4 h-4 rounded-full bg-[#f4ebd8] shadow-sm"
          animate={{ left: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        />
      </div>
    </button>
  );
}
