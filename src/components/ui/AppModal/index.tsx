import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing } from '@/theme';

import { AppButton } from '../AppButton';
import { AppText } from '../AppText';
export function AppModal({
  visible,
  title,
  onClose,
  children,
}: PropsWithChildren<{ visible: boolean; title: string; onClose: () => void }>) {
  const { colors } = useAppTheme();
  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.overlay, { backgroundColor: colors.overlay }]}
      >
        <View accessibilityViewIsModal style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <AppText variant="heading" accessibilityRole="header">
              {title}
            </AppText>
            {children}
            <AppButton title="Close" variant="secondary" onPress={onClose} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  sheet: {
    maxHeight: '90%',
    borderRadius: radius.lg,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  content: { padding: spacing.xl, gap: spacing.lg },
});
