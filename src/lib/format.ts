// src/lib/format.ts
// Small formatting helpers shared across the story UI.

/**
 * Format a dollar amount. Whole dollars render without cents ("$286");
 * fractional amounts keep two decimals ("$24.16").
 */
export function formatMoney(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

/** English ordinal suffix: 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th", 11 -> "11th". */
export function ordinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}`;
}
