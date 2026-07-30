import React from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionProvider';
import type { ColorMode, IntervalSeconds, StripStyle } from '../types';
import woodenbgImg from '../assets/woodenbg.png';

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

      {/* ── TOP NAV (Engraved Plate Style) ── */}
      <div className="relative z-10 w-full px-5 py-4 flex-shrink-0">
        <div className="flex justify-start">
          <motion.button
            onClick={goLanding}
            className="flex items-center gap-1 text-[#b38c4b] font-vintage text-lg active:scale-95 transition-transform focus:outline-none drop-shadow-md font-bold"
            whileTap={{ scale: 0.93 }}
            aria-label="Exit booth"
          >
            EXIT BOOTH
          </motion.button>
        </div>
      </div>

      {/* ── MAIN CONTENT (BRASS CONTROL PANEL) ── */}
      <div className="relative z-10 flex-1 w-full max-w-md mx-auto px-4 flex flex-col justify-center min-h-0 overflow-hidden">
        
        {/* Brass Plate Container */}
        <motion.div 
          className="relative bg-gradient-to-br from-[#e6c173] via-[#a37e3d] to-[#594119] rounded-xl p-3 shadow-[0_20px_40px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.4)] border border-[#ffe8a1]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Inner dark chassis */}
          <div className="relative bg-gradient-to-br from-[#381a10] to-[#1a0a05] rounded-lg p-4 sm:p-6 shadow-[inset_0_10px_20px_rgba(0,0,0,0.8)] border-t-[3px] border-[#0a0402] border-b border-[#4a2617] border-x border-[#0a0402] flex flex-col gap-4 sm:gap-6">
            
            {/* Corner Screws */}
            <Screw className="top-2 left-2" />
            <Screw className="top-2 right-2" />
            <Screw className="bottom-2 left-2" />
            <Screw className="bottom-2 right-2" />

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
            <div className="flex flex-col sm:flex-row gap-3">
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
            
          </div>
        </motion.div>

        {/* ── SUMMARY TEXT ── */}
        <motion.p
          className="text-center text-[#a37e3d] text-[10px] font-vintage tracking-[0.2em] mt-3 sm:mt-5 mb-1 sm:mb-2 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,1)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {settings.interval}s DELAY · {settings.colorMode === 'monochrome' ? 'B&W TONE' : 'RETRO TONE'}
          {settings.showCountdown ? ' · COUNTDOWN ENGAGED' : ''}
        </motion.p>

        {/* ── SHUTTER RELEASE BUTTON ── */}
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
            {/* Outer brass housing */}
            <div className="w-full bg-gradient-to-b from-[#e6c173] to-[#8c6b36] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.9)] border border-[#ffe8a1] p-1.5 sm:p-2 flex items-center justify-center">
              {/* Plunger button (Red Bakelite) */}
              <div className="w-full bg-gradient-to-b from-[#c4252a] to-[#7a0f14] rounded-lg shadow-[inset_0_3px_6px_rgba(255,255,255,0.3),0_8px_0px_#3b0408,0_12px_15px_rgba(0,0,0,0.7)] border border-[#5c0b11] transition-all duration-75 group-active:translate-y-[8px] group-active:shadow-[inset_0_3px_6px_rgba(255,255,255,0.3),0_0px_0px_#3b0408,0_4px_5px_rgba(0,0,0,0.8)] flex items-center justify-center py-3 sm:py-5">
                <div className="flex items-center gap-3 text-[#ffe8a1] font-vintage text-xl sm:text-2xl font-black tracking-widest drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)]">
                   START
                </div>
              </div>
            </div>
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
}

/* ── SUB-COMPONENTS ── */

function Screw({ className }: { className: string }) {
  return (
    <div className={`absolute w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#777] to-[#222] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.8)] flex items-center justify-center border border-[#111] ${className}`}>
      <div className="w-2.5 h-px bg-[#111] rotate-45 shadow-[0_1px_0_rgba(255,255,255,0.2)]" />
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-[#4a2617] border-b border-[#0a0402] mx-1" />;
}

function MechanicalRow({ label, children }: { label: string; children: React.ReactNode; }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 min-w-[70px] flex-shrink-0">
        <span className="font-vintage text-sm font-black text-[#a37e3d] drop-shadow-[0_1px_1px_rgba(0,0,0,1)] tracking-widest">{label}</span>
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
        font-vintage font-bold rounded transition-all duration-75 select-none focus:outline-none uppercase tracking-wider
        ${active 
          ? 'bg-[#1c0a04] text-[#e6c173] border-2 border-[#0a0402] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] translate-y-[4px]' 
          : 'bg-gradient-to-b from-[#4a2617] to-[#361a0f] text-[#fce3a2] border-x-2 border-t-2 border-[#6d3921] border-b-[6px] border-b-[#140603] shadow-[0_4px_10px_rgba(0,0,0,0.6)] hover:from-[#5c301c] hover:to-[#4a2617] active:translate-y-[4px] active:border-b-[2px]'
        }
      `}
      style={{ height: subtitle ? 52 : 46 }}
    >
      <span className="text-[13px] leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{children}</span>
      {subtitle && <span className={`text-[9px] font-sans mt-1 uppercase tracking-widest ${active ? 'text-[#a37e3d]' : 'text-[#a37e3d]/70'}`}>{subtitle}</span>}
    </button>
  );
}

function MechanicalToggle({ id, label, checked, disabled, onToggle }: any) {
  return (
    <button 
      id={id}
      onClick={disabled ? undefined : onToggle} 
      disabled={disabled}
      className={`flex-1 flex flex-col justify-center gap-2 p-3 bg-gradient-to-br from-[#291107] to-[#1c0a04] border-t-[3px] border-[#0a0402] border-b-2 border-[#381a10] rounded-lg shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] ${disabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.98] cursor-pointer hover:from-[#36160a] hover:to-[#220d05] transition-colors'}`}
    >
      <div className="flex items-center gap-3">
        {/* Switch casing */}
        <div className="relative w-12 h-6 bg-[#0a0402] rounded border-2 border-[#000] shadow-[inset_0_2px_4px_rgba(0,0,0,1)] flex-shrink-0">
          {/* Bat handle */}
          <motion.div 
            className="absolute top-[-2px] w-6 h-[26px] rounded bg-gradient-to-b from-[#e6c173] via-[#8c6b36] to-[#4a3617] border-x border-t border-[#fce3a2] border-b-[4px] border-b-[#33220a] shadow-[0_4px_5px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center gap-[2px] z-10"
            animate={{ left: checked ? 22 : -2 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
          >
            <div className="w-3 h-px bg-[#4a3617] opacity-60" />
            <div className="w-3 h-px bg-[#4a3617] opacity-60" />
            <div className="w-3 h-px bg-[#4a3617] opacity-60" />
          </motion.div>
          {/* Red/Green indicator dots inside casing */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
             <div className="w-2 h-2 rounded-full bg-[#111] shadow-[inset_0_1px_2px_rgba(0,0,0,1)]" />
             <div className="w-2 h-2 rounded-full bg-[#5c0b11] shadow-[inset_0_1px_2px_rgba(0,0,0,1)]" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-vintage text-[11px] font-black text-[#a37e3d] tracking-wider leading-none mt-0.5">{label}</span>
        </div>
      </div>
    </button>
  );
}
