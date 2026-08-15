import React, { useState } from 'react';
import { 
  TrendingUp, 
  PlusCircle, 
  Sparkles, 
  Building2, 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit3, 
  Trash2, 
  FileText,
  Bookmark,
  Award,
  Activity,
  Layers,
  Wallet,
  Zap,
  ShieldCheck,
  History,
  X,
  Clock,
  Plus,
  ArrowDownCircle
} from 'lucide-react';
import { Investment, AssetType, InvestmentPurchase, AccountType } from '../types';
import { formatRupiah, formatPercent, formatThousands, parseThousands } from '../utils/formatters';
import { SellInvestmentModal } from './SellInvestmentModal';

interface InvestmentsViewProps {
  investments: Investment[];
  onAddInvestment: (prefillSymbol?: string) => void;
  onEditInvestment: (inv: Investment) => void;
  onDeleteInvestment: (id: string) => void;
  onSellInvestment: (
    investmentId: string,
    sellData: {
      sharesToSell: number;
      sellPrice: number;
      destinationAccount?: AccountType;
      depositToJournal: boolean;
      sellDate: string;
      notes?: string;
    }
  ) => void;
  onOpenAIModal: () => void;
}

export const InvestmentsView: React.FC<InvestmentsViewProps> = ({
  investments,
  onAddInvestment,
  onEditInvestment,
  onDeleteInvestment,
  onSellInvestment,
  onOpenAIModal,
}) => {
  const [selectedAssetType, setSelectedAssetType] = useState<string>('all');
  const [historyModalInv, setHistoryModalInv] = useState<Investment | null>(null);
  const [quickPriceInv, setQuickPriceInv] = useState<Investment | null>(null);
  const [quickPriceInput, setQuickPriceInput] = useState<number>(0);
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [selectedSellInvId, setSelectedSellInvId] = useState<string | undefined>(undefined);

  const handleSaveQuickPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPriceInv || quickPriceInput <= 0) return;
    onEditInvestment({
      ...quickPriceInv,
      currentPrice: quickPriceInput
    });
    setQuickPriceInv(null);
  };

  const filteredInvestments = investments.filter(
    (inv) => selectedAssetType === 'all' || inv.assetType === selectedAssetType
  );

  // Totals Calculation
  const totalCost = investments.reduce((acc, inv) => acc + inv.buyPrice * inv.shares, 0);
  const totalValue = investments.reduce((acc, inv) => acc + inv.currentPrice * inv.shares, 0);
  const totalProfitLoss = totalValue - totalCost;
  const profitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

  // Helper for Asset Type Badge Style
  const getAssetBadgeStyle = (assetType: string) => {
    switch (assetType) {
      case 'Saham':
        return 'bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-600/20 text-blue-300 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.25)]';
      case 'Emas':
        return 'bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-600/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
      case 'Reksadana':
        return 'bg-gradient-to-r from-fuchsia-500/20 via-purple-500/20 to-indigo-600/20 text-fuchsia-300 border-fuchsia-500/40 shadow-[0_0_12px_rgba(217,70,239,0.25)]';
      case 'Crypto':
        return 'bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-emerald-600/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]';
      case 'Obligasi / SBN':
        return 'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-green-600/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]';
      default:
        return 'bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-purple-600/20 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]';
    }
  };

  const formatDateDisplay = (dateString: string) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#180e32]/90 via-[#130b24]/90 to-[#0e071a]/90 border border-purple-500/35 rounded-2xl p-6 shadow-neo-purple backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-fuchsia-400" />
            <span>Portofolio Investasi, Saham & Kripto</span>
          </div>
          <h2 className="text-xl font-orbitron font-black text-neon-purple tracking-wide flex items-center gap-2">
            Data Investasi & Akumulasi Aset
          </h2>
          <p className="text-xs text-purple-200/70 font-rajdhani font-semibold mt-1">
            Setiap pembelian aset yang sama otomatis terakumulasi dalam satu Box dan terintegrasi dengan kas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => {
              setSelectedSellInvId(undefined);
              setIsSellModalOpen(true);
            }}
            className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white font-orbitron font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer border border-rose-400/30"
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>Jual / Tarik Aset</span>
          </button>

          <button
            onClick={() => onAddInvestment()}
            className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-neo-purple transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Beli / Tambah Aset</span>
          </button>

          <button
            onClick={onOpenAIModal}
            className="bg-[#1a0f30]/90 hover:bg-purple-500/20 text-purple-300 border border-purple-500/40 font-orbitron font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-neo-purple hover:border-purple-400"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
            <span>Evaluasi Saham AI</span>
          </button>
        </div>
      </div>

      {/* Portfolio Metrics Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-gradient-to-br from-[#160b2b]/90 via-[#110722]/90 to-[#0c0519]/90 border border-purple-500/30 rounded-2xl p-5 space-y-2 shadow-neo-purple relative overflow-hidden group hover:border-purple-400/60 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-orbitron font-extrabold text-purple-400 uppercase tracking-widest">Total Modal Ditanamkan</p>
            <Wallet className="w-4 h-4 text-purple-400/60 group-hover:text-purple-300 transition-colors" />
          </div>
          <p className="text-2xl font-mono font-black text-purple-100 tracking-tight">{formatRupiah(totalCost)}</p>
          <p className="text-[11px] text-purple-200/60 font-rajdhani font-semibold">Total modal bersih yang dibelikan aset</p>
        </div>

        <div className="bg-gradient-to-br from-[#160b2b]/90 via-[#110722]/90 to-[#0c0519]/90 border border-purple-500/30 rounded-2xl p-5 space-y-2 shadow-neo-purple relative overflow-hidden group hover:border-purple-400/60 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-orbitron font-extrabold text-purple-400 uppercase tracking-widest">Nilai Portofolio Saat Ini</p>
            <Activity className="w-4 h-4 text-fuchsia-400/60 group-hover:text-fuchsia-300 transition-colors" />
          </div>
          <p className="text-2xl font-mono font-black text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] tracking-tight">{formatRupiah(totalValue)}</p>
          <p className="text-[11px] text-purple-200/60 font-rajdhani font-semibold">Estimasi pencairan nilai pasar saat ini</p>
        </div>

        <div className="bg-gradient-to-br from-[#160b2b]/90 via-[#110722]/90 to-[#0c0519]/90 border border-purple-500/30 rounded-2xl p-5 space-y-2 shadow-neo-purple relative overflow-hidden group hover:border-purple-400/60 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-orbitron font-extrabold text-purple-400 uppercase tracking-widest">Unrealized Gain / Loss</p>
            <Zap className={`w-4 h-4 ${totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
          </div>
          <p className={`text-2xl font-mono font-black tracking-tight ${totalProfitLoss >= 0 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}>
            {formatRupiah(totalProfitLoss)}
          </p>
          <p className={`text-[11px] font-mono font-bold flex items-center gap-1 ${totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalProfitLoss >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{formatPercent(profitLossPercent)} Return Portofolio Total</span>
          </p>
        </div>

      </div>

      {/* Asset Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {['all', 'Saham', 'Reksadana', 'Emas', 'Crypto', 'Obligasi / SBN'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedAssetType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-orbitron font-extrabold uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
              selectedAssetType === type
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400/50'
                : 'bg-[#130b20]/80 text-purple-200/70 hover:text-white border border-purple-500/30 hover:border-purple-400/50'
            }`}
          >
            {type === 'all' ? 'Semua Asset' : type}
          </button>
        ))}
      </div>

      {/* Investments Stock Cards Grid - Box Aset Terpadu */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredInvestments.map((inv) => {
          const cost = inv.buyPrice * inv.shares;
          const currentVal = inv.currentPrice * inv.shares;
          const profit = currentVal - cost;
          const profitPct = cost > 0 ? (profit / cost) * 100 : 0;
          const isGain = profit >= 0;

          // Purchases count
          const purchasesList = inv.purchases && inv.purchases.length > 0 
            ? inv.purchases 
            : [
                {
                  id: `initial-${inv.id}`,
                  date: inv.buyDate || '2026-08-01',
                  buyPrice: inv.buyPrice,
                  shares: inv.shares,
                  totalCost: cost,
                  platform: inv.platform || 'Sekuritas',
                  notes: inv.notes
                }
              ];
          const purchaseCount = purchasesList.length;

          return (
            <div
              key={inv.id}
              className="bg-gradient-to-br from-[#180e32]/95 via-[#130b24]/95 to-[#0e071a]/95 border border-purple-500/35 hover:border-purple-400/80 rounded-2xl p-5 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-300 relative overflow-hidden group"
            >
              {/* Top Accent Strip based on Gain/Loss status */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                  isGain 
                    ? 'from-emerald-500 via-teal-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.8)]' 
                    : 'from-rose-500 via-pink-500 to-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                }`} 
              />

              {/* Card Header: Symbol, Asset Type, Platform, Actions */}
              <div className="flex items-start justify-between gap-2 pt-1">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-orbitron font-black text-xl text-white tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:text-purple-300 transition-colors">
                      {inv.symbol}
                    </span>

                    <span className={`px-2.5 py-0.5 text-[10px] font-orbitron font-bold rounded-lg border uppercase tracking-wider ${getAssetBadgeStyle(inv.assetType)}`}>
                      {inv.assetType}
                    </span>

                    <span className="text-[10px] text-purple-200/90 bg-[#1a0f35]/90 border border-purple-500/30 px-2.5 py-0.5 rounded-lg font-mono font-medium shadow-inner flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-purple-400" />
                      {inv.platform}
                    </span>
                  </div>

                  <h4 className="text-xs font-rajdhani font-bold text-purple-200/90 tracking-wide">
                    {inv.name}
                  </h4>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onEditInvestment(inv)}
                    className="p-2 rounded-xl bg-[#1b0f38] hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 transition-all duration-200 cursor-pointer shadow-inner"
                    title="Edit Data Aset"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteInvestment(inv.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 hover:text-rose-200 border border-rose-500/30 transition-all duration-200 cursor-pointer shadow-inner"
                    title="Hapus Aset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Enhanced Cyberpunk Inner Metric Grid Box */}
              <div className="bg-[#0a0414]/90 border border-purple-500/30 rounded-xl p-4 shadow-inner relative overflow-hidden backdrop-blur-sm space-y-3">
                {/* Subtle Grid overlay line */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#a855f70a_1px,transparent_1px),linear-gradient(to_bottom,#a855f70a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10 text-xs">
                  {/* Item 1 */}
                  <div className="bg-[#140a2a]/60 p-2.5 rounded-lg border border-purple-500/20">
                    <p className="text-[9px] font-orbitron font-extrabold text-purple-400/80 uppercase tracking-widest">Total Akumulasi</p>
                    <p className="font-mono font-bold text-sm text-purple-100 mt-1">
                      {inv.shares.toLocaleString('id-ID')} <span className="text-xs text-purple-300/80 font-rajdhani font-semibold">{inv.assetType === 'Saham' ? 'Lembar' : inv.assetType === 'Emas' ? 'Gram' : 'Unit'}</span>
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="bg-[#140a2a]/60 p-2.5 rounded-lg border border-purple-500/20">
                    <p className="text-[9px] font-orbitron font-extrabold text-purple-400/80 uppercase tracking-widest">Harga Rata-Rata (Avg)</p>
                    <p className="font-mono font-bold text-sm text-purple-200 mt-1">{formatRupiah(inv.buyPrice)}</p>
                  </div>

                  {/* Item 3 - Harga Saat Ini (Clickable to Quick Update) */}
                  <div 
                    onClick={() => {
                      setQuickPriceInv(inv);
                      setQuickPriceInput(inv.currentPrice || inv.buyPrice);
                    }}
                    className="bg-[#140a2a]/80 hover:bg-purple-900/40 p-2.5 rounded-lg border border-fuchsia-500/30 hover:border-fuchsia-400 cursor-pointer transition-all group/price shadow-inner"
                    title="Klik untuk Update Harga Pasar Terkini"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-orbitron font-extrabold text-fuchsia-300 uppercase tracking-widest flex items-center gap-1">
                        <span>Harga Saat Ini</span>
                      </p>
                      <span className="text-[8px] font-mono text-fuchsia-400 group-hover/price:underline flex items-center gap-0.5">
                        <Edit3 className="w-2.5 h-2.5" /> Ubah
                      </span>
                    </div>
                    <p className="font-mono font-bold text-sm text-fuchsia-300 mt-1 drop-shadow-[0_0_6px_rgba(217,70,239,0.3)]">
                      {formatRupiah(inv.currentPrice)}
                    </p>
                  </div>

                  {/* Item 4 */}
                  <div className="bg-[#140a2a]/60 p-2.5 rounded-lg border border-purple-500/20">
                    <p className="text-[9px] font-orbitron font-extrabold text-purple-400/80 uppercase tracking-widest">Total Modal Beli</p>
                    <p className="font-mono font-bold text-sm text-purple-200 mt-1">{formatRupiah(cost)}</p>
                  </div>

                  {/* Item 5 */}
                  <div className="bg-[#140a2a]/60 p-2.5 rounded-lg border border-purple-500/20">
                    <p className="text-[9px] font-orbitron font-extrabold text-purple-400/80 uppercase tracking-widest">Nilai Sekarang</p>
                    <p className="font-mono font-bold text-sm text-purple-100 mt-1">{formatRupiah(currentVal)}</p>
                  </div>

                  {/* Item 6 - Highlighted Gain/Loss */}
                  <div className={`p-2.5 rounded-lg border relative overflow-hidden ${
                    isGain 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]' 
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                  }`}>
                    <p className="text-[9px] font-orbitron font-extrabold uppercase tracking-widest opacity-90">Gain / Loss</p>
                    <p className={`font-mono font-black text-xs mt-1 flex items-center gap-1 ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isGain ? <ArrowUpRight className="w-3.5 h-3.5 shrink-0" /> : <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />}
                      <span>{formatRupiah(profit)}</span>
                    </p>
                    <p className={`text-[10px] font-mono font-bold mt-0.5 ${isGain ? 'text-emerald-400/90' : 'text-rose-400/90'}`}>
                      ({formatPercent(profitPct)})
                    </p>
                  </div>
                </div>

                {/* Return Indicator Progress Bar */}
                <div className="space-y-1 pt-1 border-t border-purple-500/15 relative z-10">
                  <div className="flex justify-between text-[10px] font-orbitron font-bold">
                    <span className="text-purple-400/70">PERFORMA ASET</span>
                    <span className={isGain ? 'text-emerald-400' : 'text-rose-400'}>
                      {isGain ? `+${profitPct.toFixed(2)}% GAIN` : `${profitPct.toFixed(2)}% LOSS`}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#170a2b] rounded-full overflow-hidden p-0.5 border border-purple-500/20">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isGain 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]' 
                          : 'bg-gradient-to-r from-rose-600 to-pink-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                      }`}
                      style={{ width: `${Math.min(Math.max(Math.abs(profitPct), 5), 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Action Footer: History, Sell & Buy More */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setHistoryModalInv(inv)}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-[#140a28] hover:bg-purple-600/20 text-purple-200 hover:text-white border border-purple-500/30 text-xs font-orbitron font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate"
                  title="Lihat riwayat pembelian aset ini"
                >
                  <History className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                  <span className="truncate">Riwayat ({purchaseCount}x)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedSellInvId(inv.id);
                    setIsSellModalOpen(true);
                  }}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-rose-900/60 to-pink-900/60 hover:from-rose-600 hover:to-pink-600 text-rose-200 hover:text-white border border-rose-500/40 text-xs font-orbitron font-bold flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.2)] transition-all cursor-pointer"
                  title="Jual / Cairkan aset ini ke rekening bank"
                >
                  <ArrowDownCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Jual</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAddInvestment(inv.symbol)}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white border border-fuchsia-400/40 text-xs font-orbitron font-bold flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
                  title="Beli lagi aset ini (otomatis rata-rata di box ini)"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>+ Beli Lagi</span>
                </button>
              </div>

              {/* Executive Rationale & Notes Container */}
              {inv.notes && (
                <div className="bg-gradient-to-r from-[#170a30]/90 via-[#1e0e3d]/90 to-[#170a30]/90 border border-purple-500/30 rounded-xl p-3 space-y-1 shadow-inner backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-purple-300 font-orbitron font-extrabold text-[10px] tracking-wider uppercase">
                    <FileText className="w-3 h-3 text-fuchsia-400" />
                    <span>Catatan Terakhir:</span>
                  </div>
                  <p className="text-purple-200/90 text-xs font-rajdhani font-semibold italic leading-relaxed pl-2 border-l-2 border-fuchsia-500/60 line-clamp-2">
                    "{inv.notes}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- RIWAYAT PEMBELIAN MODAL (MATCHING USER SCREENSHOT 2) --- */}
      {historyModalInv && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#130b20] border border-purple-500/40 rounded-3xl w-full max-w-xl p-6 space-y-5 shadow-[0_0_50px_rgba(168,85,247,0.35)] relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-purple-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-orbitron font-black text-lg text-white tracking-wider uppercase">
                    RIWAYAT PEMBELIAN {historyModalInv.symbol}
                  </h3>
                  <p className="text-xs font-orbitron text-purple-300/70 uppercase tracking-widest">
                    {historyModalInv.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setHistoryModalInv(null)}
                className="p-2 rounded-xl text-purple-400 hover:text-white hover:bg-purple-500/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Purchases Table (Matching Screenshot 2) */}
            <div className="border border-purple-500/25 rounded-2xl overflow-hidden bg-[#0a0414]/90">
              <div className="grid grid-cols-4 gap-2 bg-[#180e32] px-4 py-3 border-b border-purple-500/25 text-[11px] font-orbitron font-black text-purple-300 uppercase tracking-wider">
                <div>TANGGAL</div>
                <div className="text-center">PLATFORM</div>
                <div className="text-right">HARGA BELI</div>
                <div className="text-right">NOMINAL</div>
              </div>

              <div className="divide-y divide-purple-500/15 max-h-72 overflow-y-auto">
                {(historyModalInv.purchases && historyModalInv.purchases.length > 0 ? historyModalInv.purchases : [
                  {
                    id: 'fallback-p',
                    date: historyModalInv.buyDate || '2026-08-14',
                    buyPrice: historyModalInv.buyPrice,
                    shares: historyModalInv.shares,
                    totalCost: historyModalInv.buyPrice * historyModalInv.shares,
                    platform: historyModalInv.platform,
                    notes: historyModalInv.notes
                  }
                ]).map((p, idx) => (
                  <div key={p.id || idx} className="grid grid-cols-4 gap-2 px-4 py-3.5 items-center text-xs hover:bg-purple-900/10 transition-colors">
                    {/* Tanggal */}
                    <div className="font-orbitron font-bold text-purple-100 text-[11px]">
                      {formatDateDisplay(p.date)}
                    </div>

                    {/* Platform Badge */}
                    <div className="flex justify-center">
                      <span className="px-3 py-1 rounded-full text-[10px] font-orbitron font-bold uppercase tracking-wider bg-[#1d1038] text-purple-200 border border-purple-500/30">
                        {p.platform || historyModalInv.platform}
                      </span>
                    </div>

                    {/* Harga Beli */}
                    <div className="text-right font-mono font-bold text-emerald-400">
                      {formatRupiah(p.buyPrice)}
                    </div>

                    {/* Nominal */}
                    <div className="text-right font-mono font-black text-purple-100">
                      {formatRupiah(p.totalCost || (p.buyPrice * p.shares))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Metrics */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 font-orbitron">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-300">
                <span>TOTAL AKUMULASI TRANSAKSI:</span>
                <span className="text-white font-black">
                  {(historyModalInv.purchases?.length || 1)} Kali Pembelian
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const sym = historyModalInv.symbol;
                    setHistoryModalInv(null);
                    onAddInvestment(sym);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-orbitron font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Pembelian {historyModalInv.symbol}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Quick Update Current Price Modal */}
      {quickPriceInv && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#140b22] border border-fuchsia-500/40 rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-[0_0_40px_rgba(217,70,239,0.3)]">
            
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-sm text-white">
                    Update Harga Pasar: {quickPriceInv.symbol}
                  </h3>
                  <p className="text-[10px] text-purple-300/70 font-mono">
                    Harga Beli Rata-Rata: {formatRupiah(quickPriceInv.buyPrice)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickPriceInv(null)}
                className="p-1 rounded-lg text-purple-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickPrice} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-orbitron font-bold text-fuchsia-300">
                    Harga Saat Ini (Rp)
                  </label>
                  {quickPriceInput > 0 && (
                    <span className="text-[11px] font-mono font-bold text-fuchsia-400">
                      {formatRupiah(quickPriceInput)}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  placeholder="Contoh: 1.050.000"
                  value={quickPriceInput > 0 ? formatThousands(quickPriceInput) : ''}
                  onChange={(e) => setQuickPriceInput(parseThousands(e.target.value))}
                  className="w-full bg-[#1c0e35] border border-fuchsia-500/50 text-white rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 shadow-inner tracking-wide"
                  required
                />
              </div>

              {/* Preview Gain/Loss Live */}
              {quickPriceInput > 0 && (
                <div className="p-3 rounded-xl bg-[#0b0517] border border-purple-500/30 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-purple-300/80 text-[11px]">
                    <span>Estimasi Gain / Loss:</span>
                    <span className={quickPriceInput >= quickPriceInv.buyPrice ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {quickPriceInput >= quickPriceInv.buyPrice ? '+' : ''}
                      {formatRupiah((quickPriceInput - quickPriceInv.buyPrice) * quickPriceInv.shares)} (
                      {(((quickPriceInput - quickPriceInv.buyPrice) / quickPriceInv.buyPrice) * 100).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setQuickPriceInv(null)}
                  className="px-3.5 py-2 rounded-xl bg-[#1d1038] text-purple-300 hover:text-white text-xs font-orbitron font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-orbitron font-bold shadow-[0_0_15px_rgba(217,70,239,0.4)] transition-all cursor-pointer"
                >
                  Simpan & Update Gain
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* --- MODAL JUAL / TARIK ASET INVESTASI --- */}
      <SellInvestmentModal
        isOpen={isSellModalOpen}
        onClose={() => {
          setIsSellModalOpen(false);
          setSelectedSellInvId(undefined);
        }}
        onSell={onSellInvestment}
        investments={investments}
        preSelectedInvestmentId={selectedSellInvId}
      />

    </div>
  );
};
