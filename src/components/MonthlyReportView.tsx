import React, { useState } from 'react';
import { 
  PieChart as PieChartIcon, 
  Calendar, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Target, 
  TrendingUp, 
  CheckCircle2,
  AlertTriangle,
  Wallet,
  CreditCard,
  PiggyBank,
  Percent,
  BarChart3,
  Award,
  ShieldCheck,
  Zap,
  Layers,
  Activity
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { Transaction, BudgetCategory } from '../types';
import { formatRupiah } from '../utils/formatters';

interface MonthlyReportViewProps {
  transactions: Transaction[];
  budgets: BudgetCategory[];
  onOpenAIModal: () => void;
}

const COLORS = [
  '#a855f7', '#10b981', '#d946ef', '#f43f5e', 
  '#06b6d4', '#8b5cf6', '#14b8a6', '#ec4899',
  '#f59e0b', '#3b82f6'
];

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  transactions,
  budgets,
  onOpenAIModal,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-08');
  const [chartViewMode, setChartViewMode] = useState<'pie' | 'bar'>('pie');

  // Filter transactions for the selected month
  const monthTransactions = transactions.filter((tx) => tx.date.startsWith(selectedMonth));

  const totalIncome = monthTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = monthTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Expenses by Category
  const expenseCategoryMap: Record<string, number> = {};
  monthTransactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      expenseCategoryMap[tx.category] = (expenseCategoryMap[tx.category] || 0) + tx.amount;
    });

  const pieChartData = Object.entries(expenseCategoryMap)
    .map(([name, value]) => ({
      name,
      value,
      percentage: totalExpense > 0 ? (value / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const topExpenseCategory = pieChartData.length > 0 ? pieChartData[0] : null;

  // Budget vs Actual
  const budgetVsActualData = budgets.map((b) => {
    const actual = expenseCategoryMap[b.category] || 0;
    const percentage = b.monthlyLimit > 0 ? (actual / b.monthlyLimit) * 100 : 0;
    return {
      category: b.category,
      limit: b.monthlyLimit,
      actual,
      percentage,
      isOverBudget: actual > b.monthlyLimit,
    };
  });

  const overBudgetCount = budgetVsActualData.filter((b) => b.isOverBudget).length;
  const safeBudgetCount = budgetVsActualData.filter((b) => !b.isOverBudget && b.limit > 0).length;

  // Financial Health Score Calculation (0 - 100)
  const calculateHealthScore = () => {
    let score = 50; // Base score
    if (savingsRate >= 30) score += 30;
    else if (savingsRate >= 20) score += 20;
    else if (savingsRate >= 10) score += 10;
    else if (savingsRate < 0) score -= 20;

    if (overBudgetCount === 0) score += 20;
    else score -= overBudgetCount * 10;

    return Math.max(0, Math.min(100, score));
  };

  const healthScore = calculateHealthScore();

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#170a2c] via-[#1a0f30] to-[#130b20] border border-purple-500/40 rounded-3xl p-6 shadow-neo-purple relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-orbitron font-bold uppercase tracking-wider mb-1.5">
            <span className="p-1 rounded bg-purple-500/20 border border-purple-500/40">
              <PieChartIcon className="w-3.5 h-3.5 text-purple-300" />
            </span>
            <span>MENU 3. LAPORAN BULANAN & ANALISIS KEUANGAN</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-orbitron font-black text-neon-purple tracking-wide">
            Ringkasan & Evaluation Financial Health
          </h2>
          <p className="text-xs text-purple-200/80 font-rajdhani font-semibold mt-1">
            Pantau arus kas bulanan, rasio tabungan net, serta analisis batas anggaran secara presisi.
          </p>
        </div>

        {/* Month Selector & AI Button */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0d0718] border border-purple-500/40 rounded-2xl px-3.5 py-2.5 text-xs text-purple-200 font-orbitron shadow-inner">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-purple-200 focus:outline-none cursor-pointer font-mono font-bold"
            />
          </div>

          <button
            onClick={onOpenAIModal}
            className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-700 hover:from-purple-500 hover:to-fuchsia-400 text-white font-orbitron font-bold text-xs px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-neo-purple transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-200 fill-fuchsia-200 animate-pulse" />
            <span>Analisis AI Bulan Ini</span>
          </button>
        </div>
      </div>

      {/* Monthly Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Income */}
        <div className="bg-[#130b20]/90 border border-purple-500/30 hover:border-emerald-500/50 rounded-2xl p-5 space-y-3 shadow-neo-purple transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-orbitron font-bold text-purple-300/80 uppercase tracking-wider">
              TOTAL PEMASUKAN
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-mono font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
              {formatRupiah(totalIncome)}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-purple-200/70 font-rajdhani font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
              <span>Semua sumber pemasukan</span>
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-[#130b20]/90 border border-purple-500/30 hover:border-rose-500/50 rounded-2xl p-5 space-y-3 shadow-neo-purple transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-orbitron font-bold text-purple-300/80 uppercase tracking-wider">
              TOTAL PENGELUARAN
            </span>
            <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-mono font-black text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
              {formatRupiah(totalExpense)}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-purple-200/70 font-rajdhani font-semibold mt-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 stroke-[3]" />
              <span>Total biaya hidup & konsumsi</span>
            </div>
          </div>
        </div>

        {/* Net Savings */}
        <div className="bg-[#130b20]/90 border border-purple-500/30 hover:border-teal-500/50 rounded-2xl p-5 space-y-3 shadow-neo-purple transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-orbitron font-bold text-purple-300/80 uppercase tracking-wider">
              SISA TABUNGAN NET
            </span>
            <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 group-hover:scale-110 transition-transform">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className={`text-2xl font-mono font-black ${netSavings >= 0 ? 'text-teal-300 drop-shadow-[0_0_8px_rgba(20,184,166,0.4)]' : 'text-rose-400'}`}>
              {formatRupiah(netSavings)}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-purple-200/70 font-rajdhani font-semibold mt-1">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>Arus kas bersih ditabung</span>
            </div>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-[#130b20]/90 border border-purple-500/30 hover:border-purple-400/50 rounded-2xl p-5 space-y-3 shadow-neo-purple transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-orbitron font-bold text-purple-300/80 uppercase tracking-wider">
              SAVINGS RATE (TABUNGAN)
            </span>
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 group-hover:scale-110 transition-transform">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-mono font-black text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
              {savingsRate.toFixed(1)}%
            </p>
            <div className="text-[11px] font-rajdhani font-semibold mt-1">
              {savingsRate >= 20 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Ideal (&ge; 20%)
                </span>
              ) : (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Perlu Efisiensi
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Financial Health & Insights Highlight Widget */}
      <div className="bg-[#130b20] border border-purple-500/30 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-neo-purple items-center">
        
        {/* Health Score */}
        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-purple-500/20 pb-3 md:pb-0 md:pr-4">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-purple-800 p-0.5 flex items-center justify-center shadow-neo-purple">
              <div className="w-full h-full bg-[#130b20] rounded-[14px] flex flex-col items-center justify-center">
                <span className="text-xl font-orbitron font-black text-neon-purple">{healthScore}</span>
                <span className="text-[9px] font-mono text-purple-400/80">/100</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-orbitron font-bold text-purple-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SKOR KESEHATAN KEUANGAN</span>
            </div>
            <p className="text-xs text-purple-300/80 font-rajdhani font-semibold mt-0.5">
              {healthScore >= 80 ? 'Kondisi Finansial Sangat Sehat 🌟' : healthScore >= 60 ? 'Kondisi Finansial Stabil 👍' : 'Perlu Kontrol Anggaran ⚠️'}
            </p>
          </div>
        </div>

        {/* Top Expense Insights */}
        <div className="border-b md:border-b-0 md:border-r border-purple-500/20 pb-3 md:pb-0 md:pr-4">
          <span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-fuchsia-400" /> PENGELUARAN TERBESAR
          </span>
          {topExpenseCategory ? (
            <div className="mt-1">
              <p className="font-orbitron font-bold text-sm text-white">
                {topExpenseCategory.name}
              </p>
              <p className="text-xs font-mono font-bold text-rose-400">
                {formatRupiah(topExpenseCategory.value)} ({topExpenseCategory.percentage.toFixed(1)}% dari total)
              </p>
            </div>
          ) : (
            <p className="text-xs font-rajdhani text-purple-300/60 mt-1">Belum ada data pengeluaran.</p>
          )}
        </div>

        {/* Budget Realization Status */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-orbitron font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" /> STATUS ANGGARAN
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                {safeBudgetCount} Aman
              </span>
              {overBudgetCount > 0 && (
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-lg">
                  {overBudgetCount} Over Limit
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onOpenAIModal}
            className="p-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 transition-all cursor-pointer"
            title="Tanya AI Assistant"
          >
            <Zap className="w-4 h-4 text-purple-300" />
          </button>
        </div>

      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Expense Breakdown Pie & Bar Chart */}
        <div className="bg-[#130b20]/90 border border-purple-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-neo-purple">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
            <div>
              <h3 className="text-sm font-orbitron font-bold text-purple-100 flex items-center gap-2 uppercase tracking-wider">
                <PieChartIcon className="w-4 h-4 text-purple-400" />
                <span>Proporsi Pengeluaran Per Kategori</span>
              </h3>
              <p className="text-xs text-purple-400/70 font-rajdhani">Dimana uang paling banyak dihabiskan bulan ini</p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-[#0d0718] p-1 rounded-xl border border-purple-500/30">
              <button
                onClick={() => setChartViewMode('pie')}
                className={`p-1.5 rounded-lg text-xs font-orbitron transition-all cursor-pointer ${
                  chartViewMode === 'pie' ? 'bg-purple-600 text-white shadow-neo-purple' : 'text-purple-300/60 hover:text-white'
                }`}
                title="Tampilan Pie Chart"
              >
                <PieChartIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setChartViewMode('bar')}
                className={`p-1.5 rounded-lg text-xs font-orbitron transition-all cursor-pointer ${
                  chartViewMode === 'bar' ? 'bg-purple-600 text-white shadow-neo-purple' : 'text-purple-300/60 hover:text-white'
                }`}
                title="Tampilan Grafik Batang"
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {pieChartData.length > 0 ? (
              chartViewMode === 'pie' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#130b20', borderColor: '#a855f7', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                      formatter={(val: any) => [formatRupiah(Number(val)), 'Total']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pieChartData} layout="vertical" margin={{ top: 5, right: 10, left: 30, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#d8b4fe', fontSize: 10, fontFamily: 'Orbitron' }} width={90} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#130b20', borderColor: '#a855f7', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                      formatter={(val: any) => [formatRupiah(Number(val)), 'Jumlah']}
                    />
                    <Bar dataKey="value" fill="#a855f7" radius={[0, 8, 8, 0]}>
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )
            ) : (
              <div className="text-xs text-purple-400/50 font-orbitron">Tidak ada data pengeluaran untuk bulan ini.</div>
            )}
          </div>

          {/* Enhanced Legend with Percentages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-purple-500/20 text-xs max-h-48 overflow-y-auto">
            {pieChartData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-purple-200 bg-[#1a0f30] p-2.5 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-colors">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="truncate font-orbitron text-[11px] font-bold text-white">{item.name}</span>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <span className="font-mono font-bold text-purple-300 block text-[11px]">{formatRupiah(item.value)}</span>
                  <span className="text-[9px] font-mono text-purple-400/70">{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget vs Actual Spending Progress Bars */}
        <div className="bg-[#130b20]/90 border border-purple-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-neo-purple flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div>
                <h3 className="text-sm font-orbitron font-bold text-purple-100 flex items-center gap-2 uppercase tracking-wider">
                  <Target className="w-4 h-4 text-purple-400" />
                  <span>Realisasi vs Batas Anggaran Bulanan</span>
                </h3>
                <p className="text-xs text-purple-400/70 font-rajdhani">Pantau batas maksimal pengeluaran per kategori</p>
              </div>

              <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                {budgets.length} Kategori
              </span>
            </div>

            <div className="space-y-3 mt-4 max-h-[340px] overflow-y-auto pr-1">
              {budgetVsActualData.map((item) => (
                <div key={item.category} className="bg-[#1a0f30] border border-purple-500/30 hover:border-purple-400/50 rounded-xl p-3.5 space-y-2 shadow-neo-purple transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-orbitron font-bold text-white tracking-wide">{item.category}</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-xs">
                      <span className={item.isOverBudget ? 'text-rose-400 font-black' : 'text-purple-200'}>
                        {formatRupiah(item.actual)}
                      </span>
                      <span className="text-purple-400/50">/ {formatRupiah(item.limit)}</span>
                    </div>
                  </div>

                  {/* Cyber Progress Bar */}
                  <div className="w-full bg-[#0d0718] h-2.5 rounded-full overflow-hidden border border-purple-500/20 p-0.5">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        item.isOverBudget 
                          ? 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_10px_#f43f5e]' 
                          : item.percentage > 80 
                          ? 'bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_10px_#f59e0b]' 
                          : 'bg-gradient-to-r from-purple-600 via-emerald-400 to-teal-300 shadow-[0_0_10px_#10b981]'
                      }`}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-purple-300/80 font-bold">{item.percentage.toFixed(0)}% Terpakai</span>
                    {item.isOverBudget ? (
                      <span className="text-rose-400 font-bold flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        <AlertTriangle className="w-3 h-3 text-rose-400" /> Over {formatRupiah(item.actual - item.limit)}
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Sisa {formatRupiah(item.limit - item.actual)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between text-[11px] font-rajdhani text-purple-300/70">
            <span>* Evaluasi bulanan dapat disinkronkan langsung dengan Asisten AI Gemini.</span>
            <button
              onClick={onOpenAIModal}
              className="text-xs font-orbitron font-bold text-fuchsia-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Konsultasi AI</span>
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

