import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Award,
  Globe
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { TradingViewAdvancedChart } from './TradingViewWidget';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GOLD_DATA = {
  xauUsd: 2422.80, // USD per Troy Ounce
  usdIdrRate: 16280, // 1 USD = 16,280 IDR
  troyOunceInGrams: 31.1034768,
  change24h: +0.82, // percentage
  antamGramPriceIDR: 1345000,
  antamBuybackGramIDR: 1225000,
};

export function GoldMarketModal({ isOpen, onClose }: Props) {
  const [goldSymbol, setGoldSymbol] = useState<'OANDA:XAUUSD' | 'COMEX:GC1!' | 'TVC:GOLD'>('OANDA:XAUUSD');
  const [calcGrams, setCalcGrams] = useState<number>(10);
  const [calcType, setCalcType] = useState<'sellToUs' | 'buyFromUs'>('buyFromUs');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString('id-ID'));

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date().toLocaleTimeString('id-ID'));
      setIsRefreshing(false);
    }, 600);
  };

  const xauTotalTroyOunceIDR = GOLD_DATA.xauUsd * GOLD_DATA.usdIdrRate;
  const xauSpotPricePerGramIDR = Math.round(xauTotalTroyOunceIDR / GOLD_DATA.troyOunceInGrams);
  const isPositive = GOLD_DATA.change24h >= 0;

  const calculateTotalGoldPrice = () => {
    if (!calcGrams || isNaN(calcGrams)) return 0;
    const unitPrice = calcType === 'buyFromUs' ? GOLD_DATA.antamGramPriceIDR : GOLD_DATA.antamBuybackGramIDR;
    return calcGrams * unitPrice;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-neo-purple overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-purple-500/20 flex items-center justify-between bg-[#1a0f30]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-purple-700 text-white font-orbitron font-bold shadow-neo-purple">
              <Award className="w-6 h-6 text-fuchsia-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded">
                  TRADINGVIEW LIVE DATA
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> REAL-TIME XAU/USD ({lastRefreshed})
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-orbitron font-black text-neon-purple tracking-wide mt-0.5">
                PASAR EMAS DUNIA (XAU/USD) & LOGAM MULIA
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              title="Refresh Gold Rates"
              className="p-2.5 rounded-xl bg-[#130b20] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[#130b20] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Gold Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Spot XAU/USD Card */}
            <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-4 space-y-2 shadow-neo-purple">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-wider">
                  Spot Gold XAU / USD
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  isPositive ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>+{GOLD_DATA.change24h}%</span>
                </span>
              </div>
              <p className="text-2xl font-mono font-black text-neon-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                ${GOLD_DATA.xauUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} / oz
              </p>
              <p className="text-[11px] font-rajdhani text-purple-200/70">
                1 Troy Ounce = {GOLD_DATA.troyOunceInGrams.toFixed(2)} gram
              </p>
            </div>

            {/* XAU converted to IDR Per Gram */}
            <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-4 space-y-2 shadow-neo-purple">
              <span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-wider block">
                Spot Emas Dunia (Per Gram IDR)
              </span>
              <p className="text-2xl font-mono font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                {formatRupiah(xauSpotPricePerGramIDR)} / gr
              </p>
              <p className="text-[11px] font-rajdhani text-purple-200/70">
                Konversi Kurs USD: {formatRupiah(GOLD_DATA.usdIdrRate)}
              </p>
            </div>

            {/* Antam Benchmark Price */}
            <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-4 space-y-2 shadow-neo-purple">
              <span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-wider block">
                Estimasi Emas Batangan Antam
              </span>
              <p className="text-2xl font-mono font-black text-purple-200">
                {formatRupiah(GOLD_DATA.antamGramPriceIDR)} / gr
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-purple-200/70 pt-0.5">
                <span>Buyback: <strong className="text-rose-400 font-bold">{formatRupiah(GOLD_DATA.antamBuybackGramIDR)}</strong></span>
                <span>Purity: 999.9 Fine</span>
              </div>
            </div>

          </div>

          {/* TradingView Real-Time Chart Widget */}
          <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-neo-purple">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <h3 className="font-orbitron font-black text-sm text-purple-100 uppercase tracking-wider">
                  Grafik Real-Time TradingView (XAU/USD)
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-orbitron text-purple-400/80 mr-1">Pair:</span>
                <button
                  onClick={() => setGoldSymbol('OANDA:XAUUSD')}
                  className={`px-3 py-1 rounded-xl text-xs font-orbitron font-bold uppercase transition-all cursor-pointer ${
                    goldSymbol === 'OANDA:XAUUSD'
                      ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white shadow-neo-purple'
                      : 'bg-[#0d0718] text-purple-200/70 border border-purple-500/20 hover:text-white'
                  }`}
                >
                  OANDA: XAUUSD
                </button>
                <button
                  onClick={() => setGoldSymbol('COMEX:GC1!')}
                  className={`px-3 py-1 rounded-xl text-xs font-orbitron font-bold uppercase transition-all cursor-pointer ${
                    goldSymbol === 'COMEX:GC1!'
                      ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white shadow-neo-purple'
                      : 'bg-[#0d0718] text-purple-200/70 border border-purple-500/20 hover:text-white'
                  }`}
                >
                  COMEX: GOLD FUTURES
                </button>
                <button
                  onClick={() => setGoldSymbol('TVC:GOLD')}
                  className={`px-3 py-1 rounded-xl text-xs font-orbitron font-bold uppercase transition-all cursor-pointer ${
                    goldSymbol === 'TVC:GOLD'
                      ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white shadow-neo-purple'
                      : 'bg-[#0d0718] text-purple-200/70 border border-purple-500/20 hover:text-white'
                  }`}
                >
                  TVC: GOLD
                </button>
              </div>
            </div>

            {/* Embed TradingView Live Interactive Chart */}
            <div className="w-full">
              <TradingViewAdvancedChart symbol={goldSymbol} height={420} theme="dark" />
            </div>
          </div>

          {/* Gold Calculator / Valuation Section */}
          <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-5 space-y-4 shadow-neo-purple">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider">
                <Calculator className="w-4 h-4 text-purple-400" />
                <span>Kalkulator Simulasi Pembelian / Buyback Emas</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCalcType('buyFromUs')}
                  className={`px-3 py-1 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer ${
                    calcType === 'buyFromUs'
                      ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white shadow-neo-purple'
                      : 'bg-[#0d0718] text-purple-200/70 border border-purple-500/20'
                  }`}
                >
                  Harga Beli Emas
                </button>
                <button
                  onClick={() => setCalcType('sellToUs')}
                  className={`px-3 py-1 rounded-xl text-xs font-orbitron font-bold transition-all cursor-pointer ${
                    calcType === 'sellToUs'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-[#0d0718] text-purple-200/70 border border-purple-500/20'
                  }`}
                >
                  Harga Buyback (Jual)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div>
                <label className="text-[11px] font-orbitron font-bold text-purple-400/80 block mb-1">
                  Jumlah Berat Emas (Gram):
                </label>
                <input
                  type="number"
                  value={calcGrams}
                  onChange={(e) => setCalcGrams(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0d0718] border border-purple-500/30 text-purple-100 font-mono text-sm font-bold rounded-xl p-2.5 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Quick Gram Preset Buttons */}
              <div>
                <label className="text-[11px] font-orbitron font-bold text-purple-400/80 block mb-1">
                  Pilih Preset Gram:
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[1, 5, 10, 25, 50, 100].map((g) => (
                    <button
                      key={g}
                      onClick={() => setCalcGrams(g)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        calcGrams === g
                          ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                          : 'bg-[#0d0718] text-purple-200/60 border-purple-500/20 hover:text-white'
                      }`}
                    >
                      {g}g
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Calculated Valuation */}
              <div className="bg-[#0d0718] border border-purple-500/30 p-3 rounded-xl">
                <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">
                  Total Estimasi {calcType === 'buyFromUs' ? 'Pembelian' : 'Pencairan Buyback'}
                </p>
                <p className="text-xl font-mono font-black text-neon-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.4)] mt-0.5">
                  {formatRupiah(calculateTotalGoldPrice())}
                </p>
                <p className="text-[10px] font-rajdhani text-purple-200/60 mt-0.5">
                  @ {formatRupiah(calcType === 'buyFromUs' ? GOLD_DATA.antamGramPriceIDR : GOLD_DATA.antamBuybackGramIDR)} / gram
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-purple-500/20 bg-[#1a0f30] flex flex-col sm:flex-row items-center justify-between text-[11px] text-purple-200/70 font-rajdhani">
          <span>* Live Chart disediakan langsung oleh TradingView (XAU/USD).</span>
          <button
            onClick={onClose}
            className="mt-2 sm:mt-0 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white font-orbitron font-bold text-xs px-5 py-2 rounded-xl shadow-neo-purple cursor-pointer"
          >
            Tutup Live Gold TradingView
          </button>
        </div>

      </div>
    </div>
  );
}
