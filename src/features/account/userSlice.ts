/******************************************************************************
 * File: userSlice.ts
 * Layer: feature
 * Desc: User state management slice for Telegram user authentication and profile data
 ******************************************************************************/

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/**
 * Telegram user interface
 * Represents user data from Telegram WebApp
 */
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
  photoUrl?: string;
  cachedPhotoUrl?: string;
}

/**
 * User state interface
 * Manages authentication status and user data
 */
interface UserState {
  user: TelegramUser | null;
  isAuthenticated: boolean;
}

/**
 * Initial user state
 * User starts as unauthenticated with no user data
 */
const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

/**
 * User slice for managing Telegram user state
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Sets Telegram user data and marks as authenticated
     * @param state - Current user state
     * @param action - Payload containing Telegram user data
     */
    setTelegramUser: (state, action: PayloadAction<TelegramUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    /**
     * Updates user's photo URL
     * @param state - Current user state
     * @param action - Payload containing new photo URL
     */
    setUserPhotoUrl: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.photoUrl = action.payload;
      }
    },

    /**
     * Clears user data and marks as unauthenticated
     * @param state - Current user state
     */
    clearUser: state => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Export action creators
export const { setTelegramUser, setUserPhotoUrl, clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
