import { describe, expect, it } from 'vitest';
import { generateInvoiceNumber } from './invoice';

describe('generateInvoiceNumber', () => {
  it('generates an invoice reference in format INV-YYYY-XXXX', () => {
    const inv = generateInvoiceNumber({ seed: 123 });
    const currentYear = new Date().getFullYear();
    expect(inv).toBe(`INV-${currentYear}-0123`);
  });

  it('uses the year from the passed date parameter', () => {
    const customDate = new Date('2028-05-15');
    const inv = generateInvoiceNumber({ date: customDate, seed: 45 });
    expect(inv).toBe('INV-2028-0045');
  });

  it('pads seed numbers to 4 digits', () => {
    const inv = generateInvoiceNumber({ date: new Date('2026-01-01'), seed: 7 });
    expect(inv).toBe('INV-2026-0007');
  });

  it('generates a valid invoice reference when called with no arguments', () => {
    const inv = generateInvoiceNumber();
    const currentYear = new Date().getFullYear();
    expect(inv).toMatch(new RegExp(`^INV-${currentYear}-\\d{4}$`));
  });
});
