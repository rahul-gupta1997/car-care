import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { spacing } from '@/theme';
export function AppHeader({
  title,
  subtitle,
  back = false,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
}) {
  return (
    <View style={styles.header}>
      {back && (
        <AppButton
          title="Back"
          variant="secondary"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/home'))}
        />
      )}
      <AppText variant="title" accessibilityRole="header">
        {title}
      </AppText>
      {subtitle && <AppText tone="muted">{subtitle}</AppText>}
    </View>
  );
}
const styles = StyleSheet.create({ header: { gap: spacing.sm } });
