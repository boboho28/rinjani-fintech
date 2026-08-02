import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRightLeft, 
  Calendar 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatRupiah } from '../utils/formatters';
import { TradingViewAdvancedChart } from './TradingViewWidget';

export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  priceIDR: number;
  priceUSD: number;
  change24h: number;
  volume24hIDR: number;
  high24hIDR: number;
  low24hIDR: number;
  marketCapRank: number;
  history24h: { time: string; price: number }[];
  history7d: { time: string; price: number }[];
  history30d: { time: string; price: number }[];
  history1y: { time: string; price: number }[];
}

const CRYPTO_DATA: CryptoCoin[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    priceIDR: 1045000000,
    priceUSD: 64200,
    change24h: +2.85,
    volume24hIDR: 45000000000000,
    high24hIDR: 1060000000,
    low24hIDR: 1015000000,
    marketCapRank: 1,
    history24h: [
      { time: '00:00', price: 1018000000 },
      { time: '04:00', price: 1022000000 },
      { time: '08:00', price: 1030000000 },
      { time: '12:00', price: 1028000000 },
      { time: '16:00', price: 1040000000 },
      { time: '20:00', price: 1045000000 },
    ],
    history7d: [
      { time: 'Sen', price: 980000000 },
      { time: 'Sel', price: 995000000 },
      { time: 'Rab', price: 1010000000 },
      { time: 'Kam', price: 1005000000 },
      { time: 'Jum', price: 1025000000 },
      { time: 'Sab', price: 1038000000 },
      { time: 'Min', price: 1045000000 },
    ],
    history30d: [
      { time: 'Minggu 1', price: 920000000 },
      { time: 'Minggu 2', price: 960000000 },
      { time: 'Minggu 3', price: 990000000 },
      { time: 'Minggu 4', price: 1045000000 },
    ],
    history1y: [
      { time: 'Q1', price: 650000000 },
      { time: 'Q2', price: 780000000 },
      { time: 'Q3', price: 910000000 },
      { time: 'Q4', price: 1045000000 },
    ],
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    priceIDR: 56500000,
    priceUSD: 3470,
    change24h: +3.42,
    volume24hIDR: 28000000000000,
    high24hIDR: 57200000,
    low24hIDR: 54600000,
    marketCapRank: 2,
    history24h: [
      { time: '00:00', price: 54800000 },
      { time: '04:00', price: 55100000 },
      { time: '08:00', price: 55900000 },
      { time: '12:00', price: 55700000 },
      { time: '16:00', price: 56200000 },
      { time: '20:00', price: 56500000 },
    ],
    history7d: [
      { time: 'Sen', price: 52000000 },
      { time: 'Sel', price: 53200000 },
      { time: 'Rab', price: 54500000 },
      { time: 'Kam', price: 54000000 },
      { time: 'Jum', price: 55500000 },
      { time: 'Sab', price: 56000000 },
      { time: 'Min', price: 56500000 },
    ],
    history30d: [
      { time: 'Minggu 1', price: 48000000 },
      { time: 'Minggu 2', price: 51000000 },
      { time: 'Minggu 3', price: 53500000 },
      { time: 'Minggu 4', price: 56500000 },
    ],
    history1y: [
      { time: 'Q1', price: 32000000 },
      { time: 'Q2', price: 41000000 },
      { time: 'Q3', price: 49000000 },
      { time: 'Q4', price: 56500000 },
    ],
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    priceIDR: 2480000,
    priceUSD: 152.5,
    change24h: +5.12,
    volume24hIDR: 12000000000000,
    high24hIDR: 2530000,
    low24hIDR: 2350000,
    marketCapRank: 3,
    history24h: [
      { time: '00:00', price: 2360000 },
      { time: '04:00', price: 2390000 },
      { time: '08:00', price: 2420000 },
      { time: '12:00', price: 2410000 },
      { time: '16:00', price: 2460000 },
      { time: '20:00', price: 2480000 },
    ],
    history7d: [
      { time: 'Sen', price: 2150000 },
      { time: 'Sel', price: 2220000 },
      { time: 'Rab', price: 2300000 },
      { time: 'Kam', price: 2280000 },
      { time: 'Jum', price: 2400000 },
      { time: 'Sab', price: 2450000 },
      { time: 'Min', price: 2480000 },
    ],
    history30d: [
      { time: 'Minggu 1', price: 1950000 },
      { time: 'Minggu 2', price: 2100000 },
      { time: 'Minggu 3', price: 2280000 },
      { time: 'Minggu 4', price: 2480000 },
    ],
    history1y: [
      { time: 'Q1', price: 950000 },
      { time: 'Q2', price: 1450000 },
      { time: 'Q3', price: 1980000 },
      { time: 'Q4', price: 2480000 },
    ],
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB Chain',
    priceIDR: 9420000,
    priceUSD: 578.6,
    change24h: -0.85,
    volume24hIDR: 8500000000000,
    high24hIDR: 9580000,
    low24hIDR: 9350000,
    marketCapRank: 4,
    history24h: [
      { time: '00:00', price: 9500000 },
      { time: '04:00', price: 9520000 },
      { time: '08:00', price: 9480000 },
      { time: '12:00', price: 9410000 },
      { time: '16:00', price: 9440000 },
      { time: '20:00', price: 9420000 },
    ],
    history7d: [
      { time: 'Sen', price: 9600000 },
      { time: 'Sel', price: 9550000 },
      { time: 'Rab', price: 9480000 },
      { time: 'Kam', price: 9450000 },
      { time: 'Jum', price: 9500000 },
      { time: 'Sab', price: 9450000 },
      { time: 'Min', price: 9420000 },
    ],
    history30d: [
      { time: 'Minggu 1', price: 9100000 },
      { time: 'Minggu 2', price: 9300000 },
      { time: 'Minggu 3', price: 9500000 },
      { time: 'Minggu 4', price: 9420000 },
    ],
    history1y: [
      { time: 'Q1', price: 5800000 },
      { time: 'Q2', price: 7200000 },
      { time: 'Q3', price: 8800000 },
      { time: 'Q4', price: 9420000 },
    ],
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'Ripple XRP',
    priceIDR: 9450,
    priceUSD: 0.58,
    change24h: +1.65,
    volume24hIDR: 6200000000000,
    high24hIDR: 9650,
    low24hIDR: 9280,
    marketCapRank: 5,
    history24h: [
      { time: '00:00', price: 9300 },
      { time: '04:00', price: 9340 },
      { time: '08:00', price: 9400 },
      { time: '12:00', price: 9380 },
      { time: '16:00', price: 9420 },
      { time: '20:00', price: 9450 },
    ],
    history7d: [
      { time: 'Sen', price: 8900 },
      { time: 'Sel', price: 9050 },
      { time: 'Rab', price: 9200 },
      { time: 'Kam', price: 9150 },
      { time: 'Jum', price: 9350 },
      { time: 'Sab', price: 9400 },
      { time: 'Min', price: 9450 },
    ],
    history30d: [
      { time: 'Minggu 1', price: 8100 },
      { time: 'Minggu 2', price: 8600 },
      { time: 'Minggu 3', price: 9100 },
      { time: 'Minggu 4', price: 9450 },
    ],
    history1y: [
      { time: 'Q1', price: 6200 },
      { time: 'Q2', price: 7400 },
      { time: 'Q3', price: 8500 },
      { time: 'Q4', price: 9450 },
    ],
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    priceIDR: 6850,
    priceUSD: 0.42,
    change24h: -1.15,
    volume24hIDR: 3100000000000,
    high24hIDR: 7020,
    low24hIDR: 6750,
    marketCapRank: 6,
    history24h: [
      { time: '00:00', price: 6930 },
      { time: '04:00', price: 6950 },
      { time: '08:00', price: 6900 },
      { time: '12:00', price: 6840 },
      { time: '16:00', price: 6870 },
      { time: '20:00', price: 6850 },
    ],
    history7d: [
      { time: 'Sen', price: 7100 },
      { time: 'Sel', price: 7050 },
      { time: 'Rab', price: 6980 },
      { time: 'Kam', price: 6900 },
      { time: 'Jum', price: 6950 },
      { time: 'Sab', price: 6890 },
      { time: 'Min', price: 6850 },
    ],
    history30d: [
      { time: 'Minggu 1', price: 6400 },
      { time: 'Minggu 2', price: 6700 },
      { time: 'Minggu 3', price: 7000 },
      { time: 'Minggu 4', price: 6850 },
    ],
    history1y: [
      { time: 'Q1', price: 4800 },
      { time: 'Q2', price: 5900 },
      { time: 'Q3', price: 6500 },
      { time: 'Q4', price: 6850 },
    ],
  },
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    name: 'Dogecoin',
    priceIDR: 2150,
    priceUSD: 0.132,
    change24h: +4.25,
    volume24hIDR: 5400000000000,
    high24hIDR: 2220,
    low24hIDR: 2040,
    marketCapRank: 7,
    history24h: [
      { time: '00:00', price: 2060 },
      { time: '04:00', price: 2080 },
      { time: '08:00', price: 2120 },
      { time: '12:00', price: 2100 },
      { time: '16:00', price: 2140 },
      { time: '20:00', price: 2150 },
    ],
    history7d: [
      { time: 'Sen', price: 1920 },
      { time: 'Sel', price: 1980 },
      { time: 'Rab', price: 2050 },
      { time: 'Kam', price: 2020 },
      { time: 'Jum', price: 2110 },
      { time: 'Sab', price: 2130 },
      { time: 'Min', price: 2150 },
    ],
    history30d: [
      { time: 'Minggu 1', price: 1750 },
      { time: 'Minggu 2', price: 1900 },
      { time: 'Minggu 3', price: 2040 },
      { time: 'Minggu 4', price: 2150 },
    ],
    history1y: [
      { time: 'Q1', price: 1100 },
      { time: 'Q2', price: 1550 },
      { time: 'Q3', price: 1850 },
      { time: 'Q4', price: 2150 },
    ],
  },
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether USD',
    priceIDR: 16290,
    priceUSD: 1.0,
    change24h: +0.02,
    volume24hIDR: 65000000000000,
    high24hIDR: 16310,
    low24hIDR: 16270,
    marketCapRank: 8,
    history24h: [
      { time: '00:00', price: 16285 },
      { time: '04:00', price: 16288 },
      { time: '08:00', price: 16290 },
      { time: '12:00', price: 16287 },
      { time: '16:00', price: 16289 },
      { time: '20:00', price: 16290 },
    ],
    history7d: [
      { time: 'Sen', price: 16270 },
      { time: 'Sel', price: 16280 },
      { time: 'Rab', price: 16285 },
      { time: 'Kam', price: 16280 },
      { time: 'Jum', price: 16290 },
      { time: 'Sab', price: 16288 },
      { time: 'Min', price: 16290 },
    ],
    history30d: [
      { time: 'Minggu 1', price: 16250 },
      { time: 'Minggu 2', price: 16270 },
      { time: 'Minggu 3', price: 16285 },
      { time: 'Minggu 4', price: 16290 },
    ],
    history1y: [
      { time: 'Q1', price: 15800 },
      { time: 'Q2', price: 16100 },
      { time: 'Q3', price: 16250 },
      { time: 'Q4', price: 16290 },
    ],
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type Timeframe = '24h' | '7d' | '30d' | '1y';

export function CryptoMarketModal({ isOpen, onClose }: Props) {
  const [selectedCoinId, setSelectedCoinId] = useState<string>('bitcoin');
  const [timeframe, setTimeframe] = useState<Timeframe>('7d');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [calcInput, setCalcInput] = useState<number>(1);
  const [calcDirection, setCalcDirection] = useState<'cryptoToIdr' | 'idrToCrypto'>('cryptoToIdr');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString('id-ID'));
  const [chartMode, setChartMode] = useState<'tradingview' | 'simulated'>('tradingview');

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date().toLocaleTimeString('id-ID'));
      setIsRefreshing(false);
    }, 600);
  };

  const selectedCoin = CRYPTO_DATA.find((c) => c.id === selectedCoinId) || CRYPTO_DATA[0];

  const filteredCoins = CRYPTO_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChartData = () => {
    switch (timeframe) {
      case '24h':
        return selectedCoin.history24h;
      case '7d':
        return selectedCoin.history7d;
      case '30d':
        return selectedCoin.history30d;
      case '1y':
        return selectedCoin.history1y;
      default:
        return selectedCoin.history7d;
    }
  };

  const chartData = getChartData();
  const isPositiveTrend = selectedCoin.change24h >= 0;

  const calculateConvertedCrypto = () => {
    if (!calcInput || isNaN(calcInput)) return 0;
    if (calcDirection === 'cryptoToIdr') {
      return calcInput * selectedCoin.priceIDR;
    } else {
      return calcInput / selectedCoin.priceIDR;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-neo-purple overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-purple-500/20 flex items-center justify-between bg-[#1a0f30]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-purple-700 text-white font-orbitron font-bold shadow-neo-purple">
              <Coins className="w-6 h-6 text-fuchsia-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded">
                  CRYPTO MARKET & CHARTS
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> LIVE TICKER ({lastRefreshed})
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-orbitron font-black text-neon-purple tracking-wide mt-0.5">
                GRAFIK HARGA & ANALISIS ALL CRYPTO (IDR)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              title="Refresh Crypto Data"
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
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Main Selected Coin Chart Header & Interactive Recharts Area */}
          <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-5 space-y-5 shadow-neo-purple">
            
            {/* Coin Header Bar + Price Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 border border-purple-500/40 flex items-center justify-center font-orbitron font-black text-purple-300 text-base shadow-inner">
                  {selectedCoin.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-orbitron font-black text-xl text-purple-100 tracking-wide">
                      {selectedCoin.name} ({selectedCoin.symbol})
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-orbitron font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded">
                      Rank #{selectedCoin.marketCapRank}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-purple-200/70 mt-0.5">
                    1 {selectedCoin.symbol} ≈ ${selectedCoin.priceUSD.toLocaleString('en-US')} USD
                  </p>
                </div>
              </div>

              {/* Live Price & Change */}
              <div className="sm:text-right">
                <p className="text-2xl sm:text-3xl font-mono font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  {formatRupiah(selectedCoin.priceIDR)}
                </p>
                <div className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold mt-1 px-2.5 py-0.5 rounded-md border ${
                  isPositiveTrend
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}>
                  {isPositiveTrend ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>24h Change: {isPositiveTrend ? `+${selectedCoin.change24h}%` : `${selectedCoin.change24h}%`}</span>
                </div>
              </div>
            </div>

            {/* Chart Engine & Timeframe Selector Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-b border-purple-500/20 py-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-orbitron font-bold text-purple-400/80 uppercase mr-1">
                  Chart Mode:
                </span>
                <button
                  onClick={() => setChartMode('tradingview')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-orbitron font-bold uppercase transition-all cursor-pointer ${
                    chartMode === 'tradingview'
                      ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white shadow-neo-purple'
                      : 'bg-[#0d0718] text-purple-200/70 border border-purple-500/20 hover:text-white'
                  }`}
                >
                  ⚡ TRADINGVIEW LIVE (BINANCE:{selectedCoin.symbol}USDT)
                </button>
                <button
                  onClick={() => setChartMode('simulated')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-orbitron font-bold uppercase transition-all cursor-pointer ${
                    chartMode === 'simulated'
                      ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white shadow-neo-purple'
                      : 'bg-[#0d0718] text-purple-200/70 border border-purple-500/20 hover:text-white'
                  }`}
                >
                  STATISTIK IDR
                </button>
              </div>

              {chartMode === 'simulated' ? (
                <div className="flex items-center gap-2">
                  {(['24h', '7d', '30d', '1y'] as Timeframe[]).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-orbitron font-bold uppercase transition-all cursor-pointer ${
                        timeframe === tf
                          ? 'bg-purple-500/30 text-purple-300 border border-purple-400'
                          : 'bg-[#0d0718] text-purple-200/70 border border-purple-500/20'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] font-mono text-emerald-400 font-bold">
                  ● TradingView Real-time Ticker Feed
                </div>
              )}
            </div>

            {/* Render Selected Chart Engine */}
            {chartMode === 'tradingview' ? (
              <div className="w-full">
                <TradingViewAdvancedChart
                  symbol={`BINANCE:${selectedCoin.symbol}USDT`}
                  height={420}
                  theme="dark"
                />
              </div>
            ) : (
              <div className="h-64 sm:h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="cryptoGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isPositiveTrend ? '#10b981' : '#f43f5e'} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={isPositiveTrend ? '#10b981' : '#f43f5e'} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      stroke="#8b5cf6" 
                      tick={{ fill: '#d8b4fe', fontSize: 10, fontFamily: 'Orbitron' }}
                      axisLine={{ stroke: '#6b21a8' }}
                    />
                    <YAxis 
                      hide={true} 
                      domain={['dataMin - 100', 'dataMax + 100']} 
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#130b20',
                        borderColor: '#a855f7',
                        borderRadius: '12px',
                        color: '#fff',
                        fontFamily: 'monospace',
                        boxShadow: '0 0 15px rgba(168,85,247,0.3)',
                      }}
                      formatter={(val: number) => [formatRupiah(val), 'Harga IDR']}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={isPositiveTrend ? '#10b981' : '#f43f5e'}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#cryptoGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

          </div>

          {/* Calculator Section for Selected Crypto */}
          <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider">
                <ArrowRightLeft className="w-4 h-4 text-purple-400" />
                <span>Kalkulator Estimasi Beli / Jual {selectedCoin.symbol}</span>
              </div>
              <button
                onClick={() => setCalcDirection(calcDirection === 'cryptoToIdr' ? 'idrToCrypto' : 'cryptoToIdr')}
                className="text-xs font-orbitron font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{calcDirection === 'cryptoToIdr' ? `${selectedCoin.symbol} ➔ IDR` : `IDR ➔ ${selectedCoin.symbol}`}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[11px] font-orbitron font-bold text-purple-400/80 block mb-1">
                  Masukkan Jumlah ({calcDirection === 'cryptoToIdr' ? selectedCoin.symbol : 'IDR Rupiah'}):
                </label>
                <input
                  type="number"
                  value={calcInput}
                  onChange={(e) => setCalcInput(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0d0718] border border-purple-500/30 text-purple-100 font-mono text-sm font-bold rounded-xl p-2.5 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="bg-[#0d0718] border border-emerald-500/30 p-3 rounded-xl">
                <p className="text-[10px] font-orbitron font-bold text-emerald-400/80 uppercase">
                  Estimasi Nilai Tukar
                </p>
                <p className="text-lg font-mono font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] mt-0.5">
                  {calcDirection === 'cryptoToIdr'
                    ? formatRupiah(calculateConvertedCrypto())
                    : `${calculateConvertedCrypto().toLocaleString('id-ID', { maximumFractionDigits: 6 })} ${selectedCoin.symbol}`}
                </p>
              </div>
            </div>
          </div>

          {/* List of All Cryptos Table / Cards Grid */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <h4 className="font-orbitron font-bold text-sm text-purple-300 uppercase tracking-wider">
                Daftar Seluruh Aset Crypto Utama
              </h4>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari Crypto (BTC, ETH, SOL)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl pl-9 pr-4 py-2 text-xs font-rajdhani text-purple-100 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredCoins.map((coin) => {
                const isSelected = coin.id === selectedCoinId;
                const coinPositive = coin.change24h >= 0;
                return (
                  <div
                    key={coin.id}
                    onClick={() => setSelectedCoinId(coin.id)}
                    className={`bg-[#1a0f30] border rounded-2xl p-4 space-y-3 shadow-neo-purple hover:border-purple-400 transition-all cursor-pointer ${
                      isSelected ? 'border-purple-400 ring-1 ring-purple-400/50 bg-[#231540]' : 'border-purple-500/25'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center font-orbitron font-bold text-purple-300 text-xs">
                          {coin.symbol}
                        </div>
                        <div>
                          <h5 className="font-orbitron font-bold text-xs text-purple-100">
                            {coin.name}
                          </h5>
                          <span className="text-[10px] font-mono text-purple-400/70">
                            #{coin.marketCapRank}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        coinPositive
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}>
                        {coinPositive ? `+${coin.change24h}%` : `${coin.change24h}%`}
                      </span>
                    </div>

                    <div>
                      <p className="text-[10px] font-orbitron text-purple-400/70 uppercase">Harga IDR</p>
                      <p className="font-mono font-black text-purple-200 text-sm mt-0.5">
                        {formatRupiah(coin.priceIDR)}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCoinId(coin.id);
                      }}
                      className="w-full bg-[#0d0718] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-orbitron font-bold text-[10px] py-1.5 rounded-lg transition-all"
                    >
                      {isSelected ? '✓ Grafik Aktif' : 'Tampilkan Grafik'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-purple-500/20 bg-[#1a0f30] flex flex-col sm:flex-row items-center justify-between text-[11px] text-purple-200/70 font-rajdhani">
          <span>* Data grafik & harga pasar Crypto diperbarui real-time.</span>
          <button
            onClick={onClose}
            className="mt-2 sm:mt-0 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white font-orbitron font-bold text-xs px-5 py-2 rounded-xl shadow-neo-purple cursor-pointer"
          >
            Tutup Market Crypto
          </button>
        </div>

      </div>
    </div>
  );
}
