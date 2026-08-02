import React from 'react';
import { Megaphone, Settings2, Sparkles } from 'lucide-react';
import { MarqueeSettings } from '../types';

interface RunningTickerBannerProps {
  settings: MarqueeSettings;
  onOpenSettingsModal: () => void;
}

export const RunningTickerBanner: React.FC<RunningTickerBannerProps> = ({
  settings,
  onOpenSettingsModal,
}) => {
  if (!settings.isEnabled) return null;

  // Determine text color class based on theme
  const getColorClass = () => {
    switch (settings.colorTheme) {
      case 'gold':
        return 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      case 'emerald':
        return 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]';
      case 'cyan':
        return 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]';
      case 'pink':
        return 'text-pink-300 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]';
      case 'purple':
        return 'text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]';
      case 'rainbow':
        return 'bg-gradient-to-r from-amber-400 via-emerald-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-bold';
      default:
        return 'text-amber-300';
    }
  };

  const displayText = settings.text.trim() || 'Have a nice day, have a good work, keep up the spirit !!! 🚀⚡';

  return (
    <div className="bg-[#0e071a] border-b border-purple-500/25 py-2 px-3 sm:px-6 relative overflow-hidden flex items-center justify-between gap-3 shadow-[0_2px_15px_rgba(168,85,247,0.12)]">
      
      {/* Left Icon Badge */}
      <div className="z-10 flex items-center gap-2 bg-[#160b29] border border-purple-500/40 px-2.5 py-1 rounded-xl shadow-inner shrink-0">
        <Megaphone className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
        <span className="text-[10px] font-orbitron font-bold text-fuchsia-300 uppercase tracking-widest hidden sm:inline">
          ANNOUNCEMENT
        </span>
      </div>

      {/* Center Running Marquee Text Area */}
      <div className="flex-1 overflow-hidden relative flex items-center h-7 mask-fade-edges">
        <div 
          className="animate-marquee flex items-center whitespace-nowrap"
          style={{ animationDuration: `${settings.speedDuration}s` }}
        >
          {/* Duplicate text 4 times to ensure continuous seamless scrolling */}
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="flex items-center gap-6 mr-12 shrink-0">
              <span className={`text-sm sm:text-base ${settings.fontFamily} ${getColorClass()} tracking-wider font-semibold`}>
                {displayText}
              </span>
              <Sparkles className="w-4 h-4 text-amber-400/70 inline-block shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Edit/Settings Button */}
      <button
        onClick={onOpenSettingsModal}
        title="Ganti Text & Font Berjalan"
        className="z-10 flex items-center gap-1.5 bg-[#16130b] hover:bg-amber-500/20 text-amber-300 hover:text-white border border-amber-500/40 px-2.5 py-1 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer shrink-0 shadow-inner group"
      >
        <Settings2 className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
        <span className="text-[10px] hidden md:inline">GANTI TEXT</span>
      </button>

    </div>
  );
};
