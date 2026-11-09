import { act, render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Provider } from 'react-redux';

import { setTheme } from '@/features/profile/preferencesSlice';
import { storage } from '@/lib/storage';
import { resolveTheme, ThemeProvider, useAppTheme } from '@/providers/ThemeProvider';
import { createAppStore } from '@/store';
function Probe() {
  const theme = useAppTheme();
  return <Text>{theme.ready ? (theme.dark ? 'dark' : 'light') : 'loading'}</Text>;
}
test('system mode resolves correctly', () => {
  expect(resolveTheme('system', 'dark')).toBe('dark');
  expect(resolveTheme('light', 'dark')).toBe('light');
  expect(resolveTheme('system', null)).toBe('light');
});
test('hydrates a saved theme and persists subsequent changes', async () => {
  await storage.set('theme', 'dark');
  const store = createAppStore();
  await render(
    <Provider store={store}>
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    </Provider>,
  );
  await screen.findByText('dark');
  await act(() => {
    store.dispatch(setTheme('light'));
  });
  expect(screen.getByText('light')).toBeTruthy();
  await waitFor(async () => expect(await storage.get('theme')).toBe('light'));
});
