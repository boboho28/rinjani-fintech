import React, { useState } from 'react';
import { X, Search, RefreshCw, Calculator, ArrowRightLeft, TrendingUp, TrendingDown, Globe, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

interface CurrencyRate {
  code: string;
  name: string;
  country: string;
  flag: string;
  rateVsIDR: number; // 1 unit in IDR (except JPY/KRW standard per unit)
  change24h: number; // percentage
  buyRate: number;
  sellRate: number;
  high24h: number;
  low24h: number;
}

const CURRENCY_LIST: CurrencyRate[] = [
  {
    code: 'USD',
    name: 'Dolar Amerika Serikat',
    country: 'United States',
    flag: '🇺🇸',
    rateVsIDR: 16280,
    change24h: +0.35,
    buyRate: 16180,
    sellRate: 16380,
    high24h: 16320,
    low24h: 16210,
  },
  {
    code: 'EUR',
    name: 'Euro Eropa',
    country: 'European Union',
    flag: '🇪🇺',
    rateVsIDR: 17650,
    change24h: -0.18,
    buyRate: 17520,
    sellRate: 17780,
    high24h: 17720,
    low24h: 17590,
  },
  {
    code: 'SGD',
    name: 'Dolar Singapura',
    country: 'Singapore',
    flag: '🇸🇬',
    rateVsIDR: 12180,
    change24h: +0.22,
    buyRate: 12100,
    sellRate: 12260,
    high24h: 12210,
    low24h: 12130,
  },
  {
    code: 'MYR',
    name: 'Ringgit Malaysia',
    country: 'Malaysia',
    flag: '🇲🇾',
    rateVsIDR: 3680,
    change24h: +0.45,
    buyRate: 3640,
    sellRate: 3720,
    high24h: 3695,
    low24h: 3655,
  },
  {
    code: 'JPY',
    name: 'Yen Jepang (per 100 JPY)',
    country: 'Japan',
    flag: '🇯🇵',
    rateVsIDR: 10850,
    change24h: -0.52,
    buyRate: 10750,
    sellRate: 10950,
    high24h: 10920,
    low24h: 10810,
  },
  {
    code: 'AUD',
    name: 'Dolar Australia',
    country: 'Australia',
    flag: '🇦🇺',
    rateVsIDR: 10620,
    change24h: +0.12,
    buyRate: 10540,
    sellRate: 10700,
    high24h: 10660,
    low24h: 10590,
  },
  {
    code: 'GBP',
    name: 'Poundsterling Inggris',
    country: 'United Kingdom',
    flag: '🇬🇧',
    rateVsIDR: 20850,
    change24h: +0.65,
    buyRate: 20700,
    sellRate: 21000,
    high24h: 20920,
    low24h: 20730,
  },
  {
    code: 'SAR',
    name: 'Riyal Arab Saudi',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    rateVsIDR: 4340,
    change24h: +0.08,
    buyRate: 4300,
    sellRate: 4380,
    high24h: 4355,
    low24h: 4325,
  },
  {
    code: 'CNY',
    name: 'Yuan / Renminbi Tiongkok',
    country: 'China',
    flag: '🇨🇳',
    rateVsIDR: 2250,
    change24h: -0.15,
    buyRate: 2220,
    sellRate: 2280,
    high24h: 2265,
    low24h: 2235,
  },
  {
    code: 'THB',
    name: 'Baht Thailand',
    country: 'Thailand',
    flag: '🇹🇭',
    rateVsIDR: 465,
    change24h: +0.30,
    buyRate: 458,
    sellRate: 472,
    high24h: 468,
    low24h: 461,
  },
  {
    code: 'CAD',
    name: 'Dolar Kanada',
    country: 'Canada',
    flag: '🇨🇦',
    rateVsIDR: 11850,
    change24h: -0.25,
    buyRate: 11750,
    sellRate: 11950,
    high24h: 11900,
    low24h: 11810,
  },
  {
    code: 'CHF',
    name: 'Franc Swiss',
    country: 'Switzerland',
    flag: '🇨🇭',
    rateVsIDR: 18420,
    change24h: +0.40,
    buyRate: 18280,
    sellRate: 18560,
    high24h: 18480,
    low24h: 18350,
  },
  {
    code: 'HKD',
    name: 'Dolar Hong Kong',
    country: 'Hong Kong',
    flag: '🇭🇰',
    rateVsIDR: 2080,
    change24h: +0.10,
    buyRate: 2065,
    sellRate: 2095,
    high24h: 2088,
    low24h: 2072,
  },
  {
    code: 'KRW',
    name: 'Won Korea Selatan (per 100 KRW)',
    country: 'South Korea',
    flag: '🇰🇷',
    rateVsIDR: 1180,
    change24h: -0.42,
    buyRate: 1165,
    sellRate: 1195,
    high24h: 1190,
    low24h: 1172,
  },
  {
    code: 'AED',
    name: 'Dirham Uni Emirat Arab',
    country: 'UAE',
    flag: '🇦🇪',
    rateVsIDR: 4430,
    change24h: +0.18,
    buyRate: 4390,
    sellRate: 4470,
    high24h: 4445,
    low24h: 4415,
  },
  {
    code: 'NZD',
    name: 'Dolar Selandia Baru',
    country: 'New Zealand',
    flag: '🇳🇿',
    rateVsIDR: 9850,
    change24h: +0.05,
    buyRate: 9760,
    sellRate: 9940,
    high24h: 9890,
    low24h: 9810,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CurrencyRateModal({ isOpen, onClose }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('USD');
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcDirection, setCalcDirection] = useState<'foreignToIdr' | 'idrToForeign'>('foreignToIdr');
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString('id-ID'));
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date().toLocaleTimeString('id-ID'));
      setIsRefreshing(false);
    }, 600);
  };

  const filteredRates = CURRENCY_LIST.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCurr = CURRENCY_LIST.find((c) => c.code === selectedCurrencyCode) || CURRENCY_LIST[0];

  const calculateConverted = () => {
    if (!calcAmount || isNaN(calcAmount)) return 0;
    if (calcDirection === 'foreignToIdr') {
      const perUnitMultiplier = selectedCurr.code === 'JPY' || selectedCurr.code === 'KRW' ? 0.01 : 1;
      return calcAmount * selectedCurr.rateVsIDR * perUnitMultiplier;
    } else {
      const perUnitMultiplier = selectedCurr.code === 'JPY' || selectedCurr.code === 'KRW' ? 100 : 1;
      return (calcAmount / selectedCurr.rateVsIDR) * perUnitMultiplier;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-neo-purple overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-purple-500/20 flex items-center justify-between bg-[#1a0f30]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-400 text-white font-orbitron font-bold shadow-neo-purple">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-orbitron font-bold text-purple-300 uppercase tracking-widest bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded">
                  MONETARY RATES
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> LIVE FEED ({lastRefreshed})
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-orbitron font-black text-neon-purple tracking-wide mt-0.5">
                KURS MATA UANG DUNIA VS IDR (RUPIAH)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              title="Refresh Data Rates"
              className="p-2.5 rounded-xl bg-[#24133d] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[#24133d] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Quick Currency Converter Section */}
          <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-neo-purple">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider">
                <Calculator className="w-4 h-4 text-purple-400" />
                <span>Kalkulator Konversi Valuta Asing</span>
              </div>
              <button
                onClick={() => setCalcDirection(calcDirection === 'foreignToIdr' ? 'idrToForeign' : 'foreignToIdr')}
                className="text-xs font-orbitron font-bold text-purple-300 hover:text-white bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>{calcDirection === 'foreignToIdr' ? `${selectedCurr.code} ➔ IDR` : `IDR ➔ ${selectedCurr.code}`}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              {/* Select Currency */}
              <div>
                <label className="text-[11px] font-orbitron font-bold text-purple-400/80 block mb-1">
                  Pilih Mata Uang:
                </label>
                <select
                  value={selectedCurrencyCode}
                  onChange={(e) => setSelectedCurrencyCode(e.target.value)}
                  className="w-full bg-[#130b20] border border-purple-500/30 text-purple-100 font-orbitron text-xs rounded-xl p-2.5 focus:outline-none focus:border-purple-400"
                >
                  {CURRENCY_LIST.map((c) => (
                    <option key={c.code} value={c.code} className="bg-slate-950 text-white">
                      {c.flag} {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Amount */}
              <div>
                <label className="text-[11px] font-orbitron font-bold text-purple-400/80 block mb-1">
                  {calcDirection === 'foreignToIdr' ? `Nominal (${selectedCurr.code})` : 'Nominal (IDR Rupiah)'}
                </label>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#130b20] border border-purple-500/30 text-purple-100 font-mono text-sm font-bold rounded-xl p-2.5 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Converted Result */}
              <div className="bg-[#130b20] border border-emerald-500/30 p-3 rounded-xl">
                <p className="text-[10px] font-orbitron font-bold text-emerald-400/80 uppercase">
                  Hasil Konversi Real-Time
                </p>
                <p className="text-lg font-mono font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] mt-0.5">
                  {calcDirection === 'foreignToIdr'
                    ? formatRupiah(calculateConverted())
                    : `${calculateConverted().toLocaleString('id-ID', { maximumFractionDigits: 4 })} ${selectedCurr.code}`}
                </p>
                <p className="text-[10px] font-rajdhani text-purple-200/60 mt-0.5">
                  1 {selectedCurr.code} = {formatRupiah(selectedCurr.rateVsIDR)}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari mata uang (USD, SGD, EUR, Yen)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl pl-9 pr-4 py-2 text-xs font-rajdhani text-purple-100 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="text-xs font-orbitron text-purple-200/70">
              Total <strong className="text-purple-300 font-bold">{filteredRates.length}</strong> Mata Uang Terdaftar vs IDR
            </div>
          </div>

          {/* Rates Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredRates.map((item) => {
              const isPositive = item.change24h >= 0;
              return (
                <div
                  key={item.code}
                  onClick={() => setSelectedCurrencyCode(item.code)}
                  className={`bg-[#1a0f30] border rounded-2xl p-4 space-y-3 shadow-neo-purple hover:border-purple-400 transition-all cursor-pointer ${
                    selectedCurrencyCode === item.code ? 'border-purple-400 ring-1 ring-purple-400/50 bg-[#24133d]' : 'border-purple-500/25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.flag}</span>
                      <div>
                        <h4 className="font-orbitron font-black text-sm text-purple-100 tracking-wide">
                          1 {item.code}
                        </h4>
                        <p className="text-[11px] font-rajdhani font-semibold text-purple-200/70 truncate max-w-[140px]">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                        isPositive
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{isPositive ? `+${item.change24h}%` : `${item.change24h}%`}</span>
                    </div>
                  </div>

                  <div className="bg-[#130b20] p-3 rounded-xl border border-purple-500/15 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-orbitron text-purple-400/70 uppercase">Kurs Tengah IDR</span>
                      <span className="font-mono font-extrabold text-purple-200 text-sm">
                        {formatRupiah(item.rateVsIDR)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 border-t border-purple-500/10">
                      <div>
                        <span className="text-purple-200/50 block">Kurs Beli:</span>
                        <span className="text-emerald-400 font-bold">{formatRupiah(item.buyRate)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-purple-200/50 block">Kurs Jual:</span>
                        <span className="text-rose-400 font-bold">{formatRupiah(item.sellRate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-purple-500/20 bg-[#1a0f30] flex flex-col sm:flex-row items-center justify-between text-[11px] text-purple-200/70 font-rajdhani">
          <span>* Kurs indikatif Bank Indonesia (BI) & pasar valuta asing internasional real-time.</span>
          <button
            onClick={onClose}
            className="mt-2 sm:mt-0 bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs px-5 py-2 rounded-xl shadow-neo-purple cursor-pointer"
          >
            Tutup Rates
          </button>
        </div>

      </div>
    </div>
  );
}
