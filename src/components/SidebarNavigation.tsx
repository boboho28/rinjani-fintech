import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  TrendingUp, 
  Scale, 
  Coins, 
  Sparkles,
  LogOut,
  Sliders,
  Bell,
  Activity,
  User,
  ShieldCheck,
  Award,
  CandlestickChart,
  Target,
  PiggyBank
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarNavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAIModal: () => void;
  onOpenRateModal?: () => void;
  onOpenCryptoModal?: () => void;
  onOpenGoldModal?: () => void;
  onLogout?: () => void; // Tambahkan prop logout
  debtCount?: number;
  pendingBonusCount?: number;
  unclaimedTradingCount?: number;
  activeGoalsCount?: number;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  setActiveTab,
  onOpenAIModal,
  onOpenRateModal,
  onOpenCryptoModal,
  onOpenGoldModal,
  onLogout,
  debtCount = 0,
  pendingBonusCount = 0,
  unclaimedTradingCount = 0,
  activeGoalsCount = 0,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'DASHBOARD RINJANI',
      sublabel: 'Saldo Harian Real-time',
      icon: LayoutDashboard,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_#10b981]',
    },
    {
      id: 'jurnal' as ActiveTab,
      label: 'SERAH TERIMA KAS',
      sublabel: 'Arus Keluar Masuk Duit',
      icon: Receipt,
      badge: null,
    },
    {
      id: 'laporan' as ActiveTab,
      label: 'DATA REPORTAN',
      sublabel: 'Ringkasan & Analisis',
      icon: PieChart,
      badge: null,
    },
    {
      id: 'investasi' as ActiveTab,
      label: 'PORTOFOLIO SAHAM',
      sublabel: 'Saham, Emas & Crypto',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'hutang_piutang' as ActiveTab,
      label: 'HUTANG & PIUTANG',
      sublabel: 'Pantau Cicilan & Pinjaman',
      icon: Scale,
      badge: debtCount > 0 ? `${debtCount} ACTIVE` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-[0_0_6px_rgba(245,158,11,0.3)]',
    },
    {
      id: 'gaji_bonus' as ActiveTab,
      label: 'GAJI & BONUS KERJA',
      sublabel: 'Incomes & Klaim Saldo',
      icon: Coins,
      badge: pendingBonusCount > 0 ? `${pendingBonusCount} KLAIM` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]',
    },
    {
      id: 'trading' as ActiveTab,
      label: 'JURNAL TRADING',
      sublabel: 'Forex, Gold & Crypto PnL',
      icon: CandlestickChart,
      badge: unclaimedTradingCount > 0 ? `${unclaimedTradingCount} PROFIT` : 'FOREX',
      badgeColor: 'bg-gradient-to-r from-purple-500/30 to-fuchsia-500/30 text-fuchsia-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.35)]',
    },
    {
      id: 'tabungan' as ActiveTab,
      label: 'TABUNGAN & TARGET',
      sublabel: 'Rencana Impian Financial',
      icon: Target,
      badge: activeGoalsCount > 0 ? `${activeGoalsCount} TARGET` : 'IMPIAN',
      badgeColor: 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 text-teal-300 border-teal-500/40 shadow-[0_0_10px_rgba(20,184,166,0.35)]',
    },
  ];

  return (
    <aside className="w-full lg:w-80 bg-[#0c0717] border-b lg:border-b-0 lg:border-r border-purple-500/25 p-4 lg:p-5 shrink-0 flex flex-col justify-between shadow-[4px_0_20px_rgba(168,85,247,0.08)]">
      <div className="space-y-4">
        
        {/* System Header Card (Clean Rinjani System Badge) */}
        <div className="bg-[#140b24] border border-purple-500/35 rounded-2xl p-3 space-y-2 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-fuchsia-500 to-pink-400 p-0.5 shadow-neo-purple">
              <div className="w-full h-full bg-[#120a21] rounded-[10px] flex items-center justify-center">
                <span className="font-orbitron font-extrabold text-fuchsia-300 text-sm">R</span>
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h3 className="font-orbitron font-bold text-xs text-purple-100 truncate tracking-wide">RINJANI SYSTEM</h3>
                <span className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#e879f9] animate-pulse shrink-0" />
              </div>
              <p className="text-[10px] font-mono text-purple-300/70 truncate">SYSTEM SECURE ACTIVE</p>
            </div>
          </div>
          
          <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-[10px] font-orbitron text-purple-300/70">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> SYSTEM ONLINE
            </span>
            <span className="bg-purple-500/20 text-fuchsia-300 border border-purple-500/40 px-1.5 py-0.5 rounded font-mono text-[9px]">
              v2.5 NEON
            </span>
          </div>
        </div>

        {/* Quick Cyber Tools Badges Grid (Rate / Crypto / Gold) */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          <div 
            onClick={onOpenRateModal}
            className="bg-[#140b24] border border-purple-500/30 rounded-lg p-1.5 text-center flex flex-col items-center justify-center hover:border-purple-400/60 transition-all cursor-pointer group"
          >
            <Activity className="w-3.5 h-3.5 text-fuchsia-400 mb-0.5 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-orbitron text-purple-200/80 uppercase font-bold leading-tight group-hover:text-purple-100">RATE</span>
          </div>
          <div 
            onClick={onOpenCryptoModal}
            className="bg-[#140b24] border border-purple-500/30 rounded-lg p-1.5 text-center flex flex-col items-center justify-center hover:border-purple-400/60 transition-all cursor-pointer group"
          >
            <Coins className="w-3.5 h-3.5 text-purple-400 mb-0.5 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-orbitron text-purple-200/80 uppercase font-bold leading-tight group-hover:text-purple-100">CRYPTO</span>
          </div>
          <div 
            onClick={onOpenGoldModal}
            className="bg-[#140b24] border border-purple-500/30 rounded-lg p-1.5 text-center flex flex-col items-center justify-center hover:border-purple-400/60 transition-all cursor-pointer group"
          >
            <Award className="w-3.5 h-3.5 text-pink-400 mb-0.5 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-orbitron text-purple-200/80 uppercase font-bold leading-tight group-hover:text-purple-100">GOLD</span>
          </div>
        </div>

        {/* Navigation Category Label */}
        <div className="px-1 pt-2">
          <p className="text-[10px] font-orbitron font-bold uppercase tracking-widest text-purple-300/70">
            MAIN ACCESS MENU
          </p>
        </div>

        {/* Cyber Pill Tab Buttons */}
        <nav className="grid grid-cols-1 gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/35 via-fuchsia-600/25 to-purple-800/30 text-white border-2 border-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.35)]'
                    : 'text-purple-200/70 hover:text-white hover:bg-purple-500/15 border border-purple-500/20 hover:border-purple-400/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-pink-500 text-white font-black shadow-[0_0_12px_rgba(217,70,239,0.6)]'
                        : 'bg-[#160d29] text-fuchsia-400 border border-purple-500/30 group-hover:text-fuchsia-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-xs font-orbitron font-bold tracking-wider ${isActive ? 'text-fuchsia-300 drop-shadow-[0_0_6px_rgba(217,70,239,0.5)]' : 'text-slate-200'}`}>
                      {item.label}
                    </p>
                    <p className="text-[10px] text-purple-300/60 font-rajdhani font-semibold truncate max-w-[140px]">
                      {item.sublabel}
                    </p>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[9px] font-orbitron font-bold rounded-md border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Cyber AI Assistant & Logout Box */}
      <div className="mt-6 pt-4 border-t border-purple-500/20 space-y-3">
        <div className="bg-[#140b24] border border-purple-500/35 rounded-xl p-3 space-y-2 relative overflow-hidden shadow-[inset_0_0_15px_rgba(168,85,247,0.15)]">
          <div className="flex items-center gap-2 text-purple-200">
            <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
            <h4 className="text-xs font-orbitron font-bold text-white">RINJANI AI ASSISTANT</h4>
          </div>
          
          <p className="text-[10px] text-purple-200/80 leading-relaxed font-rajdhani font-medium">
            Analisis kas harian, rekomendasi hemat, dan prediksi portofolio otomatis!
          </p>

          <button
            onClick={onOpenAIModal}
            className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-neo-purple border border-fuchsia-300/30 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
            <span>KONSULTASI AI</span>
          </button>
        </div>

        {/* Logout Button Fixed */}
        <button
          onClick={() => {
            if (window.confirm("Apakah Anda yakin ingin keluar dari RINJANI System?")) {
              onLogout?.();
            }
          }}
          className="w-full bg-[#180a0a] hover:bg-rose-950/60 border border-rose-500/40 hover:border-rose-400 text-rose-400 font-orbitron font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(244,63,94,0.2)] cursor-pointer active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>LOGOUT SYSTEM</span>
        </button>
      </div>
    </aside>
  );
};
