import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing } from '@/theme';

import { AppText } from '../AppText';
export function AppLoader({ label = 'Loading…' }: { label?: string }) {
  const { colors } = useAppTheme();
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ActivityIndicator color={colors.primary} size="large" />
      <AppText tone="muted">{label}</AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
});
