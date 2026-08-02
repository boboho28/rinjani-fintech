import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Trash2, 
  Edit3, 
  Sparkles,
  Calendar,
  X
} from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';
import { BankLogo } from './BankIcon';

interface JournalViewProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenAIModal: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  transactions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onOpenAIModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');

  const categories = Array.from(new Set(transactions.map((t) => t.category)));
  const accounts = Array.from(new Set(transactions.map((t) => t.account)));

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || tx.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;
    const matchesAccount = selectedAccount === 'all' || tx.account === selectedAccount;

    return matchesSearch && matchesType && matchesCategory && matchesAccount;
  });

  const totalIncomeFiltered = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenseFiltered = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalanceFiltered = totalIncomeFiltered - totalExpenseFiltered;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-6 shadow-neo-purple">
        <div>
          <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4" />
            <span>SERAH TERIMA & MUTASI KAS HARIAN</span>
          </div>
          <h2 className="text-xl font-orbitron font-black text-neon-purple tracking-wide">
            JURNAL KELUAR MASUK DUIT
          </h2>
          <p className="text-xs text-purple-200/70 font-rajdhani font-semibold mt-1">
            Catatan rinci setiap arus transaksi pemasukan dan pengeluaran harian real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddTransaction}
            className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-neo-purple transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>TAMBAH TRANSAKSI</span>
          </button>
          
          <button
            onClick={onOpenAIModal}
            className="bg-[#1a0f30] hover:bg-purple-500/20 text-purple-300 border border-purple-500/40 font-orbitron font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-neo-purple"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
            <span>AI PARSE STRUK</span>
          </button>
        </div>
      </div>

      {/* Filtered Summary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between shadow-neo-purple">
          <div>
            <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">Total Pemasukan (Filtered)</p>
            <p className="text-lg font-mono font-bold text-emerald-400 mt-0.5">{formatRupiah(totalIncomeFiltered)}</p>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between shadow-neo-purple">
          <div>
            <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">Total Pengeluaran (Filtered)</p>
            <p className="text-lg font-mono font-bold text-rose-400 mt-0.5">{formatRupiah(totalExpenseFiltered)}</p>
          </div>
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between shadow-neo-purple">
          <div>
            <p className="text-[10px] font-orbitron font-bold text-purple-400/80 uppercase">Selisih Net (Arus Kas)</p>
            <p className={`text-lg font-mono font-bold mt-0.5 ${netBalanceFiltered >= 0 ? 'text-purple-300' : 'text-rose-400'}`}>
              {formatRupiah(netBalanceFiltered)}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl p-4 space-y-3 shadow-neo-purple">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari transaksi / catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a0f30] border border-purple-500/30 text-purple-100 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-purple-400 font-orbitron"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-purple-400/60 hover:text-purple-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#1a0f30] border border-purple-500/30 text-purple-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-400 font-orbitron"
          >
            <option value="all">Semua Tipe (Masuk & Keluar)</option>
            <option value="income">Pemasukan Saja (+)</option>
            <option value="expense">Pengeluaran Saja (-)</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#1a0f30] border border-purple-500/30 text-purple-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-400 font-orbitron"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="bg-[#1a0f30] border border-purple-500/30 text-purple-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-400 font-orbitron"
          >
            <option value="all">Semua Akun / Rekening</option>
            {accounts.map((acc) => (
              <option key={acc} value={acc}>{acc}</option>
            ))}
          </select>

        </div>
      </div>

      {/* Transaction List Table */}
      <div className="bg-[#130b20]/80 border border-purple-500/30 rounded-2xl overflow-hidden shadow-neo-purple">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-purple-100">
            <thead className="bg-[#1a0f30] text-purple-300 uppercase font-orbitron font-bold text-[10px] tracking-wider border-b border-purple-500/30">
              <tr>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Deskripsi & Catatan</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Akun</th>
                <th className="py-3.5 px-4 text-right">Nominal</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/20">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-purple-500/10 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-purple-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>{formatDateIndo(tx.date)}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-orbitron font-bold text-white text-xs tracking-wide">{tx.description}</p>
                      {tx.note && (
                        <p className="text-[11px] text-purple-300/60 mt-0.5 line-clamp-1 italic font-rajdhani">
                          "{tx.note}"
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-[#1a0f30] text-purple-300 border border-purple-500/30 text-[10px] font-orbitron font-bold">
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-purple-200">
                        <BankLogo accountName={tx.account} size="sm" />
                        <span>{tx.account}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-mono font-extrabold text-sm ${
                          tx.type === 'income' ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'text-purple-100'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          title="Edit Transaksi"
                          className="p-1.5 rounded-lg bg-[#1a0f30] hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          title="Hapus Transaksi"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-purple-400/50 font-orbitron">
                    TIDAK ADA DATA TRANSAKSI YANG SESUAI DENGAN FILTER PENCARIAN.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
