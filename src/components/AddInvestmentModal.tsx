import React, { useState, useEffect } from 'react';
import { X, Save, TrendingUp, Wallet, CheckCircle2, RefreshCw, Calendar, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { Investment, AssetType, AccountType } from '../types';
import { formatRupiah, formatThousands, parseThousands } from '../utils/formatters';

interface AddInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    invData: Omit<Investment, 'id'>, 
    options?: { 
      editId?: string; 
      deductFromAccount?: AccountType; 
      deductAmount?: number;
      isNewPurchaseOnExisting?: boolean;
    }
  ) => void;
  editingInvestment?: Investment | null;
  existingInvestments?: Investment[];
  preSelectedSymbol?: string;
}

const ACCOUNT_OPTIONS: AccountType[] = [
  'Rekening Investasi',
  'Bank BCA',
  'Bank Mandiri',
  'Bank BRI',
  'Bank BNI',
  'SeaBank',
  'E-Wallet (GoPay/OVO/DANA)',
  'Kas / Tunai'
];

const POPULAR_PLATFORMS = [
  'Ajaib Sekuritas',
  'Bibit Reksadana',
  'Indodax',
  'Stockbit Sekuritas',
  'Tokocrypto',
  'Pegadaian Digital',
  'BCA Sekuritas',
  'Mandiri Sekuritas',
  'IPOT / Indo Premier',
  'Pluang'
];

export const AddInvestmentModal: React.FC<AddInvestmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingInvestment,
  existingInvestments = [],
  preSelectedSymbol = ''
}) => {
  const [selectedExistingId, setSelectedExistingId] = useState<string>('');
  const [isNewAsset, setIsNewAsset] = useState<boolean>(true);

  // Form Fields
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('Saham');
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [shares, setShares] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [buyDate, setBuyDate] = useState(new Date().toISOString().slice(0, 10));
  const [platform, setPlatform] = useState('Ajaib Sekuritas');
  const [notes, setNotes] = useState('');

  // Cash Integration
  const [linkToCash, setLinkToCash] = useState<boolean>(true);
  const [selectedAccount, setSelectedAccount] = useState<AccountType>('Rekening Investasi');

  // Load / Pre-fill state
  useEffect(() => {
    if (editingInvestment) {
      setIsNewAsset(false);
      setSelectedExistingId(editingInvestment.id);
      setName(editingInvestment.name);
      setSymbol(editingInvestment.symbol);
      setAssetType(editingInvestment.assetType);
      setBuyPrice(editingInvestment.buyPrice);
      setCurrentPrice(editingInvestment.currentPrice);
      setShares(editingInvestment.shares);
      setBuyDate(editingInvestment.buyDate || new Date().toISOString().slice(0, 10));
      setPlatform(editingInvestment.platform || 'Ajaib Sekuritas');
      setNotes(editingInvestment.notes || '');
      setLinkToCash(false);
    } else {
      // If preSelectedSymbol is passed (e.g. clicked "+ Beli Lagi" on a card)
      const existingMatch = existingInvestments.find(
        (inv) => inv.symbol.toUpperCase() === preSelectedSymbol.toUpperCase()
      );

      if (existingMatch) {
        setIsNewAsset(false);
        setSelectedExistingId(existingMatch.id);
        setSymbol(existingMatch.symbol);
        setName(existingMatch.name);
        setAssetType(existingMatch.assetType);
        setBuyPrice(existingMatch.currentPrice || existingMatch.buyPrice);
        setCurrentPrice(existingMatch.currentPrice);
        setShares(existingMatch.assetType === 'Saham' ? 100 : 1);
        setPlatform(existingMatch.platform);
        setBuyDate(new Date().toISOString().slice(0, 10));
        setNotes('');
        setLinkToCash(true);
      } else {
        setIsNewAsset(true);
        setSelectedExistingId('');
        setSymbol('');
        setName('');
        setAssetType('Saham');
        setBuyPrice(0);
        setCurrentPrice(0);
        setShares(0);
        setBuyDate(new Date().toISOString().slice(0, 10));
        setPlatform('Ajaib Sekuritas');
        setNotes('');
        setLinkToCash(true);
      }
    }
  }, [editingInvestment, isOpen, preSelectedSymbol, existingInvestments]);

  // Handle selecting an existing asset from quick picker
  const handleSelectExisting = (invId: string) => {
    setSelectedExistingId(invId);
    if (invId === 'NEW_CUSTOM') {
      setIsNewAsset(true);
      setSymbol('');
      setName('');
      setBuyPrice(0);
      setCurrentPrice(0);
      setShares(0);
      return;
    }

    const match = existingInvestments.find((i) => i.id === invId);
    if (match) {
      setIsNewAsset(false);
      setSymbol(match.symbol);
      setName(match.name);
      setAssetType(match.assetType);
      setBuyPrice(match.currentPrice || match.buyPrice);
      setCurrentPrice(match.currentPrice);
      setPlatform(match.platform);
      if (shares <= 0) setShares(match.assetType === 'Saham' ? 100 : 1);
    }
  };

  if (!isOpen) return null;

  const totalPurchaseCost = buyPrice * shares;

  // Find target asset for previewing Average Down calculation
  const targetExisting = existingInvestments.find(
    (inv) => inv.symbol.trim().toUpperCase() === symbol.trim().toUpperCase()
  );

  let newProjectedAvgPrice = buyPrice;
  let newProjectedShares = shares;
  if (targetExisting && !editingInvestment && shares > 0 && buyPrice > 0) {
    const currentTotalCost = targetExisting.buyPrice * targetExisting.shares;
    newProjectedShares = targetExisting.shares + shares;
    newProjectedAvgPrice = (currentTotalCost + totalPurchaseCost) / newProjectedShares;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || buyPrice <= 0 || shares <= 0) return;

    const finalName = name.trim() || symbol.toUpperCase();
    const finalSymbol = symbol.trim().toUpperCase();

    onSave(
      {
        name: finalName,
        symbol: finalSymbol,
        assetType,
        buyPrice,
        currentPrice: currentPrice || buyPrice,
        shares,
        buyDate,
        platform,
        notes,
      },
      {
        editId: editingInvestment?.id,
        deductFromAccount: linkToCash ? selectedAccount : undefined,
        deductAmount: linkToCash ? totalPurchaseCost : undefined,
        isNewPurchaseOnExisting: !!targetExisting && !editingInvestment
      }
    );

    onClose();
  };

  const assetTypes: AssetType[] = ['Saham', 'Reksadana', 'Emas', 'Crypto', 'Obligasi / SBN'];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-[0_0_50px_rgba(168,85,247,0.25)] my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-fuchsia-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-sm sm:text-base text-white tracking-wide">
                {editingInvestment ? 'Edit Asset Investasi' : 'Beli / Catat Transaksi Investasi'}
              </h3>
              <p className="text-[11px] text-purple-300/70 font-rajdhani font-semibold">
                Simpel, otomatis akumulasi di box yang sama & terhubung ke kas
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-500/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Quick Existing Asset Selector (If not in edit mode and has existing investments) */}
          {!editingInvestment && existingInvestments.length > 0 && (
            <div className="bg-[#0b0517] p-3 rounded-xl border border-purple-500/20 space-y-2">
              <label className="text-[10px] font-orbitron font-bold text-purple-300 uppercase tracking-wider flex items-center justify-between">
                <span>Pilih Aset Portofolio</span>
                <span className="text-[9px] text-fuchsia-400 font-mono">Beli aset sama = Auto Gabung Box</span>
              </label>
              
              <div className="flex flex-wrap gap-1.5">
                {existingInvestments.map((inv) => (
                  <button
                    key={inv.id}
                    type="button"
                    onClick={() => handleSelectExisting(inv.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedExistingId === inv.id && !isNewAsset
                        ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border border-fuchsia-400/60 shadow-[0_0_10px_rgba(217,70,239,0.4)]'
                        : 'bg-[#180e30] text-purple-200 hover:text-white border border-purple-500/30'
                    }`}
                  >
                    <span>{inv.symbol}</span>
                    <span className="text-[9px] opacity-75 font-mono">({inv.assetType})</span>
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={() => handleSelectExisting('NEW_CUSTOM')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition-all cursor-pointer ${
                    isNewAsset
                      ? 'bg-fuchsia-600/30 text-fuchsia-300 border border-fuchsia-400/50'
                      : 'bg-[#180e30] text-purple-400/80 hover:text-purple-200 border border-purple-500/20'
                  }`}
                >
                  + Aset Baru
                </button>
              </div>
            </div>
          )}

          {/* Asset Identification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300 block mb-1">
                Kode / Simbol Aset <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: BBCA, BTC, ANTAM"
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value);
                  // Check if matching existing
                  const found = existingInvestments.find(
                    (i) => i.symbol.toUpperCase() === e.target.value.trim().toUpperCase()
                  );
                  if (found) {
                    setName(found.name);
                    setAssetType(found.assetType);
                    setPlatform(found.platform);
                    setSelectedExistingId(found.id);
                    setIsNewAsset(false);
                  }
                }}
                className="w-full bg-[#180e30] border border-purple-500/30 text-white placeholder-purple-300/30 rounded-xl px-3.5 py-2.5 text-xs uppercase focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/50 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300 block mb-1">
                Tipe Aset
              </label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className="w-full bg-[#180e30] border border-purple-500/30 text-purple-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/50 font-medium"
              >
                {assetTypes.map((t) => (
                  <option key={t} value={t} className="bg-[#180e30] text-purple-100">{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300 block mb-1">
              Nama Lengkap Aset / Perusahaan
            </label>
            <input
              type="text"
              placeholder="Contoh: Bank Central Asia Tbk / Emas Antam 10g"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#180e30] border border-purple-500/30 text-white placeholder-purple-300/30 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/50"
            />
          </div>

          {/* Simple Numbers: Harga Beli, Jumlah Unit & Harga Saat Ini */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300 block mb-1">
                Harga Beli Satuan (Rp) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 10.250"
                value={buyPrice > 0 ? formatThousands(buyPrice) : ''}
                onChange={(e) => {
                  const val = parseThousands(e.target.value);
                  setBuyPrice(val);
                  if (!currentPrice || currentPrice === buyPrice) {
                    setCurrentPrice(val);
                  }
                }}
                className="w-full bg-[#180e30] border border-purple-500/30 text-purple-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/50 font-mono font-bold"
                required
              />
              <p className="text-[10px] text-purple-300/60 font-mono mt-0.5">
                {buyPrice > 0 ? formatRupiah(buyPrice) : 'Rp 0'}
              </p>
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300 block mb-1">
                Jumlah {assetType === 'Saham' ? 'Lembar (Lot x100)' : assetType === 'Emas' ? 'Gram' : 'Unit'} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 500"
                value={shares > 0 ? formatThousands(shares) : ''}
                onChange={(e) => setShares(parseThousands(e.target.value))}
                className="w-full bg-[#180e30] border border-purple-500/30 text-purple-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/50 font-mono font-bold"
                required
              />
              <p className="text-[10px] text-purple-300/60 font-mono mt-0.5">
                {shares > 0 ? `${formatThousands(shares)} ${assetType === 'Saham' ? `Lembar (${(shares / 100).toFixed(1)} Lot)` : 'Unit'}` : '0'}
              </p>
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-fuchsia-300 block mb-1 flex items-center justify-between">
                <span>Harga Saat Ini (Rp)</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 10.500"
                value={currentPrice > 0 ? formatThousands(currentPrice) : ''}
                onChange={(e) => setCurrentPrice(parseThousands(e.target.value))}
                className="w-full bg-[#180e30] border border-fuchsia-500/40 text-fuchsia-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 font-mono font-bold shadow-inner"
              />
              <p className="text-[10px] text-fuchsia-300/80 font-mono mt-0.5">
                {currentPrice > 0 ? formatRupiah(currentPrice) : (buyPrice > 0 ? formatRupiah(buyPrice) : 'Rp 0')}
              </p>
            </div>
          </div>

          {/* Highlighted Total Nominal Calculation Box */}
          <div className="bg-gradient-to-r from-[#1b0d35] via-[#241047] to-[#1b0d35] border border-fuchsia-500/30 rounded-xl p-3.5 space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-orbitron font-bold text-purple-300 uppercase tracking-wider">
                Total Nominal Pembelian:
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">
                {formatRupiah(totalPurchaseCost)}
              </span>
            </div>

            {/* If adding to existing box: show projected average price preview! */}
            {targetExisting && !editingInvestment && shares > 0 && (
              <div className="pt-2 border-t border-purple-500/20 flex flex-wrap items-center justify-between text-[11px] font-mono text-purple-200">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Auto-Gabung Box {targetExisting.symbol}
                </span>
                <span>
                  Harga Rata-Rata Baru:{' '}
                  <strong className="text-white font-black">{formatRupiah(newProjectedAvgPrice)}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Platform & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300 block mb-1">
                Platform / Sekuritas
              </label>
              <input
                type="text"
                list="platforms-list"
                placeholder="Ajaib, Bibit, Indodax, dll"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-[#180e30] border border-purple-500/30 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/50"
              />
              <datalist id="platforms-list">
                {POPULAR_PLATFORMS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300 block mb-1">
                Tanggal Pembelian
              </label>
              <input
                type="date"
                value={buyDate}
                onChange={(e) => setBuyDate(e.target.value)}
                className="w-full bg-[#180e30] border border-purple-500/30 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400/50 font-mono"
              />
            </div>
          </div>

          {/* Cash Account Integration Toggle */}
          {!editingInvestment && (
            <div className="bg-[#0f071d] border border-purple-500/25 rounded-xl p-3 space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-fuchsia-400" />
                  <div>
                    <p className="text-xs font-orbitron font-bold text-white">Hubungkan ke Jurnal Kas</p>
                    <p className="text-[10px] text-purple-300/70 font-rajdhani">
                      Otomatis catat pengeluaran kas sebesar {formatRupiah(totalPurchaseCost)}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={linkToCash}
                  onChange={(e) => setLinkToCash(e.target.checked)}
                  className="w-4 h-4 accent-fuchsia-500 cursor-pointer rounded"
                />
              </label>

              {linkToCash && (
                <div className="pt-2 border-t border-purple-500/15">
                  <label className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-wider block mb-1">
                    Pilih Rekening / Sumber Dana:
                  </label>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value as AccountType)}
                    className="w-full bg-[#180e30] border border-purple-500/30 text-purple-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-fuchsia-400 font-medium"
                  >
                    {ACCOUNT_OPTIONS.map((acc) => (
                      <option key={acc} value={acc} className="bg-[#180e30] text-purple-100">{acc}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Optional Notes */}
          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300 block mb-1">
              Catatan Pembelian <span className="text-[10px] text-purple-400/60 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Cicil rutin bulanan / Buy on weakness"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#180e30] border border-purple-500/30 text-white placeholder-purple-300/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-fuchsia-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-purple-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#180e30] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-orbitron font-bold cursor-pointer transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={buyPrice <= 0 || shares <= 0 || !symbol.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{editingInvestment ? 'Simpan Perubahan' : 'Simpan Pembelian'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

