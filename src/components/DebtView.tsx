import React, { useState } from 'react';
import { 
  Scale, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Plus, 
  Calendar,
  Check,
  UserCheck,
  User,
  History,
  Wallet
} from 'lucide-react';
import { DebtItem, DebtType, DebtStatus } from '../types';
import { formatRupiah, formatDateIndo, formatThousands, parseThousands } from '../utils/formatters';

interface DebtViewProps {
  debts: DebtItem[];
  onAddDebt: () => void;
  onEditDebt: (debt: DebtItem) => void;
  onDeleteDebt: (id: string) => void;
  onPayDebt: (debtId: string, paymentAmount: number, note: string) => void;
  onOpenAIModal: () => void;
}

export const DebtView: React.FC<DebtViewProps> = ({
  debts,
  onAddDebt,
  onEditDebt,
  onDeleteDebt,
  onPayDebt,
  onOpenAIModal,
}) => {
  const [activeTabType, setActiveTabType] = useState<'all' | 'hutang' | 'piutang'>('all');
  // Fitur Baru: State untuk memisahkan daftar Aktif dan Lunas
  const [activeStatusTab, setActiveStatusTab] = useState<'active' | 'completed'>('active');
  
  const [paymentModalDebt, setPaymentModalDebt] = useState<DebtItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNote, setPaymentNote] = useState<string>('');

  // Logika Filter Data
  const activeDebts = debts.filter((d) => (d.totalAmount - d.paidAmount) > 0);
  const completedDebts = debts.filter((d) => (d.totalAmount - d.paidAmount) <= 0);

  const displayedDebts = (activeStatusTab === 'active' ? activeDebts : completedDebts).filter((d) => {
    if (activeTabType === 'all') return true;
    return d.type === activeTabType;
  });

  const totalHutangOwed = debts
    .filter((d) => d.type === 'hutang')
    .reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);

  const totalPiutangOwed = debts
    .filter((d) => d.type === 'piutang')
    .reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalDebt || paymentAmount <= 0) return;
    onPayDebt(paymentModalDebt.id, paymentAmount, paymentNote || 'Pembayaran cicilan / pelunasan');
    setPaymentModalDebt(null);
    setPaymentAmount(0);
    setPaymentNote('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-6 shadow-neo-purple">
        <div>
          <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Menu 5. Catatan Hutang & Piutang Akurat</span>
          </div>
          <h2 className="text-xl font-orbitron font-black text-neon-purple tracking-wide">
            Monitoring Hutang, Piutang & Cicilan Jatuh Tempo
          </h2>
          <p className="text-xs text-purple-200/70 font-rajdhani font-semibold mt-1">
            Pantau pinjaman pribadi, kredit barang, dan tagihan piutang teman agar tidak ada transaksi terlewat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onAddDebt}
            className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-neo-purple transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Catatan Hutang/Piutang</span>
          </button>

          <button
            onClick={onOpenAIModal}
            className="bg-[#1a0f30] hover:bg-purple-500/20 text-purple-300 border border-purple-500/40 font-orbitron font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-neo-purple"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span>Strategi Pelunasan AI</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between shadow-neo-purple">
          <div>
            <p className="text-xs font-orbitron font-bold text-purple-400/80 uppercase tracking-wider">Hutang Saya (Harus Dibayar)</p>
            <p className="text-2xl font-mono font-black text-rose-400 mt-1">{formatRupiah(totalHutangOwed)}</p>
            <p className="text-[11px] text-purple-200/60 font-rajdhani font-semibold mt-0.5">Sisa kewajiban pembayaran pinjaman/kredit</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Scale className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between shadow-neo-purple">
          <div>
            <p className="text-xs font-orbitron font-bold text-purple-400/80 uppercase tracking-wider">Piutang Saya (Akan Diterima)</p>
            <p className="text-2xl font-mono font-black text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)] mt-1">{formatRupiah(totalPiutangOwed)}</p>
            <p className="text-[11px] text-purple-200/60 font-rajdhani font-semibold mt-0.5">Uang Anda yang dipinjam orang lain</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* --- SUB-TAB STATUS NAVIGATION --- */}
      <div className="flex flex-wrap items-center gap-3 bg-[#130b20]/50 p-2 rounded-2xl border border-purple-500/20 w-fit">
        <button
          onClick={() => setActiveStatusTab('active')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-orbitron font-bold text-[10px] sm:text-xs transition-all cursor-pointer ${
            activeStatusTab === 'active' 
            ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-neo-purple border border-fuchsia-400/40' 
            : 'text-purple-400/60 hover:text-purple-200'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>DAFTAR AKTIF ({activeDebts.length})</span>
        </button>
        <button
          onClick={() => setActiveStatusTab('completed')}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-orbitron font-bold text-[10px] sm:text-xs transition-all cursor-pointer ${
            activeStatusTab === 'completed' 
            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-neo-green border border-emerald-400/40' 
            : 'text-emerald-400/60 hover:text-emerald-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>RIWAYAT LUNAS ({completedDebts.length})</span>
        </button>
      </div>

      {/* Filter Type Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTabType('all')}
          className={`px-4 py-2 rounded-xl text-[10px] font-orbitron font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
            activeTabType === 'all'
              ? 'bg-purple-500/20 text-white border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
              : 'bg-[#130b20]/80 text-purple-200/70 hover:text-white border-purple-500/30'
          }`}
        >
          Semua Catatan
        </button>

        <button
          onClick={() => setActiveTabType('hutang')}
          className={`px-4 py-2 rounded-xl text-[10px] font-orbitron font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
            activeTabType === 'hutang'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/10'
              : 'bg-[#130b20]/80 text-purple-200/70 hover:text-white border-purple-500/30'
          }`}
        >
          Hutang Saya
        </button>

        <button
          onClick={() => setActiveTabType('piutang')}
          className={`px-4 py-2 rounded-xl text-[10px] font-orbitron font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
            activeTabType === 'piutang'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10'
              : 'bg-[#130b20]/80 text-purple-200/70 hover:text-white border-purple-500/30'
          }`}
        >
          Piutang Saya
        </button>
      </div>

      {/* Debt List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {displayedDebts.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-[#130b20]/40 border-2 border-dashed border-purple-500/20 rounded-3xl">
             <AlertCircle className="w-12 h-12 text-purple-500/30 mx-auto mb-3" />
             <p className="font-orbitron font-bold text-purple-300/40 uppercase tracking-widest text-sm">
                {activeStatusTab === 'active' ? 'Tidak ada hutang/piutang aktif.' : 'Belum ada riwayat lunas.'}
             </p>
          </div>
        ) : (
          displayedDebts.map((item) => {
            const remainingAmount = item.totalAmount - item.paidAmount;
            const percentagePaid = item.totalAmount > 0 ? (item.paidAmount / item.totalAmount) * 100 : 0;
            const isLunas = remainingAmount <= 0;

            return (
              <div
                key={item.id}
                className={`relative bg-[#130b20]/80 border rounded-2xl p-6 space-y-4 shadow-neo-purple transition-all overflow-hidden group ${
                  isLunas ? 'border-emerald-500/50 opacity-90' : 'border-purple-500/30 hover:border-purple-400'
                }`}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
                    isLunas
                      ? 'from-transparent via-emerald-400/80 to-transparent'
                      : 'from-transparent via-purple-400/80 to-transparent'
                  }`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-3 py-1 text-[11px] font-orbitron font-extrabold rounded-lg uppercase tracking-wider border shadow-sm ${
                          item.type === 'hutang'
                            ? 'bg-rose-950/70 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                            : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                        }`}
                      >
                        {item.type === 'hutang' ? 'Hutang Saya' : 'Piutang Saya'}
                      </span>

                      <span
                        className={`px-3 py-1 text-[11px] font-orbitron font-extrabold rounded-lg border flex items-center gap-1.5 ${
                          isLunas
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                            : percentagePaid > 0
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-neo-purple'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                        }`}
                      >
                        {isLunas ? '✓ Lunas' : percentagePaid > 0 ? 'Cicilan Sebagian' : 'Belum Lunas'}
                      </span>
                    </div>

                    <h3 className="font-orbitron font-bold text-lg text-purple-100 tracking-wide group-hover:text-purple-300 transition-colors mt-1">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-purple-300/80 font-rajdhani font-semibold">
                      <div className="flex items-center gap-1.5 bg-[#1a0f30] px-2.5 py-1 rounded-md border border-purple-500/20">
                        <User className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-purple-200">{item.personName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditDebt(item)}
                      title="Edit Catatan Hutang/Piutang"
                      className="p-2.5 rounded-xl bg-[#1a0f30] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:border-purple-400/60 transition-all cursor-pointer shadow-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteDebt(item.id)}
                      title="Hapus Catatan"
                      className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/40 hover:border-rose-400 transition-all cursor-pointer shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-[#1a0f30] p-4 rounded-xl border border-purple-500/30 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-xs border-b border-purple-500/15 pb-3">
                    <div>
                      <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase tracking-wider">Total Pinjaman</p>
                      <p className="font-mono font-bold text-sm text-purple-100 mt-1">{formatRupiah(item.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase tracking-wider">Telah Dibayar</p>
                      <p className="font-mono font-bold text-sm text-emerald-400 mt-1">{formatRupiah(item.paidAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase tracking-wider">Sisa Kewajiban</p>
                      <p className={`font-mono font-black text-sm mt-1 ${remainingAmount > 0 ? 'text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.4)]' : 'text-emerald-400'}`}>
                        {formatRupiah(remainingAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="w-full bg-[#0d0718] h-3 rounded-full overflow-hidden border border-purple-500/30 p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-purple-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(percentagePaid, 100)}%` }}
                      />
                    </div>

                    <div className="flex flex-col xs:flex-row xs:items-center justify-between text-[10px] sm:text-xs font-mono pt-1 gap-2">
                      <span className="flex items-center gap-1.5 text-purple-200/80">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>Jatuh Tempo: <strong className="text-purple-100 font-bold">{formatDateIndo(item.dueDate)}</strong></span>
                      </span>
                      <span className="text-purple-300 font-orbitron font-bold text-[10px] px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 self-start">
                        {percentagePaid.toFixed(0)}% Terbayar
                      </span>
                    </div>
                  </div>
                </div>

                {item.notes && (
                  <div className="bg-[#1a0f30] border-l-4 border-purple-500 rounded-r-xl p-3 text-xs font-rajdhani font-semibold text-purple-200/90 italic flex items-start gap-2.5">
                    <span>"{item.notes}"</span>
                  </div>
                )}

                {/* Tombol Bayar hanya tampil di tab Daftar Aktif (Hanya yang belum lunas) */}
                {!isLunas && (
                  <button
                    onClick={() => {
                      setPaymentModalDebt(item);
                      setPaymentAmount(remainingAmount);
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-orbitron font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_22px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-slate-950 font-bold" />
                    <span>Catat Pembayaran Cicilan / Pelunasan</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Payment Entry Modal */}
      {paymentModalDebt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#130b20] border border-purple-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-neo-purple">
            <h3 className="font-orbitron font-bold text-base text-neon-purple">
              Catat Pembayaran: {paymentModalDebt.title}
            </h3>
            <p className="text-xs text-purple-200/70 font-rajdhani font-semibold">
              Sisa pinjaman: <strong className="text-rose-400 font-mono text-sm">{formatRupiah(paymentModalDebt.totalAmount - paymentModalDebt.paidAmount)}</strong>
            </p>

            <form onSubmit={handleConfirmPayment} className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-orbitron font-bold text-purple-400">Nominal Pembayaran (Rp) *</label>
                  {paymentAmount > 0 && (
                    <span className="text-[11px] font-mono font-bold text-emerald-400">
                      {formatRupiah(paymentAmount)}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Contoh: 500.000"
                  value={paymentAmount > 0 ? formatThousands(paymentAmount) : ''}
                  onChange={(e) => setPaymentAmount(parseThousands(e.target.value))}
                  className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 font-mono font-bold rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-orbitron font-bold text-purple-400 block mb-1">Catatan Pembayaran</label>
                <input
                  type="text"
                  placeholder="Contoh: Cicilan bulan Agustus via Transfer BCA"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 font-rajdhani rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalDebt(null)}
                  className="px-4 py-2 rounded-xl bg-[#1a0f30] text-purple-200/70 border border-purple-500/30 text-xs font-orbitron font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 text-white text-xs font-orbitron font-bold shadow-neo-purple cursor-pointer"
                >
                  Simpan & Update Saldo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
