import React, { useState, useEffect } from 'react';
import { 
  X, 
  Percent, 
  Calculator, 
  Sparkles, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Sliders, 
  PieChart, 
  Coins, 
  Wallet, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw,
  Info
} from 'lucide-react';
import { formatRupiah, formatThousands, parseThousands } from '../utils/formatters';

interface AllocationItem {
  id: string;
  name: string;
  percentage: number;
  description: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  categoryType: 'needs' | 'invest' | 'emergency' | 'lifestyle' | 'education' | 'social';
}

interface SmartCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance?: number;
}

const PRESET_FORMULAS = [
  {
    id: 'freedom',
    name: 'Rumus Financial Freedom (50/30/15/5)',
    tag: 'POPULER TIKTOK',
    desc: 'Rumus viral untuk percepatan kemandirian finansial & investasi jangka panjang.',
    allocations: [
      { id: '1', name: 'Biaya Pokok (Needs)', percentage: 50, description: 'Kos-kosan, makan, minum, tagihan wajib, transportasi', color: '#a855f7', borderColor: 'border-purple-500/40', bgGradient: 'from-purple-900/30 to-purple-950/20', categoryType: 'needs' },
      { id: '2', name: 'Dana Investasi Long-Term', percentage: 30, description: 'Emas, Saham, Crypto, Reksadana bebas', color: '#10b981', borderColor: 'border-emerald-500/40', bgGradient: 'from-emerald-900/30 to-emerald-950/20', categoryType: 'invest' },
      { id: '3', name: 'Cash Dana Darurat', percentage: 15, description: 'Simpanan cair untuk keadaan tak terduga', color: '#06b6d4', borderColor: 'border-cyan-500/40', bgGradient: 'from-cyan-900/30 to-cyan-950/20', categoryType: 'emergency' },
      { id: '4', name: 'Bebas Gaya & Self Reward', percentage: 5, description: 'Bebas buat gaya, nongkrong, ga usah gengsi', color: '#f43f5e', borderColor: 'border-rose-500/40', bgGradient: 'from-rose-900/30 to-rose-950/20', categoryType: 'lifestyle' },
    ] as AllocationItem[]
  },
  {
    id: 'classic_50_30_20',
    name: 'Rumus Klasik 50/30/20',
    tag: 'STANDAR GLOBAL',
    desc: 'Formula manajemen uang paling terkenal di dunia (Elizabeth Warren).',
    allocations: [
      { id: '1', name: 'Kebutuhan Pokok (Needs)', percentage: 50, description: 'Tempat tinggal, makanan, listrik, air, cicilan wajib', color: '#a855f7', borderColor: 'border-purple-500/40', bgGradient: 'from-purple-900/30 to-purple-950/20', categoryType: 'needs' },
      { id: '2', name: 'Keinginan & Lifestyle (Wants)', percentage: 30, description: 'Belanja, liburan, hobi, hiburan, makan di luar', color: '#ec4899', borderColor: 'border-pink-500/40', bgGradient: 'from-pink-900/30 to-pink-950/20', categoryType: 'lifestyle' },
      { id: '3', name: 'Tabungan & Investasi (Savings)', percentage: 20, description: 'Dana darurat, portofolio investasi, dana pensiun', color: '#10b981', borderColor: 'border-emerald-500/40', bgGradient: 'from-emerald-900/30 to-emerald-950/20', categoryType: 'invest' },
    ] as AllocationItem[]
  },
  {
    id: 'aggressive_investor',
    name: 'Rumus Investor Agresif (40/40/10/10)',
    tag: 'AGRESIF INVEST',
    desc: 'Untuk yang ingin melipatgandakan portofolio saham/crypto secepat mungkin.',
    allocations: [
      { id: '1', name: 'Investasi & Portfolio', percentage: 40, description: 'Saham dividen, BTC, ETH, Emas batangan', color: '#10b981', borderColor: 'border-emerald-500/40', bgGradient: 'from-emerald-900/30 to-emerald-950/20', categoryType: 'invest' },
      { id: '2', name: 'Biaya Hidup Hemat', percentage: 40, description: 'Frugal living, kebutuhan utama', color: '#a855f7', borderColor: 'border-purple-500/40', bgGradient: 'from-purple-900/30 to-purple-950/20', categoryType: 'needs' },
      { id: '3', name: 'Dana Darurat / Kas', percentage: 10, description: 'Buffer likuiditas di rekening tabungan', color: '#06b6d4', borderColor: 'border-cyan-500/40', bgGradient: 'from-cyan-900/30 to-cyan-950/20', categoryType: 'emergency' },
      { id: '4', name: 'Self Reward & Upgrade', percentage: 10, description: 'Buku, seminar, jajan santai', color: '#f59e0b', borderColor: 'border-amber-500/40', bgGradient: 'from-amber-900/30 to-amber-950/20', categoryType: 'education' },
    ] as AllocationItem[]
  },
  {
    id: 'harv_eker_jars',
    name: 'Rumus 6 Toples (Secrets of Millionaire Mind)',
    tag: '6 JARS METHOD',
    desc: 'Metode pembagian T. Harv Eker membagi 6 pos kehidupan terstruktur.',
    allocations: [
      { id: '1', name: 'Kebutuhan Hidup (NEC - 55%)', percentage: 55, description: 'Makan, sewa tempat, tagihan, transportasi', color: '#a855f7', borderColor: 'border-purple-500/40', bgGradient: 'from-purple-900/30 to-purple-950/20', categoryType: 'needs' },
      { id: '2', name: 'Kebebasan Finansial (FFA - 10%)', percentage: 10, description: 'Investasi saham, bisnis pasif, real estate', color: '#10b981', borderColor: 'border-emerald-500/40', bgGradient: 'from-emerald-900/30 to-emerald-950/20', categoryType: 'invest' },
      { id: '3', name: 'Tabungan Jangka Panjang (LTSS - 10%)', percentage: 10, description: 'Beli rumah, kendaraan, dana darurat besar', color: '#06b6d4', borderColor: 'border-cyan-500/40', bgGradient: 'from-cyan-900/30 to-cyan-950/20', categoryType: 'emergency' },
      { id: '4', name: 'Pendidikan & Skill (EDU - 10%)', percentage: 10, description: 'Kursus, buku, sertifikasi, webinar', color: '#f59e0b', borderColor: 'border-amber-500/40', bgGradient: 'from-amber-900/30 to-amber-950/20', categoryType: 'education' },
      { id: '5', name: 'Kesenangan & Main (PLAY - 10%)', percentage: 10, description: 'Hangout, liburan, massage, kuliner mewah', color: '#ec4899', borderColor: 'border-pink-500/40', bgGradient: 'from-pink-900/30 to-pink-950/20', categoryType: 'lifestyle' },
      { id: '6', name: 'Sosial & Sedekah (GIVE - 5%)', percentage: 5, description: 'Zakat, donasi keluarga, bantuan sosial', color: '#8b5cf6', borderColor: 'border-violet-500/40', bgGradient: 'from-violet-900/30 to-violet-950/20', categoryType: 'social' },
    ] as AllocationItem[]
  }
];

const COLOR_PALETTES = [
  { color: '#a855f7', borderColor: 'border-purple-500/40', bgGradient: 'from-purple-900/30 to-purple-950/20' },
  { color: '#10b981', borderColor: 'border-emerald-500/40', bgGradient: 'from-emerald-900/30 to-emerald-950/20' },
  { color: '#06b6d4', borderColor: 'border-cyan-500/40', bgGradient: 'from-cyan-900/30 to-cyan-950/20' },
  { color: '#f43f5e', borderColor: 'border-rose-500/40', bgGradient: 'from-rose-900/30 to-rose-950/20' },
  { color: '#f59e0b', borderColor: 'border-amber-500/40', bgGradient: 'from-amber-900/30 to-amber-950/20' },
  { color: '#ec4899', borderColor: 'border-pink-500/40', bgGradient: 'from-pink-900/30 to-pink-950/20' },
  { color: '#8b5cf6', borderColor: 'border-violet-500/40', bgGradient: 'from-violet-900/30 to-violet-950/20' },
];

export const SmartCalculatorModal: React.FC<SmartCalculatorModalProps> = ({
  isOpen,
  onClose,
  currentBalance = 0,
}) => {
  const [totalIncome, setTotalIncome] = useState<number>(3000000);
  const [activePresetId, setActivePresetId] = useState<string>('freedom');
  const [allocations, setAllocations] = useState<AllocationItem[]>(PRESET_FORMULAS[0].allocations);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  if (!isOpen) return null;

  const totalPercentage = allocations.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0);
  const isBalanced = Math.abs(totalPercentage - 100) < 0.01;
  const isOver = totalPercentage > 100;
  const isUnder = totalPercentage < 100;

  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    const selected = PRESET_FORMULAS.find(p => p.id === presetId);
    if (selected) {
      setAllocations(JSON.parse(JSON.stringify(selected.allocations)));
    }
  };

  const handlePercentageChange = (id: string, newPct: number) => {
    setActivePresetId('custom');
    setAllocations(allocations.map(item => item.id === id ? { ...item, percentage: Math.max(0, newPct) } : item));
  };

  const handleNameChange = (id: string, newName: string) => {
    setActivePresetId('custom');
    setAllocations(allocations.map(item => item.id === id ? { ...item, name: newName } : item));
  };

  const handleDescriptionChange = (id: string, newDesc: string) => {
    setActivePresetId('custom');
    setAllocations(allocations.map(item => item.id === id ? { ...item, description: newDesc } : item));
  };

  const handleAddAllocation = () => {
    setActivePresetId('custom');
    const colorIndex = allocations.length % COLOR_PALETTES.length;
    const palette = COLOR_PALETTES[colorIndex];
    const newItem: AllocationItem = {
      id: `alloc-${Date.now()}`,
      name: 'Pos Alokasi Baru',
      percentage: isUnder ? Math.max(0, 100 - totalPercentage) : 10,
      description: 'Deskripsi rencana pengeluaran atau tabungan',
      color: palette.color,
      borderColor: palette.borderColor,
      bgGradient: palette.bgGradient,
      categoryType: 'invest'
    };
    setAllocations([...allocations, newItem]);
  };

  const handleDeleteAllocation = (id: string) => {
    if (allocations.length <= 1) return;
    setActivePresetId('custom');
    setAllocations(allocations.filter(item => item.id !== id));
  };

  const handleAutoBalance = () => {
    if (allocations.length === 0 || totalPercentage === 0) return;
    const ratio = 100 / totalPercentage;
    const balanced = allocations.map(item => ({
      ...item,
      percentage: Number((item.percentage * ratio).toFixed(1))
    }));
    // Fix any rounding error
    const sumAfter = balanced.reduce((s, i) => s + i.percentage, 0);
    if (sumAfter !== 100 && balanced.length > 0) {
      balanced[0].percentage = Number((balanced[0].percentage + (100 - sumAfter)).toFixed(1));
    }
    setAllocations(balanced);
  };

  const handleCopySummary = () => {
    let text = `📊 RUMUS FINANCIAL FREEDOM & PEMBAGIAN UANG (SC MONEY DENDA GIANA)\n`;
    text += `💰 Total Gaji / Uang Masuk: ${formatRupiah(totalIncome)}\n`;
    text += `------------------------------------\n`;
    allocations.forEach(item => {
      const calculatedAmount = (totalIncome * item.percentage) / 100;
      const multiplier = (item.percentage / 100).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
      text += `• ${item.name} (${item.percentage}%):\n`;
      text += `  ${formatRupiah(totalIncome)} × ${multiplier} = ${formatRupiah(calculatedAmount)}\n`;
      if (item.description) text += `  (${item.description})\n`;
    });
    text += `------------------------------------\n`;
    text += `✅ Total Alokasi: ${totalPercentage}% (${formatRupiah(totalIncome)})\n`;
    text += `Dibuat via Money Denda Giana System v2.5`;

    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-[#12081f] border border-fuchsia-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(217,70,239,0.3)] overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-[#1a0f30] via-[#150a26] to-[#1a0f30]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-fuchsia-600 via-purple-600 to-emerald-500 p-0.5 shadow-neo-purple">
              <div className="w-full h-full bg-[#12081f] rounded-[14px] flex items-center justify-center text-fuchsia-300">
                <Percent className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-orbitron font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                  SC • SMART SPLIT CALCULATOR
                </span>
                <span className="text-[10px] font-mono text-purple-300/80 hidden sm:inline">
                  Rumus Pembagian Uang & Investasi
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-orbitron font-black text-white tracking-wide mt-0.5 uppercase">
                Kalkulator Alokasi Gaji & Portfolio
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#24133d] hover:bg-purple-600/20 text-purple-200 hover:text-white border-purple-500/30'
              }`}
              title="Salin hasil pembagian"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-fuchsia-400" />}
              <span className="hidden sm:inline">{copied ? 'Tersalin!' : 'Salin Rumus'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-[#24133d] hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* 1. Input Total Nominal Uang / Gaji */}
          <div className="bg-[#180e2e] border border-purple-500/30 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-orbitron font-black text-purple-200 uppercase tracking-wide flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-fuchsia-400" />
                  <span>TOTAL PENGHASILAN / GAJI YANG DIBAGI (RP)</span>
                </label>
                <p className="text-[11px] text-purple-300/70 font-rajdhani font-semibold">
                  Bebas mau gaji berapa saja (1jt, 3jt, 5jt, 10jt+), masukkan nominal di bawah
                </p>
              </div>

              {totalIncome > 0 && (
                <div className="bg-[#12081f] border border-emerald-500/40 px-3 py-1.5 rounded-xl text-right">
                  <p className="text-[9px] font-orbitron text-purple-400 uppercase">Terformat</p>
                  <p className="text-sm font-mono font-bold text-emerald-400">{formatRupiah(totalIncome)}</p>
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 3.000.000"
                value={totalIncome > 0 ? formatThousands(totalIncome) : ''}
                onChange={(e) => setTotalIncome(parseThousands(e.target.value))}
                className="w-full bg-[#120722] border-2 border-fuchsia-500/40 hover:border-fuchsia-400 focus:border-emerald-400 text-white rounded-2xl px-4 py-3 text-lg sm:text-xl font-mono font-black focus:outline-none shadow-[0_0_15px_rgba(217,70,239,0.15)] transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-orbitron font-bold text-purple-400">
                IDR
              </span>
            </div>

            {/* Quick Gaji Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-orbitron text-purple-400/80 mr-1">Preset Gaji:</span>
              {[1000000, 2000000, 3000000, 5000000, 7500000, 10000000, 15000000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setTotalIncome(amount)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-orbitron font-bold border transition-all cursor-pointer ${
                    totalIncome === amount
                      ? 'bg-fuchsia-600 text-white border-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.5)]'
                      : 'bg-[#150a28] text-purple-300 border-purple-500/30 hover:border-purple-400'
                  }`}
                >
                  {amount >= 1000000 ? `${amount / 1000000} Jt` : formatThousands(amount)}
                </button>
              ))}

              {currentBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setTotalIncome(Math.round(currentBalance))}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-orbitron font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer ml-auto"
                >
                  Saldo Kas ({formatRupiah(currentBalance)})
                </button>
              )}
            </div>
          </div>

          {/* 2. Preset Formulas Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-orbitron font-bold text-purple-200 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>PILIH RUMUS ALOKASI KEUANGAN</span>
              </label>
              {activePresetId === 'custom' && (
                <span className="text-[10px] font-orbitron text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
                  MODE KUSTOM AKTIF
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PRESET_FORMULAS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#241344] to-[#1a0c33] border-fuchsia-400 ring-1 ring-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.3)]'
                        : 'bg-[#150a28] hover:bg-[#1c0e35] border-purple-500/25 hover:border-purple-400/50'
                    }`}
                  >
                    <div>
                      <span className={`text-[9px] font-orbitron font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider block w-fit mb-1.5 ${
                        isSelected ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/40' : 'bg-purple-500/15 text-purple-300/80 border border-purple-500/20'
                      }`}>
                        {preset.tag}
                      </span>
                      <h4 className="text-xs font-orbitron font-bold text-white leading-tight mb-1">
                        {preset.name}
                      </h4>
                      <p className="text-[10px] text-purple-200/70 font-rajdhani line-clamp-2">
                        {preset.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Visual Multi-Segment Progress Bar */}
          <div className="bg-[#180e2e] border border-purple-500/30 rounded-2xl p-4 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-fuchsia-400" />
                <span className="text-xs font-orbitron font-bold text-purple-200">
                  VISUALISASI DISTRIBUSI ALOKASI
                </span>
              </div>

              {/* Total Percentage Badge */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-orbitron font-black px-2.5 py-1 rounded-xl border flex items-center gap-1.5 ${
                  isBalanced
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : isOver
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  <span>Total: {totalPercentage.toFixed(1)}%</span>
                  {isBalanced ? '✓' : isOver ? '⚠️ Lebih' : '⚠️ Kurang'}
                </span>

                {!isBalanced && (
                  <button
                    onClick={handleAutoBalance}
                    className="px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:text-white border border-purple-500/40 text-[10px] font-orbitron font-bold transition-all cursor-pointer flex items-center gap-1"
                    title="Otomatis seimbangkan persentase ke 100%"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Seimbangkan (100%)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Segmented Bar */}
            <div className="h-4 w-full bg-[#120722] rounded-full overflow-hidden flex border border-purple-500/30 p-0.5">
              {allocations.map((item) => (
                <div
                  key={item.id}
                  style={{
                    width: `${Math.max(0, (item.percentage / Math.max(totalPercentage, 100)) * 100)}%`,
                    backgroundColor: item.color
                  }}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 hover:opacity-90 relative group"
                  title={`${item.name}: ${item.percentage}%`}
                />
              ))}
            </div>

            {/* Legend Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {allocations.map((item) => (
                <div key={item.id} className="flex items-center gap-1.5 text-[11px] font-rajdhani font-semibold text-purple-200/80 bg-[#120722] px-2 py-0.5 rounded-lg border border-purple-500/20">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name} ({item.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Detail Pos Alokasi & Rumus Pengali ($Total × % = Nominal$) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-orbitron font-bold text-purple-200 uppercase">
                  RINCIAN POS & HASIL PERHITUNGAN (RUMUS LIVE)
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddAllocation}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-orbitron font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Pos</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {allocations.map((item, index) => {
                const calculatedAmount = (totalIncome * item.percentage) / 100;
                const multiplier = (item.percentage / 100).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 });

                return (
                  <div
                    key={item.id}
                    className={`bg-gradient-to-r ${item.bgGradient} border ${item.borderColor} rounded-2xl p-4 space-y-3 transition-all hover:border-purple-400/50 shadow-inner`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      
                      {/* Left: Pos Name & Description */}
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center font-orbitron font-bold text-xs text-white shrink-0 mt-0.5 shadow-md"
                          style={{ backgroundColor: item.color }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleNameChange(item.id, e.target.value)}
                            className="bg-transparent text-sm sm:text-base font-orbitron font-bold text-white focus:outline-none border-b border-transparent focus:border-purple-400 w-full"
                          />
                          <input
                            type="text"
                            value={item.description}
                            placeholder="Keterangan alokasi (cth: Kos, makan, btc, dll)"
                            onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                            className="bg-transparent text-[11px] font-rajdhani text-purple-200/70 focus:outline-none border-b border-transparent focus:border-purple-400/50 w-full"
                          />
                        </div>
                      </div>

                      {/* Middle & Right: Percentage Input & Live Calculated Result */}
                      <div className="flex items-center gap-3 justify-between md:justify-end shrink-0">
                        
                        {/* % Input */}
                        <div className="flex items-center gap-1.5 bg-[#120722] border border-purple-500/30 rounded-xl px-2.5 py-1.5">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            value={item.percentage}
                            onChange={(e) => handlePercentageChange(item.id, parseFloat(e.target.value) || 0)}
                            className="w-14 bg-transparent text-right font-mono font-bold text-sm text-fuchsia-300 focus:outline-none"
                          />
                          <span className="text-xs font-orbitron font-bold text-purple-400">%</span>
                        </div>

                        {/* Calculated Result */}
                        <div className="bg-[#120722] border border-purple-500/30 rounded-xl px-3.5 py-1.5 text-right min-w-[140px]">
                          <span className="text-[9px] font-mono text-purple-400/80 block">
                            {formatRupiah(totalIncome)} × {multiplier}
                          </span>
                          <span className="text-sm font-mono font-black text-emerald-400">
                            {formatRupiah(calculatedAmount)}
                          </span>
                        </div>

                        {/* Delete Button */}
                        {allocations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAllocation(item.id)}
                            className="p-2 rounded-xl text-purple-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                            title="Hapus pos ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                      </div>

                    </div>

                    {/* Percentage Range Slider for smooth touch */}
                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={item.percentage}
                        onChange={(e) => handlePercentageChange(item.id, parseFloat(e.target.value) || 0)}
                        className="w-full accent-fuchsia-500 cursor-pointer h-1.5 bg-purple-950/80 rounded-lg"
                      />
                      <span className="text-[10px] font-mono text-purple-400/80 shrink-0 w-8 text-right">
                        {item.percentage}%
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Summary Info Banner */}
          <div className="bg-gradient-to-r from-[#1d0e38] to-[#140a28] border border-fuchsia-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-purple-200/90 font-rajdhani">
            <Info className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-white font-orbitron">Tips Pengelolaan Bebas & Disiplin:</p>
              <p>
                Dengan membagi gaji ke pos-pos di atas, uang Anda memiliki tujuan yang jelas: <b>Kebutuhan primer terpenuhi</b>, <b>aset investasi tetap tumbuh rutin</b>, <b>dana darurat aman</b>, dan Anda tetap bisa <b>menikmati hidup tanpa rasa bersalah</b>!
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-500/20 bg-[#150a28] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-purple-300/80 flex items-center gap-2">
            <span>Total Hasil Terbagi:</span>
            <span className="font-bold text-emerald-400 text-sm">{formatRupiah(totalIncome)}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#24133d] hover:bg-[#2d184d] text-purple-200 text-xs font-orbitron font-bold transition-all cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handleCopySummary}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-fuchsia-600 to-purple-600 hover:from-emerald-500 hover:via-fuchsia-500 hover:to-purple-500 text-white text-xs font-orbitron font-black shadow-[0_0_20px_rgba(217,70,239,0.35)] transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Format Ringkasan'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
