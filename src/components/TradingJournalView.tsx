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
  BarChart2, 
  Search, 
  Globe, 
  Flame,
  Award,
  Layers,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Building2,
  Check,
  Zap
} from 'lucide-react';
import { TradingJournalItem, AccountType, TradingPair, TradingStrategy, TradingResultStatus } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { TradingViewAdvancedChart } from './TradingViewWidget';
import { GLOBAL_RATES } from '../utils/rates';

interface TradingJournalViewProps {
  tradings: TradingJournalItem[];
  onOpenAddModal: () => void;
  onEditTrading: (trading: TradingJournalItem) => void;
  onDeleteTrading: (id: string) => void;
  onClaimToJournal: (trading: TradingJournalItem) => void;
  onBatchClaimToJournal?: (items: TradingJournalItem[], bank: AccountType, summaryTitle?: string) => void;
}

export const TradingJournalView: React.FC<TradingJournalViewProps> = ({
  tradings = [],
  onOpenAddModal,
  onEditTrading,
  onDeleteTrading,
  onClaimToJournal,
  onBatchClaimToJournal,
}) => {
  const [subTab, setSubTab] = useState<'dashboard' | 'calendar' | 'log' | 'withdraw' | 'chart'>('dashboard');
  const [withdrawTabMode, setWithdrawTabMode] = useState<'all' | 'weekly' | 'monthly' | 'single'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPair, setSelectedPair] = useState<string>('ALL');
  
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawTargetItems, setWithdrawTargetItems] = useState<TradingJournalItem[]>([]);
  const [withdrawBatchTitle, setWithdrawBatchTitle] = useState<string>('');
  const [targetBank, setTargetBank] = useState<AccountType>('Bank BCA');

  // Helper aman untuk hitung PnL
  const calculatePnL = (items: TradingJournalItem[]) => {
    const safeItems = items || [];
    const netIDR = safeItems.reduce((sum, item) => sum + (item.profitAmount || 0), 0);
    const netUSD = safeItems.reduce((sum, item) => {
      const rate = item.exchangeRateUSD || GLOBAL_RATES.USD_IDR;
      const usd = item.profitUSD !== undefined ? item.profitUSD : (item.profitAmount || 0) / rate;
      return sum + usd;
    }, 0);
    const totalTrades = safeItems.length;
    const wins = safeItems.filter((t) => t.type === 'profit').length;
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const pips = safeItems.reduce((sum, t) => sum + (t.profitPips || 0), 0);

    return { netIDR, netUSD, totalTrades, wins, winRate, pips };
  };

  const allTimeStats = calculatePnL(tradings);
  const unclaimedTrades = tradings.filter((t) => t.type === 'profit' && !t.isClaimedToJournal);
  const unclaimedProfitIDR = unclaimedTrades.reduce((sum, t) => sum + (t.profitAmount || 0), 0);
  const unclaimedProfitUSD = unclaimedTrades.reduce((sum, t) => {
    const rate = t.exchangeRateUSD || GLOBAL_RATES.USD_IDR;
    return sum + (t.profitUSD !== undefined ? t.profitUSD : (t.profitAmount || 0) / rate);
  }, 0);

  // Grouping Logics
  const pairList = Array.from(new Set(tradings.map((t) => t.pair)));
  const strategyList = Array.from(new Set(tradings.map((t) => t.strategy)));

  const filteredTradings = tradings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.pair.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPair = selectedPair === 'ALL' || item.pair === selectedPair;
    const matchesDate = !selectedCalendarDate || item.date === selectedCalendarDate;
    return matchesSearch && matchesPair && matchesDate;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-orbitron font-extrabold text-purple-100 uppercase tracking-wider flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white shadow-neo-purple">
              <CandlestickChart className="w-6 h-6" />
            </div>
            <span>JURNAL TRADING</span>
          </h2>
          <p className="text-xs text-purple-300/80 font-rajdhani font-semibold mt-1">Monitoring Profit/Loss Real-time RINJANI</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={() => setSubTab('withdraw')} className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-orbitron font-black text-[10px] px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer">
            <Building2 className="w-4 h-4" /><span>WITHDRAW ({unclaimedTrades.length})</span>
          </button>
          <button onClick={onOpenAddModal} className="bg-gradient-to-r from-purple-600 to-fuchsia-700 text-white font-orbitron font-black text-[10px] px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-neo-purple cursor-pointer">
            <Plus className="w-4 h-4" /><span>CATAT TRADING</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#130b20]/80 p-1.5 rounded-2xl border border-purple-500/30">
        <button onClick={() => setSubTab('dashboard')} className={`px-4 py-2 rounded-xl font-orbitron text-[10px] font-bold flex items-center gap-2 ${subTab === 'dashboard' ? 'bg-purple-600 text-white shadow-neo-purple' : 'text-purple-300/80 hover:bg-purple-500/10'}`}><BarChart2 className="w-4 h-4" /><span>REKAPAN PnL</span></button>
        <button onClick={() => setSubTab('log')} className={`px-4 py-2 rounded-xl font-orbitron text-[10px] font-bold flex items-center gap-2 ${subTab === 'log' ? 'bg-purple-600 text-white shadow-neo-purple' : 'text-purple-300/80 hover:bg-purple-500/10'}`}><Receipt className="w-4 h-4" /><span>LOG JURNAL</span></button>
        <button onClick={() => setSubTab('chart')} className={`px-4 py-2 rounded-xl font-orbitron text-[10px] font-bold flex items-center gap-2 ${subTab === 'chart' ? 'bg-purple-600 text-white shadow-neo-purple' : 'text-purple-300/80 hover:bg-purple-500/10'}`}><Globe className="w-4 h-4" /><span>LIVE CHART</span></button>
      </div>

      {subTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-[#180e2b] border border-purple-500/40 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[9px] font-orbitron text-purple-400 font-bold uppercase">Net Profit (USD)</span>
                <p className={`text-xl font-mono font-black ${allTimeStats.netUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>${allTimeStats.netUSD.toFixed(2)}</p>
                <p className="text-[10px] font-mono text-purple-200">≈ {formatRupiah(allTimeStats.netIDR)}</p>
             </div>
             <div className="bg-[#180e2b] border border-purple-500/40 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[9px] font-orbitron text-purple-400 font-bold uppercase">Win Rate</span>
                <p className="text-xl font-mono font-black text-fuchsia-400">{allTimeStats.winRate.toFixed(1)}%</p>
                <p className="text-[10px] font-mono text-purple-200">{allTimeStats.wins} Win dari {allTimeStats.totalTrades} Trade</p>
             </div>
             <div className="bg-[#180e2b] border border-purple-500/40 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[9px] font-orbitron text-purple-400 font-bold uppercase">Total Pips</span>
                <p className="text-xl font-mono font-black text-cyan-400">{allTimeStats.pips} Pips</p>
             </div>
             <div className="bg-[#180e2b] border border-purple-500/40 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[9px] font-orbitron text-purple-400 font-bold uppercase">Kurs USD (IDR)</span>
                <p className="text-xl font-mono font-black text-emerald-400">Rp {GLOBAL_RATES.USD_IDR.toLocaleString()}</p>
             </div>
          </div>

          <div className="bg-gradient-to-r from-[#180e2b] to-[#120921] border border-emerald-500/40 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-neo-purple">
            <div className="space-y-1">
              <span className="text-[10px] font-orbitron font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2"><Receipt className="w-4 h-4" /> PROFIT SIAP WITHDRAW</span>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-2xl font-mono font-black text-emerald-400">+${unclaimedProfitUSD.toFixed(2)} USD</span>
                <span className="text-sm font-mono font-bold text-purple-200">≈ {formatRupiah(unclaimedProfitIDR)}</span>
              </div>
            </div>
            <button onClick={() => setSubTab('withdraw')} className="bg-emerald-500 text-slate-950 font-orbitron font-black text-[10px] px-6 py-3 rounded-xl shadow-lg cursor-pointer active:scale-95 transition-all">CAIRKAN KE BANK SEKARANG</button>
          </div>
        </div>
      )}

      {subTab === 'log' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Cari Pair / Judul..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none" />
            </div>
            <select value={selectedPair} onChange={(e) => setSelectedPair(e.target.value)} className="bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3 py-2 text-[10px] text-purple-200 font-orbitron">
              <option value="ALL">SEMUA PAIR</option>
              {pairList.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            {filteredTradings.length === 0 ? (
              <div className="text-center py-20 text-purple-400/50 font-orbitron text-xs">Belum ada data trading.</div>
            ) : (
              filteredTradings.map((item) => (
                <div key={item.id} className="bg-[#180e2b] border border-purple-500/30 rounded-2xl p-5 hover:border-purple-400 transition-all group">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-orbitron text-[9px] font-bold">{item.pair}</span>
                        <span className={`px-2.5 py-0.5 rounded font-orbitron text-[9px] font-black ${item.action === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>{item.action}</span>
                      </div>
                      <h4 className="font-orbitron font-bold text-sm text-purple-100 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[10px] font-mono text-purple-300/60 mt-1">{formatDateIndo(item.date)} • {item.strategy}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-mono font-black ${item.type === 'profit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.type === 'profit' ? '+' : '-'}${Math.abs(item.profitUSD || 0).toFixed(2)}
                      </p>
                      <p className="text-[10px] font-mono text-purple-200 opacity-70">{formatRupiah(Math.abs(item.profitAmount))}</p>
                      <div className="flex gap-2 mt-2 justify-end">
                        <button onClick={() => onEditTrading(item)} className="p-1.5 rounded bg-[#1a0f30] text-purple-300 hover:text-white cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteTrading(item.id)} className="p-1.5 rounded bg-rose-950/30 text-rose-400 hover:text-rose-200 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {subTab === 'chart' && (
        <div className="space-y-4 animate-fadeIn">
          <TradingViewAdvancedChart symbol="OANDA:XAUUSD" height={520} theme="dark" />
        </div>
      )}
    </div>
  );
};
