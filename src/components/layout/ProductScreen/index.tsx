import { StatusBar } from 'expo-status-bar';
import { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { loginColors as colors } from '@/theme';

export function ProductScreen({
  title,
  action,
  children,
  scroll = true,
  gap = 18,
}: PropsWithChildren<{ title: string; action?: ReactNode; scroll?: boolean; gap?: number }>) {
  const insets = useSafeAreaInsets();
  const header = (
    <View style={styles.header}>
      <AppText accessibilityRole="header" style={styles.title}>
        {title}
      </AppText>
      {action}
    </View>
  );
  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 50) }]}>
      <StatusBar style="light" />
      {scroll ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
          {header}
          <View style={[styles.content, { gap }]}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.page, styles.fill]}>
          {header}
          <View style={[styles.content, styles.fill, { gap }]}>{children}</View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  page: { width: '100%', maxWidth: 480, alignSelf: 'center', flexGrow: 1 },
  fill: { flex: 1 },
  header: {
    height: 64,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 27,
    lineHeight: 33,
    letterSpacing: -0.8,
    fontWeight: '700',
    color: colors.text,
  },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20 },
});
