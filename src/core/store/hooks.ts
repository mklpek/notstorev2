/******************************************************************************
 * File: hooks.ts
 * Layer: core
 * Desc: Typed Redux hooks for useDispatch and useSelector with TypeScript support
 ******************************************************************************/

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Typed version of useDispatch hook
 * Eliminates need for generic boilerplate in components
 * @returns Typed dispatch function
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Typed version of useSelector hook
 * Provides full TypeScript support for state selection
 * @returns Typed selector hook
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
