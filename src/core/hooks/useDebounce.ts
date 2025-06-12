/******************************************************************************
 * File: useDebounce.ts
 * Layer: core
 * Desc: Generic debounce hook returning latest stable value after delay
 ******************************************************************************/

import { useState, useEffect } from 'react';

/**
 * Hook that debounces a value with a specified delay
 * Useful for search inputs and API calls to prevent excessive requests
 * @param value - Value to be debounced
 * @param delay - Delay time in milliseconds (default: 300ms)
 * @returns Debounced value that updates after the delay period
 * @example
 * const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
 */
export const useDebouncedValue = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timer on value or delay change
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
