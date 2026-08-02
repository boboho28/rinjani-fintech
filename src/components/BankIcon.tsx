import React from 'react';
import { AccountType } from '../types';
import { Wallet, CreditCard, Smartphone } from 'lucide-react';

interface BankLogoProps {
  accountName: AccountType | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BankLogo: React.FC<BankLogoProps> = ({ accountName, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[9px]',
    md: 'w-8 h-8 text-[10px]',
    lg: 'w-10 h-10 text-xs',
  };

  // 1. Bank BCA Logo Badge
  if (accountName.includes('BCA')) {
    return (
      <div 
        className={`rounded-xl bg-gradient-to-br from-[#00529C] to-[#002855] text-white flex flex-col items-center justify-center font-black tracking-tight border border-blue-400/40 shadow-[0_0_10px_rgba(0,82,156,0.3)] shrink-0 ${sizeClasses[size]} ${className}`}
        title="Bank BCA"
      >
        <span className="font-orbitron tracking-tighter leading-none text-white drop-shadow">BCA</span>
      </div>
    );
  }

  // 2. Bank Mandiri Logo Badge
  if (accountName.includes('Mandiri')) {
    return (
      <div 
        className={`rounded-xl bg-gradient-to-br from-[#003B6E] via-[#002347] to-[#001730] text-amber-300 flex flex-col items-center justify-center font-black tracking-tighter border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)] relative overflow-hidden shrink-0 ${sizeClasses[size]} ${className}`}
        title="Bank Mandiri"
      >
        <div className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-bl from-yellow-400 to-amber-500 rounded-bl-full opacity-80" />
        <span className="font-rajdhani font-black tracking-tighter text-white leading-none text-[10px] sm:text-[11px]">
          mandırı
        </span>
      </div>
    );
  }

  // 3. Bank BRI Logo Badge
  if (accountName.includes('BRI')) {
    return (
      <div 
        className={`rounded-xl bg-gradient-to-br from-[#00529C] via-[#003B6E] to-[#F37021] text-white flex flex-col items-center justify-center font-black border border-orange-400/40 shadow-[0_0_10px_rgba(243,112,33,0.3)] relative overflow-hidden shrink-0 ${sizeClasses[size]} ${className}`}
        title="Bank BRI"
      >
        <div className="absolute top-0 left-0 w-2 h-full bg-orange-500 opacity-90" />
        <span className="font-orbitron tracking-tighter leading-none text-white drop-shadow pl-1">
          BRI
        </span>
      </div>
    );
  }

  // 4. Bank BNI Logo Badge
  if (accountName.includes('BNI')) {
    return (
      <div 
        className={`rounded-xl bg-gradient-to-br from-[#006666] via-[#004D4D] to-[#E55300] text-white flex flex-col items-center justify-center font-black border border-orange-500/40 shadow-[0_0_10px_rgba(229,83,0,0.35)] relative overflow-hidden shrink-0 ${sizeClasses[size]} ${className}`}
        title="Bank BNI"
      >
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#E55300] rounded-tl-full opacity-90" />
        <span className="font-orbitron tracking-tighter leading-none text-cyan-200 drop-shadow">
          BNI
        </span>
      </div>
    );
  }

  // 5. SeaBank Logo Badge
  if (accountName.includes('SeaBank') || accountName.includes('SEABANK')) {
    return (
      <div 
        className={`rounded-xl bg-gradient-to-br from-[#FF5722] via-[#E64A19] to-[#BF360C] text-white flex flex-col items-center justify-center font-black border border-orange-300/40 shadow-[0_0_10px_rgba(255,87,34,0.35)] shrink-0 ${sizeClasses[size]} ${className}`}
        title="SeaBank"
      >
        <span className="font-chakra font-black tracking-tighter leading-none text-white text-[9px] sm:text-[10px] uppercase">
          Sea
        </span>
        <span className="text-[7px] font-mono leading-none text-orange-200 uppercase font-extrabold">
          BANK
        </span>
      </div>
    );
  }

  // 6. E-Wallet Badge
  if (accountName.includes('E-Wallet') || accountName.includes('GoPay')) {
    return (
      <div 
        className={`rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-cyan-200 flex items-center justify-center border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)] shrink-0 ${sizeClasses[size]} ${className}`}
        title="E-Wallet (GoPay/OVO/DANA)"
      >
        <Smartphone className="w-4 h-4 text-cyan-200" />
      </div>
    );
  }

  // 7. Rekening Investasi Badge
  if (accountName.includes('Investasi')) {
    return (
      <div 
        className={`rounded-xl bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 text-purple-200 flex items-center justify-center border border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.3)] shrink-0 ${sizeClasses[size]} ${className}`}
        title="Rekening Investasi"
      >
        <CreditCard className="w-4 h-4 text-purple-200" />
      </div>
    );
  }

  // Default: Kas / Tunai
  return (
    <div 
      className={`rounded-xl bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 text-slate-950 flex items-center justify-center border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.3)] shrink-0 ${sizeClasses[size]} ${className}`}
      title="Kas / Tunai"
    >
      <Wallet className="w-4 h-4 text-slate-950 stroke-[2.5]" />
    </div>
  );
};
