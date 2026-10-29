// ─── Formatters for Super Admin dashboard ─────────────────────────────────────

/**
 * Format a number as Indian currency (₹).
 * e.g. 4360000 → "₹43,60,000"
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format large numbers with Cr / L suffix.
 * e.g. 45000000 → "₹45 Cr", 310000 → "₹3.1L"
 */
export const formatCompactCurrency = (value: number): string => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(0)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value}`;
};

/**
 * Format a number with commas.
 * e.g. 14563 → "14,563"
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN').format(value);
};

/**
 * Format percentage with sign.
 * e.g. 8.33 → "+8.33%"
 */
export const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};
