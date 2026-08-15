import React, { useState, useEffect } from 'react';
import { 
  Transaction, 
  Investment, 
  InvestmentPurchase,
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

// Firebase Imports
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

import { 
  DEFAULT_MARQUEE_SETTINGS,
  exportBackupJSON,
  loadStoredData,
  saveTransactions,
  saveInvestments,
  saveDebts,
  saveSalaries,
  saveTradings,
  saveSavingsGoals,
  saveMarqueeSettings
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
import { AuthView } from './components/AuthView';

import { AddTransactionModal } from './components/AddTransactionModal';
import { AddInvestmentModal } from './components/AddInvestmentModal';
import { AddDebtModal } from './components/AddDebtModal';
import { AddSalaryModal } from './components/AddSalaryModal';
import { AddTradingModal } from './components/AddTradingModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { CurrencyRateModal } from './components/CurrencyRateModal';
import { CryptoMarketModal } from './components/CryptoMarketModal';
import { GoldMarketModal } from './components/GoldMarketModal';
import { SmartCalculatorModal } from './components/SmartCalculatorModal';
import { TickerSettingsModal } from './components/TickerSettingsModal';
import { RefreshCw, Menu, X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Core App State (initialized with local stored fallback)
  const initialData = loadStoredData();
  const [transactions, setTransactions] = useState<Transaction[]>(initialData.transactions);
  const [investments, setInvestments] = useState<Investment[]>(initialData.investments);
  const [debts, setDebts] = useState<DebtItem[]>(initialData.debts);
  const [salaries, setSalaries] = useState<SalaryBonus[]>(initialData.salaries);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(initialData.budgets);
  const [tradings, setTradings] = useState<TradingJournalItem[]>(initialData.tradings);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialData.savingsGoals);
  const [marqueeSettings, setMarqueeSettings] = useState<MarqueeSettings>(initialData.marquee || DEFAULT_MARQUEE_SETTINGS);

  // Modals visibility
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isAddInvModalOpen, setIsAddInvModalOpen] = useState(false);
  const [editingInv, setEditingInv] = useState<Investment | null>(null);
  const [preSelectedInvSymbol, setPreSelectedInvSymbol] = useState<string>('');
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
  const [isSCModalOpen, setIsSCModalOpen] = useState(false);
  const [isTickerModalOpen, setIsTickerModalOpen] = useState(false);

  // 1. Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Firestore Sync Listener
  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'settings', 'appData');
    const unsubscribe = onSnapshot(
      docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.transactions) { setTransactions(data.transactions); saveTransactions(data.transactions); }
          if (data.investments) { setInvestments(data.investments); saveInvestments(data.investments); }
          if (data.debts) { setDebts(data.debts); saveDebts(data.debts); }
          if (data.salaries) { setSalaries(data.salaries); saveSalaries(data.salaries); }
          if (data.budgets) { setBudgets(data.budgets); }
          if (data.tradings) { setTradings(data.tradings); saveTradings(data.tradings); }
          if (data.savingsGoals) { setSavingsGoals(data.savingsGoals); saveSavingsGoals(data.savingsGoals); }
          if (data.marquee) { setMarqueeSettings(data.marquee); saveMarqueeSettings(data.marquee); }
        } else {
          // Seed cloud database for new user
          const defaultData = loadStoredData();
          setDoc(docRef, {
            transactions: defaultData.transactions,
            investments: defaultData.investments,
            debts: defaultData.debts,
            salaries: defaultData.salaries,
            budgets: defaultData.budgets,
            tradings: defaultData.tradings,
            savingsGoals: defaultData.savingsGoals,
            marquee: defaultData.marquee
          }, { merge: true }).catch((e) => console.warn("Auto-seed warn:", e));
        }
      },
      (error) => {
        console.warn("Firestore snapshot listener warning (using local fallback):", error);
      }
    );
    return () => unsubscribe();
  }, [user]);

  // 3. Cloud Sync Helper
  const syncToCloud = async (updates: any) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'settings', 'appData');
    try {
      await setDoc(docRef, updates, { merge: true });
    } catch (err) {
      console.warn("Cloud Sync Note (persisting locally):", err);
    }
  };

  // 4. Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) { 
      console.error("Logout Error:", err); 
    }
  };

  // State Updates
  const updateTransactions = (newList: Transaction[]) => { 
    setTransactions(newList); 
    saveTransactions(newList);
    syncToCloud({ transactions: newList }); 
  };
  const updateInvestments = (newList: Investment[]) => { 
    setInvestments(newList); 
    saveInvestments(newList);
    syncToCloud({ investments: newList }); 
  };
  const updateDebts = (newList: DebtItem[]) => { 
    setDebts(newList); 
    saveDebts(newList);
    syncToCloud({ debts: newList }); 
  };
  const updateSalaries = (newList: SalaryBonus[]) => { 
    setSalaries(newList); 
    saveSalaries(newList);
    syncToCloud({ salaries: newList }); 
  };
  const updateTradings = (newList: TradingJournalItem[]) => { 
    setTradings(newList); 
    saveTradings(newList);
    syncToCloud({ tradings: newList }); 
  };
  const updateSavingsGoals = (newList: SavingsGoal[]) => { 
    setSavingsGoals(newList); 
    saveSavingsGoals(newList);
    syncToCloud({ savingsGoals: newList }); 
  };
  const handleSaveMarqueeSettings = (newSettings: MarqueeSettings) => { 
    setMarqueeSettings(newSettings); 
    saveMarqueeSettings(newSettings);
    syncToCloud({ marquee: newSettings }); 
  };

  // Logic Handlers
  const handleSaveTransaction = (txData: Omit<Transaction, 'id'>, editId?: string) => {
    if (editId) updateTransactions(transactions.map((t) => (t.id === editId ? { ...txData, id: editId } : t)));
    else updateTransactions([{ ...txData, id: `tx-${Date.now()}` }, ...transactions]);
    setEditingTx(null);
  };
  const handleDeleteTransaction = (id: string) => { if (window.confirm('Hapus transaksi?')) updateTransactions(transactions.filter((t) => t.id !== id)); };

  const handleSaveInvestment = (
    invData: Omit<Investment, 'id'>, 
    options?: { 
      editId?: string; 
      deductFromAccount?: AccountType; 
      deductAmount?: number; 
      isNewPurchaseOnExisting?: boolean; 
    }
  ) => {
    const editId = options?.editId;

    if (editId) {
      // Direct update of existing item
      const existing = investments.find((inv) => inv.id === editId);
      updateInvestments(
        investments.map((inv) =>
          inv.id === editId
            ? {
                ...invData,
                id: editId,
                purchases: existing?.purchases || []
              }
            : inv
        )
      );
    } else {
      // Check if this asset symbol already exists
      const cleanSymbol = invData.symbol.trim().toUpperCase();
      const existing = investments.find((i) => i.symbol.trim().toUpperCase() === cleanSymbol);

      if (existing) {
        const oldTotalCost = existing.buyPrice * existing.shares;
        const newPurchaseCost = invData.buyPrice * invData.shares;
        const newTotalShares = existing.shares + invData.shares;
        const newAvgBuyPrice = newTotalShares > 0 ? (oldTotalCost + newPurchaseCost) / newTotalShares : invData.buyPrice;

        const newPurchaseEntry: InvestmentPurchase = {
          id: `p-${Date.now()}`,
          date: invData.buyDate || new Date().toISOString().slice(0, 10),
          buyPrice: invData.buyPrice,
          shares: invData.shares,
          totalCost: newPurchaseCost,
          platform: invData.platform || existing.platform,
          account: options?.deductFromAccount,
          notes: invData.notes
        };

        const existingPurchases = existing.purchases && existing.purchases.length > 0
          ? existing.purchases
          : [
              {
                id: `init-${existing.id}`,
                date: existing.buyDate || '2026-08-01',
                buyPrice: existing.buyPrice,
                shares: existing.shares,
                totalCost: oldTotalCost,
                platform: existing.platform,
                notes: existing.notes
              }
            ];

        const updatedInv: Investment = {
          ...existing,
          name: invData.name || existing.name,
          assetType: invData.assetType || existing.assetType,
          platform: invData.platform || existing.platform,
          shares: newTotalShares,
          buyPrice: newAvgBuyPrice,
          currentPrice: invData.currentPrice || existing.currentPrice,
          notes: invData.notes || existing.notes,
          purchases: [newPurchaseEntry, ...existingPurchases]
        };

        updateInvestments(investments.map((i) => i.id === existing.id ? updatedInv : i));
      } else {
        // Brand new asset
        const newId = `inv-${Date.now()}`;
        const newPurchaseCost = invData.buyPrice * invData.shares;
        const initialPurchase: InvestmentPurchase = {
          id: `p-${Date.now()}`,
          date: invData.buyDate || new Date().toISOString().slice(0, 10),
          buyPrice: invData.buyPrice,
          shares: invData.shares,
          totalCost: newPurchaseCost,
          platform: invData.platform,
          account: options?.deductFromAccount,
          notes: invData.notes
        };

        const newInv: Investment = {
          ...invData,
          id: newId,
          purchases: [initialPurchase]
        };

        updateInvestments([...investments, newInv]);
      }
    }

    // Auto-create cash expense transaction if requested
    if (options?.deductFromAccount && options.deductAmount && options.deductAmount > 0) {
      const unitLabel = invData.assetType === 'Saham' ? 'Lembar' : invData.assetType === 'Emas' ? 'Gram' : 'Unit';
      const newTx: Transaction = {
        id: `tx-inv-${Date.now()}`,
        date: invData.buyDate || new Date().toISOString().slice(0, 10),
        description: `Beli Aset: ${invData.symbol.toUpperCase()} (${invData.shares.toLocaleString('id-ID')} ${unitLabel})`,
        amount: options.deductAmount,
        type: 'expense',
        category: 'Investasi',
        account: options.deductFromAccount,
        note: `Platform: ${invData.platform || ''}${invData.notes ? ` - ${invData.notes}` : ''}`
      };
      updateTransactions([newTx, ...transactions]);
    }

    setEditingInv(null);
    setPreSelectedInvSymbol('');
  };
  const handleDeleteInvestment = (id: string) => { if (window.confirm('Hapus investasi?')) updateInvestments(investments.filter((inv) => inv.id !== id)); };

  const handleSellInvestment = (
    investmentId: string,
    sellData: {
      sharesToSell: number;
      sellPrice: number;
      destinationAccount?: AccountType;
      depositToJournal: boolean;
      sellDate: string;
      notes?: string;
    }
  ) => {
    const inv = investments.find((i) => i.id === investmentId);
    if (!inv) return;

    const sharesToSell = Math.min(sellData.sharesToSell, inv.shares);
    const remainingShares = inv.shares - sharesToSell;
    const totalProceeds = sharesToSell * sellData.sellPrice;
    const modalTerjual = sharesToSell * inv.buyPrice;
    const realizedPnL = totalProceeds - modalTerjual;

    // 1. Update investments
    if (remainingShares <= 0) {
      // Sold all shares: remove from active holdings
      updateInvestments(investments.filter((i) => i.id !== investmentId));
    } else {
      // Partial sell: reduce shares, keep same average buy price
      updateInvestments(
        investments.map((i) =>
          i.id === investmentId
            ? {
                ...i,
                shares: remainingShares,
                currentPrice: sellData.sellPrice,
              }
            : i
        )
      );
    }

    // 2. Add income transaction to journal if depositToJournal is true
    if (sellData.depositToJournal && sellData.destinationAccount && totalProceeds > 0) {
      const unitLabel = inv.assetType === 'Saham' ? 'Lembar' : inv.assetType === 'Emas' ? 'Gram' : 'Unit';
      const pnlSign = realizedPnL >= 0 ? '+' : '-';
      const newTx: Transaction = {
        id: `tx-sell-${Date.now()}`,
        date: sellData.sellDate || new Date().toISOString().slice(0, 10),
        description: `Jual Aset: ${inv.symbol.toUpperCase()} (${sharesToSell.toLocaleString('id-ID')} ${unitLabel})`,
        amount: totalProceeds,
        type: 'income',
        category: 'Investasi',
        account: sellData.destinationAccount,
        note: `Penjualan ${inv.name || inv.symbol} @ Rp ${sellData.sellPrice.toLocaleString('id-ID')} (Modal: Rp ${modalTerjual.toLocaleString('id-ID')}, Realized PnL: ${pnlSign}Rp ${Math.abs(realizedPnL).toLocaleString('id-ID')})${sellData.notes ? ` - ${sellData.notes}` : ''}`
      };
      updateTransactions([newTx, ...transactions]);
    }
  };

  const handleSaveDebt = (debtData: Omit<DebtItem, 'id' | 'payments'>, editId?: string) => {
    if (editId) updateDebts(debts.map((d) => d.id === editId ? { ...debtData, id: editId, payments: d.payments } : d));
    else updateDebts([...debts, { ...debtData, id: `debt-${Date.now()}`, payments: [] }]);
    setEditingDebt(null);
  };
  const handleDeleteDebt = (id: string) => { if (window.confirm('Hapus hutang?')) updateDebts(debts.filter((d) => d.id !== id)); };

  const handlePayDebt = (debtId: string, paymentAmount: number, note: string) => {
    const targetDebt = debts.find((d) => d.id === debtId);
    if (!targetDebt) return;
    const newPaidAmount = targetDebt.paidAmount + paymentAmount;
    let newStatus = targetDebt.status;
    if (newPaidAmount >= targetDebt.totalAmount) newStatus = 'lunas';
    else if (newPaidAmount > 0) newStatus = 'sebagian';
    const newPaymentObj = { id: `pay-${Date.now()}`, date: new Date().toISOString().slice(0, 10), amount: paymentAmount, note };
    updateDebts(debts.map((d) => d.id === debtId ? { ...d, paidAmount: newPaidAmount, status: newStatus, payments: [...d.payments, newPaymentObj] } : d));
    updateTransactions([{ id: `tx-${Date.now()}`, date: new Date().toISOString().slice(0, 10), description: `Bayar: ${targetDebt.title}`, amount: paymentAmount, type: targetDebt.type === 'hutang' ? 'expense' : 'income', category: 'Tagihan & Utilitas', account: 'Bank BCA', note }, ...transactions]);
  };

  const handleSaveSalary = (salData: Omit<SalaryBonus, 'id'>, editId?: string) => {
    if (editId) updateSalaries(salaries.map((s) => (s.id === editId ? { ...salData, id: editId } : s)));
    else updateSalaries([...salaries, { ...salData, id: `sal-${Date.now()}` }]);
    setEditingSalary(null);
  };
  const handleDeleteSalary = (id: string) => { if (window.confirm('Hapus slip gaji?')) updateSalaries(salaries.filter((s) => s.id !== id)); };

  const handleClaimSalaryToJournal = (salaryItem: SalaryBonus) => {
    updateTransactions([{ id: `tx-sal-${Date.now()}`, date: salaryItem.date, description: `Klaim: ${salaryItem.title}`, amount: salaryItem.nettAmount, type: 'income', category: 'Gaji & Bonus', account: 'Bank BCA', note: salaryItem.sourceCompany }, ...transactions]);
    updateSalaries(salaries.map((s) => s.id === salaryItem.id ? { ...s, status: 'diterima' as const, isClaimedToJournal: true } : s));
  };

  const handleSaveTrading = (tradingData: Omit<TradingJournalItem, 'id'>, editId?: string) => {
    if (editId) updateTradings(tradings.map((t) => (t.id === editId ? { ...tradingData, id: editId } : t)));
    else updateTradings([{ ...tradingData, id: `trd-${Date.now()}` }, ...tradings]);
    setEditingTrading(null);
  };
  const handleDeleteTrading = (id: string) => { if (window.confirm('Hapus trading?')) updateTradings(tradings.filter((t) => t.id !== id)); };

  const handleClaimTradingToJournal = (tradingItem: TradingJournalItem) => {
    if (tradingItem.profitAmount <= 0) return;
    updateTransactions([{ id: `tx-trd-${Date.now()}`, date: tradingItem.date, description: `Profit: ${tradingItem.title}`, amount: tradingItem.profitAmount, type: 'income', category: 'Investasi', account: tradingItem.account || 'Bank BCA', note: tradingItem.pair }, ...transactions]);
    updateTradings(tradings.map((t) => t.id === tradingItem.id ? { ...t, isClaimedToJournal: true } : t));
  };

  const handleBatchClaimTradingToJournal = (items: TradingJournalItem[], bank: AccountType, summaryTitle?: string) => {
    const totalProfit = items.reduce((sum, item) => sum + item.profitAmount, 0);
    if (totalProfit <= 0) return;
    const newTxId = `tx-batch-trd-${Date.now()}`;
    const newTx: Transaction = {
      id: newTxId,
      date: new Date().toISOString().slice(0, 10),
      description: summaryTitle || `Withdrawal Kolektif: ${items.length} Trades`,
      amount: totalProfit,
      type: 'income',
      category: 'Investasi',
      account: bank,
      note: `Pencairan profit dari ${items.length} posisi trading.`
    };
    const selectedIds = new Set(items.map(i => i.id));
    const updatedTradings = tradings.map(t => 
      selectedIds.has(t.id) ? { ...t, isClaimedToJournal: true, account: bank } : t
    );
    updateTransactions([newTx, ...transactions]);
    updateTradings(updatedTradings);
  };

  const handleAddGoal = (goalData: Omit<SavingsGoal, 'id' | 'deposits'> & { initialDeposit?: number }) => {
    const newId = `goal-${Date.now()}`;
    const initialAmt = goalData.initialDeposit || 0;
    const initialDepositObj = initialAmt > 0 ? [{ id: `dep-${Date.now()}`, date: new Date().toISOString().slice(0, 10), amount: initialAmt, account: goalData.sourceAccount || 'Bank BCA', note: 'Awal' }] : [];
    const newGoal: SavingsGoal = { ...goalData, id: newId, currentAmount: initialAmt, deposits: initialDepositObj, isCompleted: initialAmt >= goalData.targetAmount };
    updateSavingsGoals([newGoal, ...savingsGoals]);
    if (initialAmt > 0) updateTransactions([{ id: `tx-dep-${Date.now()}`, date: new Date().toISOString().slice(0, 10), description: `Nabung: ${goalData.title}`, amount: initialAmt, type: 'expense', category: 'Investasi', account: goalData.sourceAccount || 'Bank BCA' }, ...transactions]);
  };

  const handleAddDeposit = (goalId: string, deposit: Omit<SavingsDeposit, 'id'>, syncJournal: boolean) => {
    const newDep = { ...deposit, id: `dep-${Date.now()}` };
    updateSavingsGoals(savingsGoals.map((g) => {
      if (g.id === goalId) {
        const newCurrent = g.currentAmount + deposit.amount;
        return { ...g, currentAmount: newCurrent, isCompleted: newCurrent >= g.targetAmount, deposits: [newDep, ...(g.deposits || [])] };
      }
      return g;
    }));
    if (syncJournal) {
      const g = savingsGoals.find(x => x.id === goalId);
      updateTransactions([{ id: `tx-dep-${Date.now()}`, date: deposit.date, description: `Nabung: ${g?.title}`, amount: deposit.amount, type: 'expense', category: 'Investasi', account: deposit.account }, ...transactions]);
    }
  };

  // Calculations
  const totalBalance = transactions.reduce((acc, tx) => tx.type === 'income' ? acc + tx.amount : acc - tx.amount, 0);
  const totalInv = investments.reduce((acc, inv) => acc + (inv.currentPrice * inv.shares), 0);
  const totalHutang = debts.filter(d => d.type === 'hutang').reduce((acc, d) => acc + (d.totalAmount - d.paidAmount), 0);
  const totalPiutang = debts.filter(d => d.type === 'piutang').reduce((acc, d) => acc + (d.totalAmount - d.paidAmount), 0);
  const netWorth = totalBalance + totalInv + totalPiutang - totalHutang;
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const mIn = transactions.filter(t => t.date.startsWith(currentMonthStr) && t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const mEx = transactions.filter(t => t.date.startsWith(currentMonthStr) && t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0a0512] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-fuchsia-500 animate-spin" />
          <p className="font-orbitron text-xs text-purple-300 tracking-[0.2em]">INITIALIZING CLOUD...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthView />;

  return (
    <div className="h-screen bg-[#0a0512] text-purple-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white overflow-hidden">
      
      <HeaderNavbar
        activeTab={activeTab} setActiveTab={setActiveTab} totalBalance={totalBalance} netWorth={netWorth}
        onOpenAddModal={() => { setEditingTx(null); setIsAddTxModalOpen(true); }}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onExportData={() => exportBackupJSON({ transactions, investments, debts, salaries, budgets, tradings, savingsGoals })}
        onResetDemo={() => alert("Gunakan Firestore Console untuk reset data cloud.")}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <RunningTickerBanner settings={marqueeSettings} onOpenSettingsModal={() => setIsTickerModalOpen(true)} />
      
      <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Sidebar with Responsive classes */}
        <div className={`
          fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-10
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-[#0a0512] w-72 lg:w-80 h-full border-r border-purple-500/20
        `}>
          <div className="h-full overflow-y-auto custom-scrollbar">
            <SidebarNavigation
              activeTab={activeTab} 
              setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
              onOpenAIModal={() => setIsAIModalOpen(true)}
              onOpenRateModal={() => setIsRateModalOpen(true)} 
              onOpenCryptoModal={() => setIsCryptoModalOpen(true)} 
              onOpenGoldModal={() => setIsGoldModalOpen(true)}
              onOpenSCModal={() => setIsSCModalOpen(true)}
              onLogout={handleLogout}
              debtCount={debts.filter(d => d.status !== 'lunas').length} pendingBonusCount={salaries.filter(s => !s.isClaimedToJournal).length}
              unclaimedTradingCount={tradings.filter(t => t.type === 'profit' && !t.isClaimedToJournal).length} activeGoalsCount={savingsGoals.filter(g => !g.isCompleted).length}
            />
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 h-full overflow-y-auto p-3 sm:p-4 lg:p-5 custom-scrollbar relative">
           {activeTab === 'dashboard' && <DashboardView transactions={transactions} investments={investments} debts={debts} totalBalance={totalBalance} netWorth={netWorth} onOpenAddModal={() => setIsAddTxModalOpen(true)} onOpenAIModal={() => setIsAIModalOpen(true)} onNavigateToTab={setActiveTab} />}
           {activeTab === 'jurnal' && <JournalView transactions={transactions} onAddTransaction={() => setIsAddTxModalOpen(true)} onEditTransaction={(tx) => { setEditingTx(tx); setIsAddTxModalOpen(true); }} onDeleteTransaction={handleDeleteTransaction} onOpenAIModal={() => setIsAIModalOpen(true)} />}
           {activeTab === 'laporan' && <MonthlyReportView transactions={transactions} budgets={budgets} onOpenAIModal={() => setIsAIModalOpen(true)} />}
           {activeTab === 'investasi' && (
             <InvestmentsView 
               investments={investments} 
               onAddInvestment={(sym) => {
                 setEditingInv(null);
                 setPreSelectedInvSymbol(sym || '');
                 setIsAddInvModalOpen(true);
               }} 
               onEditInvestment={(inv) => { 
                 setEditingInv(inv); 
                 setIsAddInvModalOpen(true); 
               }} 
               onDeleteInvestment={handleDeleteInvestment} 
               onSellInvestment={handleSellInvestment}
               onOpenAIModal={() => setIsAIModalOpen(true)} 
             />
           )}
           {activeTab === 'hutang_piutang' && <DebtView debts={debts} onAddDebt={() => setIsAddDebtModalOpen(true)} onEditDebt={(d) => { setEditingDebt(d); setIsAddDebtModalOpen(true); }} onDeleteDebt={handleDeleteDebt} onPayDebt={handlePayDebt} onOpenAIModal={() => setIsAIModalOpen(true)} />}
           {activeTab === 'gaji_bonus' && <SalaryBonusView salaries={salaries} onAddSalary={() => setIsAddSalaryModalOpen(true)} onEditSalary={(s) => { setEditingSalary(s); setIsAddSalaryModalOpen(true); }} onDeleteSalary={handleDeleteSalary} onClaimToJournal={handleClaimSalaryToJournal} onOpenAIModal={() => setIsAIModalOpen(true)} />}
           {activeTab === 'trading' && <TradingJournalView tradings={tradings} onOpenAddModal={() => setIsAddTradingModalOpen(true)} onEditTrading={(trd) => { setEditingTrading(trd); setIsAddTradingModalOpen(true); }} onDeleteTrading={handleDeleteTrading} onClaimToJournal={handleClaimTradingToJournal} onBatchClaimToJournal={handleBatchClaimTradingToJournal} />}
           {activeTab === 'tabungan' && <SavingsGoalsView savingsGoals={savingsGoals} onAddGoal={handleAddGoal} onEditGoal={updateSavingsGoals} onDeleteGoal={(id) => updateSavingsGoals(savingsGoals.filter(g => g.id !== id))} onAddDeposit={handleAddDeposit} onDeleteDeposit={() => {}} />}
        </main>
      </div>

      {/* Modals */}
      <AddTransactionModal isOpen={isAddTxModalOpen} onClose={() => { setIsAddTxModalOpen(false); setEditingTx(null); }} onSave={handleSaveTransaction} editingTransaction={editingTx} />
      <AddInvestmentModal 
        isOpen={isAddInvModalOpen} 
        onClose={() => { 
          setIsAddInvModalOpen(false); 
          setEditingInv(null); 
          setPreSelectedInvSymbol('');
        }} 
        onSave={handleSaveInvestment} 
        editingInvestment={editingInv}
        existingInvestments={investments}
        preSelectedSymbol={preSelectedInvSymbol}
      />
      <AddDebtModal isOpen={isAddDebtModalOpen} onClose={() => { setIsAddDebtModalOpen(false); setEditingDebt(null); }} onSave={handleSaveDebt} editingDebt={editingDebt} />
      <AddSalaryModal isOpen={isAddSalaryModalOpen} onClose={() => { setIsAddSalaryModalOpen(false); setEditingSalary(null); }} onSave={handleSaveSalary} editingSalary={editingSalary} />
      <AddTradingModal isOpen={isAddTradingModalOpen} onClose={() => { setIsAddTradingModalOpen(false); setEditingTrading(null); }} onSave={handleSaveTrading} editingTrading={editingTrading} />
      <AIAssistantModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} financialContext={{ totalBalance, monthlyIncome: mIn, monthlyExpense: mEx, totalInvestment: totalInv, totalDebt: totalHutang, totalReceivable: totalPiutang }} onBatchAddTransactions={() => {}} />
      <CurrencyRateModal isOpen={isRateModalOpen} onClose={() => setIsRateModalOpen(false)} />
      <CryptoMarketModal isOpen={isCryptoModalOpen} onClose={() => setIsCryptoModalOpen(false)} />
      <GoldMarketModal isOpen={isGoldModalOpen} onClose={() => setIsGoldModalOpen(false)} />
      <SmartCalculatorModal isOpen={isSCModalOpen} onClose={() => setIsSCModalOpen(false)} currentBalance={totalBalance} />
      <TickerSettingsModal isOpen={isTickerModalOpen} onClose={() => setIsTickerModalOpen(false)} settings={marqueeSettings} onSaveSettings={handleSaveMarqueeSettings} />
    </div>
  );
}
