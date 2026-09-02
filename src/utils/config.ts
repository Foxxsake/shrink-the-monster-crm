import { ModuleConfig, ModuleId } from '../types';

export function getEnabledModules(modules: ModuleConfig[]): ModuleConfig[] {
  return modules.filter((m) => m.enabled);
}

export function selectValidModule(
  enabledModules: ModuleConfig[],
  preferredType?: ModuleId
): ModuleId {
  if (preferredType && enabledModules.some((m) => m.id === preferredType)) {
    return preferredType;
  }
  return enabledModules[0]?.id || 'customers';
}
