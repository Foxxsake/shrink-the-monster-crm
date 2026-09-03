import { describe, expect, it } from 'vitest';
import { calculateClutterPercentage } from './onboarding';

describe('calculateClutterPercentage', () => {
  it('calculates 50% when removed and kept are equal', () => {
    expect(calculateClutterPercentage(5, 5)).toBe(50);
  });

  it('calculates 0% when nothing is removed', () => {
    expect(calculateClutterPercentage(0, 5)).toBe(0);
  });

  it('calculates 100% when everything is removed', () => {
    expect(calculateClutterPercentage(5, 0)).toBe(100);
  });
  
  it('handles zero total safely', () => {
    expect(calculateClutterPercentage(0, 0)).toBe(0);
  });
});
