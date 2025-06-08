import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

// Tema ile ilgili durumları tanımlama
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  prefersDarkColors: boolean;
}

// Başlangıç durumu
const initialState: ThemeState = {
  mode: 'system',         // Default olarak sistem ayarlarını kullan
  prefersDarkColors: false // Başlangıçta açık tema
};

// Tema slice'ını oluşturma
export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Tema modunu değiştiren eylem
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    
    // Sistem renk tercihini güncelleyen eylem
    setPrefersDarkColors: (state, action: PayloadAction<boolean>) => {
      state.prefersDarkColors = action.payload;
    }
  }
});

// Eylem oluşturucuları dışa aktarma
export const { setThemeMode, setPrefersDarkColors } = themeSlice.actions;

// Tema seçici (selector)
export const selectThemeMode = (state: RootState) => state.theme?.mode;
export const selectEffectiveTheme = (state: RootState) => {
  const mode = state.theme?.mode;
  const prefersDarkColors = state.theme?.prefersDarkColors;
  
  if (mode === 'system') {
    return prefersDarkColors ? 'dark' : 'light';
  }
  
  return mode;
};

// Reducer'ı dışa aktarma
export default themeSlice.reducer; 