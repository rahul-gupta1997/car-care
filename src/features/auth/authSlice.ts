import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthStatus, SessionMetadata } from './types';
type AuthState = { status: AuthStatus; session: SessionMetadata | null };
const initialState: AuthState = { status: 'initializing', session: null };
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionReady: (state, action: PayloadAction<SessionMetadata | null>) => {
      state.session = action.payload;
      state.status = action.payload ? 'authenticated' : 'anonymous';
    },
  },
});
export const { sessionReady } = authSlice.actions;
