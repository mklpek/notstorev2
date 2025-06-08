import { useState, useEffect } from 'react';

/**
 * Bir değeri belirli bir gecikme süresiyle debounce eden hook.
 * @param value Debounce edilecek değer
 * @param delay Gecikme süresi (ms cinsinden)
 * @returns Debounce edilmiş değer
 */
export const useDebouncedValue = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}; 