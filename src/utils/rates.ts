// PUSAT DATA KURS & HARGA REAL-TIME RINJANI SYSTEM
// Update angka di sini untuk mengubah harga di seluruh aplikasi secara instan

export const GLOBAL_RATES = {
  // Kurs Utama
  USD_IDR: 16280, // 1 USD ke Rupiah
  
  // Harga Emas Dunia (Spot XAU/USD)
  GOLD_XAU_USD: 2422.80,
  TROY_OUNCE_TO_GRAM: 31.1034768,
  
  // Harga Emas Antam (Estimasi Lokal)
  ANTAM_BUY: 1345000,
  ANTAM_SELL: 1225000,

  // Kurs Mata Uang Lainnya vs IDR
  OTHER_CURRENCIES: [
    { code: 'USD', name: 'Dolar Amerika Serikat', flag: '🇺🇸', rate: 16280 },
    { code: 'EUR', name: 'Euro Eropa', flag: '🇪🇺', rate: 17650 },
    { code: 'SGD', name: 'Dolar Singapura', flag: '🇸🇬', rate: 12180 },
    { code: 'MYR', name: 'Ringgit Malaysia', flag: '🇲🇾', rate: 3680 },
    { code: 'JPY', name: 'Yen Jepang (100)', flag: '🇯🇵', rate: 10850 },
    { code: 'AUD', name: 'Dolar Australia', flag: '🇦🇺', rate: 10620 },
    { code: 'GBP', name: 'Poundsterling Inggris', flag: '🇬🇧', rate: 20850 },
    { code: 'SAR', name: 'Riyal Arab Saudi', flag: '🇸🇦', rate: 4340 },
  ]
};

// Helper untuk menghitung konversi
export const convertUsdToIdr = (usd: number) => usd * GLOBAL_RATES.USD_IDR;
export const convertIdrToUsd = (idr: number) => idr / GLOBAL_RATES.USD_IDR;
export const getGoldSpotIdrPerGram = () => (GLOBAL_RATES.GOLD_XAU_USD * GLOBAL_RATES.USD_IDR) / GLOBAL_RATES.TROY_OUNCE_TO_GRAM;
