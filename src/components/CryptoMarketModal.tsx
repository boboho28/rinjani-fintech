import React, { useState } from 'react';
import { X, RefreshCw, ShieldCheck, TrendingUp, TrendingDown, ArrowRightLeft, Globe, Coins } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { GLOBAL_RATES } from '../utils/rates';
import { TradingViewAdvancedChart } from './TradingViewWidget';

const CRYPTO_ASSETS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', usdPrice: 64200, change: +2.85, rank: 1 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', usdPrice: 3470, change: +3.42, rank: 2 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', usdPrice: 152.5, change: +5.12, rank: 3 },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB Chain', usdPrice: 578.6, change: -0.85, rank: 4 },
  { id: 'ripple', symbol: 'XRP', name: 'Ripple XRP', usdPrice: 0.58, change: +1.65, rank: 5 },
  { id: 'tether', symbol: 'USDT', name: 'Tether USD', usdPrice: 1.0, change: +0.02, rank: 8 },
];

interface Props { isOpen: boolean; onClose: () => void; }

export function CryptoMarketModal({ isOpen, onClose }: Props) {
  const [selectedCoinId, setSelectedCoinId] = useState<string>('bitcoin');
  const [calcInput, setCalcInput] = useState<number>(1);
  const [calcDirection, setCalcDirection] = useState<'cryptoToIdr' | 'idrToCrypto'>('cryptoToIdr');
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 600); };
  const selectedCoin = CRYPTO_ASSETS.find((c) => c.id === selectedCoinId) || CRYPTO_ASSETS[0];
  const coinPriceIDR = selectedCoin.usdPrice * GLOBAL_RATES.USD_IDR;
  const isPositive = selectedCoin.change >= 0;

  const calculateConverted = () => {
    if (!calcInput || isNaN(calcInput)) return 0;
    return calcDirection === 'cryptoToIdr' ? calcInput * coinPriceIDR : calcInput / coinPriceIDR;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-neo-purple overflow-hidden">
        <div className="p-5 border-b border-purple-500/20 flex items-center justify-between bg-[#1a0f30]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-purple-700 text-white font-orbitron font-bold shadow-neo-purple"><Coins className="w-6 h-6 text-fuchsia-300" /></div>
            <div>
              <div className="flex items-center gap-2"><span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded">CRYPTO ASSETS</span><span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> LIVE SYNC</span></div>
              <h2 className="text-lg font-orbitron font-black text-neon-purple tracking-wide mt-0.5 uppercase tracking-tighter">Analisis Crypto & Kalkulator IDR</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} className="p-2.5 rounded-xl bg-[#130b20] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all"><RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /></button>
            <button onClick={onClose} className="p-2.5 rounded-xl bg-[#130b20] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-5 space-y-5 shadow-neo-purple">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-orbitron font-black text-purple-300 text-base uppercase">{selectedCoin.symbol}</div><div><h3 className="font-orbitron font-black text-xl text-purple-100 uppercase tracking-tight">{selectedCoin.name}</h3><p className="text-xs font-mono text-purple-200/70 mt-0.5">Rank #{selectedCoin.rank} • Global Price: ${selectedCoin.usdPrice.toLocaleString()} USD</p></div></div>
              <div className="sm:text-right"><p className="text-2xl font-mono font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{formatRupiah(coinPriceIDR)}</p><div className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold mt-1 px-2.5 py-0.5 rounded-md border ${isPositive ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'}`}>{isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}<span>24h: {isPositive ? `+${selectedCoin.change}%` : `${selectedCoin.change}%`}</span></div></div>
            </div>
            <TradingViewAdvancedChart symbol={`BINANCE:${selectedCoin.symbol}USDT`} height={420} theme="dark" />
          </div>

          <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider"><ArrowRightLeft className="w-4 h-4 text-purple-400" /><span>Kalkulator Crypto Ke Rupiah (Kurs {formatRupiah(GLOBAL_RATES.USD_IDR)})</span></div><button onClick={() => setCalcDirection(calcDirection === 'cryptoToIdr' ? 'idrToCrypto' : 'cryptoToIdr')} className="text-xs font-orbitron font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer"><span>{calcDirection === 'cryptoToIdr' ? `${selectedCoin.symbol} ➔ IDR` : `IDR ➔ ${selectedCoin.symbol}`}</span></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
              <div><label className="text-[11px] font-orbitron font-bold text-purple-400/80 block mb-1">Jumlah {calcDirection === 'cryptoToIdr' ? selectedCoin.symbol : 'IDR'}:</label><input type="number" value={calcInput} onChange={(e) => setCalcInput(parseFloat(e.target.value) || 0)} className="w-full bg-[#0d0718] border border-purple-500/30 text-purple-100 font-mono text-sm font-bold rounded-xl p-2.5 focus:outline-none" /></div>
              <div className="bg-[#0d0718] border border-emerald-500/30 p-3 rounded-xl"><p className="text-[10px] font-orbitron font-bold text-emerald-400/80 uppercase">Estimasi Nilai Tukar</p><p className="text-lg font-mono font-black text-emerald-400">{calcDirection === 'cryptoToIdr' ? formatRupiah(calculateConverted()) : `${calculateConverted().toLocaleString('id-ID', { maximumFractionDigits: 6 })} ${selectedCoin.symbol}`}</p></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CRYPTO_ASSETS.map((coin) => (
              <div key={coin.id} onClick={() => setSelectedCoinId(coin.id)} className={`bg-[#1a0f30] border rounded-2xl p-4 space-y-3 shadow-neo-purple hover:border-purple-400 transition-all cursor-pointer ${selectedCoinId === coin.id ? 'border-purple-400 bg-[#231540]' : 'border-purple-500/25'}`}>
                <div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center font-orbitron font-bold text-purple-300 text-xs">{coin.symbol}</div><div><h5 className="font-orbitron font-bold text-xs text-purple-100 uppercase tracking-tight">{coin.name}</h5><span className="text-[10px] font-mono text-purple-400/70">Rank #{coin.rank}</span></div></div><span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${coin.change >= 0 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'}`}>{coin.change >= 0 ? `+${coin.change}%` : `${coin.change}%`}</span></div>
                <div className="text-center bg-[#0d0718] p-2 rounded-xl border border-purple-500/10"><p className="text-[10px] font-orbitron text-purple-400/70 uppercase">IDR Value</p><p className="font-mono font-black text-purple-200 text-xs">{formatRupiah(coin.usdPrice * GLOBAL_RATES.USD_IDR)}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-purple-500/20 bg-[#1a0f30] text-center"><button onClick={onClose} className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white font-orbitron font-bold text-xs px-10 py-2.5 rounded-xl shadow-neo-purple transition-all active:scale-95">Tutup Market Crypto</button></div>
      </div>
    </div>
  );
}
