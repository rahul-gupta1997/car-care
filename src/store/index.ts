import { configureStore } from '@reduxjs/toolkit';

import { authSlice } from '@/features/auth/authSlice';
import { bookingSlice } from '@/features/bookings/bookingSlice';
import { garageSlice } from '@/features/garage/garageSlice';
import { preferencesSlice } from '@/features/profile/preferencesSlice';
export const createAppStore = () =>
  configureStore({
    reducer: {
      auth: authSlice.reducer,
      garage: garageSlice.reducer,
      bookingDraft: bookingSlice.reducer,
      preferences: preferencesSlice.reducer,
    },
    devTools: __DEV__,
  });
export const store = createAppStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const selectSession = (state: RootState) => state.auth.session;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectVehicleId = (state: RootState) => state.garage.selectedVehicleId;
export const selectThemeMode = (state: RootState) => state.preferences.theme;
