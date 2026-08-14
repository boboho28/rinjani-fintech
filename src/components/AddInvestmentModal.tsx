import React, { useState, useEffect } from 'react';
import { X, Save, TrendingUp, Info } from 'lucide-react';
import { Investment, AssetType } from '../types';

interface AddInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (inv: Omit<Investment, 'id'>, editId?: string) => void;
  editingInvestment?: Investment | null;
}

export const AddInvestmentModal: React.FC<AddInvestmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingInvestment,
}) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('Saham');
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [shares, setShares] = useState<number>(0);
  const [buyDate, setBuyDate] = useState(new Date().toISOString().slice(0, 10));
  const [platform, setPlatform] = useState('Ajaib Sekuritas');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingInvestment) {
      setName(editingInvestment.name);
      setSymbol(editingInvestment.symbol);
      setAssetType(editingInvestment.assetType);
      setBuyPrice(editingInvestment.buyPrice);
      setCurrentPrice(editingInvestment.currentPrice);
      setShares(editingInvestment.shares);
      setBuyDate(editingInvestment.buyDate);
      setPlatform(editingInvestment.platform);
      setNotes(editingInvestment.notes || '');
    } else {
      setName('');
      setSymbol('');
      setAssetType('Saham');
      setBuyPrice(0);
      setCurrentPrice(0);
      setShares(0);
      setBuyDate(new Date().toISOString().slice(0, 10));
      setPlatform('Ajaib Sekuritas');
      setNotes('');
    }
  }, [editingInvestment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol || buyPrice <= 0 || shares <= 0) return;

    onSave(
      {
        name,
        symbol: symbol.toUpperCase().trim(),
        assetType,
        buyPrice,
        currentPrice: currentPrice || buyPrice,
        shares,
        buyDate,
        platform,
        notes,
      },
      editingInvestment?.id
    );

    onClose();
  };

  const assetTypes: AssetType[] = ['Saham', 'Reksadana', 'Emas', 'Crypto', 'Obligasi / SBN'];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-neo-purple">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <h3 className="font-orbitron font-bold text-base text-purple-200 tracking-wide flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span>{editingInvestment ? 'Edit Transaksi Aset' : 'Input Transaksi / Beli Baru'}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-500/10 transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex items-start gap-2.5">
           <Info className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
           <p className="text-[10px] text-purple-200 font-rajdhani font-semibold italic">
             Jika Anda menginput <strong>Kode Simbol</strong> yang sudah ada, data akan otomatis digabungkan ke box aset tersebut sebagai histori baru.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Kode Ticker / Simbol</label>
              <input
                type="text"
                placeholder="CONTOH: BTC, BBCA, ANTAM"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-300 placeholder-purple-200/30 rounded-xl px-3 py-2 text-xs uppercase focus:outline-none focus:border-purple-400 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Tipe Asset</label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400"
              >
                {assetTypes.map((t) => (
                  <option key={t} value={t} className="bg-[#1a0f30] text-purple-100">{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Nama Lengkap Asset / Perusahaan</label>
            <input
              type="text"
              placeholder="Contoh: Bitcoin / Bank BCA / Emas Logam Mulia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-white placeholder-purple-200/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Harga Beli Saat Ini (Rp)</label>
              <input
                type="number"
                placeholder="0"
                value={buyPrice || ''}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Prakiraan Harga Jual (Rp)</label>
              <input
                type="number"
                placeholder="Target Exit"
                value={currentPrice || ''}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Jumlah {assetType === 'Saham' ? 'Lot' : 'Unit'}</label>
              <input
                type="number"
                step="0.00000001"
                placeholder="0"
                value={shares || ''}
                onChange={(e) => setShares(Number(e.target.value))}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Platform Sekuritas/Aplikasi</label>
              <input
                type="text"
                placeholder="Ajaib / Indodax / Tokocrypto"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-white placeholder-purple-200/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Catatan Alasan Pembelian (Analysis)</label>
            <textarea
              rows={3}
              placeholder="Contoh: Analisis Elliot Wave atau RSI Oversold di H4..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-white placeholder-purple-200/30 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1a0f30] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-orbitron font-bold cursor-pointer transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs flex items-center gap-1.5 shadow-neo-purple cursor-pointer transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Portofolio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
