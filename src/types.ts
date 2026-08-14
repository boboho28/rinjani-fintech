export type TransactionType = 'income' | 'expense';

export type AccountType = 
  | 'Kas / Tunai'
  | 'Bank BCA'
  | 'Bank Mandiri'
  | 'Bank BRI'
  | 'Bank BNI'
  | 'SeaBank'
  | 'E-Wallet (GoPay/OVO/DANA)'
  | 'Rekening Investasi';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  account: AccountType;
  note?: string;
}

export type AssetType = 'Saham' | 'Reksadana' | 'Emas' | 'Crypto' | 'Obligasi / SBN';

export interface Investment {
  id: string;
  name: string;
  symbol: string;
  assetType: AssetType;
  buyPrice: number;
  currentPrice: number;
  shares: number;
  buyDate: string; // Field Tanggal Pembelian
  platform: string;
  notes: string; // Field Alasan/Analisis
}

export type DebtType = 'hutang' | 'piutang';
export type DebtStatus = 'belum_lunas' | 'sebagian' | 'lunas';

export interface DebtPayment {
  id: string;
  date: string;
  amount: number;
  note: string;
}

export interface DebtItem {
  id: string;
  type: DebtType;
  personName: string;
  title: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  startDate: string;
  status: DebtStatus;
  notes: string;
  payments: DebtPayment[];
}

export type IncomeSourceType = 'gaji_pokok' | 'bonus_kinerja' | 'tunjangan' | 'thr' | 'lembur' | 'sampingan';

export interface SalaryBonus {
  id: string;
  title: string;
  type: IncomeSourceType;
  sourceCompany: string;
  baseAmount: number;
  bonusAmount: number;
  deductions: number;
  nettAmount: number;
  date: string;
  period: string;
  status: 'diterima' | 'dijadwalkan';
  isClaimedToJournal?: boolean;
  notes: string;
}

export interface BudgetCategory {
  category: string;
  monthlyLimit: number;
  icon?: string;
}

export type MarqueeFontFamily = 'font-orbitron' | 'font-press-start' | 'font-audiowide' | 'font-monoton' | 'font-chakra' | 'font-permanent' | 'font-vt323' | 'font-share-tech' | 'font-russo' | 'font-rajdhani';
export type MarqueeColorTheme = 'gold' | 'emerald' | 'cyan' | 'pink' | 'purple' | 'rainbow';

export interface MarqueeSettings {
  text: string;
  fontFamily: MarqueeFontFamily;
  colorTheme: MarqueeColorTheme;
  speedDuration: number;
  isEnabled: boolean;
}

export type ActiveTab = 'dashboard' | 'jurnal' | 'laporan' | 'investasi' | 'hutang_piutang' | 'gaji_bonus' | 'trading' | 'tabungan';

export interface SavingsDeposit {
  id: string;
  date: string;
  amount: number;
  account: AccountType;
  note?: string;
}

export type SavingsCategory = 'Kendaraan' | 'Properti' | 'Dana Darurat' | 'Liburan / Travel' | 'Gadget / Elektronik' | 'Pendidikan' | 'Pernikahan' | 'Investasi / Business' | 'Lainnya';

export interface SavingsGoal {
  id: string;
  title: string;
  category: SavingsCategory;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  startDate: string;
  sourceAccount?: AccountType;
  notes?: string;
  isCompleted?: boolean;
  deposits: SavingsDeposit[];
}

export type TradingType = 'profit' | 'loss';
export type TradingPair = 'XAUUSD (GOLD)' | 'EURUSD' | 'GBPUSD' | 'USDJPY' | 'BTCUSD' | 'ETHUSD' | 'US30' | 'NAS100' | 'AUDUSD' | 'USDCAD' | 'Lainnya';
export type TradingStrategy = 'Scalping' | 'Day Trading' | 'Swing Trading' | 'Breakout / Retest' | 'SMC / ICT Concept' | 'News Trading / NFP' | 'Price Action';
export type TradingResultStatus = 'TP (Take Profit)' | 'SL (Stop Loss)' | 'Cut Profit' | 'Cut Loss';

export interface TradingJournalItem {
  id: string;
  date: string;
  title: string;
  pair: TradingPair;
  action: 'BUY' | 'SELL';
  lotSize: number;
  entryPrice: number;
  exitPrice: number;
  profitPips: number;
  profitUSD?: number;
  exchangeRateUSD?: number;
  profitAmount: number;
  type: TradingType;
  broker: string;
  strategy: TradingStrategy;
  account: AccountType;
  status: TradingResultStatus;
  isClaimedToJournal?: boolean;
  notes: string;
}

export interface FinancialHealthScore {
  score: number;
  savingsRate: number;
  debtRatio: number;
  investmentCoverage: number;
  adviceSummary: string;
  recommendations: string[];
}
