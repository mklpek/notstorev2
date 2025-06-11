import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
  photoUrl?: string;
}

// TelegramUser | null olarak değil doğrudan TelegramUser olarak tanımlıyoruz
// ve ilk durumda isAuthenticated false olarak ayarlıyoruz
interface UserState {
  user: TelegramUser | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTelegramUser: (state, action: PayloadAction<TelegramUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setUserPhotoUrl: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.photoUrl = action.payload;
      }
    },
    clearUser: state => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setTelegramUser, setUserPhotoUrl, clearUser } = userSlice.actions;
export default userSlice.reducer;
