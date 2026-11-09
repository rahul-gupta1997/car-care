import { Link } from 'expo-router';
import { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

import brandMark from '@/assets/images/car-care-mark.png';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { AppCard } from '@/components/ui/AppCard';
import { AppImage } from '@/components/ui/AppImage';
import { AppText } from '@/components/ui/AppText';
import { config } from '@/constants/config';
import { radius } from '@/theme';
export function AuthShell({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <ScreenWrapper>
      <AppImage source={brandMark} style={styles.brand} accessibilityLabel="Car Care" />
      <AppText variant="label" tone="primary">
        CAR CARE / A BETTER EVERYDAY DRIVE
      </AppText>
      <AppHeader title={title} subtitle="Good care starts here." />
      <AppCard>
        <AppText variant="label">
          {config.mock ? 'DEVELOPMENT DEMO' : 'BACKEND NOT CONNECTED'}
        </AppText>
        <AppText tone="muted">
          {config.mock
            ? 'Use any valid email and a password of 8+ characters. This demo does not verify credentials, create real accounts, or send email. Do not use a real password.'
            : 'Mock authentication is disabled in release builds. Connect an authentication provider to continue.'}
        </AppText>
      </AppCard>
      {children}
      <Link href="/(auth)/login">
        <AppText tone="primary">Sign in</AppText>
      </Link>
      <Link href="/(auth)/signup">
        <AppText tone="primary">Create an account</AppText>
      </Link>
      <Link href="/(auth)/forgot-password">
        <AppText tone="primary">Forgot password?</AppText>
      </Link>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({ brand: { width: 64, height: 64, borderRadius: radius.md } });
