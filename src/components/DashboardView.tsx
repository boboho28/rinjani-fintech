import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Building2, 
  Smartphone, 
  CreditCard, 
  Sparkles, 
  PlusCircle, 
  Scale, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  Zap,
  Flame,
  FileText,
  Search,
  Bell,
  RefreshCw,
  Award,
  DollarSign,
  Coins
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { Transaction, AccountType, Investment, DebtItem } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { BankLogo } from './BankIcon';

interface DashboardViewProps {
  transactions: Transaction[];
  investments: Investment[];
  debts: DebtItem[];
  totalBalance: number;
  netWorth: number;
  onOpenAddModal: () => void;
  onOpenAIModal: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  investments,
  debts,
  totalBalance,
  netWorth,
  onOpenAddModal,
  onOpenAIModal,
  onNavigateToTab,
}) => {
  // Account Balances Calculation
  const accountBalances: Record<AccountType, number> = {
    'Kas / Tunai': 0,
    'Bank BCA': 0,
    'Bank Mandiri': 0,
    'Bank BRI': 0,
    'Bank BNI': 0,
    'SeaBank': 0,
    'E-Wallet (GoPay/OVO/DANA)': 0,
    'Rekening Investasi': 0,
  };

  transactions.forEach((tx) => {
    if (accountBalances[tx.account] !== undefined) {
      if (tx.type === 'income') {
        accountBalances[tx.account] += tx.amount;
      } else {
        accountBalances[tx.account] -= tx.amount;
      }
    }
  });

  // Calculate Monthly Metrics
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const monthTransactions = transactions.filter((tx) => tx.date.startsWith(currentMonthStr));
  
  const monthlyIncome = monthTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const monthlyExpense = monthTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const monthlySavings = monthlyIncome - monthlyExpense;

  // Investment Total Value
  const totalInvestmentValue = investments.reduce(
    (acc, inv) => acc + inv.currentPrice * inv.shares, 
    0
  );

  // Debts and Receivables Total
  const totalDebtsOwed = debts
    .filter((d) => d.type === 'hutang')
    .reduce((acc, d) => acc + (d.totalAmount - d.paidAmount), 0);

  const totalReceivableOwed = debts
    .filter((d) => d.type === 'piutang')
    .reduce((acc, d) => acc + (d.totalAmount - d.paidAmount), 0);

  // Daily Chart Data
  const dailyChartMap: Record<string, { income: number; expense: number; net: number }> = {};
  const sortedTx = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  
  sortedTx.forEach((tx) => {
    if (!dailyChartMap[tx.date]) {
      dailyChartMap[tx.date] = { income: 0, expense: 0, net: 0 };
    }
    if (tx.type === 'income') {
      dailyChartMap[tx.date].income += tx.amount;
      dailyChartMap[tx.date].net += tx.amount;
    } else {
      dailyChartMap[tx.date].expense += tx.amount;
      dailyChartMap[tx.date].net -= tx.amount;
    }
  });

  const chartData = Object.keys(dailyChartMap)
    .sort()
    .slice(-10)
    .map((date) => {
      const [y, m, d] = date.split('-');
      return {
        dateDisplay: `${d}/${m}`,
        fullDate: date,
        Pemasukan: dailyChartMap[date].income,
        Pengeluaran: dailyChartMap[date].expense,
        ArusKasNet: dailyChartMap[date].net,
      };
    });

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Iconic RINJANI Hero Main Board - Compact High-Tech Version */}
      <div className="relative bg-[#0e071a] border-2 border-purple-500/35 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-[0_0_20px_rgba(168,85,247,0.18)] overflow-hidden">
        
        {/* Ambient Purple/Pink Radial Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Cyber Mount Rinjani Vector Backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-75">
          <svg
            className="w-full h-full absolute bottom-0 left-0"
            viewBox="0 0 1200 280"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="rinjaniSunGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#9333ea" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0e071a" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="rinjaniGoldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d8b4fe" stopOpacity="0.85" />
                <stop offset="40%" stopColor="#9333ea" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0e071a" stopOpacity="0.98" />
              </linearGradient>

              <linearGradient id="rinjaniBackGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0e071a" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="auroraGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0" />
                <stop offset="30%" stopColor="#e879f9" stopOpacity="0.7" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.65" />
                <stop offset="85%" stopColor="#a855f7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="segaraAnakGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
                <stop offset="100%" stopColor="#e879f9" stopOpacity="0.7" />
              </linearGradient>

              <linearGradient id="peakGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#f472b6" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="meteorTail" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="40%" stopColor="#e879f9" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>

              <radialGradient id="sunBurst" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f472b6" stopOpacity="0.7" />
                <stop offset="35%" stopColor="#a855f7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0e071a" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="scanBeam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
                <stop offset="50%" stopColor="#e879f9" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </linearGradient>
            </defs>

            <style>{`
              @keyframes starTwinkle {
                0%, 100% { opacity: 0.3; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.4); }
              }
              @keyframes laserScan {
                0% { transform: translateX(-150px); opacity: 0; }
                15% { opacity: 0.85; }
                85% { opacity: 0.85; }
                100% { transform: translateX(1350px); opacity: 0; }
              }
              @keyframes volcanicSmoke {
                0% { transform: translate(0, 0) scale(1); opacity: 0.9; }
                50% { transform: translate(-12px, -30px) scale(2); opacity: 0.5; }
                100% { transform: translate(-25px, -60px) scale(2.8); opacity: 0; }
              }
              @keyframes mistDrift {
                0% { transform: translateX(-250px); opacity: 0.15; }
                50% { opacity: 0.5; }
                100% { transform: translateX(1250px); opacity: 0.15; }
              }
              @keyframes lakeShimmer {
                0%, 100% { filter: drop-shadow(0px 0px 10px rgba(192,132,252,0.7)); }
                50% { filter: drop-shadow(0px 0px 22px rgba(232,121,249,1)); }
              }
              @keyframes beaconPulse {
                0% { transform: scale(0.8); opacity: 1; }
                100% { transform: scale(3.5); opacity: 0; }
              }
              @keyframes auroraFlow {
                0% { transform: translateY(0px) skewX(-5deg); opacity: 0.4; }
                50% { transform: translateY(-15px) skewX(5deg); opacity: 0.75; }
                100% { transform: translateY(0px) skewX(-5deg); opacity: 0.4; }
              }
              @keyframes meteorStreak1 {
                0% { transform: translate(0, 0); opacity: 0; }
                20% { opacity: 1; }
                60% { opacity: 1; }
                100% { transform: translate(320px, 160px); opacity: 0; }
              }
              @keyframes meteorStreak2 {
                0% { transform: translate(0, 0); opacity: 0; }
                30% { opacity: 1; }
                70% { opacity: 1; }
                100% { transform: translate(280px, 140px); opacity: 0; }
              }
              @keyframes particleEmber {
                0% { transform: translate(0, 0) scale(1); opacity: 0.9; }
                100% { transform: translate(-30px, -80px) scale(0.2); opacity: 0; }
              }
              @keyframes contourGlow {
                0%, 100% { opacity: 0.3; stroke-width: 1; }
                50% { opacity: 0.85; stroke-width: 1.8; }
              }
              .star-1 { animation: starTwinkle 2.2s infinite ease-in-out; }
              .star-2 { animation: starTwinkle 3.5s infinite ease-in-out 0.8s; }
              .star-3 { animation: starTwinkle 1.7s infinite ease-in-out 0.4s; }
              .laser-beam { animation: laserScan 7s infinite linear; }
              .smoke-p1 { animation: volcanicSmoke 2.8s infinite cubic-bezier(0.4, 0, 0.2, 1); }
              .smoke-p2 { animation: volcanicSmoke 2.8s infinite cubic-bezier(0.4, 0, 0.2, 1) 1.4s; }
              .mist-layer { animation: mistDrift 24s infinite linear; }
              .lake-glow { animation: lakeShimmer 3.5s infinite ease-in-out; }
              .summit-beacon-1 { animation: beaconPulse 2.4s infinite cubic-bezier(0, 0.2, 0.8, 1); }
              .summit-beacon-2 { animation: beaconPulse 2.4s infinite cubic-bezier(0, 0.2, 0.8, 1) 1.2s; }
              .aurora-ribbon { animation: auroraFlow 10s infinite ease-in-out; transform-origin: center; }
              .meteor-1 { animation: meteorStreak1 6s infinite ease-in 1.5s; }
              .meteor-2 { animation: meteorStreak2 9s infinite ease-in 4s; }
              .ember-1 { animation: particleEmber 3s infinite linear; }
              .ember-2 { animation: particleEmber 3.5s infinite linear 1.2s; }
              .ember-3 { animation: particleEmber 2.5s infinite linear 0.7s; }
              .contour-line { animation: contourGlow 4s infinite ease-in-out; }
            `}</style>

            {/* Aurora Borealis Waves over Mount Rinjani */}
            <path
              className="aurora-ribbon"
              d="M100 80 Q 400 20 720 60 T 1100 40 L 1150 120 Q 750 100 400 130 T 50 110 Z"
              fill="url(#auroraGrad)"
              filter="blur(14px)"
            />

            {/* Celestial Sun Burst behind Rinjani Summit */}
            <circle cx="720" cy="75" r="160" fill="url(#sunBurst)" />

            {/* Cyber Grid Elevation Lines in Sky */}
            <line x1="0" y1="60" x2="1200" y2="60" stroke="#c084fc" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.3" />
            <line x1="0" y1="110" x2="1200" y2="110" stroke="#c084fc" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.35" />

            {/* Animated Cyber Radar Scanning Beam */}
            <rect className="laser-beam" x="0" y="0" width="100" height="280" fill="url(#scanBeam)" />

            {/* Glowing Twinkling Stars */}
            <circle className="star-1" cx="120" cy="35" r="2.2" fill="#e879f9" />
            <circle className="star-2" cx="280" cy="20" r="2.8" fill="#f472b6" />
            <circle className="star-3" cx="450" cy="45" r="1.8" fill="#c084fc" />
            <circle className="star-1" cx="620" cy="25" r="3.2" fill="#f472b6" />
            <circle className="star-2" cx="890" cy="15" r="2.8" fill="#e879f9" />

            {/* Main Mount Rinjani Silhouette & Summit Peak (3,726 m) */}
            <path
              d="M-50 280 L40 180 L160 160 L320 110 L480 160 L720 40 L860 130 L1000 100 L1160 190 L1280 280 Z"
              fill="url(#rinjaniGoldGrad)"
            />

            {/* Dual Radar Wave Pulsing Rings at Peak */}
            <g transform="translate(720, 40)">
              <circle className="summit-beacon-1" cx="0" cy="0" r="10" fill="none" stroke="#e879f9" strokeWidth="1.5" />
              <circle className="summit-beacon-2" cx="0" cy="0" r="10" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="3.5" fill="#ffffff" filter="drop-shadow(0px 0px 6px #ffffff)" />
            </g>

            {/* Altitude Text */}
            <text x="735" y="38" fill="#f472b6" fontSize="10" fontFamily="Orbitron, sans-serif" fontWeight="900" opacity="0.98">
              3.726 MDPL ▲
            </text>
          </svg>

          {/* Smooth Bottom Fading Mask */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0e071a] via-[#0e071a]/80 to-transparent" />
        </div>

        {/* Top Header Row Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 mb-3 pb-2.5 border-b border-purple-500/20">
          <div className="flex items-center gap-2 bg-[#140b24] border border-purple-500/40 px-3 py-1 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.18)]">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#e879f9] animate-pulse" />
            <span className="font-orbitron font-bold text-[11px] text-purple-200 tracking-wider">
              DASHBOARD RINJANI NEON
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[9px] font-orbitron font-bold bg-purple-500/20 text-purple-200 border border-purple-500/35 rounded-full">
              SYSTEM ONLINE
            </span>
          </div>
        </div>

        {/* Middle Section: Compact RINJANI Title & Emblem */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 my-1">
          <div className="space-y-1">
            <h1 className="font-orbitron font-black text-2xl sm:text-3xl lg:text-4xl tracking-widest leading-none text-cyber-gold drop-shadow-[0_2px_8px_rgba(217,70,239,0.35)]">
              DASHBOARD RINJANI
            </h1>
            <p className="text-[11px] font-rajdhani font-bold text-purple-200/80 tracking-wider">
              REAL-TIME MONETARY CONTROL & ASSET MONITORING SYSTEM
            </p>
          </div>

          {/* Right Emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-purple-500/40 flex items-center justify-center bg-purple-500/10 shadow-[0_0_15px_rgba(217,70,239,0.25)]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-purple-500 via-fuchsia-600 to-pink-600 flex items-center justify-center shadow-[0_0_12px_rgba(217,70,239,0.45)]">
                <span className="font-orbitron font-black text-2xl sm:text-3xl text-white tracking-tighter">
                  R
                </span>
              </div>
            </div>

            <div className="bg-[#140b24] border border-purple-500/40 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.2)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
              <span className="font-orbitron font-bold text-[9px] text-fuchsia-300 tracking-wider uppercase">
                SYSTEM READY
              </span>
            </div>
          </div>
        </div>

        {/* Footer Subtext Line */}
        <div className="mt-3 pt-2 border-t border-purple-500/15 flex items-center justify-between relative z-10 text-[11px] font-rajdhani font-semibold text-purple-200/70">
          <p className="animate-pulse">
            Have a nice day, have a good work, keep up the spirit !!!
          </p>
          <span className="hidden sm:inline text-[9px] font-mono text-purple-400/80 uppercase">
            Rinjani v2.5 Neon
          </span>
        </div>

      </div>

      {/* Main Stat Cards Grid in Cyber Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Saldo Kas/Bank */}
        <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-5 space-y-3 relative overflow-hidden hover:border-fuchsia-400 transition-all shadow-[0_0_15px_rgba(168,85,247,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-orbitron font-bold text-purple-300/80 uppercase tracking-wider">Total Saldo Likuid</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-mono font-black text-emerald-400 tracking-tight drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]">
              {formatRupiah(totalBalance)}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span className="font-orbitron text-[10px]">TERPANTAU REAL-TIME</span>
            </div>
          </div>
        </div>

        {/* Pemasukan Bulan Ini */}
        <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-5 space-y-3 hover:border-fuchsia-400 transition-all shadow-[0_0_15px_rgba(168,85,247,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-orbitron font-bold text-purple-300/80 uppercase tracking-wider">Pemasukan (Bulan Ini)</span>
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-mono font-black text-teal-300 tracking-tight">
              {formatRupiah(monthlyIncome)}
            </p>
            <p className="text-[11px] text-purple-200/60 mt-1 font-rajdhani">Gaji, Bonus & Side Income</p>
          </div>
        </div>

        {/* Pengeluaran Bulan Ini */}
        <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-5 space-y-3 hover:border-fuchsia-400 transition-all shadow-[0_0_15px_rgba(168,85,247,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-orbitron font-bold text-purple-300/80 uppercase tracking-wider">Pengeluaran (Bulan Ini)</span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-mono font-black text-rose-400 tracking-tight">
              {formatRupiah(monthlyExpense)}
            </p>
            <p className="text-[11px] text-purple-200/60 mt-1 font-rajdhani">
              Sisa Kas: <span className="font-bold text-emerald-400 font-mono">{formatRupiah(monthlySavings)}</span>
            </p>
          </div>
        </div>

        {/* Total Kekayaan Bersih */}
        <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-5 space-y-3 hover:border-fuchsia-400 transition-all shadow-[0_0_15px_rgba(168,85,247,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-orbitron font-bold text-purple-300/80 uppercase tracking-wider">Total Net Worth</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-fuchsia-300 border border-purple-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-mono font-black text-fuchsia-300 tracking-tight drop-shadow-[0_0_6px_rgba(217,70,239,0.5)]">
              {formatRupiah(netWorth)}
            </p>
            <p className="text-[11px] text-purple-200/60 mt-1 font-rajdhani">
              Investasi: <span className="text-fuchsia-300 font-bold font-mono">{formatRupiah(totalInvestmentValue)}</span>
            </p>
          </div>
        </div>

      </div>

      {/* Account Balance Breakdown Widgets */}
      <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-6 space-y-4 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-orbitron font-bold text-purple-100 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-5 h-5 text-fuchsia-400" />
              <span>Distribusi Saldo Per Akun Rekening</span>
            </h3>
            <p className="text-xs text-purple-300/70 font-rajdhani font-semibold mt-0.5">
              Rincian alokasi uang aktif di Bank, E-Wallet, Kas Fisik & Rekening Investasi
            </p>
          </div>
          <button 
            onClick={() => onNavigateToTab('jurnal')}
            className="text-xs text-fuchsia-300 hover:text-white flex items-center gap-1 font-orbitron font-bold cursor-pointer bg-purple-500/20 border border-purple-500/40 px-3 py-1.5 rounded-xl hover:bg-purple-500/30 transition-all shadow-neo-purple"
          >
            <span>MUTASI JURNAL</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(accountBalances).map(([accountName, balance]) => {
            const getSubLabel = (name: string) => {
              switch (name) {
                case 'Kas / Tunai': return 'Uang Tunai / Dompet Physical';
                case 'Bank BCA': return 'Rekening BCA Operasional';
                case 'Bank Mandiri': return 'Rekening Mandiri & Transfer';
                case 'Bank BRI': return 'Rekening Tabungan BRI';
                case 'Bank BNI': return 'Rekening Tabungan BNI';
                case 'SeaBank': return 'Digital Banking SeaBank';
                case 'E-Wallet (GoPay/OVO/DANA)': return 'GoPay, OVO, DANA & ShopeePay';
                case 'Rekening Investasi': return 'Dana RDN & Portofolio Saham';
                default: return 'Akun Transaksi Keuangan';
              }
            };

            const getCategoryTag = (name: string) => {
              if (name.includes('Kas')) return 'Kas Fisik';
              if (name.includes('E-Wallet')) return 'E-Wallet';
              if (name.includes('Investasi')) return 'Investasi';
              if (name.includes('SeaBank')) return 'Bank Digital';
              return 'Bank Konvensional';
            };

            return (
              <div
                key={accountName}
                className="bg-[#140b24] hover:bg-[#190e2e] border border-purple-500/30 hover:border-purple-400/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all shadow-[0_0_12px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-orbitron font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-fuchsia-300 border border-purple-500/40 uppercase tracking-wider">
                      {getCategoryTag(accountName)}
                    </span>
                    <BankLogo accountName={accountName} size="md" />
                  </div>

                  <h4 className="font-orbitron font-bold text-sm text-purple-100 group-hover:text-fuchsia-300 transition-colors">
                    {accountName}
                  </h4>
                  <p className="text-xs text-purple-200/60 font-rajdhani font-semibold mt-0.5">
                    {getSubLabel(accountName)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-500/20 flex flex-col gap-1">
                  <span className="text-[10px] font-orbitron font-bold text-purple-300/70 uppercase tracking-wider">
                    Saldo Aktif
                  </span>
                  <p className="text-base sm:text-lg font-mono font-black text-cyber-gold group-hover:text-fuchsia-300 transition-colors drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                    {formatRupiah(balance)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts & AI Insight Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-Time Cashflow Trend Chart */}
        <div className="lg:col-span-2 bg-[#0e071a] border border-purple-500/35 rounded-2xl p-6 space-y-4 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-orbitron font-bold text-purple-100 flex items-center gap-2 tracking-wider">
                <Calendar className="w-4 h-4 text-fuchsia-400" />
                <span>TREN ARUS KAS & SALDO NET HARIAN</span>
              </h3>
              <p className="text-xs text-purple-300/70 font-rajdhani">Aktivitas Pemasukan vs Pengeluaran Harian</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-orbitron text-purple-200">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] inline-block"/> MASUK</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e] inline-block"/> KELUAR</span>
            </div>
          </div>

          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#581c87" opacity={0.3} />
                  <XAxis dataKey="dateDisplay" stroke="#d8b4fe" fontSize={11} tickLine={false} />
                  <YAxis stroke="#d8b4fe" fontSize={11} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0e071a', borderColor: '#a855f7', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    formatter={(value: any) => [formatRupiah(Number(value)), '']}
                  />
                  <Area type="monotone" dataKey="Pemasukan" stroke="#10b981" fillOpacity={1} fill="url(#incomeGrad)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="Pengeluaran" stroke="#f43f5e" fillOpacity={1} fill="url(#expenseGrad)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-purple-300/50 font-orbitron">
                BELUM ADA TREN DATA TRANSAKSI HARIAN.
              </div>
            )}
          </div>
        </div>

        {/* AI Insight & Debt Summary Side Widget */}
        <div className="space-y-4">
          
          {/* AI Advisor Cyber Banner */}
          <div className="bg-[#140b24] border border-purple-500/40 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-fuchsia-300">
                <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
                <h4 className="text-xs font-orbitron font-bold text-white">RINJANI AI ADVISOR</h4>
              </div>
              <span className="text-[9px] font-orbitron font-bold bg-purple-500/20 text-fuchsia-300 border border-purple-500/40 px-2 py-0.5 rounded uppercase">
                GEMINI 3.6
              </span>
            </div>

            <p className="text-xs text-purple-200/80 leading-relaxed font-rajdhani font-semibold">
              Arus kas bulan ini berjalan optimal dengan efisiensi tabungan <strong className="text-emerald-400 font-mono">{monthlyIncome > 0 ? ((monthlySavings / monthlyIncome) * 100).toFixed(0) : 0}%</strong>.
            </p>

            <button
              onClick={onOpenAIModal}
              className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-neo-purple cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
              <span>KONSULTASI RINJANI AI</span>
            </button>
          </div>

          {/* Hutang Piutang Summary */}
          <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-5 space-y-3 shadow-[0_0_15px_rgba(168,85,247,0.12)]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-orbitron font-bold text-purple-100 flex items-center gap-2 tracking-wider">
                <Scale className="w-4 h-4 text-fuchsia-400" />
                <span>RINGKASAN HUTANG & PIUTANG</span>
              </h4>
              <button 
                onClick={() => onNavigateToTab('hutang_piutang')}
                className="text-[10px] text-fuchsia-300 hover:underline font-orbitron font-bold cursor-pointer"
              >
                DETAIL
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-[#140b24] border border-purple-500/25 p-3 rounded-xl">
                <p className="text-[9px] font-orbitron font-bold text-purple-300/70 uppercase">Hutang Saya (Sisa)</p>
                <p className="text-xs font-mono font-bold text-rose-400 mt-0.5">
                  {formatRupiah(totalDebtsOwed)}
                </p>
              </div>
              <div className="bg-[#140b24] border border-purple-500/25 p-3 rounded-xl">
                <p className="text-[9px] font-orbitron font-bold text-purple-300/70 uppercase">Piutang (Tertagih)</p>
                <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                  {formatRupiah(totalReceivableOwed)}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Recent Transactions Feed */}
      <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-6 space-y-4 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-orbitron font-bold text-purple-100 uppercase tracking-wider">
              Jurnal Transaksi Terakhir
            </h3>
            <p className="text-xs text-purple-300/70 font-rajdhani">Aktivitas penerimaan & pengeluaran kas terbaru</p>
          </div>
          <button
            onClick={() => onNavigateToTab('jurnal')}
            className="text-xs text-fuchsia-300 hover:text-white flex items-center gap-1 font-orbitron font-bold cursor-pointer"
          >
            <span>JURNAL LENGKAP</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-purple-500/20">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl text-xs font-bold ${
                    tx.type === 'income'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                  }`}
                >
                  {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-xs font-orbitron font-bold text-white tracking-wide">{tx.description}</p>
                  <p className="text-[10px] text-purple-200/60 font-mono flex items-center gap-2 mt-0.5">
                    <span>{formatDateIndo(tx.date)}</span>
                    <span>•</span>
                    <span className="text-fuchsia-300 font-semibold">{tx.category}</span>
                    <span>•</span>
                    <span className="text-slate-300">{tx.account}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-xs font-mono font-bold ${
                    tx.type === 'income' ? 'text-emerald-400 drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]' : 'text-purple-100'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
