import React, { useState } from 'react';
import { 
  Scale, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  Plus, 
  Calendar,
  UserCheck,
  User
} from 'lucide-react';
import { DebtItem, DebtStatus } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface DebtViewProps {
  debts: DebtItem[];
  onAddDebt: () => void;
  onEditDebt: (debt: DebtItem) => void;
  onDeleteDebt: (id: string) => void;
  onPayDebt: (debtId: string, paymentAmount: number, note: string) => void;
  onOpenAIModal: () => void;
}

export const DebtView: React.FC<DebtViewProps> = ({
  debts = [],
  onAddDebt,
  onEditDebt,
  onDeleteDebt,
  onPayDebt,
  onOpenAIModal,
}) => {
  const [activeTabType, setActiveTabType] = useState<'all' | 'hutang' | 'piutang'>('all');
  const [paymentModalDebt, setPaymentModalDebt] = useState<DebtItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNote, setPaymentNote] = useState<string>('');

  const filteredDebts = debts.filter((d) => activeTabType === 'all' || d.type === activeTabType);
  const totalHutangOwed = debts.filter((d) => d.type === 'hutang').reduce((sum, d) => sum + (d.totalAmount - (d.paidAmount || 0)), 0);
  const totalPiutangOwed = debts.filter((d) => d.type === 'piutang').reduce((sum, d) => sum + (d.totalAmount - (d.paidAmount || 0)), 0);

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalDebt || paymentAmount <= 0) return;
    onPayDebt(paymentModalDebt.id, paymentAmount, paymentNote || 'Pembayaran cicilan');
    setPaymentModalDebt(null); setPaymentAmount(0); setPaymentNote('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      
      {/* STICKY HEADER AREA - DESKTOP ONLY */}
      <div className="lg:sticky lg:top-0 lg:z-20 space-y-4 lg:pt-1 lg:bg-[#0a0512]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-6 shadow-neo-purple backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider mb-1"><Scale className="w-4 h-4" /><span>Menu 5. Hutang & Piutang</span></div>
            <h2 className="text-xl font-orbitron font-black text-neon-purple tracking-wide uppercase">Monitoring Hutang & Cicilan</h2>
            <p className="text-xs text-purple-200/70 font-rajdhani font-semibold mt-1">Pantau kewajiban pinjaman dan tagihan piutang Anda.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onAddDebt} className="bg-gradient-to-r from-purple-600 to-fuchsia-700 text-white font-orbitron font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-neo-purple cursor-pointer active:scale-95 transition-all"><PlusCircle className="w-4 h-4" /><span>Tambah Catatan</span></button>
            <button onClick={onOpenAIModal} className="bg-[#1a0f30] text-purple-300 border border-purple-500/40 font-orbitron font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-neo-purple cursor-pointer active:scale-95 transition-all"><Sparkles className="w-4 h-4 text-fuchsia-400" /><span>Strategi AI</span></button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between shadow-neo-purple backdrop-blur-sm">
            <div><p className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest">Hutang Saya (Sisa)</p><p className="text-2xl font-mono font-black text-rose-400 mt-1">{formatRupiah(totalHutangOwed)}</p></div>
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400"><Scale className="w-6 h-6" /></div>
          </div>
          <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between shadow-neo-purple backdrop-blur-sm">
            <div><p className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-widest">Piutang (Tertagih)</p><p className="text-2xl font-mono font-black text-emerald-400 mt-1">{formatRupiah(totalPiutangOwed)}</p></div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400"><UserCheck className="w-6 h-6" /></div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-purple-500/20">
          <button onClick={() => setActiveTabType('all')} className={`px-4 py-2 rounded-xl text-[10px] font-orbitron font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${activeTabType === 'all' ? 'bg-purple-600 text-white shadow-neo-purple' : 'bg-[#130b20] text-purple-300 border border-purple-500/30'}`}>Semua</button>
          <button onClick={() => setActiveTabType('hutang')} className={`px-4 py-2 rounded-xl text-[10px] font-orbitron font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${activeTabType === 'hutang' ? 'bg-rose-600 text-white shadow-neo-rose' : 'bg-[#130b20] text-purple-300 border border-purple-500/30'}`}>Hutang Saya</button>
          <button onClick={() => setActiveTabType('piutang')} className={`px-4 py-2 rounded-xl text-[10px] font-orbitron font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${activeTabType === 'piutang' ? 'bg-emerald-600 text-slate-950 font-black shadow-neo-green' : 'bg-[#130b20] text-purple-300 border border-purple-500/30'}`}>Piutang Saya</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pt-2">
        {filteredDebts.length === 0 ? (
          <div className="col-span-full py-20 text-center text-purple-400/50 font-orbitron text-sm uppercase tracking-widest opacity-30">Tidak ada catatan hutang/piutang.</div>
        ) : (
          filteredDebts.map((item) => {
            const remainingAmount = item.totalAmount - (item.paidAmount || 0);
            const percentagePaid = item.totalAmount > 0 ? ((item.paidAmount || 0) / item.totalAmount) * 100 : 0;
            const isLunas = remainingAmount <= 0;

            return (
              <div key={item.id} className={`relative bg-[#130b20]/80 border rounded-2xl p-6 space-y-4 shadow-neo-purple transition-all overflow-hidden group ${isLunas ? 'border-emerald-500/50 opacity-90' : 'border-purple-500/30 hover:border-purple-400'}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2"><span className={`px-3 py-1 text-[9px] font-orbitron font-extrabold rounded-lg uppercase border ${item.type === 'hutang' ? 'bg-rose-950 text-rose-300 border-rose-500/50' : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'}`}>{item.type === 'hutang' ? 'Hutang Saya' : 'Piutang Saya'}</span><span className={`px-3 py-1 text-[9px] font-orbitron font-extrabold rounded-lg border ${isLunas ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-rose-500/20 text-rose-300 border-rose-500/50'}`}>{isLunas ? 'Lunas' : 'Belum Lunas'}</span></div>
                    <h3 className="font-orbitron font-bold text-lg text-purple-100 uppercase tracking-tighter">{item.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-purple-300/80 font-rajdhani font-semibold"><div className="flex items-center gap-1.5 bg-[#1a0f30] px-2.5 py-1 rounded-md border border-purple-500/20"><User className="w-3.5 h-3.5 text-purple-400" /><span className="text-purple-200">{item.personName}</span></div></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onEditDebt(item)} className="p-2 rounded-xl bg-[#1a0f30] text-purple-300 border border-purple-500/30 active:scale-95 transition-all"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => onDeleteDebt(item.id)} className="p-2 rounded-xl bg-rose-950/40 text-rose-400 border border-rose-500/40 active:scale-95 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="bg-[#1a0f30] p-4 rounded-xl border border-purple-500/30 space-y-3 font-mono">
                  <div className="grid grid-cols-3 gap-2 text-[11px] border-b border-purple-500/15 pb-3 uppercase font-bold tracking-tighter">
                    <div><p className="text-purple-400/80">Total Pinjaman</p><p className="text-purple-100 mt-1">{formatRupiah(item.totalAmount)}</p></div>
                    <div><p className="text-purple-400/80">Telah Dibayar</p><p className="text-emerald-400 mt-1">{formatRupiah(item.paidAmount || 0)}</p></div>
                    <div className="text-right"><p className="text-purple-400/80">Sisa Kewajiban</p><p className={`mt-1 font-black ${remainingAmount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{formatRupiah(remainingAmount)}</p></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full bg-[#0d0718] h-3 rounded-full overflow-hidden border border-purple-500/30 p-0.5"><div className="h-full bg-gradient-to-r from-emerald-500 to-purple-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(percentagePaid, 100)}%` }} /></div>
                    <div className="flex items-center justify-between text-[10px] pt-1 font-bold">
                      <span className="flex items-center gap-1.5 text-purple-200/80"><Calendar className="w-3.5 h-3.5 text-purple-400" /><span>Jatuh Tempo: {formatDateIndo(item.dueDate)}</span></span>
                      <span className="text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 uppercase tracking-widest">{percentagePaid.toFixed(0)}% Terbayar</span>
                    </div>
                  </div>
                </div>

                {item.notes && <div className="bg-[#1a0f30]/60 p-3 rounded-xl text-[11px] text-purple-200/90 italic font-rajdhani font-semibold">"{item.notes}"</div>}
                
                {!isLunas && (
                  <button onClick={() => { setPaymentModalDebt(item); setPaymentAmount(remainingAmount); }} className="w-full bg-emerald-500 text-slate-950 font-orbitron font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"><Plus className="w-4 h-4 font-black" /><span>Catat Pembayaran Cicilan / Pelunasan</span></button>
                )}
              </div>
            );
          })
        )}
      </div>

      {paymentModalDebt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#130b20] border border-purple-500/40 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-neo-purple animate-scaleUp">
            <h3 className="font-orbitron font-bold text-base text-neon-purple uppercase tracking-tighter">Catat Pembayaran: {paymentModalDebt.title}</h3>
            <p className="text-xs text-purple-200/70 font-rajdhani font-semibold italic">Sisa pinjaman: <strong className="text-rose-400 font-mono text-sm">{formatRupiah(paymentModalDebt.totalAmount - (paymentModalDebt.paidAmount || 0))}</strong></p>
            <form onSubmit={handleConfirmPayment} className="space-y-3">
              <div><label className="text-[10px] font-orbitron font-bold text-purple-400 block mb-1 uppercase tracking-widest">Nominal Pembayaran (Rp)</label><input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(Number(e.target.value))} className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 font-mono rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400" required /></div>
              <div><label className="text-[10px] font-orbitron font-bold text-purple-400 block mb-1 uppercase tracking-widest">Catatan</label><input type="text" value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 font-rajdhani rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-400" /></div>
              <div className="flex items-center justify-end gap-2 pt-2"><button type="button" onClick={() => setPaymentModalDebt(null)} className="px-4 py-2 rounded-xl bg-[#1a0f30] text-purple-200/70 border border-purple-500/30 text-[10px] font-orbitron font-bold uppercase transition-all">Batal</button><button type="submit" className="px-4 py-2 rounded-xl bg-purple-600 text-white text-[10px] font-orbitron font-bold shadow-neo-purple active:scale-95 transition-all uppercase tracking-widest">Simpan & Update</button></div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
