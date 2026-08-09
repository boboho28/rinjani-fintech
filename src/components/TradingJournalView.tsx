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
  Building2,
  Check,
  Zap
} from 'lucide-react';
import { TradingJournalItem, AccountType } from '../types';
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
  const [subTab, setSubTab] = useState<'dashboard' | 'log' | 'withdraw' | 'chart'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPair, setSelectedPair] = useState<string>('ALL');
  
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawTargetItems, setWithdrawTargetItems] = useState<TradingJournalItem[]>([]);
  const [withdrawBatchTitle, setWithdrawBatchTitle] = useState<string>('');
  const [targetBank, setTargetBank] = useState<AccountType>('Bank BCA');

  const calculatePnL = (items: TradingJournalItem[]) => {
    const safeItems = items || [];
    const netIDR = safeItems.reduce((sum, item) => sum + (item.profitAmount || 0), 0);
    const netUSD = safeItems.reduce((sum, item) => {
      const rate = item.exchangeRateUSD || GLOBAL_RATES.USD_IDR;
      return sum + (item.profitUSD !== undefined ? item.profitUSD : (item.profitAmount || 0) / rate);
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
    return sum + (t.profitUSD !== undefined ? t.profitUSD : (item.profitAmount || 0) / rate);
  }, 0);

  const pairList = Array.from(new Set(tradings.map((t) => t.pair)));

  const handleOpenWithdrawModal = (items: TradingJournalItem[], title: string) => {
    setWithdrawTargetItems(items);
    setWithdrawBatchTitle(title);
    setIsWithdrawModalOpen(true);
  };

  const handleExecuteWithdrawBatch = () => {
    if (onBatchClaimToJournal && withdrawTargetItems.length > 0) {
      onBatchClaimToJournal(withdrawTargetItems, targetBank, withdrawBatchTitle);
    }
    setIsWithdrawModalOpen(false);
  };

  const filteredTradings = tradings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPair = selectedPair === 'ALL' || item.pair === selectedPair;
    return matchesSearch && matchesPair;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-orbitron font-extrabold text-purple-100 uppercase tracking-wider flex items-center gap-3">
            <CandlestickChart className="w-6 h-6 text-purple-600" /><span>JURNAL TRADING</span>
          </h2>
          <p className="text-xs text-purple-300/80 font-rajdhani font-semibold mt-1">Monitoring PnL Real-time</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button onClick={() => setSubTab('withdraw')} className="bg-emerald-600 text-white font-orbitron font-black text-[10px] px-4 py-2.5 rounded-xl shadow-lg cursor-pointer">WITHDRAW ({unclaimedTrades.length})</button>
          <button onClick={onOpenAddModal} className="bg-purple-600 text-white font-orbitron font-black text-[10px] px-4 py-2.5 rounded-xl shadow-neo-purple cursor-pointer">+ CATAT TRADING</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-[#130b20]/80 p-1.5 rounded-2xl border border-purple-500/30">
        <button onClick={() => setSubTab('dashboard')} className={`px-4 py-2 rounded-xl font-orbitron text-[10px] font-bold ${subTab === 'dashboard' ? 'bg-purple-600 text-white shadow-neo-purple' : 'text-purple-300/80 hover:bg-purple-500/10'}`}>REKAPAN</button>
        <button onClick={() => setSubTab('log')} className={`px-4 py-2 rounded-xl font-orbitron text-[10px] font-bold ${subTab === 'log' ? 'bg-purple-600 text-white shadow-neo-purple' : 'text-purple-30
