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
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState(''); // Kita gunakan untuk label koin/aset
  const [assetType, setAssetType] = useState<AssetType>('Saham');
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [nominal, setNominal] = useState<number>(0); // Total IDR yang dikeluarkan
  const [platform, setPlatform] = useState('Ajaib Sekuritas');
  const [buyDate, setBuyDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingInvestment) {
      setSymbol(editingInvestment.symbol);
      setName(editingInvestment.name);
      setAssetType(editingInvestment.assetType);
      setBuyPrice(editingInvestment.buyPrice);
      setNominal(editingInvestment.buyPrice * editingInvestment.shares);
      setPlatform(editingInvestment.platform);
      setBuyDate(editingInvestment.buyDate);
      setNotes(editingInvestment.notes || '');
    } else {
      setSymbol('');
      setName('');
      setAssetType('Saham');
      setBuyPrice(0);
      setNominal(0);
      setPlatform('Ajaib Sekuritas');
      setBuyDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
  }, [editingInvestment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || buyPrice <= 0 || nominal <= 0) return;

    // Hitung shares otomatis: Nominal / Harga Beli
    const calculatedShares = nominal / buyPrice;

    onSave(
      {
        symbol: symbol.toUpperCase().trim(),
        name: name || symbol.toUpperCase(), // Default name ke simbol jika kosong
        assetType,
        buyPrice,
        currentPrice: buyPrice, // Default awal sama dengan beli
        shares: calculatedShares,
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
            <span>{editingInvestment ? 'Edit Transaksi' : 'Input Transaksi / Beli Baru'}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-purple-400 hover:text-white transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex items-start gap-2.5">
           <Info className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
           <p className="text-[10px] text-purple-200 font-rajdhani font-semibold">
             Simbol yang sama akan otomatis dikelompokkan ke dalam satu kotak aset.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-orbitron font-bold text-purple-400 block mb-1">Kode Ticker / Simbol</label>
              <input
                type="text"
                placeholder="CONTOH: BTC"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-300 rounded-xl px-3 py-2 text-xs uppercase focus:outline-none focus:border-purple-400 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-orbitron font-bold text-purple-400 block mb-1">Tipe Asset</label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400"
              >
                {assetTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-orbitron font-bold text-purple-400 block mb-1">Nama Aset (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Bitcoin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-orbitron font-bold text-purple-400 block mb-1">Harga Beli Per Unit (Rp)</label>
              <input
                type="number"
                value={buyPrice || ''}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-emerald-400 rounded-xl px-3 py-2 text-xs focus:outline-none border-emerald-500/30 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-orbitron font-bold text-purple-400 block mb-1">Nominal Pembelian (Rp)</label>
              <input
                type="number"
                placeholder="Total Rupiah"
                value={nominal || ''}
                onChange={(e) => setNominal(Number(e.target.value))}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-fuchsia-300 rounded-xl px-3 py-2 text-xs focus:outline-none border-fuchsia-500/30 font-mono font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-orbitron font-bold text-purple-400 block mb-1">Platform Sekuritas/Aplikasi</label>
            <input
              type="text"
              placeholder="Ajaib / Indodax / Tokocrypto"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-orbitron font-bold text-purple-400 block mb-1">Alasan Pembelian (Analysis)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-white rounded-xl p-3 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-[#1a0f30] text-purple-300 border border-purple-500/30 text-xs font-orbitron font-bold cursor-pointer transition-all">Batal</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-700 text-white font-orbitron font-bold text-xs shadow-neo-purple cursor-pointer active:scale-95 transition-all">
              <Save className="w-4 h-4" />
              <span>Simpan Portofolio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
