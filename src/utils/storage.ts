import { 
  Transaction, 
  Investment, 
  DebtItem, 
  SalaryBonus, 
  BudgetCategory,
  TradingJournalItem,
  SavingsGoal,
  MarqueeSettings 
} from '../types';
import { 
  initialTransactions, 
  initialInvestments, 
  initialDebts, 
  initialSalaryBonuses, 
  initialBudgets,
  initialTradingJournals,
  initialSavingsGoals
} from '../data/initialData';

const KEYS = {
  TRANSACTIONS: 'keuanganku_transactions_v1',
  INVESTMENTS: 'keuanganku_investments_v1',
  DEBTS: 'keuanganku_debts_v1',
  SALARIES: 'keuanganku_salaries_v1',
  BUDGETS: 'keuanganku_budgets_v1',
  TRADING: 'keuanganku_trading_v1',
  SAVINGS_GOALS: 'keuanganku_savings_goals_v1',
  MARQUEE: 'keuanganku_marquee_settings_v1',
};

export const DEFAULT_MARQUEE_SETTINGS: MarqueeSettings = {
  text: "Have a nice day, have a good work, keep up the spirit !!! 🚀⚡ RINJANI FINTECH - REALTIME FINANCIAL MONITORING ⚡🚀",
  fontFamily: 'font-press-start',
  colorTheme: 'gold',
  speedDuration: 18,
  isEnabled: true,
};

export function loadStoredData() {
  const get = <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    transactions: get<Transaction[]>(KEYS.TRANSACTIONS, initialTransactions),
    investments: get<Investment[]>(KEYS.INVESTMENTS, initialInvestments),
    debts: get<DebtItem[]>(KEYS.DEBTS, initialDebts),
    salaries: get<SalaryBonus[]>(KEYS.SALARIES, initialSalaryBonuses),
    budgets: get<BudgetCategory[]>(KEYS.BUDGETS, initialBudgets),
    tradings: get<TradingJournalItem[]>(KEYS.TRADING, initialTradingJournals),
    savingsGoals: get<SavingsGoal[]>(KEYS.SAVINGS_GOALS, initialSavingsGoals),
    marquee: get<MarqueeSettings>(KEYS.MARQUEE, DEFAULT_MARQUEE_SETTINGS),
  };
}

export function saveTransactions(data: Transaction[]) {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(data));
}

export function saveInvestments(data: Investment[]) {
  localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(data));
}

export function saveDebts(data: DebtItem[]) {
  localStorage.setItem(KEYS.DEBTS, JSON.stringify(data));
}

export function saveSalaries(data: SalaryBonus[]) {
  localStorage.setItem(KEYS.SALARIES, JSON.stringify(data));
}

export function saveBudgets(data: BudgetCategory[]) {
  localStorage.setItem(KEYS.BUDGETS, JSON.stringify(data));
}

export function saveTradings(data: TradingJournalItem[]) {
  localStorage.setItem(KEYS.TRADING, JSON.stringify(data));
}

export function saveSavingsGoals(data: SavingsGoal[]) {
  localStorage.setItem(KEYS.SAVINGS_GOALS, JSON.stringify(data));
}

export function saveMarqueeSettings(data: MarqueeSettings) {
  localStorage.setItem(KEYS.MARQUEE, JSON.stringify(data));
}

export function resetAllToDemoData() {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(initialTransactions));
  localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(initialInvestments));
  localStorage.setItem(KEYS.DEBTS, JSON.stringify(initialDebts));
  localStorage.setItem(KEYS.SALARIES, JSON.stringify(initialSalaryBonuses));
  localStorage.setItem(KEYS.BUDGETS, JSON.stringify(initialBudgets));
  localStorage.setItem(KEYS.TRADING, JSON.stringify(initialTradingJournals));
  localStorage.setItem(KEYS.SAVINGS_GOALS, JSON.stringify(initialSavingsGoals));
  window.location.reload();
}

export function exportBackupJSON(state: {
  transactions: Transaction[];
  investments: Investment[];
  debts: DebtItem[];
  salaries: SalaryBonus[];
  budgets: BudgetCategory[];
  tradings?: TradingJournalItem[];
  savingsGoals?: SavingsGoal[];
}) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `KeuanganKu_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
