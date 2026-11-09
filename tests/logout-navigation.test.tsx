import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import { PropsWithChildren } from 'react';
import { Pressable, Text } from 'react-native';
import { Provider as MockProvider } from 'react-redux';

import RootLayout from '@/app/_layout';
import AuthLayout from '@/app/(auth)/_layout';
import TabLayout from '@/app/(tabs)/_layout';
import Index from '@/app/index';
import { sessionReady } from '@/features/auth/authSlice';
import { createAppStore } from '@/store';
import { lightColors as mockColors } from '@/theme';

const mockStore = createAppStore();
jest.mock('@/providers/AppProviders', () => ({
  AppProviders: ({ children }: PropsWithChildren) => (
    <MockProvider store={mockStore}>{children}</MockProvider>
  ),
}));
jest.mock('@/hooks/useAppTheme', () => ({
  useAppTheme: () => ({ ready: true, dark: false, colors: mockColors }),
}));
jest.mock('@/components/ui/AppImage', () => ({ AppImage: () => null }));
jest.mock('@/features/home/assets', () => ({}));
const session = {
  user: { id: 'test', name: 'Driver', email: 'driver@example.com' },
  expiresAt: Date.now() + 60000,
};
function Login() {
  return (
    <Pressable onPress={() => mockStore.dispatch(sessionReady(session))}>
      <Text>Sign in test</Text>
    </Pressable>
  );
}
function Home() {
  return (
    <Pressable onPress={() => mockStore.dispatch(sessionReady(null))}>
      <Text>Log out test</Text>
    </Pressable>
  );
}
afterEach(() => jest.restoreAllMocks());

test.each(['/(tabs)/profile', '/(tabs)/home', '/services/wash', '/booking/demo'])(
  'login/logout from %s settles on the correct protected screen',
  async (initialUrl) => {
    let stage = 'initial render';
    jest.spyOn(console, 'error').mockImplementation((message: unknown) => {
      throw new Error(stage + ': ' + String(message));
    });
    mockStore.dispatch(sessionReady(session));
    await renderRouter(
      {
        _layout: RootLayout,
        index: Index,
        '(auth)/_layout': AuthLayout,
        '(auth)/login': Login,
        '(tabs)/_layout': TabLayout,
        '(tabs)/home': Home,
        '(tabs)/profile': Home,
        '(tabs)/explore': Home,
        '(tabs)/garage': Home,
        '(tabs)/bookings': Home,
        'services/[id]': Home,
        'booking/[id]': Home,
      },
      { initialUrl },
    );
    for (let i = 0; i < 2; i++) {
      stage = 'logout ' + i;
      await fireEvent.press(screen.getByText('Log out test'));
      await act(async () => {});
      expect(screen).toHavePathname('/login');
      stage = 'login ' + i;
      await fireEvent.press(screen.getByText('Sign in test'));
      await act(async () => {});
      expect(screen).toHavePathname('/home');
      expect(screen.getByText('Log out test')).toBeTruthy();
    }
  },
);
