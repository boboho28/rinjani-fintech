import React, { useState, useEffect } from 'react';
import { X, Save, CandlestickChart, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { TradingJournalItem, TradingPair, TradingType, TradingStrategy, TradingResultStatus, AccountType } from '../types';
import { formatRupiah } from '../utils/formatters';

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
  
  // USD and Kurs state
  const [profitUSDInput, setProfitUSDInput] = useState<number>(100.00);
  const [exchangeRate, setExchangeRate] = useState<number>(16280);
  const [profitAmountInput, setProfitAmountInput] = useState<number>(1628000);

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

      const rate = editingTrading.exchangeRateUSD || 16280;
      setExchangeRate(rate);

      const usdVal = editingTrading.profitUSD !== undefined 
        ? Math.abs(editingTrading.profitUSD)
        : Math.abs(editingTrading.profitAmount) / rate;
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
      setExchangeRate(16280);
      setProfitAmountInput(1628000);
      setBroker('Exness Broker (PRO Account)');
      setStrategy('SMC / ICT Concept');
      setAccount('Bank BCA');
      setStatus('TP (Take Profit)');
      setDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
  }, [editingTrading, isOpen]);

  // Sync USD & Rate to IDR automatically
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

    onSave(
      {
        title: title || `${action} ${pair} - ${strategy}`,
        pair,
        action,
        lotSize,
        entryPrice,
        exitPrice,
        profitPips: finalPips,
        profitUSD: finalUSD,
        exchangeRateUSD: exchangeRate,
        profitAmount: finalProfitAmount,
        type,
        broker,
        strategy,
        account,
        status,
        date,
        isClaimedToJournal: editingTrading?.isClaimedToJournal ?? false,
        notes,
      },
      editingTrading?.id
    );

    onClose();
  };

  const pairsList: TradingPair[] = [
    'XAUUSD (GOLD)',
    'EURUSD',
    'GBPUSD',
    'USDJPY',
    'BTCUSD',
    'ETHUSD',
    'US30',
    'NAS100',
    'AUDUSD',
    'USDCAD',
    'Lainnya',
  ];

  const strategiesList: TradingStrategy[] = [
    'SMC / ICT Concept',
    'Scalping',
    'Day Trading',
    'Swing Trading',
    'Breakout / Retest',
    'News Trading / NFP',
    'Price Action',
  ];

  const statusesList: TradingResultStatus[] = [
    'TP (Take Profit)',
    'SL (Stop Loss)',
    'Cut Profit',
    'Cut Loss',
  ];

  const accountsList: AccountType[] = [
    'Bank BCA',
    'Bank Mandiri',
    'Bank BRI',
    'Bank BNI',
    'SeaBank',
    'E-Wallet (GoPay/OVO/DANA)',
    'Rekening Investasi',
    'Kas / Tunai',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-neo-purple my-8">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <h3 className="font-orbitron font-bold text-base text-purple-200 tracking-wide flex items-center gap-2">
            <CandlestickChart className="w-5 h-5 text-purple-400" />
            <span>{editingTrading ? 'Edit Catatan Trading' : 'Catat Profit / Loss Trading Baru'}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-purple-500/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Result Type selector (Profit vs Loss) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setType('profit');
                setStatus('TP (Take Profit)');
              }}
              className={`py-2.5 px-3 rounded-xl border font-orbitron font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                type === 'profit'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-[#1a0f30] text-slate-400 border-purple-500/20 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>PROFIT (UNTUNG)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('loss');
                setStatus('SL (Stop Loss)');
              }}
              className={`py-2.5 px-3 rounded-xl border font-orbitron font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                type === 'loss'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : 'bg-[#1a0f30] text-slate-400 border-purple-500/20 hover:text-white'
              }`}
            >
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>LOSS (RUGI)</span>
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-orbitron text-purple-400/80 mb-1">
              Judul / Setup Trade
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Scalping Gold M15 Order Block FVG"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Pair & Action (BUY/SELL) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-orbitron text-purple-400/80 mb-1">
                Pair / Instrument
              </label>
              <select
                value={pair}
                onChange={(e) => setPair(e.target.value as TradingPair)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-purple-200 focus:outline-none focus:border-purple-400 font-mono"
              >
                {pairsList.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-orbitron text-purple-400/80 mb-1">
                Posisi (Action)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAction('BUY')}
                  className={`py-2 rounded-xl border font-orbitron font-bold text-xs ${
                    action === 'BUY'
                      ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400'
                      : 'bg-[#1a0f30] text-slate-400 border-purple-500/20'
                  }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setAction('SELL')}
                  className={`py-2 rounded-xl border font-orbitron font-bold text-xs ${
                    action === 'SELL'
                      ? 'bg-rose-500/30 text-rose-300 border-rose-400'
                      : 'bg-[#1a0f30] text-slate-400 border-purple-500/20'
                  }`}
                >
                  SELL
                </button>
              </div>
            </div>
          </div>

          {/* Lot Size */}
          <div>
            <label className="block text-xs font-orbitron text-purple-400/80 mb-1">
              Ukuran Lot (Lot Size)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={lotSize}
              onChange={(e) => setLotSize(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* USD Profit/Loss & Kurs Conversion Block */}
          <div className="bg-[#180e2b] border border-purple-500/30 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs font-orbitron text-purple-300 font-bold border-b border-purple-500/20 pb-2">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>KONVERSI HASIL TRADING (USD ➔ IDR)</span>
              </span>
              <span className="text-[10px] text-purple-400/70 font-mono">1 USD = Rp {exchangeRate.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* USD Input */}
              <div>
                <label className="block text-[10px] font-orbitron text-purple-400/80 mb-1">
                  Nominal USD ($)
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-emerald-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={profitUSDInput}
                    onChange={(e) => handleUSDChange(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#1a0f30] border border-emerald-500/40 rounded-xl pl-6 pr-2 py-2 text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Kurs Input */}
              <div>
                <label className="block text-[10px] font-orbitron text-purple-400/80 mb-1">
                  Kurs USD (IDR)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={exchangeRate}
                  onChange={(e) => handleRateChange(parseFloat(e.target.value) || 16000)}
                  className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-2.5 py-2 text-xs font-mono text-purple-200 focus:outline-none focus:border-purple-400"
                />
              </div>

              {/* Hasil IDR Input */}
              <div>
                <label className="block text-[10px] font-orbitron text-purple-400/80 mb-1">
                  Hasil Rupiah (IDR)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={profitAmountInput}
                  onChange={(e) => handleIDRChange(parseFloat(e.target.value) || 0)}
                  className={`w-full bg-[#1a0f30] border rounded-xl px-2.5 py-2 text-xs font-mono font-bold focus:outline-none ${
                    type === 'profit'
                      ? 'border-emerald-500/40 text-emerald-400'
                      : 'border-rose-500/40 text-rose-400'
                  }`}
                />
              </div>
            </div>

            <div className="bg-[#1d1136] p-2 rounded-lg text-center text-xs font-mono">
              <span className="text-purple-400/80">Est. Total: </span>
              <span className={type === 'profit' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {type === 'profit' ? '+' : '-'}${profitUSDInput.toFixed(2)} USD = {type === 'profit' ? '+' : '-'}{formatRupiah(profitAmountInput)}
              </span>
            </div>
          </div>

          {/* Entry Price, Exit Price & Pips */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-orbitron text-purple-400/80 mb-1">
                Harga Entry
              </label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-orbitron text-purple-400/80 mb-1">
                Harga Exit
              </label>
              <input
                type="number"
                step="any"
                value={exitPrice}
                onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-orbitron text-purple-400/80 mb-1">
                Profit Pips
              </label>
              <input
                type="number"
                step="any"
                value={profitPips}
                onChange={(e) => setProfitPips(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-2.5 py-2 text-xs text-emerald-300 font-mono focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Strategy & Result Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-orbitron text-purple-400/80 mb-1">
                Strategi Trading
              </label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as TradingStrategy)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-purple-200 focus:outline-none focus:border-purple-400"
              >
                {strategiesList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-orbitron text-purple-400/80 mb-1">
                Status Target
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TradingResultStatus)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-purple-200 focus:outline-none focus:border-purple-400"
              >
                {statusesList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Broker Name & Account Penampungan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-orbitron text-purple-400/80 mb-1">
                Nama Broker Forex / Exchange
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Exness, XM, HFM"
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-orbitron text-purple-400/80 mb-1">
                Rekening Penampungan Profit
              </label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value as AccountType)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-purple-200 focus:outline-none focus:border-purple-400"
              >
                {accountsList.map((acc) => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-orbitron text-purple-400/80 mb-1">
              Tanggal Transaksi
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-orbitron text-purple-400/80 mb-1">
              Catatan Evaluasi / Emosi / Konfirmasi Indicator
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Disiplin Stop Loss, ikuti rilis berita NFP..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-purple-500/30 text-purple-200/80 hover:text-white text-xs font-orbitron font-bold transition-colors"
            >
              BATAL
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-black text-xs flex items-center gap-2 shadow-neo-purple transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-white" />
              <span>SIMPAN CATATAN TRADING</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
