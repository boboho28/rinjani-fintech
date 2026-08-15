import React, { useState, useEffect } from 'react';
import { X, ArrowDownCircle, Wallet, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Investment, AccountType } from '../types';
import { formatRupiah, formatPercent, formatThousands, parseThousands } from '../utils/formatters';

interface SellInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSell: (
    investmentId: string,
    sellData: {
      sharesToSell: number;
      sellPrice: number;
      destinationAccount?: AccountType;
      depositToJournal: boolean;
      sellDate: string;
      notes?: string;
    }
  ) => void;
  investments: Investment[];
  preSelectedInvestmentId?: string;
}

export const SellInvestmentModal: React.FC<SellInvestmentModalProps> = ({
  isOpen,
  onClose,
  onSell,
  investments,
  preSelectedInvestmentId
}) => {
  const [selectedInvId, setSelectedInvId] = useState<string>('');
  const [sharesToSell, setSharesToSell] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [depositToJournal, setDepositToJournal] = useState<boolean>(true);
  const [destinationAccount, setDestinationAccount] = useState<AccountType>('Bank BCA');
  const [sellDate, setSellDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState<string>('');

  const activeInvestment = investments.find((i) => i.id === selectedInvId) || investments[0] || null;

  useEffect(() => {
    if (isOpen) {
      if (preSelectedInvestmentId && investments.some((i) => i.id === preSelectedInvestmentId)) {
        setSelectedInvId(preSelectedInvestmentId);
      } else if (investments.length > 0) {
        setSelectedInvId(investments[0].id);
      }
    }
  }, [isOpen, preSelectedInvestmentId, investments]);

  useEffect(() => {
    if (activeInvestment) {
      setSellPrice(activeInvestment.currentPrice || activeInvestment.buyPrice || 0);
      setSharesToSell(activeInvestment.shares); // default to sell all
      setNotes(`Take profit / jual aset ${activeInvestment.symbol}`);
    }
  }, [activeInvestment?.id]);

  if (!isOpen) return null;

  if (investments.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#140b22] border border-purple-500/40 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-[0_0_50px_rgba(168,85,247,0.3)] text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 mx-auto flex items-center justify-center text-purple-300">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="font-orbitron font-bold text-base text-white">Belum Ada Aset untuk Dijual</h3>
          <p className="text-xs text-purple-200/70">
            Anda belum memiliki portofolio investasi aktif. Silakan tambahkan atau beli aset terlebih dahulu.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1e0f38] hover:bg-[#28134d] text-purple-200 rounded-xl text-xs font-orbitron font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const unitLabel = activeInvestment
    ? activeInvestment.assetType === 'Saham'
      ? 'Lembar'
      : activeInvestment.assetType === 'Emas'
      ? 'Gram'
      : 'Unit'
    : 'Unit';

  const totalShares = activeInvestment?.shares || 0;
  const avgBuyPrice = activeInvestment?.buyPrice || 0;

  // Calculations
  const validSharesToSell = Math.min(Math.max(sharesToSell, 0), totalShares);
  const totalProceeds = validSharesToSell * sellPrice; // Gross withdrawal amount
  const modalCostSold = validSharesToSell * avgBuyPrice;
  const realizedPnL = totalProceeds - modalCostSold;
  const pnlPercent = modalCostSold > 0 ? (realizedPnL / modalCostSold) * 100 : 0;
  const isGain = realizedPnL >= 0;
  const remainingSharesAfterSell = Math.max(0, totalShares - validSharesToSell);

  const handleQuickPercent = (pct: number) => {
    if (!activeInvestment) return;
    const calc = (activeInvestment.shares * pct) / 100;
    // For stocks, round to integer if needed, else exact
    setSharesToSell(activeInvestment.assetType === 'Saham' ? Math.round(calc) : Number(calc.toFixed(4)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvestment || validSharesToSell <= 0 || sellPrice <= 0) return;

    onSell(activeInvestment.id, {
      sharesToSell: validSharesToSell,
      sellPrice,
      depositToJournal,
      destinationAccount,
      sellDate,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#12081f] border border-purple-500/40 rounded-3xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-[0_0_50px_rgba(217,70,239,0.3)] relative my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/20 to-fuchsia-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-orbitron font-black text-base sm:text-lg text-white tracking-wide flex items-center gap-2">
                <span>Jual / Tarik Aset Investasi</span>
              </h3>
              <p className="text-[11px] text-purple-300/70 font-rajdhani font-semibold">
                Cairkan dana aset langsung masuk ke rekening bank pilihan Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-purple-400 hover:text-white hover:bg-purple-900/40 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Asset Selection */}
          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300 block mb-1.5">
              Pilih Aset yang Ingin Dijual <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedInvId}
              onChange={(e) => setSelectedInvId(e.target.value)}
              className="w-full bg-[#180e30] border border-purple-500/40 text-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-orbitron font-bold focus:outline-none focus:border-fuchsia-400 cursor-pointer shadow-inner"
            >
              {investments.map((inv) => (
                <option key={inv.id} value={inv.id} className="bg-[#12081f]">
                  {inv.symbol} - {inv.name} ({inv.shares.toLocaleString('id-ID')} {inv.assetType === 'Saham' ? 'Lembar' : 'Unit'} | Nilai: {formatRupiah(inv.currentPrice * inv.shares)})
                </option>
              ))}
            </select>
          </div>

          {/* Current Holding Banner */}
          {activeInvestment && (
            <div className="bg-[#180d2e]/80 border border-purple-500/25 rounded-2xl p-3.5 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[9px] font-orbitron text-purple-400/80 uppercase">Total Dimiliki</p>
                <p className="text-xs font-mono font-bold text-purple-100 mt-0.5">
                  {totalShares.toLocaleString('id-ID')} {unitLabel}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-orbitron text-purple-400/80 uppercase">Modal Rata2 (AVG)</p>
                <p className="text-xs font-mono font-bold text-purple-200 mt-0.5">
                  {formatRupiah(avgBuyPrice)}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-orbitron text-purple-400/80 uppercase">Harga Pasar</p>
                <p className="text-xs font-mono font-bold text-fuchsia-300 mt-0.5">
                  {formatRupiah(activeInvestment.currentPrice)}
                </p>
              </div>
            </div>
          )}

          {/* Shares to Sell & Quick Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-orbitron font-bold text-purple-300">
                Jumlah yang Dijual ({unitLabel}) <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-1">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleQuickPercent(pct)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-orbitron font-bold border transition-all cursor-pointer ${
                      sharesToSell === (totalShares * pct) / 100 || (pct === 100 && sharesToSell === totalShares)
                        ? 'bg-fuchsia-600 text-white border-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.5)]'
                        : 'bg-[#1a0e30] text-purple-300 border-purple-500/30 hover:border-purple-400'
                    }`}
                  >
                    {pct === 100 ? 'Semua (100%)' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              inputMode="numeric"
              placeholder={`Contoh: ${totalShares}`}
              value={sharesToSell > 0 ? formatThousands(sharesToSell) : ''}
              onChange={(e) => setSharesToSell(parseThousands(e.target.value))}
              className="w-full bg-[#180e30] border border-purple-500/40 text-purple-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-fuchsia-400 font-mono font-bold"
              required
            />

            <p className="text-[10px] text-purple-300/70 font-mono flex justify-between">
              <span>Menjual: {validSharesToSell.toLocaleString('id-ID')} {unitLabel}</span>
              <span>Sisa di Portofolio: {remainingSharesAfterSell.toLocaleString('id-ID')} {unitLabel}</span>
            </p>
          </div>

          {/* Sell Price per Unit */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-orbitron font-bold text-purple-300">
                Harga Jual Satuan (Rp) <span className="text-rose-400">*</span>
              </label>
              {sellPrice > 0 && (
                <span className="text-[11px] font-mono font-bold text-fuchsia-300">
                  {formatRupiah(sellPrice)}
                </span>
              )}
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Harga jual per unit"
              value={sellPrice > 0 ? formatThousands(sellPrice) : ''}
              onChange={(e) => setSellPrice(parseThousands(e.target.value))}
              className="w-full bg-[#180e30] border border-purple-500/40 text-purple-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-fuchsia-400 font-mono font-bold"
              required
            />
          </div>

          {/* Live Realized Profit/Loss Breakdown Box */}
          <div className="bg-gradient-to-br from-[#1b0c30] to-[#120724] border border-fuchsia-500/30 rounded-2xl p-4 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
              <span className="text-xs font-orbitron font-bold text-purple-200">TOTAL DANA CAIR / HASIL JUAL:</span>
              <span className="text-base font-orbitron font-black text-white drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]">
                {formatRupiah(totalProceeds)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="text-purple-300/80">
                <span>Modal Terjual:</span>
                <p className="font-bold text-purple-200">{formatRupiah(modalCostSold)}</p>
              </div>
              <div className="text-right">
                <span className="text-purple-300/80">Realisasi Profit / Loss:</span>
                <p className={`font-bold flex items-center justify-end gap-1 ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isGain ? '+' : ''}{formatRupiah(realizedPnL)} ({formatPercent(pnlPercent)})
                </p>
              </div>
            </div>
          </div>

          {/* Withdrawal to Bank Account Section */}
          <div className="bg-[#170c2e] border border-purple-500/30 rounded-2xl p-3.5 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={depositToJournal}
                onChange={(e) => setDepositToJournal(e.target.checked)}
                className="w-4 h-4 rounded text-fuchsia-600 bg-purple-900 border-purple-500 focus:ring-0 cursor-pointer accent-fuchsia-500"
              />
              <div className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-orbitron font-bold text-purple-100">
                  Tarik / Masukkan Hasil Penjualan ke Rekening Bank
                </span>
              </div>
            </label>

            {depositToJournal && (
              <div className="space-y-2.5 pt-1 border-t border-purple-500/20">
                <div>
                  <label className="text-[11px] font-orbitron font-bold text-purple-300 block mb-1">
                    Pilih Rekening Tujuan Penarikan (Withdraw) <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={destinationAccount}
                    onChange={(e) => setDestinationAccount(e.target.value as AccountType)}
                    className="w-full bg-[#1e0f38] border border-emerald-500/40 text-emerald-300 rounded-xl px-3.5 py-2 text-xs font-orbitron font-bold focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="Bank BCA">Bank BCA</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                    <option value="Bank BRI">Bank BRI</option>
                    <option value="Bank BNI">Bank BNI</option>
                    <option value="SeaBank">SeaBank</option>
                    <option value="Rekening Investasi">Rekening Investasi / RDN</option>
                    <option value="Kas / Tunai">Kas / Tunai</option>
                    <option value="E-Wallet (GoPay/OVO/DANA)">E-Wallet (GoPay/OVO/DANA)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-orbitron font-bold text-purple-300/80 block mb-1">
                      Tanggal Penjualan
                    </label>
                    <input
                      type="date"
                      value={sellDate}
                      onChange={(e) => setSellDate(e.target.value)}
                      className="w-full bg-[#1e0f38] border border-purple-500/30 text-purple-200 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-orbitron font-bold text-purple-300/80 block mb-1">
                      Catatan (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: TP 100% BTC"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-[#1e0f38] border border-purple-500/30 text-purple-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-emerald-400/90 font-mono flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Saldo <b>{destinationAccount}</b> akan otomatis bertambah sebesar <b>{formatRupiah(totalProceeds)}</b></span>
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-purple-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1d1038] text-purple-300 hover:text-white text-xs font-orbitron font-bold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={validSharesToSell <= 0 || sellPrice <= 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-fuchsia-600 to-purple-600 hover:from-rose-500 hover:via-fuchsia-500 hover:to-purple-500 text-white text-xs font-orbitron font-black shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>Konfirmasi Jual & Cairkan Dana</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
