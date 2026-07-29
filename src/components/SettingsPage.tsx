import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowLeft, Eye, Clock, Timer, Calendar, Layers } from 'lucide-react';
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
            <ArrowLeft size={18} strokeWidth={3} />
            EXIT BOOTH
          </motion.button>
        </div>
      </div>

      {/* ── MAIN CONTENT (BRASS CONTROL PANEL) ── */}
      <div className="relative z-10 flex-1 w-full max-w-md mx-auto px-4 flex flex-col justify-center min-h-0 overflow-hidden">
        
        {/* Brass Plate Container */}
        <motion.div 
          className="relative bg-gradient-to-br from-[#c49b5c] via-[#8c6b36] to-[#4a3617] rounded-xl p-2 shadow-[0_15px_30px_rgba(0,0,0,0.8)] border border-[#fce3a2]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Inner dark chassis */}
          <div className="relative bg-[#120804] rounded-lg p-5 shadow-[inset_0_10px_20px_rgba(0,0,0,0.9)] border border-[#26130b] flex flex-col gap-5">
            
            {/* Corner Screws */}
            <Screw className="top-2 left-2" />
            <Screw className="top-2 right-2" />
            <Screw className="bottom-2 left-2" />
            <Screw className="bottom-2 right-2" />

            {/* Color Mode */}
            <MechanicalRow icon={<Eye size={16} />} label="TONE">
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
            <MechanicalRow icon={<Clock size={16} />} label="DELAY">
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
            <MechanicalRow icon={<Layers size={16} />} label="STRIP">
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
                icon={<Timer size={14} />}
                label="COUNTDOWN"
                checked={settings.showCountdown}
                onToggle={() => updateSettings({ showCountdown: !settings.showCountdown })}
              />

              <MechanicalToggle
                id="timestamp-toggle"
                icon={<Calendar size={14} />}
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
          className="text-center text-[#a37e3d] text-[10px] font-vintage tracking-[0.2em] mt-5 mb-2 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,1)]"
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
            <div className="w-full bg-gradient-to-b from-[#d4a853] to-[#8c6b36] rounded-lg shadow-[0_8px_15px_rgba(0,0,0,0.8)] border border-[#e6d0a3] p-1.5 flex items-center justify-center">
              {/* Plunger button (Red Bakelite) */}
              <div className="w-full bg-gradient-to-b from-[#c4252a] to-[#7a0f14] rounded shadow-[inset_0_2px_3px_rgba(255,255,255,0.3),0_5px_0px_#4a0508,0_8px_10px_rgba(0,0,0,0.6)] border border-[#4a0508] transition-all duration-75 group-active:translate-y-[5px] group-active:shadow-[inset_0_2px_3px_rgba(255,255,255,0.3),0_0px_0px_#4a0508,0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center py-4 relative mb-[5px] group-active:mb-0">
                <div className="flex items-center gap-3 text-[#ffebd6] font-vintage text-2xl font-black tracking-widest drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]">
                   <Camera size={24} strokeWidth={2.5} />
                   LET'S GO
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
  return <div className="h-px bg-[#26130b] border-b border-[#050201] mx-1" />;
}

function MechanicalRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode; }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 min-w-[70px] flex-shrink-0">
        <span className="text-[#8c6b36] drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">{icon}</span>
        <span className="font-vintage text-sm font-black text-[#a37e3d] drop-shadow-[0_1px_1px_rgba(0,0,0,1)] tracking-widest">{label}</span>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function MechanicalChip({ id, active, onClick, children, subtitle }: any) {
  return (
    <div className="flex-1 flex flex-col relative" style={{ height: subtitle ? 52 : 46 }}>
      <button
        id={id}
        onClick={onClick}
        aria-pressed={active}
        className={`
          absolute inset-x-0 top-0 flex flex-col items-center justify-center
          font-vintage font-bold rounded transition-all duration-100 select-none focus:outline-none uppercase tracking-wider
          ${active 
            ? 'bg-[#0a0402] text-[#d4a853] shadow-[inset_0_3px_6px_rgba(0,0,0,0.9)] border border-[#000] translate-y-[4px]' 
            : 'bg-gradient-to-b from-[#3a2015] to-[#26130b] text-[#e8d5b5] shadow-[0_4px_0_#0a0402,0_6px_8px_rgba(0,0,0,0.6)] border border-[#4a2b1c] hover:from-[#422619] hover:to-[#2e170d] active:translate-y-[4px] active:shadow-[0_0px_0_#0a0402,0_0px_0px_rgba(0,0,0,0)]'
          }
        `}
        style={{ height: subtitle ? 48 : 42 }}
      >
        <span className="text-[13px] leading-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{children}</span>
        {subtitle && <span className={`text-[9px] font-sans mt-1 uppercase tracking-widest ${active ? 'text-[#8c6b36]' : 'text-[#8c6b36]/70'}`}>{subtitle}</span>}
      </button>
    </div>
  );
}

function MechanicalToggle({ id, icon, label, checked, disabled, onToggle }: any) {
  return (
    <button 
      id={id}
      onClick={disabled ? undefined : onToggle} 
      disabled={disabled}
      className={`flex-1 flex flex-col justify-center gap-2 p-2.5 bg-[#180a06] border border-[#050201] rounded shadow-[inset_0_2px_5px_rgba(0,0,0,0.9)] ${disabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.98] cursor-pointer hover:bg-[#1a0b07] transition-colors'}`}
    >
      <div className="flex items-center gap-3">
        {/* Switch casing */}
        <div className="relative w-12 h-6 bg-[#050201] rounded-full border border-[#000] shadow-[inset_0_2px_5px_rgba(0,0,0,1)] flex-shrink-0">
          {/* Bat handle */}
          <motion.div 
            className="absolute top-0 w-6 h-6 rounded-full bg-gradient-to-b from-[#e6d0a3] to-[#8c6b36] border border-[#4a3617] shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center gap-[1px] z-10"
            animate={{ left: checked ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div className="w-2.5 h-[1px] bg-[#4a3617] opacity-70" />
            <div className="w-2.5 h-[1px] bg-[#4a3617] opacity-70" />
            <div className="w-2.5 h-[1px] bg-[#4a3617] opacity-70" />
          </motion.div>
          {/* Red/Green indicator dots inside casing */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
             <div className="w-1.5 h-1.5 rounded-full bg-[#111]" />
             <div className="w-1.5 h-1.5 rounded-full bg-[#5c0b11]" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#8c6b36]">{icon}</span>
          <span className="font-vintage text-[11px] font-black text-[#a37e3d] tracking-wider leading-none mt-0.5">{label}</span>
        </div>
      </div>
    </button>
  );
}
