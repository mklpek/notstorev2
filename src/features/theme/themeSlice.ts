/******************************************************************************
 * File: themeSlice.ts
 * Layer: feature
 * Desc: Redux slice for theme management with light/dark/system mode support
 ******************************************************************************/

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../core/store';

/**
 * Theme mode options for the application
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme state interface
 */
interface ThemeState {
  mode: ThemeMode;
  prefersDarkColors: boolean;
}

/**
 * Initial theme state
 */
const initialState: ThemeState = {
  mode: 'system', // Default to system settings
  prefersDarkColors: false, // Start with light theme
};

/**
 * Theme slice with reducers for theme management
 */
export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    /**
     * Action to change theme mode
     * @param state - Current theme state
     * @param action - Payload containing new theme mode
     */
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },

    /**
     * Action to update system color preference
     * @param state - Current theme state
     * @param action - Payload containing dark color preference
     */
    setPrefersDarkColors: (state, action: PayloadAction<boolean>) => {
      state.prefersDarkColors = action.payload;
    },
  },
});

// Export action creators
export const { setThemeMode, setPrefersDarkColors } = themeSlice.actions;

/**
 * Selector to get current theme mode
 * @param state - Root state
 * @returns Current theme mode
 */
export const selectThemeMode = (state: RootState) => state.theme?.mode;

/**
 * Selector to get effective theme (resolves system preference)
 * @param state - Root state
 * @returns Effective theme ('light' or 'dark')
 */
export const selectEffectiveTheme = (state: RootState) => {
  const mode = state.theme?.mode;
  const prefersDarkColors = state.theme?.prefersDarkColors;

  if (mode === 'system') {
    return prefersDarkColors ? 'dark' : 'light';
  }

  return mode;
};

// Export reducer
export default themeSlice.reducer;
