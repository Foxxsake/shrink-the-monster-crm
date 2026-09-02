import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Pure local storage parsing helper to test local-storage fallback behavior
export function getLocalStorageItem<T>(storage: Storage, key: string, initialValue: T): T {
  try {
    const item = storage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
  }
  return initialValue;
}

// In-memory mock storage for Node environment
class MemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

describe('LocalStorage parsing & fallback', () => {
  let mockStorage: MemoryStorage;

  beforeEach(() => {
    mockStorage = new MemoryStorage();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns stored data when JSON is valid', () => {
    const data = { businessName: 'Test Cleaners', isConfigured: true };
    mockStorage.setItem('test_key', JSON.stringify(data));

    const result = getLocalStorageItem(mockStorage, 'test_key', { businessName: 'Default', isConfigured: false });
    expect(result).toEqual(data);
  });

  it('falls back to initialValue when stored JSON is corrupt/invalid', () => {
    mockStorage.setItem('corrupt_key', '{ bad json ...');

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const fallback = { businessName: 'Fallback', isConfigured: false };
    const result = getLocalStorageItem(mockStorage, 'corrupt_key', fallback);

    expect(result).toEqual(fallback);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('returns initialValue when key does not exist', () => {
    const fallback = ['item1', 'item2'];
    const result = getLocalStorageItem(mockStorage, 'non_existent', fallback);
    expect(result).toEqual(fallback);
  });
});
