import React, { useState } from 'react';
import { 
  Coins, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Building, 
  Edit3, 
  Trash2,
  Receipt
} from 'lucide-react';
import { SalaryBonus } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface SalaryBonusViewProps {
  salaries: SalaryBonus[];
  onAddSalary: () => void;
  onEditSalary: (item: SalaryBonus) => void;
  onDeleteSalary: (id: string) => void;
  onClaimToJournal: (item: SalaryBonus) => void;
  onOpenAIModal: () => void;
}

export const SalaryBonusView: React.FC<SalaryBonusViewProps> = ({
  salaries,
  onAddSalary,
  onEditSalary,
  onDeleteSalary,
  onClaimToJournal,
  onOpenAIModal,
}) => {
  const filteredSalaries = salaries;
  const totalNettReceived = salaries.filter((s) => s.status === 'diterima').reduce((sum, s) => sum + s.nettAmount, 0);
  const totalPendingScheduled = salaries.filter((s) => s.status === 'dijadwalkan').reduce((sum, s) => sum + s.nettAmount, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      
      {/* Sticky Header - Desktop Only (Lg:sticky) */}
      <div className="lg:sticky lg:top-0 lg:z-20 space-y-4 lg:pt-1 lg:bg-[#0a0512]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-6 shadow-neo-purple backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider mb-1"><Coins className="w-4 h-4" /><span>Menu 6. Bonus Kerja & Income</span></div>
            <h2 className="text-xl font-orbitron font-black text-neon-purple tracking-wide">Gaji, Insentif & Bonus Kerja</h2>
            <p className="text-xs text-purple-200/70 font-rajdhani font-semibold mt-1">Rekam penerimaan slip gaji dan klaim langsung ke saldo harian.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onAddSalary} className="bg-gradient-to-r from-purple-600 to-fuchsia-700 text-white font-orbitron font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-neo-purple cursor-pointer active:scale-95"><PlusCircle className="w-4 h-4" /><span>Tambah Slip Gaji</span></button>
            <button onClick={onOpenAIModal} className="bg-[#1a0f30] text-purple-300 border border-purple-500/40 font-orbitron font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-neo-purple cursor-pointer transition-all active:scale-95"><Sparkles className="w-4 h-4 text-fuchsia-400" /><span>Optimasi AI</span></button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
          <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between shadow-neo-purple backdrop-blur-sm">
            <div><p className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest">Total Diterima</p><p className="text-2xl font-mono font-black text-emerald-400 mt-1">{formatRupiah(totalNettReceived)}</p></div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400"><CheckCircle2 className="w-6 h-6" /></div>
          </div>
          <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between shadow-neo-purple backdrop-blur-sm">
            <div><p className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest">Dijadwalkan</p><p className="text-2xl font-mono font-black text-purple-300 mt-1">{formatRupiah(totalPendingScheduled)}</p></div>
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400"><Clock className="w-6 h-6" /></div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {filteredSalaries.length === 0 ? (
          <div className="py-20 text-center text-purple-400/50 font-orbitron text-sm uppercase tracking-widest opacity-30">Tidak ada catatan income.</div>
        ) : (
          filteredSalaries.map((item) => (
            <div key={item.id} className="relative bg-[#130b20]/80 border border-purple-500/30 hover:border-purple-400 rounded-2xl p-6 space-y-4 shadow-neo-purple transition-all overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2"><span className="px-3 py-1 text-[11px] font-orbitron font-extrabold rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase tracking-wider">{item.type.replace('_', ' ')}</span><span className="text-[10px] font-orbitron font-bold text-purple-200/80 bg-[#1a0f30] border border-purple-500/30 px-3 py-1 rounded-lg">{item.period}</span><span className={`px-3 py-1 text-[11px] font-orbitron font-extrabold rounded-lg border flex items-center gap-1.5 ${item.status === 'diterima' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-purple-500/20 text-purple-300 border-purple-500/40'}`}>{item.status === 'diterima' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}<span>{item.status === 'diterima' ? 'CAIR' : 'PENDING'}</span></span></div>
                  <h3 className="font-orbitron font-bold text-lg text-purple-100 uppercase tracking-tight">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-purple-300/80 font-rajdhani font-semibold"><Building className="w-3.5 h-3.5 text-purple-400" /><span>{item.sourceCompany}</span><span className="text-purple-500/50">•</span><span className="font-mono">{formatDateIndo(item.date)}</span></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-3"><p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">Nett</p><p className="text-xl font-mono font-black text-neon-purple leading-none">{formatRupiah(item.nettAmount)}</p></div>
                  <button onClick={() => onEditSalary(item)} className="p-2 rounded-xl bg-[#1a0f30] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 cursor-pointer transition-all active:scale-95"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => onDeleteSalary(item.id)} className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/40 cursor-pointer transition-all active:scale-95"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1a0f30] p-4 rounded-xl border border-purple-500/30 text-[11px] font-mono">
                <div><span className="text-purple-400 block uppercase">Gaji Pokok</span><span className="text-purple-100 font-bold">{formatRupiah(item.baseAmount)}</span></div>
                <div><span className="text-purple-400 block uppercase">Bonus</span><span className="text-emerald-400 font-bold">+{formatRupiah(item.bonusAmount)}</span></div>
                <div><span className="text-purple-400 block uppercase">Potongan</span><span className="text-rose-400 font-bold">-{formatRupiah(item.deductions)}</span></div>
                <div><span className="text-purple-400 block uppercase">Bersih</span><span className="text-neon-purple font-black">{formatRupiah(item.nettAmount)}</span></div>
              </div>
              {!item.isClaimedToJournal && (
                <button onClick={() => onClaimToJournal(item)} className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-700 text-white font-orbitron font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-neo-purple cursor-pointer active:scale-95 transition-all"><Receipt className="w-4 h-4" /><span>KLAIM KE SALDO JURNAL</span></button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
