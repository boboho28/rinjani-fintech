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
  ShieldCheck
} from 'lucide-react';
import { Investment, AssetType } from '../types';
import { formatRupiah, formatPercent } from '../utils/formatters';

interface InvestmentsViewProps {
  investments: Investment[];
  onAddInvestment: () => void;
  onEditInvestment: (inv: Investment) => void;
  onDeleteInvestment: (id: string) => void;
  onOpenAIModal: () => void;
}

export const InvestmentsView: React.FC<InvestmentsViewProps> = ({
  investments,
  onAddInvestment,
  onEditInvestment,
  onDeleteInvestment,
  onOpenAIModal,
}) => {
  const [selectedAssetType, setSelectedAssetType] = useState<string>('all');

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

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#180e32]/90 via-[#130b24]/90 to-[#0e071a]/90 border border-purple-500/35 rounded-2xl p-6 shadow-neo-purple backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-fuchsia-400" />
            <span>Menu 4. Portofolio Uang Dinvestasikan & Saham</span>
          </div>
          <h2 className="text-xl font-orbitron font-black text-neon-purple tracking-wide flex items-center gap-2">
            Data Investasi, Saham & Catatan Analisis Beli
          </h2>
          <p className="text-xs text-purple-200/70 font-rajdhani font-semibold mt-1">
            Pantau performa saham, emas batangan, reksadana, dan pertimbangan/alasan dibeli secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={onAddInvestment}
            className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-neo-purple transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Beli / Tambah Saham</span>
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

      {/* Investments Stock Cards Grid - Enhanced Futuristic Cyberpunk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredInvestments.map((inv) => {
          const cost = inv.buyPrice * inv.shares;
          const currentVal = inv.currentPrice * inv.shares;
          const profit = currentVal - cost;
          const profitPct = cost > 0 ? (profit / cost) * 100 : 0;
          const isGain = profit >= 0;

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
                    title="Edit Data Saham"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteInvestment(inv.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/30 text-rose-400 hover:text-rose-200 border border-rose-500/30 transition-all duration-200 cursor-pointer shadow-inner"
                    title="Hapus Saham"
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
                    <p className="text-[9px] font-orbitron font-extrabold text-purple-400/80 uppercase tracking-widest">Jumlah Dibeli</p>
                    <p className="font-mono font-bold text-sm text-purple-100 mt-1">
                      {inv.shares.toLocaleString('id-ID')} <span className="text-xs text-purple-300/80 font-rajdhani font-semibold">{inv.assetType === 'Saham' ? 'Lembar' : 'Unit'}</span>
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="bg-[#140a2a]/60 p-2.5 rounded-lg border border-purple-500/20">
                    <p className="text-[9px] font-orbitron font-extrabold text-purple-400/80 uppercase tracking-widest">Harga Beli Rata-Rata</p>
                    <p className="font-mono font-bold text-sm text-purple-200 mt-1">{formatRupiah(inv.buyPrice)}</p>
                  </div>

                  {/* Item 3 */}
                  <div className="bg-[#140a2a]/60 p-2.5 rounded-lg border border-purple-500/20">
                    <p className="text-[9px] font-orbitron font-extrabold text-purple-400/80 uppercase tracking-widest">Harga Saat Ini</p>
                    <p className="font-mono font-bold text-sm text-purple-300 mt-1">{formatRupiah(inv.currentPrice)}</p>
                  </div>

                  {/* Item 4 */}
                  <div className="bg-[#140a2a]/60 p-2.5 rounded-lg border border-purple-500/20">
                    <p className="text-[9px] font-orbitron font-extrabold text-purple-400/80 uppercase tracking-widest">Total Modal</p>
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

              {/* Executive Rationale & Notes Container */}
              {inv.notes && (
                <div className="bg-gradient-to-r from-[#170a30]/90 via-[#1e0e3d]/90 to-[#170a30]/90 border border-purple-500/30 rounded-xl p-3.5 space-y-1.5 shadow-inner backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-purple-300 font-orbitron font-extrabold text-[10px] tracking-wider uppercase">
                    <FileText className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
                    <span>Catatan & Alasan Pembelian:</span>
                  </div>
                  <p className="text-purple-200/90 text-xs font-rajdhani font-semibold italic leading-relaxed pl-2.5 border-l-2 border-fuchsia-500/60">
                    "{inv.notes}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
