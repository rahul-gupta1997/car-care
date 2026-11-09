import { sessionReady } from '@/features/auth/authSlice';
import { clearDraft, updateDraft } from '@/features/bookings/bookingSlice';
import { selectVehicle } from '@/features/garage/garageSlice';
import { setTheme } from '@/features/profile/preferencesSlice';
import { createAppStore } from '@/store';
test('shared client state is typed, independent, and resettable', () => {
  const store = createAppStore();
  store.dispatch(selectVehicle('v1'));
  store.dispatch(updateDraft({ serviceId: 'wash', vehicleId: 'v1', note: 'Please call' }));
  store.dispatch(setTheme('dark'));
  expect(store.getState().garage.selectedVehicleId).toBe('v1');
  expect(store.getState().bookingDraft.note).toBe('Please call');
  expect(store.getState().preferences.theme).toBe('dark');
  store.dispatch(clearDraft());
  expect(store.getState().bookingDraft).toEqual({ serviceId: null, vehicleId: null, note: '' });
});
test('authentication initialization transitions to signed out', () => {
  const store = createAppStore();
  expect(store.getState().auth.status).toBe('initializing');
  store.dispatch(sessionReady(null));
  expect(store.getState().auth.status).toBe('anonymous');
});
