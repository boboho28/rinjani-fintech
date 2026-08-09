import React, { useState } from 'react';
import { X, Search, RefreshCw, Calculator, ArrowRightLeft, Globe, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { GLOBAL_RATES } from '../utils/rates';

interface Props { isOpen: boolean; onClose: () => void; }

export function CurrencyRateModal({ isOpen, onClose }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('USD');
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcDirection, setCalcDirection] = useState<'foreignToIdr' | 'idrToForeign'>('foreignToIdr');
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredRates = GLOBAL_RATES.OTHER_CURRENCIES.filter(
    (item) => item.code.toLowerCase().includes(searchTerm.toLowerCase()) || item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCurr = GLOBAL_RATES.OTHER_CURRENCIES.find((c) => c.code === selectedCurrencyCode) || GLOBAL_RATES.OTHER_CURRENCIES[0];

  const calculateConverted = () => {
    if (!calcAmount || isNaN(calcAmount)) return 0;
    if (calcDirection === 'foreignToIdr') {
      const perUnitMultiplier = selectedCurr.code === 'JPY' ? 0.01 : 1;
      return calcAmount * selectedCurr.rate * perUnitMultiplier;
    } else {
      const perUnitMultiplier = selectedCurr.code === 'JPY' ? 100 : 1;
      return (calcAmount / selectedCurr.rate) * perUnitMultiplier;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-neo-purple overflow-hidden">
        <div className="p-5 border-b border-purple-500/20 flex items-center justify-between bg-[#1a0f30]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-400 text-white font-orbitron font-bold shadow-neo-purple"><Globe className="w-6 h-6" /></div>
            <div>
              <div className="flex items-center gap-2"><span className="text-[10px] font-orbitron font-bold text-purple-300 uppercase tracking-widest bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded">MONETARY RATES</span><span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> LIVE FEED</span></div>
              <h2 className="text-lg font-orbitron font-black text-neon-purple tracking-wide mt-0.5 uppercase tracking-tighter">Kurs Dunia vs IDR</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} className="p-2.5 rounded-xl bg-[#24133d] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all"><RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /></button>
            <button onClick={onClose} className="p-2.5 rounded-xl bg-[#24133d] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="bg-[#1a0f30] border border-purple-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-neo-purple">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider"><Calculator className="w-4 h-4" /><span>Kalkulator Konversi Real-time</span></div><button onClick={() => setCalcDirection(calcDirection === 'foreignToIdr' ? 'idrToForeign' : 'foreignToIdr')} className="text-xs font-orbitron font-bold text-purple-300 hover:text-white bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"><ArrowRightLeft className="w-3.5 h-3.5" /><span>{calcDirection === 'foreignToIdr' ? `${selectedCurr.code} ➔ IDR` : `IDR ➔ ${selectedCurr.code}`}</span></button></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div><label className="text-[11px] font-orbitron font-bold text-purple-400/80 block mb-1">Mata Uang:</label><select value={selectedCurrencyCode} onChange={(e) => setSelectedCurrencyCode(e.target.value)} className="w-full bg-[#130b20] border border-purple-500/30 text-purple-100 font-orbitron text-xs rounded-xl p-2.5 focus:outline-none">{GLOBAL_RATES.OTHER_CURRENCIES.map(c => <option key={c.code} value={c.code} className="bg-slate-950">{c.flag} {c.code} - {c.name}</option>)}</select></div>
              <div><label className="text-[11px] font-orbitron font-bold text-purple-400/80 block mb-1">Nominal:</label><input type="number" value={calcAmount} onChange={(e) => setCalcAmount(parseFloat(e.target.value) || 0)} className="w-full bg-[#130b20] border border-purple-500/30 text-purple-100 font-mono text-sm font-bold rounded-xl p-2.5 focus:outline-none" /></div>
              <div className="bg-[#130b20] border border-emerald-500/30 p-3 rounded-xl"><p className="text-[10px] font-orbitron font-bold text-emerald-400/80 uppercase">Hasil Konversi</p><p className="text-lg font-mono font-black text-emerald-400">{calcDirection === 'foreignToIdr' ? formatRupiah(calculateConverted()) : `${calculateConverted().toLocaleString('id-ID')} ${selectedCurr.code}`}</p><p className="text-[10px] font-rajdhani text-purple-200/60 mt-0.5">1 {selectedCurr.code} = {formatRupiah(selectedCurr.rate)}</p></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredRates.map((item) => (
              <div key={item.code} onClick={() => setSelectedCurrencyCode(item.code)} className={`bg-[#1a0f30] border rounded-2xl p-4 space-y-3 shadow-neo-purple hover:border-purple-400 transition-all cursor-pointer ${selectedCurrencyCode === item.code ? 'border-purple-400 ring-1 ring-purple-400/50 bg-[#24133d]' : 'border-purple-500/25'}`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{item.flag}</span>
                  <div><h4 className="font-orbitron font-black text-sm text-purple-100 uppercase tracking-tight">1 {item.code}</h4><p className="text-[10px] font-rajdhani font-semibold text-purple-200/70 truncate">{item.name}</p></div>
                </div>
                <div className="bg-[#130b20] p-3 rounded-xl border border-purple-500/15 text-center"><p className="text-[10px] font-orbitron text-purple-400/70 uppercase">IDR Kurs Tengah</p><p className="font-mono font-black text-purple-200 text-sm">{formatRupiah(item.rate)}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-purple-500/20 bg-[#1a0f30] text-center"><button onClick={onClose} className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-orbitron font-bold text-xs px-8 py-2 rounded-xl shadow-neo-purple">Tutup Live Rates</button></div>
      </div>
    </div>
  );
}
