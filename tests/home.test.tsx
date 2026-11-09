import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import Index from '@/app/index';
import HomeScreen from '@/features/home/screens/HomeScreen';
import { useServices } from '@/features/services/hooks';
import { useAppSelector } from '@/store/hooks';

jest.mock('expo-router', () => ({ router: { push: jest.fn() }, Redirect: jest.fn(() => null) }));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('@/store/hooks', () => ({ useAppSelector: jest.fn() }));
jest.mock('@/features/services/hooks', () => ({ useServices: jest.fn() }));
jest.mock('@/components/ui/AppImage', () => ({ AppImage: () => null }));
jest.mock('@/components/ui/AppModal', () => ({ AppModal: () => null }));
jest.mock('@/features/home/assets', () =>
  Object.fromEntries(
    [
      'hero',
      'wash',
      'interior',
      'mapPin',
      'chevron',
      'bell',
      'arrow',
      'carWash',
      'armchair',
      'sparkles',
      'shield',
      'star',
      'arrowUp',
      'badge',
    ].map((key) => [key, 1]),
  ),
);
const selector = jest.mocked(useAppSelector);
beforeEach(() => {
  jest.clearAllMocks();
  selector.mockReturnValue({ user: { name: 'Alex Morgan' } });
  jest.mocked(useServices).mockReturnValue({
    data: [
      { id: 'wash', price: 499, duration: '45 minutes' },
      { id: 'deep', price: 2499, duration: '3 hours' },
    ],
    isPending: false,
    isError: false,
  } as ReturnType<typeof useServices>);
});
test('home greets the signed-in user and connects service actions', async () => {
  await render(<HomeScreen />);
  expect(screen.getByText('Hey Alex, welcome in.')).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: 'Book a wash' }));
  expect(router.push).toHaveBeenLastCalledWith({
    pathname: '/services/[id]',
    params: { id: 'wash' },
  });
  await fireEvent.press(screen.getByRole('link', { name: 'Explore all' }));
  expect(router.push).toHaveBeenLastCalledWith('/(tabs)/explore');
  await fireEvent.press(screen.getByRole('button', { name: /Explore Interior reset/ }));
  expect(router.push).toHaveBeenLastCalledWith({
    pathname: '/services/[id]',
    params: { id: 'deep' },
  });
});
test('authenticated entry redirects to the home tab', async () => {
  selector.mockReturnValue('authenticated');
  await render(<Index />);
  const { Redirect } = jest.requireMock('expo-router');
  expect(Redirect).toHaveBeenCalledWith(
    expect.objectContaining({ href: '/(tabs)/home' }),
    undefined,
  );
});
