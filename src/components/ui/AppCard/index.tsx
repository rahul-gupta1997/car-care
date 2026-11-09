import { StyleSheet, View, ViewProps } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing } from '@/theme';
export function AppCard({ style, ...props }: ViewProps) {
  const { colors } = useAppTheme();
  return (
    <View
      {...props}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}
    />
  );
}
const styles = StyleSheet.create({
  card: { borderRadius: radius.md, borderWidth: 1, padding: spacing.xl, gap: spacing.md },
});
