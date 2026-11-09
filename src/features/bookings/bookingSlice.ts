import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type BookingDraft = { serviceId: string | null; vehicleId: string | null; note: string };
const initialState: BookingDraft = { serviceId: null, vehicleId: null, note: '' };
export const bookingSlice = createSlice({
  name: 'bookingDraft',
  initialState,
  reducers: {
    updateDraft: (state, action: PayloadAction<Partial<BookingDraft>>) => {
      Object.assign(state, action.payload);
    },
    clearDraft: () => initialState,
  },
});
export const { updateDraft, clearDraft } = bookingSlice.actions;
