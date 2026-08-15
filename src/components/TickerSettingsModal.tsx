import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Type, 
  Palette, 
  Gauge, 
  Check, 
  RotateCcw,
  Sliders,
  Play
} from 'lucide-react';
import { MarqueeSettings, MarqueeFontFamily, MarqueeColorTheme } from '../types';

interface TickerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: MarqueeSettings;
  onSaveSettings: (newSettings: MarqueeSettings) => void;
}

const PRESET_MESSAGES = [
  "Have a nice day, have a good work, keep up the spirit !!! 🚀⚡",
  "🔥 MONEY DENDA GIANA: MONITORING KAS, BANK, SAHAM & EMAS REAL-TIME 💰📈",
  "💪 SELAMAT BEKERJA & SEMANGAT MENCAPAI KEBEBASAN FINANSIAL! 🏆",
  "⚡ LIVE TICKER: XAU/USD SPOT GOLD & CRYPTO MARKET ALL-TIME HIGH 🚀",
  "✨ CATAT SETIAP TRANSAKSI, JAGA CASHFLOW TETAP SEHAT & AMAN! 🛡️",
];

const FONTS_LIST: { id: MarqueeFontFamily; label: string; sampleText: string }[] = [
  { id: 'font-press-start', label: 'Press Start 2P', sampleText: 'RETRO 8-BIT ARCADE' },
  { id: 'font-orbitron', label: 'Orbitron', sampleText: 'CYBER SCI-FI NEON' },
  { id: 'font-audiowide', label: 'Audiowide', sampleText: 'SYNTHWAVE TECHNO' },
  { id: 'font-chakra', label: 'Chakra Petch', sampleText: 'CYBERPUNK ESPORTS' },
  { id: 'font-vt323', label: 'VT323 Terminal', sampleText: 'CRT GREEN MATRIX' },
  { id: 'font-share-tech', label: 'Share Tech Mono', sampleText: 'HACKER CODE MONO' },
  { id: 'font-monoton', label: 'Monoton', sampleText: 'DISCO NEON GLOW' },
  { id: 'font-permanent', label: 'Permanent Marker', sampleText: 'GRAFFITI HANDWRITTEN' },
  { id: 'font-russo', label: 'Russo One', sampleText: 'IMPACT HEAVY BOLD' },
  { id: 'font-rajdhani', label: 'Rajdhani', sampleText: 'SLEEK FUTURISTIC' },
];

const COLOR_THEMES: { id: MarqueeColorTheme; label: string; colorClass: string; bgBadge: string }[] = [
  { id: 'purple', label: 'Electric Purple', colorClass: 'text-purple-300', bgBadge: 'from-purple-500 to-indigo-600' },
  { id: 'gold', label: 'Cyber Gold', colorClass: 'text-amber-300', bgBadge: 'from-amber-500 to-yellow-600' },
  { id: 'emerald', label: 'Neon Emerald', colorClass: 'text-emerald-300', bgBadge: 'from-emerald-500 to-teal-600' },
  { id: 'cyan', label: 'Cyber Cyan', colorClass: 'text-cyan-300', bgBadge: 'from-cyan-500 to-blue-600' },
  { id: 'pink', label: 'Synthwave Pink', colorClass: 'text-pink-300', bgBadge: 'from-pink-500 to-rose-600' },
  { id: 'rainbow', label: 'Rainbow Neon', colorClass: 'bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent font-bold', bgBadge: 'from-purple-400 via-fuchsia-400 to-pink-500' },
];

export const TickerSettingsModal: React.FC<TickerSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [text, setText] = useState(settings.text);
  const [fontFamily, setFontFamily] = useState<MarqueeFontFamily>(settings.fontFamily);
  const [colorTheme, setColorTheme] = useState<MarqueeColorTheme>(settings.colorTheme);
  const [speedDuration, setSpeedDuration] = useState<number>(settings.speedDuration);
  const [isEnabled, setIsEnabled] = useState<boolean>(settings.isEnabled);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      text: text.trim() || "Have a nice day, have a good work, keep up the spirit !!! 🚀⚡",
      fontFamily,
      colorTheme,
      speedDuration,
      isEnabled,
    });
    onClose();
  };

  const handleResetDefault = () => {
    setText("Have a nice day, have a good work, keep up the spirit !!! 🚀⚡");
    setFontFamily('font-press-start');
    setColorTheme('purple');
    setSpeedDuration(18);
    setIsEnabled(true);
  };

  const getColorPreviewClass = () => {
    switch (colorTheme) {
      case 'purple':
        return 'text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]';
      case 'gold':
        return 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      case 'emerald':
        return 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]';
      case 'cyan':
        return 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]';
      case 'pink':
        return 'text-pink-300 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]';
      case 'rainbow':
        return 'bg-gradient-to-r from-purple-400 via-fuchsia-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-bold';
      default:
        return 'text-purple-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-neo-purple overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-500/20 flex items-center justify-between bg-[#1a0f30]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-purple-700 text-white font-orbitron font-bold shadow-neo-purple">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded">
                CUSTOMIZE RUNNING TICKER
              </span>
              <h2 className="text-lg sm:text-xl font-orbitron font-black text-neon-purple tracking-wide mt-0.5">
                PENGATURAN TEXT & FONT BERJALAN
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-[#130b20] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Live Preview Box */}
          <div className="bg-[#1a0f30] border border-purple-500/40 rounded-2xl p-4 space-y-2 shadow-neo-purple">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                <Play className="w-3 h-3 text-purple-400 fill-purple-400" /> LIVE PREVIEW RUNNING TEXT
              </span>
              <span className="text-[10px] font-mono text-purple-200/60">
                Kecepatan: {speedDuration}s
              </span>
            </div>

            <div className="bg-[#130b20] border border-purple-500/30 rounded-xl p-3 overflow-hidden relative flex items-center h-12">
              <div 
                className="animate-marquee flex items-center whitespace-nowrap"
                style={{ animationDuration: `${speedDuration}s` }}
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-6 mr-10 shrink-0">
                    <span className={`text-base ${fontFamily} ${getColorPreviewClass()} tracking-wider font-semibold`}>
                      {text || "Have a nice day, have a good work, keep up the spirit !!! 🚀⚡"}
                    </span>
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text Input & Presets */}
          <div className="space-y-3">
            <label className="text-xs font-orbitron font-bold text-purple-300 uppercase flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-400" />
              <span>1. TULIS TEXT BERJALAN ANDA:</span>
            </label>
            <textarea
              rows={2}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Masukkan pesan kalimat yang ingin disajikan pada text berjalan..."
              className="w-full bg-[#0d0718] border border-purple-500/30 rounded-xl p-3 text-sm text-purple-100 font-medium focus:outline-none focus:border-purple-400"
            />

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-orbitron text-purple-200/70 block">
                Pilih Kalimat Rekomendasi / Preset:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_MESSAGES.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => setText(msg)}
                    className="text-left text-[11px] font-sans bg-[#1a0f30] hover:bg-purple-500/20 text-purple-200/90 hover:text-white border border-purple-500/25 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    "{msg.slice(0, 42)}..."
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Font Selector Grid */}
          <div className="space-y-3">
            <label className="text-xs font-orbitron font-bold text-purple-300 uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>2. PILIH FONT KEREN:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FONTS_LIST.map((f) => {
                const isSelected = fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFontFamily(f.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-400 shadow-neo-purple'
                        : 'bg-[#0d0718] border-purple-500/20 hover:border-purple-500/50'
                    }`}
                  >
                    <div>
                      <p className="text-[10px] font-orbitron text-purple-200/70 uppercase">
                        {f.label}
                      </p>
                      <p className={`text-sm ${f.id} text-purple-300 font-bold mt-0.5 truncate`}>
                        {f.sampleText}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-purple-400 text-slate-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Theme Selector */}
          <div className="space-y-3">
            <label className="text-xs font-orbitron font-bold text-purple-300 uppercase flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>3. WARNA NEON & TEMATIK:</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COLOR_THEMES.map((theme) => {
                const isSelected = colorTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setColorTheme(theme.id)}
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-400 shadow-neo-purple'
                        : 'bg-[#0d0718] border-purple-500/20 hover:border-purple-500/40'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.bgBadge} shrink-0`} />
                    <span className={`text-xs font-orbitron font-bold ${theme.colorClass}`}>
                      {theme.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Speed Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-orbitron font-bold text-purple-300 uppercase flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-400" />
                <span>4. KECEPATAN JALAN:</span>
              </label>
              <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded">
                {speedDuration} Detik {speedDuration <= 12 ? '(Sangat Cepat)' : speedDuration >= 28 ? '(Pelan)' : '(Normal)'}
              </span>
            </div>

            <input
              type="range"
              min={8}
              max={35}
              step={1}
              value={speedDuration}
              onChange={(e) => setSpeedDuration(parseInt(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-purple-500/20 bg-[#1a0f30] flex items-center justify-between">
          <button
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 text-xs font-orbitron text-purple-200/70 hover:text-purple-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET DEFAULT</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#130b20] hover:bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-orbitron font-bold transition-all cursor-pointer"
            >
              BATAL
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white text-xs font-orbitron font-bold shadow-neo-purple transition-all cursor-pointer active:scale-95"
            >
              SIMPAN PENGATURAN
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
