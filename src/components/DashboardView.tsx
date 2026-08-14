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

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const monthTransactions = transactions.filter((tx) => tx.date.startsWith(currentMonthStr));
  
  const monthlyIncome = monthTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const monthlyExpense = monthTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const monthlySavings = monthlyIncome - monthlyExpense;

  const totalInvestmentValue = investments.reduce(
    (acc, inv) => acc + inv.currentPrice * inv.shares, 
    0
  );

  const totalDebtsOwed = debts
    .filter((d) => d.type === 'hutang')
    .reduce((acc, d) => acc + (d.totalAmount - d.paidAmount), 0);

  const totalReceivableOwed = debts
    .filter((d) => d.type === 'piutang')
    .reduce((acc, d) => acc + (d.totalAmount - d.paidAmount), 0);

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
    <div className="space-y-5 animate-fadeIn max-w-full overflow-x-hidden pb-10">
      
      {/* Iconic RINJANI Hero - Mobile Fix: Added overflow-hidden and min-h */}
      <div className="relative bg-[#0e071a] border-2 border-purple-500/35 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-[0_0_20px_rgba(168,85,247,0.18)] overflow-hidden min-h-[160px] sm:min-h-auto">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] h-[200px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-75">
          <svg className="w-full h-full absolute bottom-0 left-0" viewBox="0 0 1200 280" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="rinjaniSunGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c084fc" stopOpacity="0.45" /><stop offset="60%" stopColor="#9333ea" stopOpacity="0.2" /></linearGradient>
              <linearGradient id="rinjaniGoldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d8b4fe" stopOpacity="0.85" /><stop offset="100%" stopColor="#0e071a" stopOpacity="0.98" /></linearGradient>
              <linearGradient id="auroraGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#c084fc" stopOpacity="0" /><stop offset="50%" stopColor="#e879f9" stopOpacity="0.7" /><stop offset="100%" stopColor="#c084fc" stopOpacity="0" /></linearGradient>
              <linearGradient id="scanBeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#a855f7" stopOpacity="0" /><stop offset="50%" stopColor="#e879f9" stopOpacity="0.85" /><stop offset="100%" stopColor="#a855f7" stopOpacity="0" /></linearGradient>
            </defs>
            <path d="M-50 280 L40 180 L160 160 L320 110 L480 160 L720 40 L860 130 L1000 100 L1160 190 L1280 280 Z" fill="url(#rinjaniGoldGrad)" />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0e071a] via-[#0e071a]/80 to-transparent" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 relative z-10 mb-3 pb-2 border-b border-purple-500/15">
          <div className="flex items-center gap-1.5 bg-[#140b24] border border-purple-500/40 px-2.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.18)]">
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
            <span className="font-orbitron font-bold text-[9px] sm:text-[11px] text-purple-200 tracking-wider">
              DASHBOARD RINJANI
            </span>
          </div>
          <span className="px-2 py-0.5 text-[8px] sm:text-[9px] font-orbitron font-bold bg-purple-500/20 text-purple-200 border border-purple-500/35 rounded-full">
            ONLINE
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 my-1">
          <div className="space-y-0.5">
            <h1 className="font-orbitron font-black text-xl sm:text-3xl lg:text-4xl tracking-widest leading-none text-cyber-gold drop-shadow-[0_2px_8px_rgba(217,70,239,0.35)]">
              RINJANI SYSTEM
            </h1>
            <p className="text-[9px] sm:text-[11px] font-rajdhani font-bold text-purple-200/80 tracking-wider uppercase">
              Security Active
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative w-10 h-10 sm:w-16 sm:h-16 rounded-full border border-purple-500/40 flex items-center justify-center bg-purple-500/10 shadow-[0_0_15px_rgba(217,70,239,0.25)]">
              <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-full bg-gradient-to-b from-purple-500 via-fuchsia-600 to-pink-600 flex items-center justify-center">
                <span className="font-orbitron font-black text-lg sm:text-3xl text-white tracking-tighter">R</span>
              </div>
            </div>
            <div className="bg-purple-500/20 text-fuchsia-300 border border-purple-500/40 px-2 py-0.5 rounded font-mono text-[9px] sm:text-[10px]">v2.5 NEON</div>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t border-purple-500/15 flex items-center justify-between relative z-10 text-[9px] sm:text-[11px] font-rajdhani font-semibold text-purple-200/70">
          <p className="animate-pulse truncate max-w-[80%]">Have a nice day, have a good work, keep up the spirit !!!</p>
        </div>
      </div>

      {/* Stats Cards - Added sm:grid-cols-2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-orbitron font-bold text-purple-300/80 uppercase">Total Saldo Likuid</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-mono font-black text-emerald-400 tracking-tight">
              {formatRupiah(totalBalance)}
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-medium">
              <ArrowUpRight className="w-3 h-3" />
              <span className="font-orbitron">REAL-TIME</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_0_15px_rgba(168,85,247,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-orbitron font-bold text-purple-300/80 uppercase">Pemasukan (Bulan Ini)</span>
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-mono font-black text-teal-300 tracking-tight">
            {formatRupiah(monthlyIncome)}
          </p>
        </div>

        <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_0_15px_rgba(168,85,247,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-orbitron font-bold text-purple-300/80 uppercase">Pengeluaran (Bulan Ini)</span>
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-mono font-black text-rose-400 tracking-tight">
            {formatRupiah(monthlyExpense)}
          </p>
        </div>

        <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_0_15px_rgba(168,85,247,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-orbitron font-bold text-purple-300/80 uppercase">Total Net Worth</span>
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-fuchsia-300 border border-purple-500/30">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-mono font-black text-fuchsia-300 tracking-tight">
            {formatRupiah(netWorth)}
          </p>
        </div>

      </div>

      {/* Account Balance Breakdown Widgets */}
      <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-4 sm:p-6 space-y-4 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-500/20 pb-4 gap-3">
          <div>
            <h3 className="text-sm font-orbitron font-bold text-purple-100 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-fuchsia-400" />
              <span>SALDO PER AKUN</span>
            </h3>
          </div>
          <button onClick={() => onNavigateToTab('jurnal')} className="text-[10px] sm:text-xs text-fuchsia-300 flex items-center gap-1 font-orbitron font-bold bg-purple-500/20 border border-purple-500/40 px-2.5 py-1.5 rounded-xl self-start sm:self-auto shadow-neo-purple">
            <span>JURNAL</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(accountBalances).map(([accountName, balance]) => (
            <div key={accountName} className="bg-[#140b24] border border-purple-500/30 rounded-2xl p-4 flex flex-col justify-between group transition-all">
              <div className="flex items-center justify-between gap-2 mb-2">
                <BankLogo accountName={accountName} size="sm" />
                <span className="text-[8px] font-orbitron font-bold px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300">ACTIVE</span>
              </div>
              <h4 className="font-orbitron font-bold text-[11px] text-purple-100 group-hover:text-fuchsia-300 transition-colors truncate">{accountName}</h4>
              <p className="text-sm sm:text-base font-mono font-black text-cyber-gold mt-2 drop-shadow-[0_0_4px_rgba(168,85,247,0.4)]">
                {formatRupiah(balance)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-[#0e071a] border border-purple-500/35 rounded-2xl p-4 sm:p-6 space-y-4 shadow-[0_0_20px_rgba(168,85,247,0.15)] overflow-hidden">
          <h3 className="text-xs sm:text-sm font-orbitron font-bold text-purple-100 flex items-center gap-2 uppercase">
            <Calendar className="w-4 h-4 text-fuchsia-400" />
            <span>TREN ARUS KAS</span>
          </h3>
          <div className="h-48 sm:h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
                  </defs>
                  <XAxis dataKey="dateDisplay" stroke="#d8b4fe" fontSize={10} tickLine={false} />
                  <YAxis stroke="#d8b4fe" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0e071a', borderColor: '#a855f7', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="Pemasukan" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Pengeluaran" stroke="#f43f5e" fill="url(#expenseGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[10px] text-purple-300/50 font-orbitron">NO DATA</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#140b24] border border-purple-500/40 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <div className="flex items-center gap-2 text-fuchsia-300">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <h4 className="text-xs font-orbitron font-bold text-white uppercase">RINJANI AI ADVISOR</h4>
            </div>
            <p className="text-[11px] text-purple-200/80 leading-relaxed font-rajdhani font-semibold">
              Kesehatan finansial terpantau optimal! Efisiensi tabungan: <strong className="text-emerald-400 font-mono">{monthlyIncome > 0 ? ((monthlySavings / monthlyIncome) * 100).toFixed(0) : 0}%</strong>.
            </p>
            <button onClick={onOpenAIModal} className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white font-orbitron font-bold text-[10px] py-2 rounded-xl flex items-center justify-center gap-2 shadow-neo-purple">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>CONSULT AI</span>
            </button>
          </div>

          <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-4 sm:p-5 space-y-3 shadow-[0_0_15px_rgba(168,85,247,0.12)]">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] sm:text-xs font-orbitron font-bold text-purple-100 flex items-center gap-2 tracking-wider">
                <Scale className="w-4 h-4 text-fuchsia-400" />
                <span>DEBT SUMMARY</span>
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-[#140b24] border border-purple-500/25 p-2 rounded-xl">
                <p className="text-[8px] font-orbitron text-purple-300/70">HUTANG</p>
                <p className="text-[10px] sm:text-xs font-mono font-bold text-rose-400 truncate">{formatRupiah(totalDebtsOwed)}</p>
              </div>
              <div className="bg-[#140b24] border border-purple-500/25 p-2 rounded-xl">
                <p className="text-[8px] font-orbitron text-purple-300/70">PIUTANG</p>
                <p className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400 truncate">{formatRupiah(totalReceivableOwed)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0e071a] border border-purple-500/35 rounded-2xl p-4 sm:p-6 space-y-4 shadow-[0_0_20px_rgba(168,85,247,0.15)] overflow-hidden">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-orbitron font-bold text-purple-100 uppercase tracking-wider truncate">
            Transaksi Terakhir
          </h3>
          <button onClick={() => onNavigateToTab('jurnal')} className="text-[10px] text-fuchsia-300 hover:text-white flex items-center gap-1 font-orbitron font-bold">
            <span className="hidden xs:inline">LIHAT SEMUA</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-purple-500/10">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3 overflow-hidden">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className={`p-1.5 rounded-lg shrink-0 ${tx.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {tx.type === 'income' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] sm:text-xs font-orbitron font-bold text-white truncate">{tx.description}</p>
                  <p className="text-[8px] sm:text-[9px] text-purple-200/50 font-mono truncate">{formatDateIndo(tx.date)} • <span className="text-fuchsia-300">{tx.category}</span></p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-[10px] sm:text-xs font-mono font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-purple-100'}`}>
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
