import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { restoreSession, signOut } from '@/features/auth/session';
import { reportError } from '@/lib/monitoring';
import { queryClient } from '@/lib/queryClient';
import { selectSession, store } from '@/store';
import { useAppSelector } from '@/store/hooks';

import { ThemeProvider } from './ThemeProvider';
function Lifecycle({ children }: PropsWithChildren) {
  const session = useAppSelector(selectSession);
  useEffect(() => {
    void restoreSession();
  }, []);
  useEffect(() => {
    onlineManager.setEventListener((setOnline) =>
      NetInfo.addEventListener((state) =>
        setOnline(state.isConnected !== false && state.isInternetReachable !== false),
      ),
    );
    const subscription = AppState.addEventListener('change', (state) => {
      if (Platform.OS !== 'web') focusManager.setFocused(state === 'active');
      if (state === 'active' && session && session.expiresAt <= Date.now())
        void signOut(true).catch((error) => reportError(error, 'session-expiry'));
    });
    const expiry = session
      ? setTimeout(
          () => {
            void signOut(true).catch((error) => reportError(error, 'session-expiry'));
          },
          Math.max(0, session.expiresAt - Date.now()),
        )
      : undefined;
    return () => {
      subscription.remove();
      if (expiry) clearTimeout(expiry);
      onlineManager.setEventListener(() => () => {});
    };
  }, [session]);
  return children;
}
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <Lifecycle>{children}</Lifecycle>
            </ErrorBoundary>
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
}
