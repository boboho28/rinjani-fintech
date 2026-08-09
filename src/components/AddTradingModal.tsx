import React, { useState, useEffect } from 'react';
import { X, Save, CandlestickChart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { TradingJournalItem, TradingPair, TradingType, TradingStrategy, TradingResultStatus, AccountType } from '../types';
import { formatRupiah } from '../utils/formatters';
import { GLOBAL_RATES } from '../utils/rates';

interface AddTradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trading: Omit<TradingJournalItem, 'id'>, editId?: string) => void;
  editingTrading?: TradingJournalItem | null;
}

export const AddTradingModal: React.FC<AddTradingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTrading,
}) => {
  const [title, setTitle] = useState('');
  const [pair, setPair] = useState<TradingPair>('XAUUSD (GOLD)');
  const [action, setAction] = useState<'BUY' | 'SELL'>('BUY');
  const [type, setType] = useState<TradingType>('profit');
  const [lotSize, setLotSize] = useState<number>(0.10);
  const [entryPrice, setEntryPrice] = useState<number>(2400.00);
  const [exitPrice, setExitPrice] = useState<number>(2415.00);
  const [profitPips, setProfitPips] = useState<number>(150);
  
  // USD and Kurs state - Menggunakan Global Rates
  const [profitUSDInput, setProfitUSDInput] = useState<number>(100.00);
  const [exchangeRate, setExchangeRate] = useState<number>(GLOBAL_RATES.USD_IDR);
  const [profitAmountInput, setProfitAmountInput] = useState<number>(100 * GLOBAL_RATES.USD_IDR);

  const [broker, setBroker] = useState('Exness Broker (PRO Account)');
  const [strategy, setStrategy] = useState<TradingStrategy>('SMC / ICT Concept');
  const [account, setAccount] = useState<AccountType>('Bank BCA');
  const [status, setStatus] = useState<TradingResultStatus>('TP (Take Profit)');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingTrading) {
      setTitle(editingTrading.title);
      setPair(editingTrading.pair);
      setAction(editingTrading.action);
      setType(editingTrading.type);
      setLotSize(editingTrading.lotSize);
      setEntryPrice(editingTrading.entryPrice);
      setExitPrice(editingTrading.exitPrice);
      setProfitPips(editingTrading.profitPips);
      const rate = editingTrading.exchangeRateUSD || GLOBAL_RATES.USD_IDR;
      setExchangeRate(rate);
      const usdVal = editingTrading.profitUSD !== undefined ? Math.abs(editingTrading.profitUSD) : Math.abs(editingTrading.profitAmount) / rate;
      setProfitUSDInput(parseFloat(usdVal.toFixed(2)));
      setProfitAmountInput(Math.abs(editingTrading.profitAmount));
      setBroker(editingTrading.broker);
      setStrategy(editingTrading.strategy);
      setAccount(editingTrading.account);
      setStatus(editingTrading.status);
      setDate(editingTrading.date);
      setNotes(editingTrading.notes || '');
    } else {
      setTitle('');
      setPair('XAUUSD (GOLD)');
      setAction('BUY');
      setType('profit');
      setLotSize(0.10);
      setEntryPrice(2400.00);
      setExitPrice(2415.00);
      setProfitPips(150);
      setProfitUSDInput(100.00);
      setExchangeRate(GLOBAL_RATES.USD_IDR);
      setProfitAmountInput(100 * GLOBAL_RATES.USD_IDR);
      setBroker('Exness Broker (PRO Account)');
      setStrategy('SMC / ICT Concept');
      setAccount('Bank BCA');
      setStatus('TP (Take Profit)');
      setDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
  }, [editingTrading, isOpen]);

  const handleUSDChange = (usd: number) => {
    setProfitUSDInput(usd);
    setProfitAmountInput(Math.round(usd * exchangeRate));
  };

  const handleRateChange = (rate: number) => {
    setExchangeRate(rate);
    setProfitAmountInput(Math.round(profitUSDInput * rate));
  };

  const handleIDRChange = (idr: number) => {
    setProfitAmountInput(idr);
    if (exchangeRate > 0) {
      setProfitUSDInput(parseFloat((idr / exchangeRate).toFixed(2)));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUSD = type === 'profit' ? Math.abs(profitUSDInput) : -Math.abs(profitUSDInput);
    const finalProfitAmount = type === 'profit' ? Math.abs(profitAmountInput) : -Math.abs(profitAmountInput);
    const finalPips = type === 'profit' ? Math.abs(profitPips) : -Math.abs(profitPips);

    onSave({
      title: title || `${action} ${pair} - ${strategy}`,
      pair, action, lotSize, entryPrice, exitPrice,
      profitPips: finalPips, profitUSD: finalUSD, exchangeRateUSD: exchangeRate,
      profitAmount: finalProfitAmount, type, broker, strategy, account, status, date,
      isClaimedToJournal: editingTrading?.isClaimedToJournal ?? false, notes,
    }, editingTrading?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-neo-purple my-8">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <h3 className="font-orbitron font-bold text-base text-purple-200 tracking-wide flex items-center gap-2">
            <CandlestickChart className="w-5 h-5 text-purple-400" />
            <span>{editingTrading ? 'Edit Catatan Trading' : 'Catat Profit / Loss Trading Baru'}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-purple-500/10 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => { setType('profit'); setStatus('TP (Take Profit)'); }} className={`py-2.5 px-3 rounded-xl border font-orbitron font-bold text-xs flex items-center justify-center gap-2 transition-all ${type === 'profit' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-[#1a0f30] text-slate-400 border-purple-500/20'}`}><TrendingUp className="w-4 h-4" /><span>PROFIT</span></button>
            <button type="button" onClick={() => { setType('loss'); setStatus('SL (Stop Loss)'); }} className={`py-2.5 px-3 rounded-xl border font-orbitron font-bold text-xs flex items-center justify-center gap-2 transition-all ${type === 'loss' ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)]' : 'bg-[#1a0f30] text-slate-400 border-purple-500/20'}`}><TrendingDown className="w-4 h-4" /><span>LOSS</span></button>
          </div>

          <div>
            <label className="block text-xs font-orbitron text-purple-400/80 mb-1">Judul / Setup Trade</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-orbitron text-purple-400/80 mb-1">Pair</label>
              <select value={pair} onChange={(e) => setPair(e.target.value as TradingPair)} className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-purple-200 font-mono">{['XAUUSD (GOLD)', 'EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD', 'ETHUSD', 'US30', 'NAS100', 'AUDUSD', 'USDCAD', 'Lainnya'].map(p => <option key={p} value={p}>{p}</option>)}</select>
            </div>
            <div>
              <label className="block text-xs font-orbitron text-purple-400/80 mb-1">Posisi</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setAction('BUY')} className={`py-2 rounded-xl border font-orbitron font-bold text-xs ${action === 'BUY' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-[#1a0f30] text-slate-400'}`}>BUY</button>
                <button type="button" onClick={() => setAction('SELL')} className={`py-2 rounded-xl border font-orbitron font-bold text-xs ${action === 'SELL' ? 'bg-rose-500/30 text-rose-300' : 'bg-[#1a0f30] text-slate-400'}`}>SELL</button>
              </div>
            </div>
          </div>

          <div className="bg-[#180e2b] border border-purple-500/30 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs font-orbitron text-purple-300 font-bold border-b border-purple-500/20 pb-2">
              <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-emerald-400" /><span>KONVERSI HASIL TRADING (USD ➔ IDR)</span></span>
              <span className="text-[10px] text-purple-400/70 font-mono">Real-time: 1 USD = Rp {GLOBAL_RATES.USD_IDR.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <div><label className="block text-[10px] font-orbitron text-purple-400/80 mb-1">USD ($)</label><input type="number" step="0.01" value={profitUSDInput} onChange={(e) => handleUSDChange(parseFloat(e.target.value) || 0)} className="w-full bg-[#1a0f30] border border-emerald-500/40 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-emerald-300" /></div>
              <div><label className="block text-[10px] font-orbitron text-purple-400/80 mb-1">Kurs IDR</label><input type="number" value={exchangeRate} onChange={(e) => handleRateChange(parseFloat(e.target.value) || 16000)} className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-2.5 py-2 text-xs font-mono text-purple-200" /></div>
              <div><label className="block text-[10px] font-orbitron text-purple-400/80 mb-1">Hasil (IDR)</label><input type="number" value={profitAmountInput} onChange={(e) => handleIDRChange(parseFloat(e.target.value) || 0)} className={`w-full bg-[#1a0f30] border rounded-xl px-2.5 py-2 text-xs font-mono font-bold ${type === 'profit' ? 'text-emerald-400 border-emerald-500/40' : 'text-rose-400 border-rose-500/40'}`} /></div>
            </div>
            <div className="bg-[#1d1136] p-2 rounded-lg text-center text-xs font-mono"><span className={type === 'profit' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{type === 'profit' ? '+' : '-'}${profitUSDInput.toFixed(2)} USD = {type === 'profit' ? '+' : '-'}{formatRupiah(profitAmountInput)}</span></div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 text-xs">
            <div><label className="block text-[10px] font-orbitron text-purple-400/80 mb-1">Entry</label><input type="number" step="any" value={entryPrice} onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)} className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-2.5 py-2 text-white font-mono" /></div>
            <div><label className="block text-[10px] font-orbitron text-purple-400/80 mb-1">Exit</label><input type="number" step="any" value={exitPrice} onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)} className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-2.5 py-2 text-white font-mono" /></div>
            <div><label className="block text-[10px] font-orbitron text-purple-400/80 mb-1">Pips</label><input type="number" value={profitPips} onChange={(e) => setProfitPips(parseFloat(e.target.value) || 0)} className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-2.5 py-2 text-emerald-300 font-mono" /></div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-purple-500/30 text-purple-200/80 text-xs font-orbitron">BATAL</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white font-orbitron font-black text-xs flex items-center gap-2 shadow-neo-purple"><Save className="w-4 h-4" /><span>SIMPAN</span></button>
          </div>
        </form>
      </div>
    </div>
  );
};
