import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Sparkles, 
  PlusCircle, 
  Download, 
  RefreshCw,
  TrendingUp,
  Landmark,
  ShieldCheck,
  Clock,
  UserCheck
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { ActiveTab } from '../types';

interface HeaderNavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  totalBalance: number;
  netWorth: number;
  onOpenAddModal: () => void;
  onOpenAIModal: () => void;
  onExportData: () => void;
  onResetDemo: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  totalBalance,
  netWorth,
  onOpenAddModal,
  onOpenAIModal,
  onExportData,
  onResetDemo,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const optionsDate: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      };
      setDateStr(now.toLocaleDateString('id-ID', optionsDate).toUpperCase());
      setTimeStr(now.toLocaleTimeString('id-ID', { hour12: false }));
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#0e0819]/95 backdrop-blur-md border-b border-purple-500/30 shadow-[0_4px_20px_rgba(168,85,247,0.18)] text-white px-3 sm:px-5 lg:px-6 py-2 transition-all">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & User Profile Info */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          
          {/* Main Cyber Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-700 via-fuchsia-500 to-pink-400 p-0.5 shadow-neo-purple">
                <div className="w-full h-full bg-[#120a21] rounded-[10px] flex items-center justify-center">
                  <span className="font-orbitron font-black text-fuchsia-300 text-lg tracking-widest">R</span>
                </div>
              </div>
              {/* Glowing Neon Lamp */}
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-fuchsia-400 shadow-[0_0_10px_#e879f9] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-orbitron font-black text-xl tracking-wider text-cyber-gold drop-shadow-[0_2px_8px_rgba(168,85,247,0.35)]">
                  RINJANI FINTECH
                </h1>
              </div>
              <p className="text-[11px] font-rajdhani font-semibold tracking-wider text-purple-200/80">
                SYSTEM REAL-TIME DASHBOARD & MONITORING
              </p>
            </div>
          </div>

          {/* Live Cyber Digital Clock Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-[#140b24] border border-purple-500/30 px-3 py-1.5 rounded-xl shadow-inner">
            <Clock className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
            <div className="font-mono text-xs">
              <span className="text-purple-300/60 mr-1.5 text-[10px]">{dateStr}</span>
              <span className="font-bold text-fuchsia-300 tracking-widest">{timeStr}</span>
              <span className="ml-1.5 text-[9px] bg-purple-500/20 text-purple-300 px-1 rounded font-sans">GMT+7</span>
            </div>
          </div>

          {/* Mobile AI Trigger Button */}
          <button
            onClick={onOpenAIModal}
            className="md:hidden p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 text-xs font-bold"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI</span>
          </button>
        </div>

        {/* Real-Time Balance Pills & Controls */}
        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
          
          {/* Daily Balance Cyber Pill */}
          <div className="bg-[#140b24] border border-purple-500/40 rounded-xl px-3.5 py-1.5 flex items-center gap-3 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] font-orbitron font-bold text-purple-300/80 uppercase tracking-widest">Saldo Kas & Bank</p>
              <p className={`text-sm font-bold tracking-wide font-mono ${totalBalance >= 0 ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'text-rose-400'}`}>
                {formatRupiah(totalBalance)}
              </p>
            </div>
          </div>

          {/* Net Worth Cyber Pill */}
          <div className="hidden sm:flex bg-[#140b24] border border-purple-500/40 rounded-xl px-3.5 py-1.5 items-center gap-3 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-fuchsia-300 border border-purple-500/30 shadow-[0_0_8px_rgba(168,85,247,0.3)]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] font-orbitron font-bold text-purple-300/80 uppercase tracking-widest">Kekayaan Bersih (Net Worth)</p>
              <p className="text-sm font-bold tracking-wide font-mono text-fuchsia-300 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">
                {formatRupiah(netWorth)}
              </p>
            </div>
          </div>

          {/* Action Buttons with Cyber Neo Glows */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-neo-green transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>CATAT TRANSAKSI</span>
            </button>

            <button
              onClick={onOpenAIModal}
              className="hidden md:flex bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs px-3.5 py-2 rounded-xl items-center gap-1.5 shadow-neo-purple border border-fuchsia-300/40 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-white fill-white" />
              <span>AI RINJANI</span>
            </button>

            <button
              onClick={onExportData}
              title="Ekspor Backup Data JSON"
              className="p-2 rounded-xl bg-[#140b24] hover:bg-purple-950/60 text-purple-300 border border-purple-500/40 transition-all cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)]"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onResetDemo}
              title="Reset ke Data Demo"
              className="p-2 rounded-xl bg-[#140b24] hover:bg-rose-950/60 text-rose-400 border border-rose-500/40 transition-all cursor-pointer shadow-[0_0_10px_rgba(244,63,94,0.15)]"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
