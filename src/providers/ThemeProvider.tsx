import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { isThemeMode, setTheme, ThemeMode } from '@/features/profile/preferencesSlice';
import { reportError } from '@/lib/monitoring';
import { storage } from '@/lib/storage';
import { selectThemeMode } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { darkColors, lightColors, radius, spacing, typography } from '@/theme';
export const resolveTheme = (mode: ThemeMode, system: string | null | undefined) =>
  mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
const defaultTheme = {
  colors: lightColors,
  spacing,
  radius,
  typography,
  dark: false,
  ready: false,
};
const ThemeContext = createContext(defaultTheme);
export function ThemeProvider({ children }: PropsWithChildren) {
  const mode = useAppSelector(selectThemeMode);
  const dispatch = useAppDispatch();
  const system = useColorScheme();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    storage
      .get('theme')
      .then((value) => {
        if (active && isThemeMode(value)) dispatch(setTheme(value));
      })
      .catch((error) => reportError(error, 'preferences'))
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, [dispatch]);
  useEffect(() => {
    if (ready) storage.set('theme', mode).catch((error) => reportError(error, 'preferences'));
  }, [mode, ready]);
  const dark = resolveTheme(mode, system) === 'dark';
  const value = useMemo(
    () => ({ colors: dark ? darkColors : lightColors, spacing, radius, typography, dark, ready }),
    [dark, ready],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export const useAppTheme = () => useContext(ThemeContext);
