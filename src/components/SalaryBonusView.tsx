import React, { useState } from 'react';
import { 
  Coins, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  Building, 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit3, 
  Trash2,
  Receipt
} from 'lucide-react';
import { SalaryBonus, IncomeSourceType } from '../types';
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
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredSalaries = salaries.filter(
    (item) => selectedType === 'all' || item.type === selectedType
  );

  const totalNettReceived = salaries
    .filter((s) => s.status === 'diterima')
    .reduce((sum, s) => sum + s.nettAmount, 0);

  const totalPendingScheduled = salaries
    .filter((s) => s.status === 'dijadwalkan')
    .reduce((sum, s) => sum + s.nettAmount, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      
      {/* --- STICKY HEADER SECTION --- */}
      <div className="sticky top-0 z-20 space-y-4 pt-1 bg-[#0a0512]">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-6 shadow-neo-purple backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider mb-1">
              <Coins className="w-4 h-4" />
              <span>Menu 6. Bonus Kerja, Gaji Pokok & Income</span>
            </div>
            <h2 className="text-xl font-orbitron font-black text-neon-purple tracking-wide">
              Catatan Gaji, Insentif & Bonus Kerja
            </h2>
            <p className="text-xs text-purple-200/70 font-rajdhani font-semibold mt-1">
              Rekam penerimaan slip gaji, bonus proyek, lembur, dan klaim langsung ke saldo harian.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onAddSalary}
              className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-neo-purple transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Slip Gaji / Bonus</span>
            </button>

            <button
              onClick={onOpenAIModal}
              className="bg-[#1a0f30] hover:bg-purple-500/20 text-purple-300 border border-purple-500/40 font-orbitron font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-neo-purple"
            >
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <span>Optimasi Income AI</span>
            </button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-purple-500/20">
          <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between shadow-neo-purple backdrop-blur-sm">
            <div>
              <p className="text-xs font-orbitron font-bold text-purple-400/80 uppercase tracking-wider">Total Gaji & Bonus Diterima</p>
              <p className="text-2xl font-mono font-black text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)] mt-1">{formatRupiah(totalNettReceived)}</p>
              <p className="text-[11px] text-purple-200/60 font-rajdhani font-semibold mt-0.5">Pendapatan yang sudah cair dan masuk kas</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between shadow-neo-purple backdrop-blur-sm">
            <div>
              <p className="text-xs font-orbitron font-bold text-purple-400/80 uppercase tracking-wider">Dijadwalkan / Belum Cair</p>
              <p className="text-2xl font-mono font-black text-purple-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.5)] mt-1">{formatRupiah(totalPendingScheduled)}</p>
              <p className="text-[11px] text-purple-200/60 font-rajdhani font-semibold mt-0.5">Estimasi pencairan gaji/bonus di depan</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT SECTION --- */}
      <div className="space-y-5">
        {filteredSalaries.length === 0 ? (
          <div className="py-20 text-center text-purple-400/50 font-orbitron text-sm">
            Belum ada catatan gaji atau bonus tersimpan.
          </div>
        ) : (
          filteredSalaries.map((item) => (
            <div
              key={item.id}
              className="relative bg-[#130b20]/80 border border-purple-500/30 hover:border-purple-400 rounded-2xl p-6 space-y-4 shadow-neo-purple transition-all overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 text-[11px] font-orbitron font-extrabold rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase tracking-wider shadow-neo-purple">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-orbitron font-bold text-purple-200/80 bg-[#1a0f30] border border-purple-500/30 px-3 py-1 rounded-lg">
                      {item.period}
                    </span>
                    <span
                      className={`px-3 py-1 text-[11px] font-orbitron font-extrabold rounded-lg border flex items-center gap-1.5 ${
                        item.status === 'diterima'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-neo-purple'
                      }`}
                    >
                      {item.status === 'diterima' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Diterima / Cair</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          <span>Dijadwalkan</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="font-orbitron font-bold text-lg sm:text-xl text-purple-100 tracking-wide group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs text-purple-300/80 font-rajdhani font-semibold">
                    <div className="flex items-center gap-1.5 bg-[#1a0f30] px-2.5 py-1 rounded-md border border-purple-500/20">
                      <Building className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-purple-200">{item.sourceCompany}</span>
                    </div>
                    <span className="text-purple-500/50">•</span>
                    <span className="text-purple-200/70 font-mono">{formatDateIndo(item.date)}</span>
                  </div>
                </div>

                <div className="flex items-center sm:items-end justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-purple-500/20 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase tracking-widest">
                      Nett Diterima
                    </p>
                    <p className="text-xl sm:text-2xl font-mono font-black text-neon-purple mt-0.5">
                      {formatRupiah(item.nettAmount)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditSalary(item)}
                      title="Edit Slip Gaji"
                      className="p-2.5 rounded-xl bg-[#1a0f30] hover:bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:border-purple-400/60 transition-all cursor-pointer shadow-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteSalary(item.id)}
                      title="Hapus Slip Gaji"
                      className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/40 hover:border-rose-400 transition-all cursor-pointer shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1a0f30] p-4 rounded-xl border border-purple-500/30">
                <div className="sm:border-r sm:border-purple-500/15 sm:pr-3">
                  <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase tracking-wider">Gaji Pokok</p>
                  <p className="font-mono font-bold text-sm text-purple-100 mt-1">{formatRupiah(item.baseAmount)}</p>
                </div>
                <div className="sm:border-r sm:border-purple-500/15 sm:pr-3">
                  <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase tracking-wider">Bonus / Insentif</p>
                  <p className="font-mono font-bold text-sm text-emerald-400 mt-1">+{formatRupiah(item.bonusAmount)}</p>
                </div>
                <div className="sm:border-r sm:border-purple-500/15 sm:pr-3">
                  <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase tracking-wider">Potongan (Pajak/BPJS)</p>
                  <p className="font-mono font-bold text-sm text-rose-400 mt-1">-{formatRupiah(item.deductions)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase tracking-wider">Total Bersih</p>
                  <p className="font-mono font-black text-sm text-neon-purple mt-1">{formatRupiah(item.nettAmount)}</p>
                </div>
              </div>

              {item.notes && (
                <div className="bg-[#1a0f30] border-l-4 border-purple-500 rounded-r-xl p-3 text-xs font-rajdhani font-semibold text-purple-200/90 italic flex items-start gap-2.5">
                  <Receipt className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>"{item.notes}"</span>
                </div>
              )}

              {!item.isClaimedToJournal && (
                <button
                  onClick={() => onClaimToJournal(item)}
                  className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-neo-purple transition-all cursor-pointer active:scale-95"
                >
                  <Receipt className="w-4 h-4 text-white font-bold" />
                  <span>Klaim & Masukkan Langsung ke Saldo Kas Real-Time Jurnal</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
