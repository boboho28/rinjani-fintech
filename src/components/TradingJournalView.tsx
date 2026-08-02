import React, { useState } from 'react';
import { 
  CandlestickChart, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  Edit3, 
  Trash2, 
  DollarSign, 
  BarChart2, 
  Search, 
  Filter, 
  Flame,
  Globe,
  Award,
  Layers,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Wallet,
  Check,
  Zap,
  RefreshCw,
  PieChart
} from 'lucide-react';
import { TradingJournalItem, TradingPair, TradingStrategy, TradingType, AccountType } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { TradingViewAdvancedChart } from './TradingViewWidget';

interface TradingJournalViewProps {
  tradings: TradingJournalItem[];
  onOpenAddModal: () => void;
  onEditTrading: (trading: TradingJournalItem) => void;
  onDeleteTrading: (id: string) => void;
  onClaimToJournal: (trading: TradingJournalItem) => void;
  onBatchClaimToJournal?: (items: TradingJournalItem[], bank: AccountType, summaryTitle?: string) => void;
}

export const TradingJournalView: React.FC<TradingJournalViewProps> = ({
  tradings,
  onOpenAddModal,
  onEditTrading,
  onDeleteTrading,
  onClaimToJournal,
  onBatchClaimToJournal,
}) => {
  // Navigation sub-tabs inside Trading View
  const [subTab, setSubTab] = useState<'dashboard' | 'calendar' | 'log' | 'withdraw' | 'chart'>('dashboard');

  // Withdrawal Mode inside withdraw tab: 'all' | 'weekly' | 'monthly' | 'single'
  const [withdrawTabMode, setWithdrawTabMode] = useState<'all' | 'weekly' | 'monthly' | 'single'>('all');

  // Search & Filter state for Log tab
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPair, setSelectedPair] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('ALL');

  // Calendar Date State (default to current month: August 2026)
  const todayDate = new Date();
  const [currentYear, setCurrentYear] = useState<number>(todayDate.getFullYear() || 2026);
  const [currentMonth, setCurrentMonth] = useState<number>(todayDate.getMonth()); // 0-indexed (7 = Aug)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  // Withdrawal Modal / Flow State
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawTargetItems, setWithdrawTargetItems] = useState<TradingJournalItem[]>([]);
  const [withdrawBatchTitle, setWithdrawBatchTitle] = useState<string>('');
  const [targetBank, setTargetBank] = useState<AccountType>('Bank BCA');
  const [withdrawSuccessSlip, setWithdrawSuccessSlip] = useState<{
    tradingTitle: string;
    amountUSD: number;
    amountIDR: number;
    bank: string;
    date: string;
    tradeCount: number;
  } | null>(null);

  // Default USD Exchange Rate (16,280 as per Google rates)
  const DEFAULT_RATE = 16280;

  // Helpers for Timeframe Filtering
  const getTodayStr = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = getTodayStr();

  // Calculation for Timeframe Stats
  const calculatePnL = (items: TradingJournalItem[]) => {
    const netIDR = items.reduce((sum, item) => sum + item.profitAmount, 0);
    const netUSD = items.reduce((sum, item) => {
      const usd = item.profitUSD !== undefined ? item.profitUSD : item.profitAmount / (item.exchangeRateUSD || DEFAULT_RATE);
      return sum + usd;
    }, 0);
    const winsUSD = items.filter((t) => t.type === 'profit').reduce((sum, item) => {
      const usd = item.profitUSD !== undefined ? item.profitUSD : item.profitAmount / (item.exchangeRateUSD || DEFAULT_RATE);
      return sum + usd;
    }, 0);
    const lossesUSD = items.filter((t) => t.type === 'loss').reduce((sum, item) => {
      const usd = item.profitUSD !== undefined ? Math.abs(item.profitUSD) : Math.abs(item.profitAmount) / (item.exchangeRateUSD || DEFAULT_RATE);
      return sum + usd;
    }, 0);
    const totalTrades = items.length;
    const wins = items.filter((t) => t.type === 'profit').length;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const pips = items.reduce((sum, t) => sum + t.profitPips, 0);

    return { netIDR, netUSD, winsUSD, lossesUSD, totalTrades, wins, winRate, pips };
  };

  // Filtered by Timeframes
  const todayTrades = tradings.filter((t) => t.date === todayStr);
  
  // Week calculation
  const isDateInCurrentWeek = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return d >= startOfWeek && d <= endOfWeek;
  };

  const weekTrades = tradings.filter((t) => isDateInCurrentWeek(t.date));

  const isDateInCurrentMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  };

  const monthTrades = tradings.filter((t) => isDateInCurrentMonth(t.date));

  const isDateInCurrentYear = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getFullYear() === now.getFullYear();
  };

  const yearTrades = tradings.filter((t) => isDateInCurrentYear(t.date));

  const allTimeStats = calculatePnL(tradings);
  const todayStats = calculatePnL(todayTrades);
  const weekStats = calculatePnL(weekTrades);
  const monthStats = calculatePnL(monthTrades);
  const yearStats = calculatePnL(yearTrades);

  // Unclaimed Profit Stats
  const unclaimedTrades = tradings.filter((t) => t.type === 'profit' && !t.isClaimedToJournal);
  const unclaimedProfitIDR = unclaimedTrades.reduce((sum, t) => sum + t.profitAmount, 0);
  const unclaimedProfitUSD = unclaimedTrades.reduce((sum, t) => {
    const usd = t.profitUSD !== undefined ? t.profitUSD : t.profitAmount / (t.exchangeRateUSD || DEFAULT_RATE);
    return sum + usd;
  }, 0);

  // Claim / Withdraw Handlers & Helpers
  const openWithdrawModalForBatch = (items: TradingJournalItem[], batchTitle: string) => {
    if (items.length === 0) return;
    setWithdrawTargetItems(items);
    setWithdrawBatchTitle(batchTitle);
    setTargetBank(items[0]?.account || 'Bank BCA');
    setIsWithdrawModalOpen(true);
  };

  const handleExecuteWithdrawBatch = (items: TradingJournalItem[], bank: AccountType, title: string) => {
    if (items.length === 0) return;

    const totalIDR = items.reduce((sum, t) => sum + t.profitAmount, 0);
    const totalUSD = items.reduce((sum, t) => {
      const usd = t.profitUSD !== undefined ? t.profitUSD : t.profitAmount / (t.exchangeRateUSD || DEFAULT_RATE);
      return sum + usd;
    }, 0);

    if (onBatchClaimToJournal) {
      onBatchClaimToJournal(items, bank, title);
    } else {
      items.forEach((item) => {
        onClaimToJournal({ ...item, account: bank });
      });
    }

    setWithdrawSuccessSlip({
      tradingTitle: title,
      amountUSD: totalUSD,
      amountIDR: totalIDR,
      bank: bank,
      tradeCount: items.length,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    });

    setIsWithdrawModalOpen(false);
    setWithdrawTargetItems([]);
  };

  // Helper to format week label (e.g. "Minggu (27 Jul - 02 Agu 2026)")
  const getWeekLabel = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length < 3) return 'Minggu Ini';
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const date = new Date(y, m, d);

    const day = date.getDay();
    const diffToMon = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(y, m, diffToMon);
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);

    const opt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const monStr = monday.toLocaleDateString('id-ID', opt);
    const sunStr = sunday.toLocaleDateString('id-ID', opt);
    return `Minggu (${monStr} - ${sunStr} ${sunday.getFullYear()})`;
  };

  // Helper to format month label (e.g. "Agustus 2026")
  const getMonthLabel = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length < 2) return 'Bulan Ini';
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const date = new Date(y, m, 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  // Group unclaimed trades by week
  const unclaimedByWeekMap: Record<string, { label: string; trades: TradingJournalItem[]; totalIDR: number; totalUSD: number }> = {};
  unclaimedTrades.forEach((t) => {
    const label = getWeekLabel(t.date);
    if (!unclaimedByWeekMap[label]) {
      unclaimedByWeekMap[label] = { label, trades: [], totalIDR: 0, totalUSD: 0 };
    }
    const usd = t.profitUSD !== undefined ? t.profitUSD : t.profitAmount / (t.exchangeRateUSD || DEFAULT_RATE);
    unclaimedByWeekMap[label].trades.push(t);
    unclaimedByWeekMap[label].totalIDR += t.profitAmount;
    unclaimedByWeekMap[label].totalUSD += usd;
  });

  // Group unclaimed trades by month
  const unclaimedByMonthMap: Record<string, { label: string; trades: TradingJournalItem[]; totalIDR: number; totalUSD: number }> = {};
  unclaimedTrades.forEach((t) => {
    const label = getMonthLabel(t.date);
    if (!unclaimedByMonthMap[label]) {
      unclaimedByMonthMap[label] = { label, trades: [], totalIDR: 0, totalUSD: 0 };
    }
    const usd = t.profitUSD !== undefined ? t.profitUSD : t.profitAmount / (t.exchangeRateUSD || DEFAULT_RATE);
    unclaimedByMonthMap[label].trades.push(t);
    unclaimedByMonthMap[label].totalIDR += t.profitAmount;
    unclaimedByMonthMap[label].totalUSD += usd;
  });

  // Calendar Helpers
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 = Sun

  const monthNamesIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Group tradings by YYYY-MM-DD
  const tradingsByDate: Record<string, { trades: TradingJournalItem[]; netIDR: number; netUSD: number }> = {};
  tradings.forEach((t) => {
    if (!tradingsByDate[t.date]) {
      tradingsByDate[t.date] = { trades: [], netIDR: 0, netUSD: 0 };
    }
    const usd = t.profitUSD !== undefined ? t.profitUSD : t.profitAmount / (t.exchangeRateUSD || DEFAULT_RATE);
    tradingsByDate[t.date].trades.push(t);
    tradingsByDate[t.date].netIDR += t.profitAmount;
    tradingsByDate[t.date].netUSD += usd;
  });

  // Filtered tradings for Log Tab
  const filteredTradings = tradings.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.broker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPair = selectedPair === 'ALL' || item.pair === selectedPair;
    const matchesType = selectedType === 'ALL' || item.type === selectedType;
    const matchesStrategy = selectedStrategy === 'ALL' || item.strategy === selectedStrategy;
    const matchesDate = !selectedCalendarDate || item.date === selectedCalendarDate;

    return matchesSearch && matchesPair && matchesType && matchesStrategy && matchesDate;
  });

  const pairList = Array.from(new Set(tradings.map((t) => t.pair)));
  const strategyList = Array.from(new Set(tradings.map((t) => t.strategy)));

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* View Header with Cyber Badges & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 font-orbitron text-[10px] font-bold uppercase tracking-widest">
              DASHBOARD EKSEKUTIF RINJANI
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
              KURS GOOGLE REAL-TIME: 1 USD = Rp {DEFAULT_RATE.toLocaleString()}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-orbitron font-extrabold text-purple-100 uppercase tracking-wider flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white shadow-neo-purple">
              <CandlestickChart className="w-6 h-6 text-white font-bold" />
            </div>
            <span>JURNAL TRADING FOREX & CRYPTO</span>
          </h2>
          <p className="text-xs sm:text-sm text-purple-300/80 font-rajdhani font-semibold mt-1">
            Rekapan Profit/Loss Harian, Mingguan, Bulanan, Tahunan & Kalender PnL Visual Terhubung ke Dashboard RINJANI
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSubTab('withdraw')}
            className="relative bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 hover:from-emerald-500 hover:to-teal-400 text-white font-orbitron font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-white" />
            <span>WITHDRAW KE BANK ({unclaimedTrades.length})</span>
            {unclaimedTrades.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-fuchsia-400 text-slate-950 text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unclaimedTrades.length}
              </span>
            )}
          </button>

          <button
            onClick={onOpenAddModal}
            className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-neo-purple transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white font-bold" />
            <span>+ CATAT TRADING BARU</span>
          </button>
        </div>
      </div>

      {/* Cyber Sub-Tab Navigation Header */}
      <div className="flex flex-wrap items-center gap-2 bg-[#130b20]/80 p-1.5 rounded-2xl border border-purple-500/30">
        <button
          onClick={() => { setSubTab('dashboard'); setSelectedCalendarDate(null); }}
          className={`px-4 py-2 rounded-xl font-orbitron text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            subTab === 'dashboard'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-neo-purple'
              : 'text-purple-300/80 hover:text-white hover:bg-purple-500/10'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>REKAPAN PnL (TIMEFRAME)</span>
        </button>

        <button
          onClick={() => setSubTab('calendar')}
          className={`px-4 py-2 rounded-xl font-orbitron text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            subTab === 'calendar'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-neo-purple'
              : 'text-purple-300/80 hover:text-white hover:bg-purple-500/10'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>KALENDER PROFIT / LOSS</span>
        </button>

        <button
          onClick={() => setSubTab('log')}
          className={`px-4 py-2 rounded-xl font-orbitron text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            subTab === 'log'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-neo-purple'
              : 'text-purple-300/80 hover:text-white hover:bg-purple-500/10'
          }`}
        >
          <CandlestickChart className="w-4 h-4" />
          <span>LOG JURNAL TRADING ({filteredTradings.length})</span>
        </button>

        <button
          onClick={() => setSubTab('withdraw')}
          className={`px-4 py-2 rounded-xl font-orbitron text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            subTab === 'withdraw'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
              : 'text-emerald-300/80 hover:text-white hover:bg-emerald-500/10'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>WITHDRAW KE BANK ({unclaimedTrades.length})</span>
        </button>

        <button
          onClick={() => setSubTab('chart')}
          className={`px-4 py-2 rounded-xl font-orbitron text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            subTab === 'chart'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-neo-purple'
              : 'text-purple-300/80 hover:text-white hover:bg-purple-500/10'
          }`}
        >
          <Globe className="w-4 h-4 text-fuchsia-400" />
          <span>LIVE CHART TRADINGVIEW</span>
        </button>
      </div>

      {/* SUB-TAB 1: REKAPAN PnL TIMEFRAME DASHBOARD */}
      {subTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Executive Timeframe PnL Cards Grid (Harian, Mingguan, Bulanan, Tahunan, All-Time) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Hari Ini */}
            <div className="bg-gradient-to-b from-[#180e2b] to-[#0d0718] border border-purple-500/40 rounded-2xl p-4 space-y-2 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">
                <span>PnL HARI INI</span>
                <Clock className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className={`text-lg font-mono font-black ${todayStats.netUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {todayStats.netUSD >= 0 ? `+$${todayStats.netUSD.toFixed(2)}` : `-$${Math.abs(todayStats.netUSD).toFixed(2)}`}
              </p>
              <p className="text-xs font-mono font-bold text-purple-200/90">
                ≈ {todayStats.netIDR >= 0 ? `+${formatRupiah(todayStats.netIDR)}` : formatRupiah(todayStats.netIDR)}
              </p>
              <div className="text-[10px] font-rajdhani font-semibold text-purple-300/60 pt-1 border-t border-purple-500/15 flex justify-between">
                <span>{todayTrades.length} Trade Hari Ini</span>
                <span className="text-emerald-400">{todayStats.wins} W</span>
              </div>
            </div>

            {/* Minggu Ini */}
            <div className="bg-gradient-to-b from-[#180e2b] to-[#0d0718] border border-purple-500/40 rounded-2xl p-4 space-y-2 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">
                <span>PnL MINGGU INI</span>
                <CalendarIcon className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className={`text-lg font-mono font-black ${weekStats.netUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {weekStats.netUSD >= 0 ? `+$${weekStats.netUSD.toFixed(2)}` : `-$${Math.abs(weekStats.netUSD).toFixed(2)}`}
              </p>
              <p className="text-xs font-mono font-bold text-purple-200/90">
                ≈ {weekStats.netIDR >= 0 ? `+${formatRupiah(weekStats.netIDR)}` : formatRupiah(weekStats.netIDR)}
              </p>
              <div className="text-[10px] font-rajdhani font-semibold text-purple-300/60 pt-1 border-t border-purple-500/15 flex justify-between">
                <span>{weekTrades.length} Trade Pekan Ini</span>
                <span className="text-cyan-400">{weekStats.pips} Pips</span>
              </div>
            </div>

            {/* Bulan Ini */}
            <div className="bg-gradient-to-b from-[#180e2b] to-[#0d0718] border border-purple-500/40 rounded-2xl p-4 space-y-2 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">
                <span>PnL BULAN INI</span>
                <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className={`text-lg font-mono font-black ${monthStats.netUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {monthStats.netUSD >= 0 ? `+$${monthStats.netUSD.toFixed(2)}` : `-$${Math.abs(monthStats.netUSD).toFixed(2)}`}
              </p>
              <p className="text-xs font-mono font-bold text-purple-200/90">
                ≈ {monthStats.netIDR >= 0 ? `+${formatRupiah(monthStats.netIDR)}` : formatRupiah(monthStats.netIDR)}
              </p>
              <div className="text-[10px] font-rajdhani font-semibold text-purple-300/60 pt-1 border-t border-purple-500/15 flex justify-between">
                <span>Win Rate: {monthStats.winRate.toFixed(0)}%</span>
                <span className="text-emerald-400">{monthStats.wins} W</span>
              </div>
            </div>

            {/* Tahun Ini */}
            <div className="bg-gradient-to-b from-[#180e2b] to-[#0d0718] border border-purple-500/40 rounded-2xl p-4 space-y-2 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">
                <span>PnL TAHUN INI</span>
                <Award className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className={`text-lg font-mono font-black ${yearStats.netUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {yearStats.netUSD >= 0 ? `+$${yearStats.netUSD.toFixed(2)}` : `-$${Math.abs(yearStats.netUSD).toFixed(2)}`}
              </p>
              <p className="text-xs font-mono font-bold text-purple-200/90">
                ≈ {yearStats.netIDR >= 0 ? `+${formatRupiah(yearStats.netIDR)}` : formatRupiah(yearStats.netIDR)}
              </p>
              <div className="text-[10px] font-rajdhani font-semibold text-purple-300/60 pt-1 border-t border-purple-500/15 flex justify-between">
                <span>{yearTrades.length} Trade 2026</span>
                <span className="text-purple-300">{yearStats.pips} Pips</span>
              </div>
            </div>

            {/* All-Time Net Profit */}
            <div className="bg-gradient-to-b from-[#221338] to-[#130b20] border border-fuchsia-500/60 rounded-2xl p-4 space-y-2 relative overflow-hidden shadow-neo-purple">
              <div className="flex items-center justify-between text-[10px] font-orbitron font-bold text-fuchsia-300 uppercase">
                <span>TOTAL ALL-TIME</span>
                <Flame className="w-3.5 h-3.5 text-fuchsia-400" />
              </div>
              <p className={`text-lg font-mono font-black ${allTimeStats.netUSD >= 0 ? 'text-neon-purple' : 'text-rose-400'}`}>
                {allTimeStats.netUSD >= 0 ? `+$${allTimeStats.netUSD.toFixed(2)}` : `-$${Math.abs(allTimeStats.netUSD).toFixed(2)}`}
              </p>
              <p className="text-xs font-mono font-bold text-purple-200">
                ≈ {allTimeStats.netIDR >= 0 ? `+${formatRupiah(allTimeStats.netIDR)}` : formatRupiah(allTimeStats.netIDR)}
              </p>
              <div className="text-[10px] font-rajdhani font-semibold text-purple-300/80 pt-1 border-t border-purple-500/20 flex justify-between">
                <span>Win Rate: {allTimeStats.winRate.toFixed(1)}%</span>
                <span className="text-emerald-400 font-bold">{allTimeStats.wins} W</span>
              </div>
            </div>
          </div>

          {/* Unclaimed Profit Banner & Quick Withdrawal Box */}
          <div className="bg-gradient-to-r from-[#180e2b] via-[#24133d] to-[#120921] border border-purple-500/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-neo-purple">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-orbitron font-bold text-purple-300">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>SALDO PROFIT TRADING SIAP WITHDRAW KE BANK</span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                  +${unclaimedProfitUSD.toFixed(2)} USD
                </span>
                <span className="text-base font-mono font-bold text-purple-200">
                  (≈ {formatRupiah(unclaimedProfitIDR)})
                </span>
              </div>
              <p className="text-xs text-purple-200/70 font-rajdhani font-semibold">
                Tersedia {unclaimedTrades.length} transaksi profit belum ditransfer. Setelah diklaim, saldo langsung bertambah di Dashboard RINJANI!
              </p>
            </div>

            <button
              onClick={() => setSubTab('withdraw')}
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-xs px-6 py-3.5 rounded-xl flex items-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_28px_rgba(16,185,129,0.5)] transition-all cursor-pointer shrink-0"
            >
              <Building2 className="w-5 h-5 text-slate-950 font-bold" />
              <span>CAIRKAN / WITHDRAW KE BANK NOW</span>
            </button>
          </div>

          {/* Performance Highlight Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Pairs Breakdown */}
            <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 space-y-3">
              <h3 className="font-orbitron font-bold text-purple-100 text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>REKAPAN PERALISAN PASAR (TOP PAIRS)</span>
              </h3>
              <div className="space-y-2">
                {pairList.map((pair) => {
                  const pairItems = tradings.filter((t) => t.pair === pair);
                  const stats = calculatePnL(pairItems);
                  return (
                    <div key={pair} className="bg-[#1a0f30] p-3 rounded-xl border border-purple-500/20 flex items-center justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-orbitron text-xs font-bold">
                          {pair}
                        </span>
                        <span className="ml-2 text-xs font-mono text-purple-200/70">{pairItems.length} Trade</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold text-sm ${stats.netUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stats.netUSD >= 0 ? `+$${stats.netUSD.toFixed(2)}` : `-$${Math.abs(stats.netUSD).toFixed(2)}`}
                        </span>
                        <p className="text-[10px] font-mono text-purple-300/60">≈ {formatRupiah(stats.netIDR)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Strategy Breakdown */}
            <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 space-y-3">
              <h3 className="font-orbitron font-bold text-purple-100 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>EFEKTIVITAS STRATEGI TRADING</span>
              </h3>
              <div className="space-y-2">
                {strategyList.map((st) => {
                  const stItems = tradings.filter((t) => t.strategy === st);
                  const stats = calculatePnL(stItems);
                  return (
                    <div key={st} className="bg-[#1a0f30] p-3 rounded-xl border border-purple-500/20 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-orbitron font-bold text-purple-200">{st}</p>
                        <p className="text-[10px] font-mono text-purple-300/60">{stItems.length} Executed Setup • Win Rate: {stats.winRate.toFixed(0)}%</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold text-sm ${stats.netUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stats.netUSD >= 0 ? `+$${stats.netUSD.toFixed(2)}` : `-$${Math.abs(stats.netUSD).toFixed(2)}`}
                        </span>
                        <p className="text-[10px] font-mono text-purple-300/60">≈ {formatRupiah(stats.netIDR)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: KALENDER PROFIT / LOSS VISUAL */}
      {subTab === 'calendar' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Month Header Controller */}
          <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 rounded-xl bg-[#1a0f30] border border-purple-500/30 text-purple-300 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-orbitron font-black text-purple-100 tracking-wider">
                KALENDER PnL: {monthNamesIndo[currentMonth].toUpperCase()} {currentYear}
              </h3>
              <p className="text-xs font-rajdhani text-purple-300/70">
                Klik pada tanggal bertanda Profit / Loss untuk melihat rincian transaksi harian
              </p>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2.5 rounded-xl bg-[#1a0f30] border border-purple-500/30 text-purple-300 hover:text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Heatmap Grid */}
          <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-4 sm:p-6 space-y-4">
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center border-b border-purple-500/20 pb-3">
              {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day, idx) => (
                <div key={day} className={`font-orbitron text-[10px] sm:text-xs font-bold uppercase tracking-wider ${idx === 0 || idx === 6 ? 'text-purple-500/60' : 'text-purple-300'}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Empty leading padding days */}
              {Array.from({ length: firstDayOfMonth(currentYear, currentMonth) }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-20 sm:h-28 rounded-xl bg-[#1a0f30]/30 border border-purple-500/5" />
              ))}

              {/* Days in Month */}
              {Array.from({ length: daysInMonth(currentYear, currentMonth) }).map((_, idx) => {
                const dayNum = idx + 1;
                const mm = String(currentMonth + 1).padStart(2, '0');
                const dd = String(dayNum).padStart(2, '0');
                const dateKey = `${currentYear}-${mm}-${dd}`;
                const dayData = tradingsByDate[dateKey];
                const isSelected = selectedCalendarDate === dateKey;

                return (
                  <div
                    key={dateKey}
                    onClick={() => {
                      if (dayData && dayData.trades.length > 0) {
                        setSelectedCalendarDate(isSelected ? null : dateKey);
                        setSubTab('log');
                      }
                    }}
                    className={`h-22 sm:h-28 rounded-xl p-1.5 sm:p-2.5 border flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
                      dayData && dayData.netUSD > 0
                        ? 'bg-gradient-to-b from-emerald-950/40 to-[#130b20] border-emerald-500/50 hover:border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                        : dayData && dayData.netUSD < 0
                        ? 'bg-gradient-to-b from-rose-950/40 to-[#130b20] border-rose-500/50 hover:border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
                        : 'bg-[#1a0f30] border-purple-500/15 hover:border-purple-400/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-xs font-bold ${dayData ? 'text-white' : 'text-purple-400/50'}`}>
                        {dayNum}
                      </span>
                      {dayData && (
                        <span className="text-[9px] font-orbitron font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          {dayData.trades.length} T
                        </span>
                      )}
                    </div>

                    {dayData ? (
                      <div className="space-y-0.5 mt-auto">
                        <p className={`font-mono font-black text-[11px] sm:text-xs truncate ${dayData.netUSD > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {dayData.netUSD > 0 ? `+$${dayData.netUSD.toFixed(1)}` : `-$${Math.abs(dayData.netUSD).toFixed(1)}`}
                        </p>
                        <p className="font-mono text-[9px] text-purple-200/80 truncate hidden sm:block">
                          ≈ {dayData.netIDR > 0 ? `+${(dayData.netIDR / 1000000).toFixed(1)}M` : `${(dayData.netIDR / 1000000).toFixed(1)}M`}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[9px] font-mono text-purple-500/30 mt-auto text-center">-</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LOG TRANSAKSI TRADING */}
      {subTab === 'log' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Search & Filter Bar */}
          <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-4 space-y-3 shadow-neo-purple">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative w-full md:flex-1">
                <Search className="w-4 h-4 text-purple-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari judul trade, pair (XAUUSD), broker (Exness), atau strategi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
                {selectedCalendarDate && (
                  <button
                    onClick={() => setSelectedCalendarDate(null)}
                    className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
                  >
                    <span>Filter Tgl: {selectedCalendarDate}</span>
                    <span className="text-purple-400 font-bold">×</span>
                  </button>
                )}

                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-purple-200 focus:outline-none focus:border-purple-400 font-mono"
                >
                  <option value="ALL">Semua Pair ({tradings.length})</option>
                  {pairList.map((pair) => (
                    <option key={pair} value={pair}>{pair}</option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-purple-200 focus:outline-none focus:border-purple-400 font-orbitron"
                >
                  <option value="ALL">Profit & Loss</option>
                  <option value="profit">Khusus Profit (+)</option>
                  <option value="loss">Khusus Loss (-)</option>
                </select>

                <select
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                  className="bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-purple-200 focus:outline-none focus:border-purple-400"
                >
                  <option value="ALL">Semua Strategi</option>
                  {strategyList.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cards feed */}
          <div className="space-y-4">
            {filteredTradings.length === 0 ? (
              <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-12 text-center space-y-3">
                <CandlestickChart className="w-12 h-12 text-purple-500/40 mx-auto" />
                <h3 className="font-orbitron font-bold text-purple-200 text-base">Tidak Ada Catatan Trading</h3>
                <p className="text-xs text-purple-400/60 font-rajdhani font-semibold">
                  Coba atur ulang pencarian atau filter pair untuk menampilkan data.
                </p>
              </div>
            ) : (
              filteredTradings.map((item) => {
                const isProfit = item.type === 'profit';
                const rate = item.exchangeRateUSD || DEFAULT_RATE;
                const itemUSD = item.profitUSD !== undefined ? item.profitUSD : item.profitAmount / rate;

                return (
                  <div
                    key={item.id}
                    className="relative bg-gradient-to-b from-[#180e2b] to-[#0d0718] border border-purple-500/40 hover:border-purple-400/80 rounded-2xl p-6 space-y-4 shadow-lg transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 text-[11px] font-orbitron font-extrabold rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                            {item.pair}
                          </span>

                          <span className={`px-3 py-1 text-[11px] font-orbitron font-black rounded-lg border flex items-center gap-1 ${
                            item.action === 'BUY'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            {item.action === 'BUY' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                            <span>{item.action} {item.lotSize} LOT</span>
                          </span>

                          <span className={`px-3 py-1 text-[11px] font-orbitron font-bold rounded-lg border ${
                            isProfit ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}>
                            {item.status}
                          </span>

                          {item.isClaimedToJournal && (
                            <span className="px-3 py-1 text-[11px] font-orbitron font-bold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Saldo Masuk Jurnal Kas ({item.account})</span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-orbitron font-bold text-lg sm:text-xl text-purple-100 group-hover:text-purple-300 transition-colors">
                          {item.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-purple-300/80 font-rajdhani font-semibold">
                          <span className="bg-[#1a0f30] px-2.5 py-1 rounded-md border border-purple-500/20 text-purple-200">
                            {item.strategy}
                          </span>
                          <span>•</span>
                          <span className="font-mono">{item.broker}</span>
                          <span>•</span>
                          <span className="font-mono">{formatDateIndo(item.date)}</span>
                        </div>
                      </div>

                      <div className="flex items-center sm:items-end justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-purple-500/20 pt-3 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase tracking-widest">
                            {isProfit ? 'PROFIT HASIL TRADING' : 'KERUGIAN (LOSS)'}
                          </p>
                          <p className={`text-xl sm:text-2xl font-mono font-black ${isProfit ? 'text-neon-purple drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]' : 'text-rose-400'}`}>
                            {isProfit ? `+$${itemUSD.toFixed(2)} USD` : `-$${Math.abs(itemUSD).toFixed(2)} USD`}
                          </p>
                          <p className="text-xs font-mono font-bold text-purple-300/90 mt-0.5">
                            ≈ {isProfit ? `+${formatRupiah(item.profitAmount)}` : formatRupiah(item.profitAmount)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEditTrading(item)}
                            className="p-2.5 rounded-xl bg-[#1a0f30] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTrading(item.id)}
                            className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/40 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Details Box */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-[#1a0f30] p-4 rounded-xl border border-purple-500/30">
                      <div>
                        <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">Harga Entry</p>
                        <p className="font-mono font-bold text-xs text-purple-100 mt-0.5">{item.entryPrice}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">Harga Exit</p>
                        <p className="font-mono font-bold text-xs text-purple-100 mt-0.5">{item.exitPrice}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">Total Pips</p>
                        <p className={`font-mono font-bold text-xs mt-0.5 ${item.profitPips >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                          {item.profitPips >= 0 ? `+${item.profitPips}` : item.profitPips} Pips
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">Kurs Google</p>
                        <p className="font-mono font-bold text-xs text-purple-200 mt-0.5">Rp {rate.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">Akun Penampung</p>
                        <p className="font-mono font-bold text-xs text-emerald-300 mt-0.5">{item.account}</p>
                      </div>
                    </div>

                    {/* Quick Claim Button */}
                    {isProfit && !item.isClaimedToJournal && (
                      <button
                        onClick={() => {
                          setWithdrawTargetItems([item]);
                          setWithdrawBatchTitle(`Pencairan Profit Single Trade ${item.pair}`);
                          setTargetBank(item.account || 'Bank BCA');
                          setIsWithdrawModalOpen(true);
                        }}
                        className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                      >
                        <Building2 className="w-4 h-4 text-slate-950 font-bold" />
                        <span>WITHDRAW HASIL TRADING KE {item.account || 'BANK BCA'} (+${itemUSD.toFixed(2)} USD)</span>
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: WITHDRAWAL / PENARIKAN KE REKENING BANK */}
      {subTab === 'withdraw' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Summary Banner */}
          <div className="bg-gradient-to-r from-[#180e2b] via-[#24133d] to-[#180e2b] border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-orbitron font-bold text-emerald-400">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <span>DASHBOARD WITHDRAWAL HASIL TRADING KE REKENING BANK</span>
              </div>
              {unclaimedTrades.length > 0 && (
                <button
                  onClick={() => openWithdrawModalForBatch(unclaimedTrades, `Pencairan Semua Profit (${unclaimedTrades.length} Transaksi)`)}
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer shrink-0"
                >
                  <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>CAIRKAN SEMUA PROFIT NOW ({unclaimedTrades.length})</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-emerald-500/20 pt-4">
              <div>
                <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">TOTAL PROFIT BELUM DICAIRKAN</p>
                <p className="text-2xl font-mono font-black text-emerald-400 mt-1">+${unclaimedProfitUSD.toFixed(2)} USD</p>
                <p className="text-xs font-mono text-purple-200">≈ {formatRupiah(unclaimedProfitIDR)}</p>
              </div>

              <div>
                <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">TRANSAKSI READY</p>
                <p className="text-2xl font-mono font-black text-purple-200 mt-1">{unclaimedTrades.length} Transaksi</p>
                <p className="text-xs font-rajdhani text-purple-300/70">Dapat ditarik Mingguan / Bulanan / Sekaligus</p>
              </div>

              <div>
                <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">KURS GOOGLE MONETARY</p>
                <p className="text-2xl font-mono font-black text-cyan-400 mt-1">Rp {DEFAULT_RATE.toLocaleString()}</p>
                <p className="text-xs font-rajdhani text-cyan-300/70">Google Rates Real-Time</p>
              </div>
            </div>
          </div>

          {/* Mode Selection Tabs for Withdrawal Frequency */}
          <div className="flex flex-wrap items-center gap-2 border-b border-purple-500/20 pb-3">
            <button
              onClick={() => setWithdrawTabMode('all')}
              className={`font-orbitron text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                withdrawTabMode === 'all'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg'
                  : 'bg-[#180e2b] text-purple-300 hover:text-white border border-purple-500/30'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Semua Profit ({unclaimedTrades.length})</span>
            </button>

            <button
              onClick={() => setWithdrawTabMode('weekly')}
              className={`font-orbitron text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                withdrawTabMode === 'weekly'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-[#180e2b] text-purple-300 hover:text-white border border-purple-500/30'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>1 Minggu Sekali ({Object.keys(unclaimedByWeekMap).length} Pekan)</span>
            </button>

            <button
              onClick={() => setWithdrawTabMode('monthly')}
              className={`font-orbitron text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                withdrawTabMode === 'monthly'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-[#180e2b] text-purple-300 hover:text-white border border-purple-500/30'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>1 Bulan Sekali ({Object.keys(unclaimedByMonthMap).length} Bulan)</span>
            </button>

            <button
              onClick={() => setWithdrawTabMode('single')}
              className={`font-orbitron text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                withdrawTabMode === 'single'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-[#180e2b] text-purple-300 hover:text-white border border-purple-500/30'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Per Transaksi Satuan</span>
            </button>
          </div>

          {/* TAB CONTENT: ALL UNCLAIMED */}
          {withdrawTabMode === 'all' && (
            <div className="space-y-4">
              {unclaimedTrades.length === 0 ? (
                <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-10 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-orbitron font-bold text-purple-100">Semua Profit Telah Dicairkan</h4>
                  <p className="text-xs text-purple-300/70 font-rajdhani">
                    Seluruh hasil trading profit sudah berhasil ditransfer dan tercatat di Saldo Jurnal Kas RINJANI.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-[#180e2b] border border-emerald-500/50 rounded-2xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-orbitron font-bold text-purple-100 text-base">Pencairan Kolektif Semua Profit Trading</h4>
                        <p className="text-xs text-purple-300/70 font-rajdhani">
                          Cairkan akumulasi {unclaimedTrades.length} transaksi profit trading sekaligus ke rekening pilihan Anda.
                        </p>
                      </div>
                      <button
                        onClick={() => openWithdrawModalForBatch(unclaimedTrades, `Pencairan Semua Profit (${unclaimedTrades.length} Transaksi)`)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0"
                      >
                        <Building2 className="w-4 h-4 text-slate-950 font-bold" />
                        <span>WITHDRAW SEMUA PROFIT NOW (+${unclaimedProfitUSD.toFixed(2)})</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-orbitron font-bold text-xs text-purple-300 uppercase tracking-wider">Rincian Transaksi Yang Termasuk ({unclaimedTrades.length}):</h5>
                    {unclaimedTrades.map((item) => {
                      const usd = item.profitUSD !== undefined ? item.profitUSD : item.profitAmount / DEFAULT_RATE;
                      return (
                        <div key={item.id} className="bg-[#130b20] border border-purple-500/20 rounded-xl p-4 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-mono text-purple-400">{formatDateIndo(item.date)}</span>
                            <h6 className="font-orbitron font-bold text-sm text-purple-100">{item.title} ({item.pair})</h6>
                            <p className="text-xs font-mono text-purple-400/80">Broker: {item.broker}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-bold text-emerald-400 text-sm">+${usd.toFixed(2)} USD</p>
                            <p className="text-xs font-mono text-purple-200">≈ {formatRupiah(item.profitAmount)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB CONTENT: WEEKLY (1 MINGGU SEKALI) */}
          {withdrawTabMode === 'weekly' && (
            <div className="space-y-4">
              {Object.keys(unclaimedByWeekMap).length === 0 ? (
                <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-10 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-orbitron font-bold text-purple-100">Tidak Ada Batch Profit Mingguan</h4>
                  <p className="text-xs text-purple-300/70 font-rajdhani">Semua profit trading mingguan telah berhasil dicairkan.</p>
                </div>
              ) : (
                Object.values(unclaimedByWeekMap).map((weekGroup) => (
                  <div key={weekGroup.label} className="bg-[#180e2b] border border-emerald-500/40 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-emerald-400" />
                          <h4 className="font-orbitron font-bold text-purple-100 text-base">{weekGroup.label}</h4>
                        </div>
                        <p className="text-xs text-purple-300/70 font-rajdhani mt-0.5">
                          {weekGroup.trades.length} Transaksi Profit Trading pada pekan ini
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-5">
                        <div className="text-right">
                          <p className="text-xl font-mono font-black text-emerald-400">+${weekGroup.totalUSD.toFixed(2)} USD</p>
                          <p className="text-xs font-mono font-bold text-purple-200">≈ {formatRupiah(weekGroup.totalIDR)}</p>
                        </div>
                        <button
                          onClick={() => openWithdrawModalForBatch(weekGroup.trades, `Pencairan Batch Mingguan: ${weekGroup.label}`)}
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
                        >
                          <Building2 className="w-4 h-4 text-slate-950 font-bold" />
                          <span>CAIRKAN PEKAN INI</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {weekGroup.trades.map((t) => {
                        const usd = t.profitUSD !== undefined ? t.profitUSD : t.profitAmount / DEFAULT_RATE;
                        return (
                          <div key={t.id} className="bg-[#130b20] p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                            <span className="text-purple-200">{formatDateIndo(t.date)} • {t.title} ({t.pair})</span>
                            <span className="text-emerald-400 font-bold">+${usd.toFixed(2)} USD ({formatRupiah(t.profitAmount)})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB CONTENT: MONTHLY (1 BULAN SEKALI) */}
          {withdrawTabMode === 'monthly' && (
            <div className="space-y-4">
              {Object.keys(unclaimedByMonthMap).length === 0 ? (
                <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-10 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-orbitron font-bold text-purple-100">Tidak Ada Batch Profit Bulanan</h4>
                  <p className="text-xs text-purple-300/70 font-rajdhani">Semua profit trading bulanan telah berhasil dicairkan.</p>
                </div>
              ) : (
                Object.values(unclaimedByMonthMap).map((monthGroup) => (
                  <div key={monthGroup.label} className="bg-[#180e2b] border border-emerald-500/40 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-emerald-400" />
                          <h4 className="font-orbitron font-bold text-purple-100 text-base">Pencairan Bulan {monthGroup.label}</h4>
                        </div>
                        <p className="text-xs text-purple-300/70 font-rajdhani mt-0.5">
                          Akumulasi {monthGroup.trades.length} Transaksi Profit Trading bulan ini
                        </p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-5">
                        <div className="text-right">
                          <p className="text-xl font-mono font-black text-emerald-400">+${monthGroup.totalUSD.toFixed(2)} USD</p>
                          <p className="text-xs font-mono font-bold text-purple-200">≈ {formatRupiah(monthGroup.totalIDR)}</p>
                        </div>
                        <button
                          onClick={() => openWithdrawModalForBatch(monthGroup.trades, `Pencairan Batch Bulanan: ${monthGroup.label}`)}
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
                        >
                          <Building2 className="w-4 h-4 text-slate-950 font-bold" />
                          <span>CAIRKAN BULAN INI</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {monthGroup.trades.map((t) => {
                        const usd = t.profitUSD !== undefined ? t.profitUSD : t.profitAmount / DEFAULT_RATE;
                        return (
                          <div key={t.id} className="bg-[#130b20] p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                            <span className="text-purple-200">{formatDateIndo(t.date)} • {t.title} ({t.pair})</span>
                            <span className="text-emerald-400 font-bold">+${usd.toFixed(2)} USD ({formatRupiah(t.profitAmount)})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB CONTENT: SINGLE TRANSACTION */}
          {withdrawTabMode === 'single' && (
            <div className="space-y-4">
              {unclaimedTrades.length === 0 ? (
                <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-10 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-orbitron font-bold text-purple-100">Semua Profit Telah Dicairkan</h4>
                  <p className="text-xs text-purple-300/70 font-rajdhani">Seluruh hasil trading profit sudah berhasil ditransfer.</p>
                </div>
              ) : (
                unclaimedTrades.map((item) => {
                  const usd = item.profitUSD !== undefined ? item.profitUSD : item.profitAmount / DEFAULT_RATE;
                  return (
                    <div key={item.id} className="bg-[#180e2b] border border-emerald-500/40 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-orbitron text-xs font-bold">{item.pair}</span>
                          <span className="text-xs font-mono text-purple-200">{formatDateIndo(item.date)}</span>
                        </div>
                        <h4 className="font-orbitron font-bold text-base text-purple-100">{item.title}</h4>
                        <p className="text-xs font-mono text-purple-300/80">Broker: {item.broker} • Strategi: {item.strategy}</p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 border-purple-500/20 pt-3 md:pt-0">
                        <div className="text-right">
                          <p className="text-xl font-mono font-black text-emerald-400">+${usd.toFixed(2)} USD</p>
                          <p className="text-xs font-mono font-bold text-purple-200">≈ {formatRupiah(item.profitAmount)}</p>
                        </div>

                        <button
                          onClick={() => openWithdrawModalForBatch([item], `Pencairan Profit: ${item.title}`)}
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
                        >
                          <Building2 className="w-4 h-4 text-slate-950 font-bold" />
                          <span>WITHDRAW NOW</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: LIVE CHART TRADINGVIEW */}
      {subTab === 'chart' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-[#130b20]/90 border border-purple-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-neo-purple">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-fuchsia-400 animate-pulse" />
                <h3 className="font-orbitron font-black text-sm sm:text-base text-purple-100 uppercase tracking-wider">
                  Grafik Real-Time TradingView (XAU/USD Gold, Crypto, Forex & Stocks)
                </h3>
              </div>
              <span className="text-xs font-mono text-purple-300/70">
                Pilih pair, timeframe, dan mirror server langsung di atas chart
              </span>
            </div>

            <TradingViewAdvancedChart symbol="OANDA:XAUUSD" height={520} theme="dark" />
          </div>
        </div>
      )}

      {/* WITHDRAWAL PROCESS MODAL */}
      {isWithdrawModalOpen && withdrawTargetItems.length > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#130b20] border border-emerald-500/50 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-[0_0_35px_rgba(16,185,129,0.3)] animate-fadeIn">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-orbitron font-bold text-sm">
                <Building2 className="w-5 h-5" />
                <span>KONFIRMASI WITHDRAWAL KE BANK</span>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-purple-400/60 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#1a0f30] p-4 rounded-xl border border-purple-500/20 space-y-3">
              <p className="text-[10px] font-orbitron text-purple-400/80 uppercase">Skema & Detail Pencairan</p>
              <p className="font-orbitron font-bold text-purple-100 text-sm">{withdrawBatchTitle}</p>
              
              <div className="flex items-center justify-between text-xs font-mono text-purple-300 pt-1 border-t border-purple-500/15">
                <span>Jumlah Transaksi:</span>
                <span className="text-purple-200 font-bold">{withdrawTargetItems.length} Trade</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-purple-300">
                <span>Total Nominal USD:</span>
                <span className="text-emerald-400 font-bold">
                  +${withdrawTargetItems.reduce((sum, t) => sum + (t.profitUSD !== undefined ? t.profitUSD : t.profitAmount / DEFAULT_RATE), 0).toFixed(2)} USD
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-purple-300">
                <span>Total Rupiah (IDR):</span>
                <span className="text-emerald-400 font-bold">
                  +{formatRupiah(withdrawTargetItems.reduce((sum, t) => sum + t.profitAmount, 0))}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-orbitron text-purple-300 mb-1.5">
                Pilih Rekening Bank Tujuan Penampungan:
              </label>
              <select
                value={targetBank}
                onChange={(e) => setTargetBank(e.target.value as AccountType)}
                className="w-full bg-[#1a0f30] border border-emerald-500/40 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 font-orbitron focus:outline-none"
              >
                <option value="Bank BCA">Bank BCA (Rekening Utama)</option>
                <option value="Bank Mandiri">Bank Mandiri</option>
                <option value="Bank BRI">Bank BRI</option>
                <option value="Bank BNI">Bank BNI</option>
                <option value="Kas Tunai">Kas Tunai (Cash Vault)</option>
                <option value="Dompet Digital">Dompet Digital (e-Wallet)</option>
                <option value="Rekening Investasi">Rekening Investasi</option>
              </select>
            </div>

            <div className="bg-[#1d1136] p-3 rounded-xl text-center text-xs font-rajdhani text-purple-200/80">
              Total Saldo sebesar <span className="text-emerald-400 font-bold">{formatRupiah(withdrawTargetItems.reduce((sum, t) => sum + t.profitAmount, 0))}</span> akan otomatis ditambahkan ke saldo real-time <span className="text-purple-300 font-bold">{targetBank}</span> di Dashboard RINJANI.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-purple-500/30 text-purple-200/80 text-xs font-orbitron"
              >
                BATAL
              </button>
              <button
                type="button"
                onClick={() => handleExecuteWithdrawBatch(withdrawTargetItems, targetBank, withdrawBatchTitle)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Check className="w-4 h-4 text-slate-950 font-bold" />
                <span>KONFIRMASI TRANSFER KE {targetBank.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAWAL SUCCESS SLIP MODAL */}
      {withdrawSuccessSlip && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#130b20] border-2 border-emerald-500 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-[0_0_45px_rgba(16,185,129,0.4)] animate-fadeIn text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="font-orbitron font-black text-emerald-400 text-lg uppercase tracking-wider">WITHDRAWAL BERHASIL!</h3>
              <p className="text-xs font-rajdhani text-purple-200/80 mt-1">
                Hasil profit trading ({withdrawSuccessSlip.tradeCount} Transaksi) telah resmi dicairkan dan masuk ke Saldo Dashboard RINJANI.
              </p>
            </div>

            <div className="bg-[#1a0f30] border border-emerald-500/30 rounded-xl p-4 text-left space-y-2 font-mono text-xs">
              <div className="flex justify-between border-b border-purple-500/15 pb-2">
                <span className="text-purple-400/70">Waktu Transfer:</span>
                <span className="text-purple-200">{withdrawSuccessSlip.date}</span>
              </div>
              <div className="flex justify-between border-b border-purple-500/15 pb-2">
                <span className="text-purple-400/70">Skema Batch:</span>
                <span className="text-purple-200 font-bold">{withdrawSuccessSlip.tradingTitle}</span>
              </div>
              <div className="flex justify-between border-b border-purple-500/15 pb-2">
                <span className="text-purple-400/70">Jumlah Transaksi:</span>
                <span className="text-purple-200 font-bold">{withdrawSuccessSlip.tradeCount} Trade</span>
              </div>
              <div className="flex justify-between border-b border-purple-500/15 pb-2">
                <span className="text-purple-400/70">Bank Tujuan:</span>
                <span className="text-emerald-400 font-bold">{withdrawSuccessSlip.bank}</span>
              </div>
              <div className="flex justify-between border-b border-purple-500/15 pb-2">
                <span className="text-purple-400/70">Nominal USD:</span>
                <span className="text-emerald-400 font-bold">+${withdrawSuccessSlip.amountUSD.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-purple-400/70">Kredit Masuk (IDR):</span>
                <span className="text-emerald-400 font-black text-sm">+{formatRupiah(withdrawSuccessSlip.amountIDR)}</span>
              </div>
            </div>

            <button
              onClick={() => setWithdrawSuccessSlip(null)}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              TUTUP BUKTI WITHDRAWAL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
