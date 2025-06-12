/******************************************************************************
 * File: index.ts
 * Layer: core
 * Desc: Redux store exports - store instance, types, and typed hooks
 ******************************************************************************/

// Redux store configuration
export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Typed Redux hooks
export { useAppDispatch, useAppSelector } from './hooks';
