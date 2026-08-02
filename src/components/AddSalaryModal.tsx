import React, { useState, useEffect } from 'react';
import { X, Save, Coins } from 'lucide-react';
import { SalaryBonus, IncomeSourceType } from '../types';

interface AddSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (salary: Omit<SalaryBonus, 'id'>, editId?: string) => void;
  editingSalary?: SalaryBonus | null;
}

export const AddSalaryModal: React.FC<AddSalaryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSalary,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<IncomeSourceType>('gaji_pokok');
  const [sourceCompany, setSourceCompany] = useState('');
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [bonusAmount, setBonusAmount] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [period, setPeriod] = useState('Agustus 2026');
  const [status, setStatus] = useState<'diterima' | 'dijadwalkan'>('diterima');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingSalary) {
      setTitle(editingSalary.title);
      setType(editingSalary.type);
      setSourceCompany(editingSalary.sourceCompany);
      setBaseAmount(editingSalary.baseAmount);
      setBonusAmount(editingSalary.bonusAmount);
      setDeductions(editingSalary.deductions);
      setDate(editingSalary.date);
      setPeriod(editingSalary.period);
      setStatus(editingSalary.status);
      setNotes(editingSalary.notes || '');
    } else {
      setTitle('');
      setType('gaji_pokok');
      setSourceCompany('');
      setBaseAmount(0);
      setBonusAmount(0);
      setDeductions(0);
      setDate(new Date().toISOString().slice(0, 10));
      setPeriod('Agustus 2026');
      setStatus('diterima');
      setNotes('');
    }
  }, [editingSalary, isOpen]);

  if (!isOpen) return null;

  const nettAmount = Math.max(0, baseAmount + bonusAmount - deductions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !sourceCompany || nettAmount <= 0) return;

    onSave(
      {
        title,
        type,
        sourceCompany,
        baseAmount,
        bonusAmount,
        deductions,
        nettAmount,
        date,
        period,
        status,
        isClaimedToJournal: editingSalary?.isClaimedToJournal ?? false,
        notes,
      },
      editingSalary?.id
    );

    onClose();
  };

  const types: { id: IncomeSourceType; label: string }[] = [
    { id: 'gaji_pokok', label: 'Gaji Pokok' },
    { id: 'bonus_kinerja', label: 'Bonus Kinerja KPI / Proyek' },
    { id: 'tunjangan', label: 'Tunjangan (Transport/Makan)' },
    { id: 'thr', label: 'THR / Insentif Tahunan' },
    { id: 'lembur', label: 'Uang Lembur' },
    { id: 'sampingan', label: 'Sampingan / Freelance' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#130b20] border border-purple-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-neo-purple">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
          <h3 className="font-orbitron font-bold text-base text-purple-200 tracking-wide flex items-center gap-2">
            <Coins className="w-5 h-5 text-purple-400" />
            <span>{editingSalary ? 'Edit Slip Gaji/Bonus' : 'Catat Slip Gaji & Bonus Baru'}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-purple-400 hover:text-white hover:bg-purple-500/10 transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Tipe Income</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IncomeSourceType)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              >
                {types.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#1a0f30] text-purple-100">{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Status Cair</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              >
                <option value="diterima" className="bg-[#1a0f30] text-purple-100">✓ Sudah Diterima / Cair</option>
                <option value="dijadwalkan" className="bg-[#1a0f30] text-purple-100">⏳ Dijadwalkan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Judul Slip Gaji / Bonus</label>
            <input
              type="text"
              placeholder="Contoh: Gaji Bulanan Agustus 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-white placeholder-purple-200/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              required
            />
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Nama Perusahaan / Sumber</label>
            <input
              type="text"
              placeholder="Contoh: PT Solusi Tekno Indonesia"
              value={sourceCompany}
              onChange={(e) => setSourceCompany(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-white placeholder-purple-200/30 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Gaji Pokok (Rp)</label>
              <input
                type="number"
                placeholder="0"
                value={baseAmount || ''}
                onChange={(e) => setBaseAmount(Number(e.target.value))}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-300 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Bonus/Insentif</label>
              <input
                type="number"
                placeholder="0"
                value={bonusAmount || ''}
                onChange={(e) => setBonusAmount(Number(e.target.value))}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-emerald-400 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Potongan Pajak</label>
              <input
                type="number"
                placeholder="0"
                value={deductions || ''}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-rose-400 rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 font-mono font-bold"
              />
            </div>
          </div>

          <div className="bg-[#1a0f30] p-2.5 rounded-xl border border-purple-500/30 flex items-center justify-between text-xs">
            <span className="text-purple-200/70 font-orbitron">Total Nett Diterima:</span>
            <span className="font-orbitron font-black text-sm text-neon-purple">
              Rp {nettAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Tanggal Cair</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
                required
              />
            </div>

            <div>
              <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Periode</label>
              <input
                type="text"
                placeholder="Agustus 2026"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-[#1a0f30] border border-purple-500/30 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-orbitron font-bold text-purple-300/90 block mb-1">Catatan</label>
            <input
              type="text"
              placeholder="Catatan tambahan slip gaji..."
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
              <span>Simpan Slip Gaji</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
