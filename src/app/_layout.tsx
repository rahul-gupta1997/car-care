import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppLoader } from '@/components/ui/AppLoader';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AppProviders } from '@/providers/AppProviders';
import { selectAuthStatus } from '@/store';
import { useAppSelector } from '@/store/hooks';
export { ErrorBoundary } from 'expo-router';
function Navigation() {
  const status = useAppSelector(selectAuthStatus);
  const theme = useAppTheme();
  if (status === 'initializing' || !theme.ready)
    return <AppLoader label="Getting your garage ready…" />;
  return (
    <>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Protected guard={status === 'anonymous'}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={status === 'authenticated'}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="services/[id]" />
          <Stack.Screen name="booking/[id]" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
export default function RootLayout() {
  return (
    <AppProviders>
      <Navigation />
    </AppProviders>
  );
}
