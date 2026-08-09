import React, { useState } from 'react';
import { X, RefreshCw, ShieldCheck, TrendingUp, Calculator, Award, Globe } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { GLOBAL_RATES, getGoldSpotIdrPerGram } from '../utils/rates';
import { TradingViewAdvancedChart } from './TradingViewWidget';

interface Props { isOpen: boolean; onClose: () => void; }

export function GoldMarketModal({ isOpen, onClose }: Props) {
  const [goldSymbol, setGoldSymbol] = useState<'OANDA:XAUUSD' | 'COMEX:GC1!' | 'TVC:GOLD'>('OANDA:XAUUSD');
  const [calcGrams, setCalcGrams] = useState<number>(10);
  const [calcType, setCalcType] = useState<'sellToUs' | 'buyFromUs' | 'spot'>('buyFromUs');
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 600); };

  const calculateTotalGoldPrice = () => {
    if (!calcGrams || isNaN(calcGrams)) return 0;
    let unitPrice = GLOBAL_RATES.ANTAM_BUY;
    if (calcType === 'sellToUs') unitPrice = GLOBAL_RATES.ANTAM_SELL;
    if (calcType === 'spot') unitPrice = getGoldSpotIdrPerGram();
    return calcGrams * unitPrice;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-neo-purple overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-purple-500/20 flex items-center justify-between bg-[#1a0f30]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-purple-700 text-white font-orbitron font-bold shadow-neo-purple"><Award className="w-6 h-6 text-fuchsia-300" /></div>
            <div>
              <div className="flex items-center gap-2"><span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded">REAL-TIME DATA</span><span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> XAU/USD REAL-TIME</span></div>
              <h2 className="text-base sm:text-xl font-orbitron font-black text-neon-purple mt-0.5 uppercase tracking-tighter">Pasar Emas Dunia & Antam</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} className="p-2.5 rounded-xl bg-[#130b20] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all"><RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /></button>
            <button onClick={onClose} className="p-2.5 rounded-xl bg-[#130b20] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-4 space-y-2 shadow-neo-purple">
              <span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-wider">Spot Gold XAU / USD</span>
              <p className="text-2xl font-mono font-black text-neon-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">${GLOBAL_RATES.GOLD_XAU_USD.toLocaleString('en-US')} / oz</p>
              <p className="text-[11px] font-rajdhani text-purple-200/70">Kurs Int: {formatRupiah(GLOBAL_RATES.USD_IDR)}</p>
            </div>
            <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-4 space-y-2 shadow-neo-purple">
              <span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-wider block">Spot Emas (IDR Per Gram)</span>
              <p className="text-2xl font-mono font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">{formatRupiah(getGoldSpotIdrPerGram())} / gr</p>
              <p className="text-[11px] font-rajdhani text-purple-200/70">Berdasarkan Harga Kurs USD</p>
            </div>
            <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-4 space-y-2 shadow-neo-purple">
              <span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-wider block">Estimasi Antam Lokal</span>
              <p className="text-2xl font-mono font-black text-purple-200">{formatRupiah(GLOBAL_RATES.ANTAM_BUY)} / gr</p>
              <div className="flex justify-between text-[10px] font-mono text-purple-200/70 pt-0.5"><span>Buyback: <strong className="text-rose-400">{formatRupiah(GLOBAL_RATES.ANTAM_SELL)}</strong></span></div>
            </div>
          </div>

          <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-neo-purple">
            <TradingViewAdvancedChart symbol={goldSymbol} height={420} theme="dark" />
          </div>

          <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-5 space-y-4 shadow-neo-purple">
            <div className="flex items-center justify-between flex-wrap gap-2"><div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider"><Calculator className="w-4 h-4" /><span>Kalkulator Emas Akurat</span></div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCalcType('buyFromUs')} className={`px-3 py-1 rounded-xl text-[10px] font-orbitron font-bold ${calcType === 'buyFromUs' ? 'bg-purple-600 text-white' : 'bg-[#0d0718] text-purple-200/70 border border-purple-500/20'}`}>BELI ANTAM</button>
                <button onClick={() => setCalcType('sellToUs')} className={`px-3 py-1 rounded-xl text-[10px] font-orbitron font-bold ${calcType === 'sellToUs' ? 'bg-rose-500 text-white' : 'bg-[#0d0718] text-purple-200/70 border border-purple-500/20'}`}>JUAL ANTAM</button>
                <button onClick={() => setCalcType('spot')} className={`px-3 py-1 rounded-xl text-[10px] font-orbitron font-bold ${calcType === 'spot' ? 'bg-emerald-600 text-white' : 'bg-[#0d0718] text-purple-200/70 border border-purple-500/20'}`}>SPOT DUNIA</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div><label className="text-[11px] font-orbitron font-bold text-purple-400/80 block mb-1">Berat Emas (Gram):</label><input type="number" value={calcGrams} onChange={(e) => setCalcGrams(parseFloat(e.target.value) || 0)} className="w-full bg-[#0d0718] border border-purple-500/30 text-purple-100 font-mono text-sm font-bold rounded-xl p-2.5 focus:outline-none" /></div>
              <div><label className="text-[11px] font-orbitron font-bold text-purple-400/80 block mb-1">Preset Gram:</label><div className="flex items-center gap-1.5 flex-wrap">{[1, 5, 10, 25, 50, 100].map(g => <button key={g} onClick={() => setCalcGrams(g)} className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${calcGrams === g ? 'bg-purple-500/20 text-purple-300 border-purple-400' : 'bg-[#0d0718] text-purple-200/60 border-purple-500/20'}`}>{g}g</button>)}</div></div>
              <div className="bg-[#0d0718] border border-emerald-500/30 p-3 rounded-xl"><p className="text-[10px] font-orbitron font-bold text-emerald-400/80 uppercase">Estimasi Rupiah (IDR)</p><p className="text-xl font-mono font-black text-neon-purple">{formatRupiah(calculateTotalGoldPrice())}</p></div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-purple-500/20 bg-[#1a0f30] text-center"><button onClick={onClose} className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-orbitron font-bold text-xs px-10 py-2.5 rounded-xl shadow-neo-purple">Tutup Pasar Emas</button></div>
      </div>
    </div>
  );
}
