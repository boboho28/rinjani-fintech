export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactRupiah(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)}Jt`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}Rb`;
  }
  return formatRupiah(amount);
}

export function formatDateIndo(dateString: string): string {
  if (!dateString) return '-';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Formats a raw number or numeric string with thousand separators (e.g. 2000000 -> "2.000.000")
 */
export function formatThousands(val: number | string): string {
  if (val === undefined || val === null || val === '') return '';
  const numStr = val.toString().replace(/[^0-9.]/g, '');
  if (!numStr) return '';
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
}

/**
 * Parses a thousand-separated string back to a valid float number (e.g. "2.000.000" -> 2000000)
 */
export function parseThousands(val: string): number {
  if (!val) return 0;
  // Remove all dots, replace comma with dot for decimals
  const clean = val.toString().replace(/\./g, '').replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}
