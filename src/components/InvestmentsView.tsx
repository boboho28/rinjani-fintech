import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  PlusCircle, 
  Sparkles, 
  Edit3, 
  Trash2, 
  History,
  RefreshCw,
  Wallet,
  X,
  FileText
} from 'lucide-react';
import { Investment, AssetType } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

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
  const [historySymbol, setHistorySymbol] = useState<string | null>(null);

  // FETCH HARGA DARI INDODAX
  const fetchPrices = async () => {
    setIsFetching(true);
    try {
      const res = await fetch('https://indodax.com/api/summaries');
      const data = await res.json();
      const prices: Record<string, number> = {};
      if (data.tickers) {
        Object.keys(data.tickers).forEach(pair => {
          if (pair.endsWith('_idr')) {
            const sym = pair.split('_')[0].toUpperCase();
            prices[sym] = parseFloat(data.tickers[pair].last);
          }
        });
      }
      setCryptoPrices(prices);
    } catch (err) { console.error(err); }
    finally { setIsFetching(false); }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // GROUPING LOGIC
  const grouped = investments.reduce((acc, curr) => {
    const key = curr.symbol.toUpperCase();
    if (!acc[key]) {
      acc[key] = {
        symbol: key,
        name: curr.name,
        assetType: curr.assetType,
        platform: curr.platform,
        items: [] as Investment[]
      };
    }
    acc[key].items.push(curr);
    return acc;
  }, {} as Record<string, { symbol: string; name: string; assetType: AssetType; platform: string; items: Investment[] }>);

  const groups = Object.values(grouped).filter(
    (g) => selectedAssetType === 'all' || g.assetType === selectedAssetType
  );

  // Global Stats
  const globalTotalCost = investments.reduce((sum, inv) => sum + (inv.buyPrice * inv.shares), 0);
  const globalTotalValue = Object.values(grouped).reduce((sum, g) => {
    const live = g.assetType === 'Crypto' ? (cryptoPrices[g.symbol] || g.items[0].buyPrice) : g.items[0].buyPrice;
    const shares = g.items.reduce((s, i) => s + i.shares, 0);
    return sum + (live * shares);
  }, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#130b24]/90 border border-purple-500/30 rounded-2xl p-6 shadow-neo-purple backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-fuchsia-400" />
            <span>Menu 4. Portofolio Uang Dinvestasikan & Saham</span>
          </div>
          <h2 className="text-xl font-orbitron font-black text-neon-purple tracking-wide">Data Investasi & Kelola Aset</h2>
          <p className="text-xs text-purple-200/70 font-rajdhani font-semibold mt-1">Grup Aset otomatis per Simbol. Crypto Terupdate via Indodax.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={onAddInvestment} className="bg-gradient-to-r from-purple-600 to-fuchsia-700 text-white font-orbitron font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-neo-purple cursor-pointer active:scale-95 transition-all"><PlusCircle className="w-4 h-4" /><span>Beli / Tambah Saham</span></button>
          <button onClick={onOpenAIModal} className="bg-[#1a0f30] text-purple-300 border border-purple-500/40 font-orbitron font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-neo-purple cursor-pointer active:scale-95 transition-all"><Sparkles className="w-4 h-4 text-fuchsia-400" /><span>Evaluasi Saham AI</span></button>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 shadow-neo-purple">
          <p className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest">Total Modal Ditanamkan</p>
          <p className="text-2xl font-mono font-black text-white mt-1">{formatRupiah(globalTotalCost)}</p>
        </div>
        <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 shadow-neo-purple">
          <p className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest">Estimasi Nilai Saat Ini</p>
          <p className="text-2xl font-mono font-black text-fuchsia-300 drop-shadow-[0_0_8px_#d946ef] mt-1">{formatRupiah(globalTotalValue)}</p>
        </div>
        <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 shadow-neo-purple">
          <p className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest">Unrealized Gain / Loss</p>
          <p className={`text-2xl font-mono font-black mt-1 ${globalTotalValue - globalTotalCost >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatRupiah(globalTotalValue - globalTotalCost)}</p>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Saham', 'Reksadana', 'Emas', 'Crypto', 'Obligasi / SBN'].map((type) => (
          <button key={type} onClick={() => setSelectedAssetType(type)} className={`px-4 py-2 rounded-xl text-[10px] font-orbitron font-bold uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${selectedAssetType === type ? 'bg-purple-600 text-white border-purple-400 shadow-neo-purple' : 'bg-[#130b20] text-purple-400 border-purple-500/30'}`}>{type === 'all' ? 'Semua Asset' : type}</button>
        ))}
      </div>

      {/* SIMPLIFIED ASSET GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {groups.map((group) => {
          const totalModalPerAset = group.items.reduce((sum, i) => sum + (i.buyPrice * i.shares), 0);
          const livePrice = group.assetType === 'Crypto' ? (cryptoPrices[group.symbol] || group.items[group.items.length-1].buyPrice) : group.items[group.items.length-1].buyPrice;

          return (
            <div key={group.symbol} className="bg-[#130b20]/95 border border-purple-500/30 rounded-2xl p-6 space-y-5 shadow-neo-purple relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500" />
              
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron font-black text-2xl text-white tracking-widest">{group.symbol}</span>
                    <span className="px-2 py-0.5 text-[9px] font-orbitron font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">{group.assetType}</span>
                    <span className="px-2 py-0.5 text-[9px] font-orbitron font-bold rounded bg-[#1a0f30] text-purple-400 border border-purple-500/20 uppercase truncate max-w-[100px]">{group.platform}</span>
                  </div>
                  <h4 className="text-[11px] font-rajdhani font-bold text-purple-300/80 uppercase mt-1">{group.name}</h4>
                </div>

                <div className="flex items-center gap-1.5">
                   {/* TOMBOL POPUP HISTORY */}
                   <button onClick={() => setHistorySymbol(group.symbol)} className="p-2 rounded-xl bg-[#1a0f30] text-purple-300 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer shadow-neo-purple active:scale-90"><History className="w-4 h-4" /></button>
                   <button onClick={() => onEditInvestment(group.items[group.items.length-1])} className="p-2 rounded-xl bg-[#1a0f30] text-purple-300 border border-purple-500/30 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                   <button onClick={() => { if(window.confirm(`Hapus seluruh data ${group.symbol}?`)) group.items.forEach(i => onDeleteInvestment(i.id)) }} className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {/* BOX KONTEN SIMPEL */}
              <div className="bg-[#0a0512]/80 border border-purple-500/20 rounded-xl p-5 shadow-inner grid grid-cols-1 gap-4">
                 <div>
                    <p className="text-[9px] font-orbitron font-bold text-purple-400 uppercase tracking-widest mb-1">Total Modal Investasi</p>
                    <p className="text-2xl font-mono font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">{formatRupiah(totalModalPerAset)}</p>
                 </div>
                 <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-orbitron font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">Harga Saat Ini <RefreshCw className={`w-2.5 h-2.5 ${isFetching ? 'animate-spin' : ''}`} /></p>
                      <p className="text-base font-mono font-bold text-cyan-300">{formatRupiah(livePrice)}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-orbitron font-bold text-purple-400 uppercase tracking-widest">Aksi</p>
                       <span className="text-[10px] text-purple-300 font-rajdhani italic">Cek History Detail ➔</span>
                    </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* POPUP HISTORY MODAL (KODE DI UPDATE DISINI) */}
      {historySymbol && grouped[historySymbol] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-[#130b20] border border-purple-500/40 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-neo-purple animate-scaleUp">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10"><History className="w-5 h-5 text-fuchsia-400" /></div>
                    <div>
                       <h3 className="font-orbitron font-black text-lg text-white uppercase tracking-widest">Riwayat Pembelian {historySymbol}</h3>
                       <p className="text-[10px] text-purple-400 font-bold uppercase tracking-tighter">{grouped[historySymbol].name}</p>
                    </div>
                 </div>
                 <button onClick={() => setHistorySymbol(null)} className="p-2 rounded-lg text-purple-400 hover:text-white transition-all cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                 <table className="w-full text-[11px] font-mono border-collapse">
                    <thead>
                       <tr className="bg-[#1a0f30] text-purple-300 border-b border-purple-500/20">
                          <th className="p-3 text-left font-orbitron uppercase">Tanggal</th>
                          <th className="p-3 text-left font-orbitron uppercase">Platform</th>
                          <th className="p-3 text-right font-orbitron uppercase">Harga Beli</th>
                          <th className="p-3 text-right font-orbitron uppercase">Nominal</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-500/10">
                       {grouped[historySymbol].items.sort((a,b) => b.buyDate.localeCompare(a.buyDate)).map((item) => (
                          <tr key={item.id} className="hover:bg-purple-500/5 text-purple-100 transition-colors">
                             <td className="p-3 font-bold">{formatDateIndo(item.buyDate)}</td>
                             <td className="p-3"><span className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[9px] uppercase">{item.platform}</span></td>
                             <td className="p-3 text-right text-emerald-400 font-bold">{formatRupiah(item.buyPrice)}</td>
                             <td className="p-3 text-right text-fuchsia-300 font-black">{formatRupiah(item.buyPrice * item.shares)}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              <div className="pt-3 border-t border-purple-500/20 flex justify-between items-center text-[10px] font-orbitron font-bold">
                 <p className="text-purple-400 uppercase tracking-widest">Total Akumulasi Transaksi:</p>
                 <p className="text-white text-sm font-mono">{grouped[historySymbol].items.length} Kali Pembelian</p>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
