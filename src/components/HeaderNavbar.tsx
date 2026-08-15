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
  UserCheck,
  Menu
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
  toggleSidebar: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  totalBalance,
  netWorth,
  onOpenAddModal,
  onOpenAIModal,
  onExportData,
  onResetDemo,
  toggleSidebar,
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
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300">
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-purple-700 via-fuchsia-500 to-pink-400 p-0.5 shadow-neo-purple">
                <div className="w-full h-full bg-[#120a21] rounded-[10px] flex items-center justify-center">
                  <span className="font-orbitron font-black text-fuchsia-300 text-lg tracking-widest">MDG</span>
                </div>
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-fuchsia-400 shadow-[0_0_10px_#e879f9] animate-pulse" />
            </div>

            <div className="overflow-hidden">
              <h1 className="font-orbitron font-black text-sm sm:text-xl tracking-wider text-cyber-gold drop-shadow-[0_2px_8px_rgba(168,85,247,0.35)] truncate">
                MONEY DENDA GIANA
              </h1>
              <p className="text-[9px] sm:text-[11px] font-rajdhani font-semibold tracking-wider text-purple-200/80 truncate">
                SYSTEM REAL-TIME DASHBOARD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
             {/* Mobile AI Trigger Button */}
            <button
              onClick={onOpenAIModal}
              className="md:hidden p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 text-[10px] font-bold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full md:w-auto">
          
          <div className="bg-[#140b24] border border-purple-500/40 rounded-xl px-2.5 py-1 sm:px-3.5 sm:py-1.5 flex items-center gap-2 sm:gap-3 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
            <div className="p-1 sm:p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <p className="text-[8px] sm:text-[9px] font-orbitron font-bold text-purple-300/80 uppercase">Saldo Kas</p>
              <p className={`text-xs sm:text-sm font-bold font-mono ${totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatRupiah(totalBalance)}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex bg-[#140b24] border border-purple-500/40 rounded-xl px-3.5 py-1.5 items-center gap-3 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-fuchsia-300 border border-purple-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] font-orbitron font-bold text-purple-300/80 uppercase">Net Worth</p>
              <p className="text-sm font-bold font-mono text-fuchsia-300">
                {formatRupiah(netWorth)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenAddModal}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-orbitron font-bold text-[10px] sm:text-xs px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-1.5 shadow-neo-green transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">CATAT</span>
            </button>

            <button
              onClick={onExportData}
              className="p-1.5 sm:p-2 rounded-xl bg-[#140b24] text-purple-300 border border-purple-500/40 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
