import { describe, expect, it } from 'vitest';
import { ModuleConfig } from '../types';
import { getEnabledModules, selectValidModule } from './config';

describe('Workspace module configuration', () => {
  const sampleModules: ModuleConfig[] = [
    { id: 'customers', enabled: true, label: 'Clients', defaultLabel: 'Clients', iconName: 'Users', description: '' },
    { id: 'jobs', enabled: false, label: 'Jobs', defaultLabel: 'Jobs', iconName: 'Briefcase', description: '' },
    { id: 'tasks', enabled: true, label: 'Tasks', defaultLabel: 'Tasks', iconName: 'CheckSquare', description: '' },
    { id: 'payments', enabled: false, label: 'Invoices', defaultLabel: 'Payments', iconName: 'Receipt', description: '' },
  ];

  it('filters out disabled modules', () => {
    const enabled = getEnabledModules(sampleModules);
    expect(enabled).toHaveLength(2);
    expect(enabled.map((m) => m.id)).toEqual(['customers', 'tasks']);
  });

  it('returns preferred module if it is enabled', () => {
    const enabled = getEnabledModules(sampleModules);
    const selected = selectValidModule(enabled, 'tasks');
    expect(selected).toBe('tasks');
  });

  it('falls back to the first enabled module if preferred module is disabled', () => {
    const enabled = getEnabledModules(sampleModules);
    const selected = selectValidModule(enabled, 'jobs'); // 'jobs' is disabled
    expect(selected).toBe('customers');
  });

  it('defaults to customers if no enabled modules provided', () => {
    const selected = selectValidModule([]);
    expect(selected).toBe('customers');
  });
});
