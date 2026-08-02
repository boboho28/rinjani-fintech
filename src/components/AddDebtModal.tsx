import React, { useState, useEffect } from 'react';
import { X, Save, Scale } from 'lucide-react';
import { DebtItem, DebtType, DebtStatus } from '../types';

interface AddDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (debt: Omit<DebtItem, 'id' | 'payments'>, editId?: string) => void;
  editingDebt?: DebtItem | null;
}

export const AddDebtModal: React.FC<AddDebtModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingDebt,
}) => {
  const [type, setType] = useState<DebtType>('hutang');
  const [title, setTitle] = useState('');
  const [personName, setPersonName] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingDebt) {
      setType(editingDebt.type);
      setTitle(editingDebt.title);
      setPersonName(editingDebt.personName);
      setTotalAmount(editingDebt.totalAmount);
      setPaidAmount(editingDebt.paidAmount);
      setDueDate(editingDebt.dueDate);
      setStartDate(editingDebt.startDate);
      setNotes(editingDebt.notes || '');
    } else {
      setType('hutang');
      setTitle('');
      setPersonName('');
      setTotalAmount(0);
      setPaidAmount(0);
      setDueDate('');
      setStartDate(new Date().toISOString().slice(0, 10));
      setNotes('');
    }
  }, [editingDebt, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !personName || totalAmount <= 0) return;

    let status: DebtStatus = 'belum_lunas';
    if (paidAmount >= totalAmount) status = 'lunas';
    else if (paidAmount > 0) status = 'sebagian';

    onSave(
      {
        type,
        title,
        personName,
        totalAmount,
        paidAmount,
        dueDate: dueDate || startDate,
        startDate,
        status,
        notes,
      },
      editingDebt?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-neo-purple">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <h3 className="font-orbitron font-bold text-base text-purple-200 tracking-wide flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-400" />
            <span>{editingDebt ? 'Edit Catatan Hutang/Piutang' : 'Catat Hutang atau Piutang Baru'}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-500/10 transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#1a0f30] rounded-xl border border-purple-500/30">
            <button
              type="button"
              onClick={() => setType('hutang')}
              className={`py-2 rounded-lg text-xs font-orbitron font-bold transition-all ${
                type === 'hutang'
                  ? 'bg-rose-950/90 text-rose-300 border border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'text-purple-200/60 hover:text-purple-100'
              }`}
            >
              Hutang Saya (Pinjaman)
            </button>
            <button
              type="button"
              onClick={() => setType('piutang')}
              className={`py-2 rounded-lg text-xs font-orbitron font-bold transition-all ${
                type === 'piutang'
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-neo-purple'
                  : 'text-purple-200/60 hover:text-purple-100'
              }`}
            >
              Piutang Saya (Tagihan)
            </button>
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">
              {type === 'hutang' ? 'Nama Kreditur / Pemberi Pinjaman' : 'Nama Debitur / Orang yang Meminjam'}
            </label>
            <input
              type="text"
              placeholder="Contoh: Rian Pratama / Bank Mandiri"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-white placeholder-purple-200/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              required
            />
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Judul / Keperluan Transaksi</label>
            <input
              type="text"
              placeholder="Contoh: Talangan Servis Laptop / Cicilan HP"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-white placeholder-purple-200/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Total Pinjaman (Rp)</label>
              <input
                type="number"
                placeholder="0"
                value={totalAmount || ''}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Telah Dibayar (Rp)</label>
              <input
                type="number"
                placeholder="0"
                value={paidAmount || ''}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-emerald-400 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Tanggal Mulai Pinjam</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
                required
              />
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Tanggal Jatuh Tempo</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Catatan Tambahan & Bunga</label>
            <input
              type="text"
              placeholder="Contoh: Janji bayar 2x cicilan tanggal gajian..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-white placeholder-purple-200/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs shadow-neo-purple cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Catatan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
