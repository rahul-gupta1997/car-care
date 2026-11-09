import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type ThemeMode = 'light' | 'dark' | 'system';
export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: { theme: 'system' as ThemeMode },
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
  },
});
export const { setTheme } = preferencesSlice.actions;
export const isThemeMode = (value: unknown): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'system';
