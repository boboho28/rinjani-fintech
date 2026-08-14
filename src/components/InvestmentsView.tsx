import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  PlusCircle, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit3, 
  Trash2, 
  History,
  Info,
  Layers,
  Wallet,
  Zap,
  ShieldCheck,
  RefreshCw,
  Search
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
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({});
  const [isFetching, setIsFetching] = useState(false);
  const [showHistoryFor, setShowHistoryFor] = useState<string | null>(null);

  // 1. Fetch Harga Real-time dari Indodax
  const fetchIndodaxPrices = async () => {
    setIsFetching(true);
    try {
      const response = await fetch('https://indodax.com/api/summaries');
      const data = await response.json();
      const prices: Record<string, number> = {};
      
      if (data.tickers) {
        Object.keys(data.tickers).forEach(pair => {
          if (pair.endsWith('_idr')) {
            const symbol = pair.split('_')[0].toUpperCase();
            prices[symbol] = parseFloat(data.tickers[pair].last);
          }
        });
      }
      setCryptoPrices(prices);
    } catch (err) {
      console.error("Gagal mengambil data Indodax:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchIndodaxPrices();
    const interval = setInterval(fetchIndodaxPrices, 30000); // Update setiap 30 detik
    return () => clearInterval(interval);
  }, []);

  // 2. Logika GROUPING (Satu Box per Simbol)
  const groupedInvestments = investments.reduce((acc, current) => {
    const key = current.symbol.toUpperCase();
    if (!acc[key]) {
      acc[key] = {
        symbol: key,
        name: current.name,
        assetType: current.assetType,
        platform: current.platform,
        items: [] as Investment[]
      };
    }
    acc[key].items.push(current);
    return acc;
  }, {} as Record<string, { symbol: string; name: string; assetType: AssetType; platform: string; items: Investment[] }>);

  const groups = Object.values(groupedInvestments).filter(
    (g) => selectedAssetType === 'all' || g.assetType === selectedAssetType
  );

  // 3. Totals Calculation (Global)
  const calculateGlobals = () => {
    let totalCost = 0;
    let totalValue = 0;

    Object.values(groupedInvestments).forEach(group => {
      const livePrice = group.assetType === 'Crypto' ? (cryptoPrices[group.symbol] || group.items[0].currentPrice) : group.items[0].currentPrice;
      const groupShares = group.items.reduce((sum, i) => sum + i.shares, 0);
      const groupCost = group.items.reduce((sum, i) => sum + (i.buyPrice * i.shares), 0);
      
      totalCost += groupCost;
      totalValue += (livePrice * groupShares);
    });

    return { totalCost, totalValue };
  };

  const { totalCost, totalValue } = calculateGlobals();
  const totalProfitLoss = totalValue - totalCost;
  const profitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

  const getAssetBadgeStyle = (assetType: string) => {
    switch (assetType) {
      case 'Saham': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Emas': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Crypto': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Reksadana': return 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#130b24]/90 border border-purple-500/35 rounded-2xl p-6 shadow-neo-purple backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-fuchsia-400" />
            <span>Menu 4. Portofolio Uang Dinvestasikan & Saham</span>
          </div>
          <h2 className="text-xl font-orbitron font-black text-neon-purple tracking-wide">Data Investasi & Kelola Aset</h2>
          <p className="text-xs text-purple-200/70 font-rajdhani font-semibold mt-1">Satu Box per Simbol. Crypto terupdate otomatis via API Indodax.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1a0f30] px-3 py-1.5 rounded-xl border border-purple-500/30">
             <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isFetching ? 'animate-spin' : ''}`} />
             <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-tighter">API Live</span>
          </div>
          <button onClick={onAddInvestment} className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-orbitron font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-neo-purple transition-all cursor-pointer active:scale-95"><PlusCircle className="w-4 h-4" /><span>Beli / Tambah Saham</span></button>
          <button onClick={onOpenAIModal} className="bg-[#1a0f30] text-purple-300 border border-purple-500/40 font-orbitron font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-neo-purple cursor-pointer active:scale-95"><Sparkles className="w-4 h-4 text-fuchsia-400" /><span>Evaluasi Saham AI</span></button>
        </div>
      </div>

      {/* Metrics Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 space-y-1 shadow-neo-purple">
          <p className="text-[10px] font-orbitron font-extrabold text-purple-400 uppercase tracking-widest">Total Modal Ditanamkan</p>
          <p className="text-2xl font-mono font-black text-purple-100">{formatRupiah(totalCost)}</p>
          <p className="text-[10px] text-purple-200/50">Modal bersih akumulasi beli</p>
        </div>
        <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 space-y-1 shadow-neo-purple">
          <p className="text-[10px] font-orbitron font-extrabold text-purple-400 uppercase tracking-widest">Nilai Portofolio Saat Ini</p>
          <p className="text-2xl font-mono font-black text-fuchsia-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">{formatRupiah(totalValue)}</p>
          <p className="text-[10px] text-purple-200/50">Estimasi nilai pasar real-time</p>
        </div>
        <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 space-y-1 shadow-neo-purple">
          <p className="text-[10px] font-orbitron font-extrabold text-purple-400 uppercase tracking-widest">Unrealized Gain / Loss</p>
          <p className={`text-2xl font-mono font-black ${totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatRupiah(totalProfitLoss)}</p>
          <p className={`text-[10px] font-mono font-bold flex items-center gap-1 ${totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalProfitLoss >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {formatPercent(profitLossPercent)} PnL Total
          </p>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Saham', 'Reksadana', 'Emas', 'Crypto', 'Obligasi / SBN'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedAssetType(type)}
            className={`px-4 py-2 rounded-xl text-[10px] font-orbitron font-extrabold uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
              selectedAssetType === type ? 'bg-purple-600 text-white border-purple-400 shadow-neo-purple' : 'bg-[#130b20] text-purple-300 border-purple-500/30'
            }`}
          >
            {type === 'all' ? 'Semua Asset' : type}
          </button>
        ))}
      </div>

      {/* GROUPED CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {groups.map((group) => {
          const totalShares = group.items.reduce((sum, i) => sum + i.shares, 0);
          const totalCost = group.items.reduce((sum, i) => sum + (i.buyPrice * i.shares), 0);
          const avgBuyPrice = totalCost / totalShares;
          
          // Ambil harga live jika Crypto, jika tidak ambil dari data terakhir
          const livePrice = group.assetType === 'Crypto' ? (cryptoPrices[group.symbol] || group.items[0].currentPrice) : group.items[0].currentPrice;
          
          const groupValueNow = livePrice * totalShares;
          const groupProfit = groupValueNow - totalCost;
          const groupProfitPct = (groupProfit / totalCost) * 100;
          const isGain = groupProfit >= 0;

          return (
            <div key={group.symbol} className="bg-[#130b20]/95 border border-purple-500/30 rounded-2xl p-5 space-y-4 shadow-neo-purple relative group overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${isGain ? 'from-emerald-500 to-teal-400 shadow-[0_0_8px_#10b981]' : 'from-rose-500 to-pink-500 shadow-[0_0_8px_#f43f5e]'}`} />

              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron font-black text-xl text-white tracking-widest">{group.symbol}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-orbitron font-bold rounded border uppercase ${getAssetBadgeStyle(group.assetType)}`}>{group.assetType}</span>
                    <span className="text-[9px] text-purple-300/70 bg-[#1a0f30] border border-purple-500/20 px-2 py-0.5 rounded font-mono uppercase">{group.platform}</span>
                  </div>
                  <h4 className="text-xs font-rajdhani font-bold text-purple-200/80 uppercase">{group.name}</h4>
                </div>
                
                <div className="flex items-center gap-1.5">
                   {/* TOMBOL HISTORI (Area Kotak Merah Anda) */}
                   <button 
                    onClick={() => setShowHistoryFor(showHistoryFor === group.symbol ? null : group.symbol)}
                    className="p-2 rounded-xl bg-[#1a0f30] text-purple-300 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer"
                    title="Riwayat Pembelian"
                   >
                     <History className={`w-4 h-4 ${showHistoryFor === group.symbol ? 'text-fuchsia-400' : ''}`} />
                   </button>
                   <button onClick={() => onEditInvestment(group.items[group.items.length-1])} className="p-2 rounded-xl bg-[#1a0f30] text-purple-300 border border-purple-500/30 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                   <button onClick={() => { if(window.confirm(`Hapus seluruh data ${group.symbol}?`)) group.items.forEach(i => onDeleteInvestment(i.id)) }} className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {/* GRID DATA SIMPEL */}
              <div className="bg-[#0a0512]/80 border border-purple-500/20 rounded-xl p-4 grid grid-cols-2 gap-4 shadow-inner relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#a855f705_1px,transparent_1px),linear-gradient(to_bottom,#a855f705_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                
                <div className="space-y-3 relative z-10">
                   <div>
                      <p className="text-[9px] font-orbitron font-bold text-purple-400 uppercase tracking-widest">Total Unit</p>
                      <p className="text-sm font-mono font-bold text-white">{totalShares.toLocaleString('id-ID')} <span className="text-[10px] text-purple-400">{group.assetType === 'Saham' ? 'Lot' : 'Unit'}</span></p>
                   </div>
                   <div>
                      <p className="text-[9px] font-orbitron font-bold text-purple-400 uppercase tracking-widest">Harga Beli Rata-Rata</p>
                      <p className="text-sm font-mono font-bold text-purple-200">{formatRupiah(avgBuyPrice)}</p>
                   </div>
                </div>

                <div className="space-y-3 relative z-10">
                   <div>
                      <p className="text-[9px] font-orbitron font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">Harga Saat Ini <RefreshCw className={`w-2.5 h-2.5 ${isFetching ? 'animate-spin' : ''}`} /></p>
                      <p className="text-sm font-mono font-bold text-cyan-300 drop-shadow-[0_0_5px_#22d3ee]">{formatRupiah(livePrice)}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-orbitron font-bold text-purple-400 uppercase tracking-widest">Total Modal</p>
                      <p className="text-sm font-mono font-bold text-purple-100">{formatRupiah(totalCost)}</p>
                   </div>
                </div>

                <div className="col-span-2 pt-2 border-t border-purple-500/20">
                   <div className="flex items-center justify-between">
                      <p className="text-[9px] font-orbitron font-bold text-purple-400 uppercase">Performa Aset</p>
                      <p className={`text-xs font-mono font-black flex items-center gap-1 ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                         {isGain ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                         {formatRupiah(groupProfit)} ({groupProfitPct.toFixed(2)}%)
                      </p>
                   </div>
                   <div className="mt-1.5 w-full h-1.5 bg-[#1a0f30] rounded-full overflow-hidden border border-purple-500/20">
                      <div className={`h-full transition-all duration-700 ${isGain ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} style={{ width: `${Math.min(Math.abs(groupProfitPct), 100)}%` }} />
                   </div>
                </div>
              </div>

              {/* LIST HISTORI PEMBELIAN (Akan tampil jika tombol histori diklik) */}
              {showHistoryFor === group.symbol && (
                <div className="bg-[#1a0f30] border border-purple-500/40 rounded-xl p-3 space-y-2 animate-fadeIn">
                   <p className="text-[9px] font-orbitron font-bold text-fuchsia-400 uppercase tracking-tighter mb-2 flex items-center gap-1.5"><Layers className="w-3 h-3" /> Log Riwayat Pembelian {group.symbol}</p>
                   <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                      {group.items.sort((a,b) => b.date.localeCompare(a.date)).map((item, idx) => (
                        <div key={item.id} className="flex items-center justify-between text-[10px] bg-black/40 p-2 rounded-lg border border-purple-500/10">
                           <div>
                              <span className="text-purple-300 font-mono block">{formatDateIndo(item.date)}</span>
                              <span className="text-purple-400/70 font-rajdhani italic truncate max-w-[150px] inline-block">"{item.notes || 'No Note'}"</span>
                           </div>
                           <div className="text-right">
                              <span className="text-white font-bold block">{item.shares} {group.assetType === 'Saham' ? 'Lot' : 'Unit'}</span>
                              <span className="text-purple-300 font-mono">@{formatRupiah(item.buyPrice)}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
