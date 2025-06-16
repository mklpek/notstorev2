/******************************************************************************
 * File: safeAreaHelpers.ts
 * Layer: core/utils
 * Desc: Safe area helper functions for preventing zero value overwrites
 ******************************************************************************/

/**
 * Keeps a value only if it's a positive number, otherwise returns undefined
 * This prevents overwriting existing positive safe area values with 0
 * @param v - The value to check
 * @returns The value if positive, undefined otherwise
 */
export const keepIfPositive = (v?: number) => (typeof v === 'number' && v > 0 ? v : undefined);
