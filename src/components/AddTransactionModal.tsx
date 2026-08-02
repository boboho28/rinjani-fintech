import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Save } from 'lucide-react';
import { Transaction, TransactionType, AccountType } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id'>, editId?: string) => void;
  editingTransaction?: Transaction | null;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTransaction,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('Makanan & Minuman');
  const [account, setAccount] = useState<AccountType>('Bank BCA');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  useEffect(() => {
    if (editingTransaction) {
      setDescription(editingTransaction.description);
      setAmount(editingTransaction.amount);
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setAccount(editingTransaction.account);
      setDate(editingTransaction.date);
      setNote(editingTransaction.note || '');
    } else {
      setDescription('');
      setAmount(0);
      setType('expense');
      setCategory('Makanan & Minuman');
      setAccount('Bank BCA');
      setDate(new Date().toISOString().slice(0, 10));
      setNote('');
    }
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    onSave(
      {
        description,
        amount,
        type,
        category,
        account,
        date,
        note,
      },
      editingTransaction?.id
    );

    onClose();
  };

  const categories = [
    'Makanan & Minuman',
    'Transportasi',
    'Belanja Bulanan',
    'Tagihan & Utilitas',
    'Hiburan & Gaya Hidup',
    'Investasi',
    'Place / Tempat Tinggal',
    'Gaji & Bonus',
    'Sampingan / Freelance',
    'Transfer E-Wallet',
    'Lain-lain',
  ];

  const accounts: AccountType[] = [
    'Kas / Tunai',
    'Bank BCA',
    'Bank Mandiri',
    'Bank BRI',
    'Bank BNI',
    'SeaBank',
    'E-Wallet (GoPay/OVO/DANA)',
    'Rekening Investasi',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-neo-purple">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <h3 className="font-orbitron font-bold text-base text-purple-200 tracking-wide flex items-center gap-2">
            <span>{editingTransaction ? 'Edit Transaksi Jurnal' : 'Catat Transaksi Kas Baru'}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-500/10 transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Type Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#1a0f30] rounded-xl border border-purple-500/30">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-lg text-xs font-orbitron font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-950/90 text-rose-300 border border-rose-500/60 shadow-md'
                  : 'text-purple-200/60 hover:text-purple-100'
              }`}
            >
              Pengeluaran (-)
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-lg text-xs font-orbitron font-bold transition-all ${
                type === 'income'
                  ? 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white shadow-neo-purple'
                  : 'text-purple-200/60 hover:text-purple-100'
              }`}
            >
              Pemasukan (+)
            </button>
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Deskripsi Transaksi</label>
            <input
              type="text"
              placeholder="Contoh: Belanja Sembako Supermarket"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-white placeholder-purple-200/30 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              required
            />
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Nominal (Rp)</label>
            <input
              type="number"
              placeholder="0"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-300 placeholder-purple-200/30 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 font-mono font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#1a0f30] text-purple-100">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Akun Pembayaran</label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value as AccountType)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              >
                {accounts.map((a) => (
                  <option key={a} value={a} className="bg-[#1a0f30] text-purple-100">{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              required
            />
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Catatan Tambahan (Opsional)</label>
            <input
              type="text"
              placeholder="Rincian / tempat transaksi..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-white placeholder-purple-200/30 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1a0f30] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-orbitron font-bold cursor-pointer transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs shadow-neo-purple cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{editingTransaction ? 'Simpan Perubahan' : 'Simpan Transaksi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
