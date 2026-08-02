import React, { useState, useEffect } from 'react';
import { 
  Transaction, 
  Investment, 
  DebtItem, 
  SalaryBonus, 
  BudgetCategory, 
  TradingJournalItem,
  SavingsGoal,
  SavingsDeposit,
  AccountType,
  ActiveTab,
  MarqueeSettings 
} from './types';
import { 
  loadStoredData, 
  saveTransactions, 
  saveInvestments, 
  saveDebts, 
  saveSalaries, 
  saveBudgets, 
  saveTradings,
  saveSavingsGoals,
  saveMarqueeSettings,
  DEFAULT_MARQUEE_SETTINGS,
  resetAllToDemoData, 
  exportBackupJSON 
} from './utils/storage';

import { HeaderNavbar } from './components/HeaderNavbar';
import { SidebarNavigation } from './components/SidebarNavigation';
import { RunningTickerBanner } from './components/RunningTickerBanner';
import { DashboardView } from './components/DashboardView';
import { JournalView } from './components/JournalView';
import { MonthlyReportView } from './components/MonthlyReportView';
import { InvestmentsView } from './components/InvestmentsView';
import { DebtView } from './components/DebtView';
import { SalaryBonusView } from './components/SalaryBonusView';
import { TradingJournalView } from './components/TradingJournalView';
import { SavingsGoalsView } from './components/SavingsGoalsView';

import { AddTransactionModal } from './components/AddTransactionModal';
import { AddInvestmentModal } from './components/AddInvestmentModal';
import { AddDebtModal } from './components/AddDebtModal';
import { AddSalaryModal } from './components/AddSalaryModal';
import { AddTradingModal } from './components/AddTradingModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { CurrencyRateModal } from './components/CurrencyRateModal';
import { CryptoMarketModal } from './components/CryptoMarketModal';
import { GoldMarketModal } from './components/GoldMarketModal';
import { TickerSettingsModal } from './components/TickerSettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Core App State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [debts, setDebts] = useState<DebtItem[]>([]);
  const [salaries, setSalaries] = useState<SalaryBonus[]>([]);
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [tradings, setTradings] = useState<TradingJournalItem[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  // Modals visibility
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const [isAddInvModalOpen, setIsAddInvModalOpen] = useState(false);
  const [editingInv, setEditingInv] = useState<Investment | null>(null);

  const [isAddDebtModalOpen, setIsAddDebtModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<DebtItem | null>(null);

  const [isAddSalaryModalOpen, setIsAddSalaryModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<SalaryBonus | null>(null);

  const [isAddTradingModalOpen, setIsAddTradingModalOpen] = useState(false);
  const [editingTrading, setEditingTrading] = useState<TradingJournalItem | null>(null);

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [isGoldModalOpen, setIsGoldModalOpen] = useState(false);
  const [isTickerModalOpen, setIsTickerModalOpen] = useState(false);

  // Marquee running text settings
  const [marqueeSettings, setMarqueeSettings] = useState<MarqueeSettings>(DEFAULT_MARQUEE_SETTINGS);

  // Load stored data on mount
  useEffect(() => {
    const loaded = loadStoredData();
    setTransactions(loaded.transactions);
    setInvestments(loaded.investments);
    setDebts(loaded.debts);
    setSalaries(loaded.salaries);
    setBudgets(loaded.budgets);
    if (loaded.tradings) {
      setTradings(loaded.tradings);
    }
    if (loaded.savingsGoals) {
      setSavingsGoals(loaded.savingsGoals);
    }
    if (loaded.marquee) {
      setMarqueeSettings(loaded.marquee);
    }
  }, []);

  const handleSaveMarqueeSettings = (newSettings: MarqueeSettings) => {
    setMarqueeSettings(newSettings);
    saveMarqueeSettings(newSettings);
  };

  // Save changes to localStorage
  const updateTransactions = (newTxList: Transaction[]) => {
    setTransactions(newTxList);
    saveTransactions(newTxList);
  };

  const updateInvestments = (newList: Investment[]) => {
    setInvestments(newList);
    saveInvestments(newList);
  };

  const updateDebts = (newList: DebtItem[]) => {
    setDebts(newList);
    saveDebts(newList);
  };

  const updateSalaries = (newList: SalaryBonus[]) => {
    setSalaries(newList);
    saveSalaries(newList);
  };

  const updateTradings = (newList: TradingJournalItem[]) => {
    setTradings(newList);
    saveTradings(newList);
  };

  const updateSavingsGoals = (newList: SavingsGoal[]) => {
    setSavingsGoals(newList);
    saveSavingsGoals(newList);
  };

  // Savings Goals Handlers
  const handleAddGoal = (goalData: Omit<SavingsGoal, 'id' | 'deposits'> & { initialDeposit?: number }) => {
    const newId = `goal-${Date.now()}`;
    const initialAmt = goalData.initialDeposit || 0;
    const initialDepositObj = initialAmt > 0 ? [{
      id: `dep-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      amount: initialAmt,
      account: goalData.sourceAccount || 'Bank BCA',
      note: 'Setoran awal target'
    }] : [];

    const newGoal: SavingsGoal = {
      id: newId,
      title: goalData.title,
      category: goalData.category,
      targetAmount: goalData.targetAmount,
      currentAmount: initialAmt,
      targetDate: goalData.targetDate,
      startDate: goalData.startDate,
      sourceAccount: goalData.sourceAccount,
      notes: goalData.notes,
      isCompleted: initialAmt >= goalData.targetAmount,
      deposits: initialDepositObj
    };

    updateSavingsGoals([newGoal, ...savingsGoals]);

    if (initialAmt > 0) {
      const newTx: Transaction = {
        id: `tx-dep-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        description: `Setoran Awal Tabungan: ${goalData.title}`,
        amount: initialAmt,
        type: 'expense',
        category: 'Investasi',
        account: goalData.sourceAccount || 'Bank BCA',
        note: `Alokasi tabungan target ${goalData.title}`
      };
      updateTransactions([newTx, ...transactions]);
    }
  };

  const handleEditGoal = (updatedGoal: SavingsGoal) => {
    const newList = savingsGoals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g));
    updateSavingsGoals(newList);
  };

  const handleDeleteGoal = (id: string) => {
    const newList = savingsGoals.filter((g) => g.id !== id);
    updateSavingsGoals(newList);
  };

  const handleAddDeposit = (goalId: string, deposit: Omit<SavingsDeposit, 'id'>, syncJournal: boolean) => {
    const newDepId = `dep-${Date.now()}`;
    const newDep: SavingsDeposit = {
      id: newDepId,
      ...deposit
    };

    const newList = savingsGoals.map((g) => {
      if (g.id === goalId) {
        const newCurrent = g.currentAmount + deposit.amount;
        const existingDeps = g.deposits || [];
        return {
          ...g,
          currentAmount: newCurrent,
          isCompleted: newCurrent >= g.targetAmount,
          deposits: [newDep, ...existingDeps]
        };
      }
      return g;
    });

    updateSavingsGoals(newList);

    if (syncJournal) {
      const targetGoal = savingsGoals.find(g => g.id === goalId);
      const goalName = targetGoal ? targetGoal.title : 'Target Impian';
      const newTx: Transaction = {
        id: `tx-dep-${Date.now()}`,
        date: deposit.date,
        description: `Setoran Tabungan: ${goalName}`,
        amount: deposit.amount,
        type: 'expense',
        category: 'Investasi',
        account: deposit.account,
        note: deposit.note || `Alokasi setoran tabungan target ${goalName}`
      };
      updateTransactions([newTx, ...transactions]);
    }
  };

  const handleDeleteDeposit = (goalId: string, depositId: string) => {
    const targetGoal = savingsGoals.find(g => g.id === goalId);
    if (!targetGoal) return;
    const depToRemove = targetGoal.deposits?.find(d => d.id === depositId);
    const removedAmt = depToRemove ? depToRemove.amount : 0;

    const newList = savingsGoals.map((g) => {
      if (g.id === goalId) {
        const newCurrent = Math.max(0, g.currentAmount - removedAmt);
        return {
          ...g,
          currentAmount: newCurrent,
          isCompleted: newCurrent >= g.targetAmount,
          deposits: (g.deposits || []).filter(d => d.id !== depositId)
        };
      }
      return g;
    });

    updateSavingsGoals(newList);
  };

  // Calculations
  const totalBalance = transactions.reduce((acc, tx) => {
    return tx.type === 'income' ? acc + tx.amount : acc - tx.amount;
  }, 0);

  const totalInvestmentVal = investments.reduce(
    (acc, inv) => acc + inv.currentPrice * inv.shares,
    0
  );

  const totalDebtsOwed = debts
    .filter((d) => d.type === 'hutang')
    .reduce((acc, d) => acc + (d.totalAmount - d.paidAmount), 0);

  const totalReceivablesOwed = debts
    .filter((d) => d.type === 'piutang')
    .reduce((acc, d) => acc + (d.totalAmount - d.paidAmount), 0);

  const netWorth = totalBalance + totalInvestmentVal + totalReceivablesOwed - totalDebtsOwed;

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = transactions.filter((tx) => tx.date.startsWith(currentMonthStr));
  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Transaction CRUD Handlers
  const handleSaveTransaction = (txData: Omit<Transaction, 'id'>, editId?: string) => {
    if (editId) {
      const updated = transactions.map((t) => (t.id === editId ? { ...txData, id: editId } : t));
      updateTransactions(updated);
    } else {
      const newTx: Transaction = {
        ...txData,
        id: `tx-${Date.now()}`,
      };
      updateTransactions([newTx, ...transactions]);
    }
    setEditingTx(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      updateTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  // Investment CRUD Handlers
  const handleSaveInvestment = (invData: Omit<Investment, 'id'>, editId?: string) => {
    if (editId) {
      const updated = investments.map((inv) => (inv.id === editId ? { ...invData, id: editId } : inv));
      updateInvestments(updated);
    } else {
      const newInv: Investment = {
        ...invData,
        id: `inv-${Date.now()}`,
      };
      updateInvestments([...investments, newInv]);
    }
    setEditingInv(null);
  };

  const handleDeleteInvestment = (id: string) => {
    if (window.confirm('Hapus item investasi ini dari portofolio?')) {
      updateInvestments(investments.filter((inv) => inv.id !== id));
    }
  };

  // Debt CRUD Handlers
  const handleSaveDebt = (debtData: Omit<DebtItem, 'id' | 'payments'>, editId?: string) => {
    if (editId) {
      const updated = debts.map((d) =>
        d.id === editId ? { ...debtData, id: editId, payments: d.payments } : d
      );
      updateDebts(updated);
    } else {
      const newDebt: DebtItem = {
        ...debtData,
        id: `debt-${Date.now()}`,
        payments: [],
      };
      updateDebts([...debts, newDebt]);
    }
    setEditingDebt(null);
  };

  const handleDeleteDebt = (id: string) => {
    if (window.confirm('Hapus catatan hutang/piutang ini?')) {
      updateDebts(debts.filter((d) => d.id !== id));
    }
  };

  const handlePayDebt = (debtId: string, paymentAmount: number, note: string) => {
    const targetDebt = debts.find((d) => d.id === debtId);
    if (!targetDebt) return;

    const newPaidAmount = targetDebt.paidAmount + paymentAmount;
    let newStatus = targetDebt.status;
    if (newPaidAmount >= targetDebt.totalAmount) newStatus = 'lunas';
    else if (newPaidAmount > 0) newStatus = 'sebagian';

    const newPaymentObj = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      amount: paymentAmount,
      note,
    };

    const updatedDebts = debts.map((d) =>
      d.id === debtId
        ? {
            ...d,
            paidAmount: newPaidAmount,
            status: newStatus,
            payments: [...d.payments, newPaymentObj],
          }
        : d
    );

    updateDebts(updatedDebts);

    // Auto-create transaction entry in journal so daily balance updates real-time!
    const journalType = targetDebt.type === 'hutang' ? 'expense' : 'income';
    const journalDesc = targetDebt.type === 'hutang'
      ? `Pembayaran Cicilan Hutang: ${targetDebt.title}`
      : `Penerimaan Pelunasan Piutang: ${targetDebt.title}`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      description: journalDesc,
      amount: paymentAmount,
      type: journalType,
      category: 'Tagihan & Utilitas',
      account: 'Bank BCA',
      note: `Pelunasan/Cicilan ke ${targetDebt.personName}. ${note}`,
    };

    updateTransactions([newTx, ...transactions]);
  };

  // Salary CRUD Handlers
  const handleSaveSalary = (salData: Omit<SalaryBonus, 'id'>, editId?: string) => {
    if (editId) {
      const updated = salaries.map((s) => (s.id === editId ? { ...salData, id: editId } : s));
      updateSalaries(updated);
    } else {
      const newSal: SalaryBonus = {
        ...salData,
        id: `sal-${Date.now()}`,
      };
      updateSalaries([...salaries, newSal]);
    }
    setEditingSalary(null);
  };

  const handleDeleteSalary = (id: string) => {
    if (window.confirm('Hapus slip gaji/bonus ini?')) {
      updateSalaries(salaries.filter((s) => s.id !== id));
    }
  };

  const handleClaimSalaryToJournal = (salaryItem: SalaryBonus) => {
    // Post income transaction into journal
    const newTx: Transaction = {
      id: `tx-sal-${Date.now()}`,
      date: salaryItem.date,
      description: `Klaim Gaji/Bonus: ${salaryItem.title}`,
      amount: salaryItem.nettAmount,
      type: 'income',
      category: 'Gaji & Bonus',
      account: 'Bank BCA',
      note: `Pencairan dari ${salaryItem.sourceCompany} (${salaryItem.period})`,
    };

    updateTransactions([newTx, ...transactions]);

    // Update salary item status & claim flag
    const updatedSalaries = salaries.map((s) =>
      s.id === salaryItem.id
        ? { ...s, status: 'diterima' as const, isClaimedToJournal: true }
        : s
    );
    updateSalaries(updatedSalaries);
  };

  // Trading CRUD Handlers
  const handleSaveTrading = (tradingData: Omit<TradingJournalItem, 'id'>, editId?: string) => {
    if (editId) {
      const updated = tradings.map((t) => (t.id === editId ? { ...tradingData, id: editId } : t));
      updateTradings(updated);
    } else {
      const newTrading: TradingJournalItem = {
        ...tradingData,
        id: `trd-${Date.now()}`,
      };
      updateTradings([newTrading, ...tradings]);
    }
    setEditingTrading(null);
  };

  const handleDeleteTrading = (id: string) => {
    if (window.confirm('Hapus catatan hasil trading ini?')) {
      updateTradings(tradings.filter((t) => t.id !== id));
    }
  };

  const handleClaimTradingToJournal = (tradingItem: TradingJournalItem) => {
    if (tradingItem.profitAmount <= 0) return;

    // Post income transaction into journal
    const newTx: Transaction = {
      id: `tx-trd-${Date.now()}`,
      date: tradingItem.date,
      description: `Profit Trading Forex/Crypto: ${tradingItem.title} (${tradingItem.pair})`,
      amount: tradingItem.profitAmount,
      type: 'income',
      category: 'Investasi',
      account: tradingItem.account || 'Bank BCA',
      note: `Hasil Trading ${tradingItem.pair} (${tradingItem.strategy}) - Broker: ${tradingItem.broker}`,
    };

    updateTransactions([newTx, ...transactions]);

    // Mark as claimed
    const updatedTradings = tradings.map((t) =>
      t.id === tradingItem.id ? { ...t, isClaimedToJournal: true } : t
    );
    updateTradings(updatedTradings);
  };

  const handleBatchClaimTradingToJournal = (
    items: TradingJournalItem[],
    bank: AccountType,
    summaryTitle?: string
  ) => {
    const validItems = items.filter((t) => t.profitAmount > 0 && !t.isClaimedToJournal);
    if (validItems.length === 0) return;

    const totalAmountIDR = validItems.reduce((sum, t) => sum + t.profitAmount, 0);
    const dateStr = new Date().toISOString().slice(0, 10);
    const title = summaryTitle || `Pencairan Batch Profit Trading (${validItems.length} Trade)`;

    // Post consolidated income transaction into journal
    const newTx: Transaction = {
      id: `tx-trd-batch-${Date.now()}`,
      date: dateStr,
      description: title,
      amount: totalAmountIDR,
      type: 'income',
      category: 'Investasi',
      account: bank || 'Bank BCA',
      note: `Pencairan kolektif ${validItems.length} transaksi profit trading ke ${bank}. Detail: ${validItems.map((i) => i.title).join('; ')}`,
    };

    updateTransactions([newTx, ...transactions]);

    // Mark all validItems as claimed
    const validIds = new Set(validItems.map((i) => i.id));
    const updatedTradings = tradings.map((t) =>
      validIds.has(t.id) ? { ...t, isClaimedToJournal: true, account: bank } : t
    );
    updateTradings(updatedTradings);
  };

  // AI Batch Add parsed transactions
  const handleBatchAddParsedTransactions = (parsedTxs: Partial<Transaction>[]) => {
    const createdList: Transaction[] = parsedTxs.map((ptx, idx) => ({
      id: `tx-ai-${Date.now()}-${idx}`,
      date: ptx.date || new Date().toISOString().slice(0, 10),
      description: ptx.description || 'Transaksi AI',
      amount: ptx.amount || 0,
      type: (ptx.type as any) || 'expense',
      category: ptx.category || 'Lain-lain',
      account: (ptx.account as any) || 'Bank BCA',
      note: ptx.note || 'Parsed by Gemini AI',
    }));

    updateTransactions([...createdList, ...transactions]);
  };

  const pendingBonusCount = salaries.filter((s) => !s.isClaimedToJournal).length;

  return (
    <div className="min-h-screen bg-[#0a0512] text-purple-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Sticky Header */}
      <HeaderNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalBalance={totalBalance}
        netWorth={netWorth}
        onOpenAddModal={() => {
          setEditingTx(null);
          setIsAddTxModalOpen(true);
        }}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onExportData={() =>
          exportBackupJSON({
            transactions,
            investments,
            debts,
            salaries,
            budgets,
            tradings,
            savingsGoals,
          })
        }
        onResetDemo={resetAllToDemoData}
      />

      {/* Running Marquee Text Ticker Banner */}
      <RunningTickerBanner
        settings={marqueeSettings}
        onOpenSettingsModal={() => setIsTickerModalOpen(true)}
      />

      {/* Main App Layout - Ultra-Wide Edge to Edge */}
      <div className="flex-1 w-full flex flex-col lg:flex-row min-h-0">
        
        {/* Left Menu Sidebar */}
        <SidebarNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAIModal={() => setIsAIModalOpen(true)}
          onOpenRateModal={() => setIsRateModalOpen(true)}
          onOpenCryptoModal={() => setIsCryptoModalOpen(true)}
          onOpenGoldModal={() => setIsGoldModalOpen(true)}
          debtCount={debts.filter((d) => d.status !== 'lunas').length}
          pendingBonusCount={pendingBonusCount}
          unclaimedTradingCount={tradings.filter((t) => t.type === 'profit' && !t.isClaimedToJournal).length}
          activeGoalsCount={savingsGoals.filter((g) => g.currentAmount < g.targetAmount && !g.isCompleted).length}
        />

        {/* Center Main Tab View */}
        <main className="flex-1 p-3 sm:p-4 lg:p-5 overflow-y-auto w-full min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              transactions={transactions}
              investments={investments}
              debts={debts}
              totalBalance={totalBalance}
              netWorth={netWorth}
              onOpenAddModal={() => {
                setEditingTx(null);
                setIsAddTxModalOpen(true);
              }}
              onOpenAIModal={() => setIsAIModalOpen(true)}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'jurnal' && (
            <JournalView
              transactions={transactions}
              onAddTransaction={() => {
                setEditingTx(null);
                setIsAddTxModalOpen(true);
              }}
              onEditTransaction={(tx) => {
                setEditingTx(tx);
                setIsAddTxModalOpen(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenAIModal={() => setIsAIModalOpen(true)}
            />
          )}

          {activeTab === 'laporan' && (
            <MonthlyReportView
              transactions={transactions}
              budgets={budgets}
              onOpenAIModal={() => setIsAIModalOpen(true)}
            />
          )}

          {activeTab === 'investasi' && (
            <InvestmentsView
              investments={investments}
              onAddInvestment={() => {
                setEditingInv(null);
                setIsAddInvModalOpen(true);
              }}
              onEditInvestment={(inv) => {
                setEditingInv(inv);
                setIsAddInvModalOpen(true);
              }}
              onDeleteInvestment={handleDeleteInvestment}
              onOpenAIModal={() => setIsAIModalOpen(true)}
            />
          )}

          {activeTab === 'hutang_piutang' && (
            <DebtView
              debts={debts}
              onAddDebt={() => {
                setEditingDebt(null);
                setIsAddDebtModalOpen(true);
              }}
              onEditDebt={(d) => {
                setEditingDebt(d);
                setIsAddDebtModalOpen(true);
              }}
              onDeleteDebt={handleDeleteDebt}
              onPayDebt={handlePayDebt}
              onOpenAIModal={() => setIsAIModalOpen(true)}
            />
          )}

          {activeTab === 'gaji_bonus' && (
            <SalaryBonusView
              salaries={salaries}
              onAddSalary={() => {
                setEditingSalary(null);
                setIsAddSalaryModalOpen(true);
              }}
              onEditSalary={(s) => {
                setEditingSalary(s);
                setIsAddSalaryModalOpen(true);
              }}
              onDeleteSalary={handleDeleteSalary}
              onClaimToJournal={handleClaimSalaryToJournal}
              onOpenAIModal={() => setIsAIModalOpen(true)}
            />
          )}

          {activeTab === 'trading' && (
            <TradingJournalView
              tradings={tradings}
              onOpenAddModal={() => {
                setEditingTrading(null);
                setIsAddTradingModalOpen(true);
              }}
              onEditTrading={(trd) => {
                setEditingTrading(trd);
                setIsAddTradingModalOpen(true);
              }}
              onDeleteTrading={handleDeleteTrading}
              onClaimToJournal={handleClaimTradingToJournal}
              onBatchClaimToJournal={handleBatchClaimTradingToJournal}
            />
          )}

          {activeTab === 'tabungan' && (
            <SavingsGoalsView
              savingsGoals={savingsGoals}
              onAddGoal={handleAddGoal}
              onEditGoal={handleEditGoal}
              onDeleteGoal={handleDeleteGoal}
              onAddDeposit={handleAddDeposit}
              onDeleteDeposit={handleDeleteDeposit}
            />
          )}
        </main>
      </div>

      {/* Dialog Modals */}
      <AddTransactionModal
        isOpen={isAddTxModalOpen}
        onClose={() => {
          setIsAddTxModalOpen(false);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTx}
      />

      <AddInvestmentModal
        isOpen={isAddInvModalOpen}
        onClose={() => {
          setIsAddInvModalOpen(false);
          setEditingInv(null);
        }}
        onSave={handleSaveInvestment}
        editingInvestment={editingInv}
      />

      <AddDebtModal
        isOpen={isAddDebtModalOpen}
        onClose={() => {
          setIsAddDebtModalOpen(false);
          setEditingDebt(null);
        }}
        onSave={handleSaveDebt}
        editingDebt={editingDebt}
      />

      <AddSalaryModal
        isOpen={isAddSalaryModalOpen}
        onClose={() => {
          setIsAddSalaryModalOpen(false);
          setEditingSalary(null);
        }}
        onSave={handleSaveSalary}
        editingSalary={editingSalary}
      />

      <AddTradingModal
        isOpen={isAddTradingModalOpen}
        onClose={() => {
          setIsAddTradingModalOpen(false);
          setEditingTrading(null);
        }}
        onSave={handleSaveTrading}
        editingTrading={editingTrading}
      />

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        financialContext={{
          totalBalance,
          monthlyIncome,
          monthlyExpense,
          totalInvestment: totalInvestmentVal,
          totalDebt: totalDebtsOwed,
          totalReceivable: totalReceivablesOwed,
        }}
        onBatchAddTransactions={handleBatchAddParsedTransactions}
      />

      <CurrencyRateModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
      />

      <CryptoMarketModal
        isOpen={isCryptoModalOpen}
        onClose={() => setIsCryptoModalOpen(false)}
      />

      <GoldMarketModal
        isOpen={isGoldModalOpen}
        onClose={() => setIsGoldModalOpen(false)}
      />

      <TickerSettingsModal
        isOpen={isTickerModalOpen}
        onClose={() => setIsTickerModalOpen(false)}
        settings={marqueeSettings}
        onSaveSettings={handleSaveMarqueeSettings}
      />
    </div>
  );
}
