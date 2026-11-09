import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export const garageSlice = createSlice({
  name: 'garage',
  initialState: { selectedVehicleId: null as string | null },
  reducers: {
    selectVehicle: (state, action: PayloadAction<string | null>) => {
      state.selectedVehicleId = action.payload;
    },
  },
});
export const { selectVehicle } = garageSlice.actions;
