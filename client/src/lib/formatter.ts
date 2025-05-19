/**
 * Formats a number as currency based on the specified currency code
 */
export function formatCurrency(value: number, currency: string = 'EUR'): string {
  if (currency === 'BTC') {
    // For Bitcoin format with 8 decimals
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'XBT',
      minimumFractionDigits: 8,
      maximumFractionDigits: 8
    }).format(value).replace('XBT', '₿');
  } else if (currency === 'USDT') {
    // For USDT use ₮ symbol
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value).replace('$', '₮');
  } else {
    // For other currencies (EUR, USD) use standard formatting
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency
    }).format(value);
  }
}

/**
 * Formats a number as a percentage with 2 decimal places
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
}
