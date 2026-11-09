import { restoreSession, signIn, signOut } from '@/features/auth/session';
import { updateDraft } from '@/features/bookings/bookingSlice';
import { selectVehicle } from '@/features/garage/garageSlice';
import { queryClient } from '@/lib/queryClient';
import { secureStorage } from '@/lib/secureStorage';
import { store } from '@/store';
jest.mock('@/lib/secureStorage', () => ({
  secureStorage: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));
jest.mock('@/features/auth/mockAuth', () => ({
  mockAuth: {
    signIn: jest.fn(async () => ({
      accessToken: 'secret-demo',
      expiresAt: Date.now() + 60000,
      user: { id: '1', name: 'Driver', email: 'driver@example.com' },
    })),
  },
}));
const secure = jest.mocked(secureStorage);
beforeEach(() => {
  secure.get.mockReset();
  secure.set.mockReset();
  secure.clear.mockReset();
});
afterEach(() => queryClient.clear());
test('missing session initializes signed out', async () => {
  secure.get.mockResolvedValue(null);
  await restoreSession();
  expect(store.getState().auth.status).toBe('anonymous');
});
test('valid session restores metadata without token in Redux', async () => {
  secure.get.mockResolvedValue(
    JSON.stringify({
      accessToken: 'secret-demo',
      expiresAt: Date.now() + 60000,
      user: { id: '1', name: 'Driver', email: 'driver@example.com' },
    }),
  );
  await restoreSession();
  expect(store.getState().auth.status).toBe('authenticated');
  expect(JSON.stringify(store.getState())).not.toContain('secret-demo');
});
test.each([
  'not json',
  JSON.stringify({
    accessToken: 'expired',
    expiresAt: 1,
    user: { id: '1', name: 'Driver', email: 'driver@example.com' },
  }),
])('invalid/expired session is removed', async (value) => {
  secure.get.mockResolvedValue(value);
  await restoreSession();
  expect(secure.clear).toHaveBeenCalled();
  expect(store.getState().auth.status).toBe('anonymous');
});
test('storage failure does not leave initialization hanging', async () => {
  secure.get.mockRejectedValue(new Error('keychain unavailable'));
  await restoreSession();
  expect(store.getState().auth.status).toBe('anonymous');
});
test('sign in stores securely; logout clears account data and draft', async () => {
  await signIn('driver@example.com');
  expect(secure.set).toHaveBeenCalled();
  store.dispatch(selectVehicle('v1'));
  store.dispatch(updateDraft({ note: 'private note' }));
  queryClient.setQueryData(['private'], { value: 1 });
  await signOut();
  expect(secure.clear).toHaveBeenCalled();
  expect(queryClient.getQueryData(['private'])).toBeUndefined();
  expect(store.getState().garage.selectedVehicleId).toBeNull();
  expect(store.getState().bookingDraft.note).toBe('');
});

test('failed manual logout preserves the screen so the user can retry', async () => {
  await signIn('driver@example.com');
  secure.clear.mockRejectedValueOnce(new Error('keychain unavailable'));
  await expect(signOut()).rejects.toThrow('Could not clear the saved session');
  expect(store.getState().auth.status).toBe('authenticated');
  await signOut();
  expect(store.getState().auth.status).toBe('anonymous');
});

test('forced expiration blocks navigation even when keychain deletion fails', async () => {
  await signIn('driver@example.com');
  secure.clear.mockRejectedValueOnce(new Error('keychain unavailable'));
  await signOut(true);
  expect(store.getState().auth.status).toBe('anonymous');
});

test('sign in without remember clears saved credentials', async () => {
  await signIn('driver@example.com', undefined, false);
  expect(secure.set).not.toHaveBeenCalled();
  expect(secure.clear).toHaveBeenCalled();
  expect(store.getState().auth.status).toBe('authenticated');
});
