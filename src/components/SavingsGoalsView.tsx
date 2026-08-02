import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  PiggyBank, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Wallet, 
  TrendingUp, 
  Building2, 
  Car, 
  Home, 
  ShieldAlert, 
  Plane, 
  Smartphone, 
  GraduationCap, 
  Heart, 
  Briefcase, 
  HelpCircle,
  Edit2,
  Trash2,
  ChevronRight,
  Clock,
  ArrowUpRight,
  History,
  Check,
  AlertCircle,
  Coins,
  Calculator,
  Flame,
  Zap,
  Award,
  Layers
} from 'lucide-react';
import { SavingsGoal, SavingsCategory, SavingsDeposit, AccountType } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

interface SavingsGoalsViewProps {
  savingsGoals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'deposits'> & { initialDeposit?: number }) => void;
  onEditGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
  onAddDeposit: (goalId: string, deposit: Omit<SavingsDeposit, 'id'>, syncJournal: boolean) => void;
  onDeleteDeposit?: (goalId: string, depositId: string) => void;
}

export const SavingsGoalsView: React.FC<SavingsGoalsViewProps> = ({
  savingsGoals,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onAddDeposit,
  onDeleteDeposit,
}) => {
  // Filter states
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'progress' | 'targetDate' | 'amount'>('default');
  
  // Simulator state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [monthlySimInput, setMonthlySimInput] = useState<number>(2000000);
  
  // Modals state
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  
  const [depositModalGoal, setDepositModalGoal] = useState<SavingsGoal | null>(null);
  const [historyModalGoal, setHistoryModalGoal] = useState<SavingsGoal | null>(null);

  // Form states for Add/Edit Goal
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<SavingsCategory>('Dana Darurat');
  const [goalTargetAmount, setGoalTargetAmount] = useState<string>('');
  const [goalInitialAmount, setGoalInitialAmount] = useState<string>('');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [goalSourceAccount, setGoalSourceAccount] = useState<AccountType>('Bank BCA');
  const [goalNotes, setGoalNotes] = useState('');

  // Form states for Deposit Modal
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositDate, setDepositDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [depositAccount, setDepositAccount] = useState<AccountType>('Bank BCA');
  const [depositNote, setDepositNote] = useState<string>('');
  const [syncToJournal, setSyncToJournal] = useState<boolean>(true);

  // Celebration overlay state
  const [celebrationGoal, setCelebrationGoal] = useState<SavingsGoal | null>(null);

  // Helper for category icons
  const getCategoryIcon = (category: SavingsCategory) => {
    switch (category) {
      case 'Kendaraan':
        return Car;
      case 'Properti':
        return Home;
      case 'Dana Darurat':
        return ShieldAlert;
      case 'Liburan / Travel':
        return Plane;
      case 'Gadget / Elektronik':
        return Smartphone;
      case 'Pendidikan':
        return GraduationCap;
      case 'Pernikahan':
        return Heart;
      case 'Investasi / Business':
        return Briefcase;
      default:
        return Target;
    }
  };

  // Helper for category colors & glows
  const getCategoryBadgeClass = (category: SavingsCategory) => {
    switch (category) {
      case 'Dana Darurat':
        return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
      case 'Kendaraan':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.25)]';
      case 'Properti':
        return 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]';
      case 'Liburan / Travel':
        return 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]';
      case 'Gadget / Elektronik':
        return 'bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20 text-fuchsia-300 border-fuchsia-500/40 shadow-[0_0_12px_rgba(217,70,239,0.25)]';
      case 'Pendidikan':
        return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]';
      case 'Pernikahan':
        return 'bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)]';
      default:
        return 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/40 shadow-[0_0_12px_rgba(20,184,166,0.25)]';
    }
  };

  // Calculations
  const totalTargetNominal = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCollectedNominal = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalRemainingNominal = Math.max(0, totalTargetNominal - totalCollectedNominal);
  const overallPercentage = totalTargetNominal > 0 ? Math.min(100, Math.round((totalCollectedNominal / totalTargetNominal) * 100)) : 0;

  const completedGoalsCount = savingsGoals.filter((g) => g.currentAmount >= g.targetAmount || g.isCompleted).length;
  const activeGoalsCount = savingsGoals.length - completedGoalsCount;

  // Filtered Goals list
  let filteredGoals = savingsGoals.filter((goal) => {
    const isDone = goal.currentAmount >= goal.targetAmount || goal.isCompleted;
    if (filterStatus === 'active' && isDone) return false;
    if (filterStatus === 'completed' && !isDone) return false;

    if (filterCategory !== 'ALL' && goal.category !== filterCategory) return false;

    return true;
  });

  // Sorting
  filteredGoals = [...filteredGoals].sort((a, b) => {
    const pctA = a.targetAmount > 0 ? a.currentAmount / a.targetAmount : 0;
    const pctB = b.targetAmount > 0 ? b.currentAmount / b.targetAmount : 0;
    
    if (sortBy === 'progress') return pctB - pctA;
    if (sortBy === 'targetDate') return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    if (sortBy === 'amount') return b.targetAmount - a.targetAmount;
    return 0;
  });

  // Open modal for new goal
  const handleOpenAddGoal = () => {
    setEditingGoal(null);
    setGoalTitle('');
    setGoalCategory('Dana Darurat');
    setGoalTargetAmount('');
    setGoalInitialAmount('');
    setGoalTargetDate('');
    setGoalSourceAccount('Bank BCA');
    setGoalNotes('');
    setIsAddGoalModalOpen(true);
  };

  // Open modal for edit goal
  const handleOpenEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalCategory(goal.category);
    setGoalTargetAmount(goal.targetAmount.toString());
    setGoalInitialAmount('');
    setGoalTargetDate(goal.targetDate);
    setGoalSourceAccount(goal.sourceAccount || 'Bank BCA');
    setGoalNotes(goal.notes || '');
    setIsAddGoalModalOpen(true);
  };

  // Submit Goal Add/Edit
  const handleSubmitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAmt = parseFloat(goalTargetAmount.replace(/[^0-9]/g, '')) || 0;
    const initialAmt = parseFloat(goalInitialAmount.replace(/[^0-9]/g, '')) || 0;

    if (!goalTitle.trim()) {
      alert('Judul target tabungan wajib diisi!');
      return;
    }
    if (targetAmt <= 0) {
      alert('Target nominal tabungan harus lebih dari Rp 0!');
      return;
    }

    if (editingGoal) {
      onEditGoal({
        ...editingGoal,
        title: goalTitle,
        category: goalCategory,
        targetAmount: targetAmt,
        targetDate: goalTargetDate || new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
        sourceAccount: goalSourceAccount,
        notes: goalNotes,
      });
    } else {
      onAddGoal({
        title: goalTitle,
        category: goalCategory,
        targetAmount: targetAmt,
        currentAmount: initialAmt,
        targetDate: goalTargetDate || new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
        startDate: new Date().toISOString().slice(0, 10),
        sourceAccount: goalSourceAccount,
        notes: goalNotes,
        initialDeposit: initialAmt,
      });
    }

    setIsAddGoalModalOpen(false);
  };

  // Submit Deposit (Nabung)
  const handleOpenDepositModal = (goal: SavingsGoal) => {
    setDepositModalGoal(goal);
    setDepositAmount('');
    setDepositDate(new Date().toISOString().slice(0, 10));
    setDepositAccount(goal.sourceAccount || 'Bank BCA');
    setDepositNote(`Nabung rutin ke ${goal.title}`);
    setSyncToJournal(true);
  };

  const handleApplyQuickPreset = (amount: number) => {
    setDepositAmount(amount.toLocaleString('id-ID'));
  };

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoal) return;

    const amt = parseFloat(depositAmount.replace(/[^0-9]/g, '')) || 0;
    if (amt <= 0) {
      alert('Nominal setoran tabungan harus lebih dari Rp 0!');
      return;
    }

    onAddDeposit(
      depositModalGoal.id,
      {
        date: depositDate,
        amount: amt,
        account: depositAccount,
        note: depositNote || `Setoran tabungan ${depositModalGoal.title}`,
      },
      syncToJournal
    );

    const updatedCurrent = depositModalGoal.currentAmount + amt;
    if (updatedCurrent >= depositModalGoal.targetAmount && !depositModalGoal.isCompleted) {
      setCelebrationGoal({
        ...depositModalGoal,
        currentAmount: updatedCurrent,
        isCompleted: true,
      });
    }

    setDepositModalGoal(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* SECTION HEADER & TITLE */}
      <div className="bg-gradient-to-r from-[#140b24] via-[#1c1033] to-[#140b24] border border-purple-500/35 rounded-3xl p-6 lg:p-8 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-orbitron font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                TARGET FINANCIAL GOALS
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-fuchsia-300 border border-purple-500/30 text-[10px] font-mono">
                {savingsGoals.length} TARGET DIPANTAU
              </span>
            </div>
            <h2 className="font-orbitron font-black text-2xl lg:text-3xl text-white tracking-wider flex items-center gap-3">
              <Target className="w-8 h-8 text-emerald-400 animate-pulse" />
              <span>TABUNGAN & TARGET IMPAN</span>
            </h2>
            <p className="text-sm font-rajdhani text-purple-200/80 max-w-2xl">
              Alokasikan dana khusus untuk mewujudkan target kendaraan, rumah, dana darurat, maupun liburan impian. Pantau progress nabung real-time dan rasakan pencapaian finansial Anda!
            </p>
          </div>

          <button
            onClick={handleOpenAddGoal}
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-xs px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Plus className="w-5 h-5 text-slate-950 stroke-[3]" />
            <span>BUAT TARGET IMPAN BARU</span>
          </button>
        </div>

        {/* TOP SUMMARY KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-500/20">
          <div className="bg-[#120a21] border border-emerald-500/30 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-purple-300/80 font-orbitron font-bold">
              <span>TOTAL DANA TERKUMPUL</span>
              <PiggyBank className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-mono font-black text-emerald-400">{formatRupiah(totalCollectedNominal)}</p>
            <p className="text-[10px] font-mono text-purple-300/60">Dari total target {formatRupiah(totalTargetNominal)}</p>
          </div>

          <div className="bg-[#120a21] border border-purple-500/30 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-purple-300/80 font-orbitron font-bold">
              <span>SISA TARGET DANA</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl font-mono font-black text-amber-300">{formatRupiah(totalRemainingNominal)}</p>
            <p className="text-[10px] font-mono text-purple-300/60">Perlu dikumpulkan untuk 100% lunas</p>
          </div>

          <div className="bg-[#120a21] border border-purple-500/30 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-purple-300/80 font-orbitron font-bold">
              <span>PROGRESS CAPAIAN</span>
              <TrendingUp className="w-4 h-4 text-fuchsia-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-mono font-black text-fuchsia-300">{overallPercentage}%</p>
              <span className="text-xs text-purple-300/70 font-mono">Tercapai</span>
            </div>
            <div className="w-full h-1.5 bg-purple-950 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-[#120a21] border border-purple-500/30 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-purple-300/80 font-orbitron font-bold">
              <span>STATUS TARGET</span>
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
            </div>
            <div className="flex items-center gap-3 pt-0.5">
              <div>
                <p className="text-lg font-mono font-black text-teal-300">{completedGoalsCount}</p>
                <p className="text-[9px] font-orbitron text-teal-400/80">TERCAPAI</p>
              </div>
              <div className="h-6 w-px bg-purple-500/30" />
              <div>
                <p className="text-lg font-mono font-black text-purple-200">{activeGoalsCount}</p>
                <p className="text-[9px] font-orbitron text-purple-300/70">BERJALAN</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & CATEGORY BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#140b24] border border-purple-500/25 rounded-2xl p-4">
        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`font-orbitron text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg'
                : 'bg-[#1a0f30] text-purple-300 hover:text-white border border-purple-500/30'
            }`}
          >
            Semua ({savingsGoals.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`font-orbitron text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'active'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg'
                : 'bg-[#1a0f30] text-purple-300 hover:text-white border border-purple-500/30'
            }`}
          >
            Masih Nabung ({activeGoalsCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`font-orbitron text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'bg-[#1a0f30] text-purple-300 hover:text-white border border-purple-500/30'
            }`}
          >
            Tercapai ({completedGoalsCount})
          </button>
        </div>

        {/* Category Dropdown Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-orbitron font-bold text-purple-300/80">KATEGORI:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#1a0f30] border border-purple-500/30 text-purple-100 font-orbitron text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-fuchsia-400 cursor-pointer"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Dana Darurat">Dana Darurat</option>
            <option value="Kendaraan">Kendaraan</option>
            <option value="Properti">Properti</option>
            <option value="Liburan / Travel">Liburan / Travel</option>
            <option value="Gadget / Elektronik">Gadget / Elektronik</option>
            <option value="Pendidikan">Pendidikan</option>
            <option value="Pernikahan">Pernikahan</option>
            <option value="Investasi / Business">Investasi / Business</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
      </div>

      {/* SAVINGS GOALS GRID */}
      {filteredGoals.length === 0 ? (
        <div className="bg-[#140b24] border border-purple-500/25 rounded-3xl p-12 text-center space-y-4">
          <Target className="w-12 h-12 text-purple-400/50 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-orbitron font-bold text-white text-lg">Belum Ada Target Tabungan</h3>
            <p className="text-xs text-purple-300/70 font-rajdhani max-w-md mx-auto">
              Mulai buat rencana impian Anda sekarang! Tentukan berapa nominal yang ingin dicapai dan tanggal targetnya.
            </p>
          </div>
          <button
            onClick={handleOpenAddGoal}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-orbitron font-bold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950 font-bold" />
            <span>BUAT TARGET PERTAMA</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => {
            const IconComp = getCategoryIcon(goal.category);
            const badgeStyle = getCategoryBadgeClass(goal.category);
            const isCompleted = goal.currentAmount >= goal.targetAmount || goal.isCompleted;
            const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            // Calculate estimated remaining months
            const targetDateObj = new Date(goal.targetDate);
            const now = new Date();
            const diffMonths = Math.max(1, (targetDateObj.getFullYear() - now.getFullYear()) * 12 + (targetDateObj.getMonth() - now.getMonth()));
            const monthlyReq = remaining > 0 ? Math.ceil(remaining / diffMonths) : 0;

            return (
              <div
                key={goal.id}
                className={`bg-[#140b24] border rounded-3xl p-6 transition-all hover:border-purple-400/50 space-y-5 flex flex-col justify-between relative overflow-hidden shadow-xl ${
                  isCompleted
                    ? 'border-emerald-500/60 bg-gradient-to-b from-[#140b24] to-[#0f1f1d]'
                    : 'border-purple-500/30'
                }`}
              >
                {/* Completed Badge Glow */}
                {isCompleted && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-400 text-slate-950 font-orbitron font-black text-[10px] px-4 py-1 rounded-bl-2xl shadow-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                    <span>TARGET TERCAPAI 100%!</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Category & Action Header */}
                  <div className="flex items-center justify-between gap-2 pr-16">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-orbitron font-bold border flex items-center gap-1.5 ${badgeStyle}`}>
                        <IconComp className="w-3.5 h-3.5" />
                        <span>{goal.category}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditGoal(goal)}
                        title="Edit Target"
                        className="p-1.5 rounded-lg text-purple-300/70 hover:text-white hover:bg-purple-500/20 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus target tabungan "${goal.title}"?`)) {
                            onDeleteGoal(goal.id);
                          }
                        }}
                        title="Hapus Target"
                        className="p-1.5 rounded-lg text-rose-400/70 hover:text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Notes */}
                  <div>
                    <h3 className="font-orbitron font-bold text-lg text-white tracking-wide">{goal.title}</h3>
                    {goal.notes && (
                      <p className="text-xs text-purple-300/70 font-rajdhani mt-1 line-clamp-2">
                        {goal.notes}
                      </p>
                    )}
                  </div>

                  {/* Amount Progress Metrics */}
                  <div className="bg-[#1b0f33] border border-purple-500/20 rounded-2xl p-4 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-[10px] font-orbitron font-bold text-purple-300/70 uppercase">TERKUMPUL</p>
                        <p className={`text-xl font-mono font-black ${isCompleted ? 'text-emerald-400' : 'text-purple-100'}`}>
                          {formatRupiah(goal.currentAmount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-orbitron font-bold text-purple-300/70 uppercase">TARGET DANA</p>
                        <p className="text-sm font-mono font-bold text-purple-200">
                          {formatRupiah(goal.targetAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono font-bold">
                        <span className={isCompleted ? 'text-emerald-400' : 'text-fuchsia-300'}>{pct}% Terkumpul</span>
                        <span className="text-purple-300/70">
                          {isCompleted ? 'LUNAS 🎉' : `Kurang ${formatRupiah(remaining)}`}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-purple-500/30">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted
                              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_12px_#10b981]'
                              : 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-400 shadow-[0_0_10px_#d946ef]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date & Estimated Monthly Requirement */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-[#120a21] p-2.5 rounded-xl border border-purple-500/20 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-orbitron text-purple-400/70 uppercase">TARGET TGL</p>
                        <p className="text-purple-200 font-bold truncate">{formatDateIndo(goal.targetDate)}</p>
                      </div>
                    </div>

                    <div className="bg-[#120a21] p-2.5 rounded-xl border border-purple-500/20 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <div>
                        <p className="text-[9px] font-orbitron text-purple-400/70 uppercase">REKOMENDASI/BLN</p>
                        <p className="text-teal-300 font-bold truncate">
                          {isCompleted ? 'Selesai' : `≈ ${formatRupiah(monthlyReq)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="pt-2 border-t border-purple-500/20 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenDepositModal(goal)}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-slate-950 font-black" />
                    <span>SETOR TABUNGAN</span>
                  </button>

                  <button
                    onClick={() => setHistoryModalGoal(goal)}
                    className="bg-[#1b0f33] hover:bg-purple-900/40 text-purple-200 border border-purple-500/30 font-orbitron font-bold text-xs py-2.5 px-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <History className="w-4 h-4 text-purple-400" />
                    <span>RIWAYAT ({goal.deposits?.length || 0})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD / EDIT GOAL */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#130b20] border border-purple-500/50 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-[0_0_35px_rgba(168,85,247,0.3)] animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <h3 className="font-orbitron font-bold text-lg text-white">
                  {editingGoal ? 'EDIT TARGET IMPAN' : 'BUAT TARGET TABUNGAN BARU'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddGoalModalOpen(false)}
                className="text-purple-400/60 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-orbitron font-bold text-purple-300 mb-1">
                  Judul Target Financial Goal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beli Mobil Honda HR-V / DP Rumah Impian"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full bg-[#1b0f33] border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm font-rajdhani text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-orbitron font-bold text-purple-300 mb-1">
                    Kategori Impian *
                  </label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value as SavingsCategory)}
                    className="w-full bg-[#1b0f33] border border-purple-500/30 rounded-xl px-3 py-2.5 text-xs font-orbitron text-purple-100 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Dana Darurat">Dana Darurat</option>
                    <option value="Kendaraan">Kendaraan</option>
                    <option value="Properti">Properti</option>
                    <option value="Liburan / Travel">Liburan / Travel</option>
                    <option value="Gadget / Elektronik">Gadget / Elektronik</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Pernikahan">Pernikahan</option>
                    <option value="Investasi / Business">Investasi / Business</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-orbitron font-bold text-purple-300 mb-1">
                    Target Nominal (IDR) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 50.000.000"
                    value={goalTargetAmount}
                    onChange={(e) => setGoalTargetAmount(e.target.value)}
                    className="w-full bg-[#1b0f33] border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {!editingGoal && (
                <div>
                  <label className="block text-xs font-orbitron font-bold text-purple-300 mb-1">
                    Setoran Awal (Optional / Boleh 0)
                  </label>
                  <input
                    type="text"
                    placeholder="Nominal awal yang sudah ada (Rp)"
                    value={goalInitialAmount}
                    onChange={(e) => setGoalInitialAmount(e.target.value)}
                    className="w-full bg-[#1b0f33] border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm font-mono text-purple-200 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-orbitron font-bold text-purple-300 mb-1">
                    Target Tgl Jatuh Tempo *
                  </label>
                  <input
                    type="date"
                    required
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full bg-[#1b0f33] border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-orbitron font-bold text-purple-300 mb-1">
                    Rekening Utama Penyimpanan
                  </label>
                  <select
                    value={goalSourceAccount}
                    onChange={(e) => setGoalSourceAccount(e.target.value as AccountType)}
                    className="w-full bg-[#1b0f33] border border-purple-500/30 rounded-xl px-3 py-2.5 text-xs font-orbitron text-purple-100 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Bank BCA">Bank BCA</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                    <option value="Bank BRI">Bank BRI</option>
                    <option value="Bank BNI">Bank BNI</option>
                    <option value="SeaBank">SeaBank</option>
                    <option value="E-Wallet (GoPay/OVO/DANA)">E-Wallet</option>
                    <option value="Kas / Tunai">Kas / Tunai</option>
                    <option value="Rekening Investasi">Rekening Investasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-orbitron font-bold text-purple-300 mb-1">
                  Catatan Motivasi / Rincian
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan tambahan alokasi nabung..."
                  value={goalNotes}
                  onChange={(e) => setGoalNotes(e.target.value)}
                  className="w-full bg-[#1b0f33] border border-purple-500/30 rounded-xl p-3 text-xs font-rajdhani text-purple-100 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-purple-500/30 text-purple-300 font-orbitron text-xs hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-orbitron font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-slate-950 font-bold" />
                  <span>{editingGoal ? 'SIMPAN PERUBAHAN' : 'BUAT TARGET SEKARANG'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DEPOSIT (SETOR TABUNGAN) */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#130b20] border border-emerald-500/50 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-[0_0_35px_rgba(16,185,129,0.3)] animate-fadeIn">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-emerald-400" />
                <h3 className="font-orbitron font-bold text-emerald-400 text-base">CATAT SETORAN TABUNGAN</h3>
              </div>
              <button
                onClick={() => setDepositModalGoal(null)}
                className="text-purple-400/60 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#1b0f33] p-3.5 rounded-2xl border border-purple-500/20 space-y-1">
              <p className="text-[10px] font-orbitron text-purple-400 uppercase">Target Tujuan Setoran</p>
              <p className="font-orbitron font-bold text-white text-base">{depositModalGoal.title}</p>
              <p className="text-xs font-mono text-emerald-400">
                Terkumpul: {formatRupiah(depositModalGoal.currentAmount)} / {formatRupiah(depositModalGoal.targetAmount)}
              </p>
            </div>

            <form onSubmit={handleSubmitDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-orbitron font-bold text-purple-300 mb-1">
                  Nominal Setoran Nabung (IDR) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 1.000.000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-[#1b0f33] border border-emerald-500/40 rounded-xl px-4 py-3 text-lg font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                />

                {/* Quick Presets Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-orbitron text-purple-400/80 mr-1">QUICK PRESET:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickPreset(500000)}
                    className="px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-500/30 text-[10px] font-mono cursor-pointer"
                  >
                    +500rb
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickPreset(1000000)}
                    className="px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-500/30 text-[10px] font-mono cursor-pointer"
                  >
                    +1 Jt
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickPreset(2500000)}
                    className="px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-500/30 text-[10px] font-mono cursor-pointer"
                  >
                    +2.5 Jt
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickPreset(5000000)}
                    className="px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-500/30 text-[10px] font-mono cursor-pointer"
                  >
                    +5 Jt
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickPreset(Math.max(0, depositModalGoal.targetAmount - depositModalGoal.currentAmount))}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold cursor-pointer"
                  >
                    Pelunasan Total
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-orbitron font-bold text-purple-300 mb-1">
                    Tgl Setoran
                  </label>
                  <input
                    type="date"
                    required
                    value={depositDate}
                    onChange={(e) => setDepositDate(e.target.value)}
                    className="w-full bg-[#1b0f33] border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-orbitron font-bold text-purple-300 mb-1">
                    Sumber Rekening Bank
                  </label>
                  <select
                    value={depositAccount}
                    onChange={(e) => setDepositAccount(e.target.value as AccountType)}
                    className="w-full bg-[#1b0f33] border border-purple-500/30 rounded-xl px-2.5 py-2 text-xs font-orbitron text-purple-100 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Bank BCA">Bank BCA</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                    <option value="Bank BRI">Bank BRI</option>
                    <option value="Bank BNI">Bank BNI</option>
                    <option value="SeaBank">SeaBank</option>
                    <option value="E-Wallet (GoPay/OVO/DANA)">E-Wallet</option>
                    <option value="Kas / Tunai">Kas / Tunai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-orbitron font-bold text-purple-300 mb-1">
                  Catatan Setoran
                </label>
                <input
                  type="text"
                  placeholder="Catatan e.g. Nabung rutin sisa gaji"
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                  className="w-full bg-[#1b0f33] border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-rajdhani text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Checkbox Sync to Main Financial Journal */}
              <div className="bg-[#180d2d] p-3 rounded-xl border border-purple-500/30 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  id="syncJournalCheck"
                  checked={syncToJournal}
                  onChange={(e) => setSyncToJournal(e.target.checked)}
                  className="mt-0.5 rounded border-purple-500 text-emerald-500 focus:ring-emerald-400"
                />
                <label htmlFor="syncJournalCheck" className="text-xs text-purple-200 cursor-pointer font-rajdhani">
                  <span className="font-bold text-emerald-400">Catat Otomatis Pengeluaran di Jurnal Kas</span>
                  <p className="text-[10px] text-purple-300/70">
                    Otomatis mengurangi saldo {depositAccount} di Dashboard RINJANI dengan kategori Investasi/Tabungan.
                  </p>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDepositModalGoal(null)}
                  className="px-4 py-2.5 rounded-xl border border-purple-500/30 text-purple-300 font-orbitron text-xs hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-orbitron font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-slate-950 font-bold" />
                  <span>KONFIRMASI SETORAN</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DEPOSIT HISTORY */}
      {historyModalGoal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#130b20] border border-purple-500/50 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-[0_0_35px_rgba(168,85,247,0.3)] animate-fadeIn max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-fuchsia-400" />
                <h3 className="font-orbitron font-bold text-white text-base">
                  RIWAYAT SETORAN: {historyModalGoal.title}
                </h3>
              </div>
              <button
                onClick={() => setHistoryModalGoal(null)}
                className="text-purple-400/60 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {(!historyModalGoal.deposits || historyModalGoal.deposits.length === 0) ? (
                <p className="text-center text-xs font-rajdhani text-purple-300/70 py-6">
                  Belum ada catatan setoran untuk target ini.
                </p>
              ) : (
                historyModalGoal.deposits.map((dep, idx) => (
                  <div
                    key={dep.id || idx}
                    className="bg-[#1b0f33] border border-purple-500/25 rounded-2xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-purple-400">{formatDateIndo(dep.date)}</span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-orbitron text-[10px]">{dep.account}</span>
                      </div>
                      <p className="text-xs font-rajdhani font-semibold text-purple-100">{dep.note || 'Setoran Tabungan'}</p>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-mono font-bold text-emerald-400 text-sm">+{formatRupiah(dep.amount)}</p>
                      </div>
                      {onDeleteDeposit && (
                        <button
                          onClick={() => onDeleteDeposit(historyModalGoal.id, dep.id)}
                          title="Hapus setoran"
                          className="text-rose-400/60 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setHistoryModalGoal(null)}
                className="px-5 py-2 rounded-xl bg-[#1b0f33] border border-purple-500/30 text-purple-200 font-orbitron text-xs hover:text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: CELEBRATION WHEN GOAL ACHIEVED */}
      {celebrationGoal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#180e2b] via-[#120824] to-[#0c1615] border-2 border-emerald-400 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-bounce-short relative overflow-hidden">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_#10b981]">
              <Sparkles className="w-10 h-10 text-emerald-300 animate-spin" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-orbitron text-xs font-bold border border-emerald-400/40">
                🎉 SELAMAT! TARGET TERCAPAI!
              </span>
              <h3 className="font-orbitron font-black text-2xl text-white tracking-wider pt-2">
                {celebrationGoal.title}
              </h3>
              <p className="text-xs font-rajdhani text-purple-200/90">
                Impian finansial Anda resmi terkumpul 100%! Dana total sebesar{' '}
                <span className="text-emerald-400 font-bold">{formatRupiah(celebrationGoal.targetAmount)}</span> siap digunakan.
              </p>
            </div>

            <button
              onClick={() => setCelebrationGoal(null)}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-sm py-3.5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              MANTAP! TERIMA KASIH RINJANI
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
