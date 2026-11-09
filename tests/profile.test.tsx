import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import { signOut } from '@/features/auth/session';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import { createAppStore as mockCreateAppStore } from '@/store';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));
jest.mock('@/features/auth/session', () => ({ signOut: jest.fn(async () => {}) }));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('@/components/ui/designAssets', () => ({}));
jest.mock('@/components/ui/DesignIcon', () => ({ DesignIcon: () => null }));
jest.mock('@/components/ui/AppImage', () => ({ AppImage: () => null }));
jest.mock('@/components/ui/AppModal', () => ({ AppModal: () => null }));
jest.mock('@/store/hooks', () => ({
  useAppSelector: (
    selector: (state: ReturnType<ReturnType<typeof mockCreateAppStore>['getState']>) => unknown,
  ) =>
    selector({
      ...mockCreateAppStore().getState(),
      auth: {
        status: 'authenticated',
        session: {
          user: { id: 'test', name: 'Alex Morgan', email: 'alex@example.com' },
          expiresAt: Date.now() + 60000,
        },
      },
    }),
  useAppDispatch: () => jest.fn(),
}));
jest.mock('@/features/bookings/hooks', () => ({
  useBookings: () => ({
    isPending: false,
    isError: false,
    data: [
      {
        id: 'next',
        serviceId: 'deep',
        vehicleName: 'BMW 3 Series',
        date: '2026-12-01T10:00:00.000Z',
        status: 'upcoming',
        price: 2499,
      },
      {
        id: 'previous',
        serviceId: 'wash',
        vehicleName: 'BMW 3 Series',
        date: '2026-10-01T10:00:00.000Z',
        status: 'completed',
        price: 499,
      },
    ],
  }),
}));

test('profile uses booking data and connects manage, rebook, and logout actions', async () => {
  await render(<ProfileScreen />);
  expect(screen.getByText('Alex')).toBeTruthy();
  expect(screen.getByText('1 upcoming')).toBeTruthy();
  expect(screen.getByText('1 completed')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Manage booking' }));
  expect(router.push).toHaveBeenLastCalledWith({
    pathname: '/booking/[id]',
    params: { id: 'next' },
  });
  await fireEvent.press(screen.getByRole('button', { name: 'Book again' }));
  expect(router.push).toHaveBeenLastCalledWith({
    pathname: '/services/[id]',
    params: { id: 'wash' },
  });
  await fireEvent.press(screen.getByRole('button', { name: 'Log out' }));
  expect(signOut).toHaveBeenCalledTimes(1);
});
