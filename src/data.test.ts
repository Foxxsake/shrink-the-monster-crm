import { describe, expect, it } from 'vitest';
import { BUSINESS_PRESETS } from './data';

describe('BUSINESS_PRESETS', () => {
  it('contains at least 15 business types', () => {
    expect(BUSINESS_PRESETS.length).toBeGreaterThanOrEqual(15);
  });

  it('contains an Other option', () => {
    const other = BUSINESS_PRESETS.find(p => p.id === 'other');
    expect(other).toBeDefined();
    expect(other?.name).toBe('Other service business');
  });

  it('all presets have required fields', () => {
    BUSINESS_PRESETS.forEach(preset => {
      expect(preset.id).toBeDefined();
      expect(preset.name).toBeDefined();
      expect(preset.icon).toBeDefined();
      expect(preset.defaultSoftware).toBeDefined();
      expect(preset.recommendedModules.length).toBeGreaterThan(0);
      expect(preset.sampleName).toBeDefined();
      expect(preset.moduleLabels).toBeDefined();
    });
  });
});
