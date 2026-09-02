/**
 * Utility to generate readable, offline-friendly invoice numbers.
 * Format: INV-YYYY-XXXX
 */
export function generateInvoiceNumber(options?: { date?: Date; seed?: number }): string {
  const date = options?.date ?? new Date();
  const year = date.getFullYear();

  let num: number;
  if (options?.seed !== undefined) {
    num = Math.abs(Math.floor(options.seed)) % 10000;
  } else {
    // Generate a 4-digit random number between 1000 and 9999
    num = Math.floor(Math.random() * 9000) + 1000;
  }

  const padded = String(num).padStart(4, '0');
  return `INV-${year}-${padded}`;
}
