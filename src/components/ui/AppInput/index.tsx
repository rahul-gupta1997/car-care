import { ReactNode, useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing, typography } from '@/theme';

import { AppText } from '../AppText';
export type AppInputProps = TextInputProps & {
  label: string;
  error?: string;
  password?: boolean;
  compact?: boolean;
  leading?: ReactNode;
  visibilityIcon?: ReactNode;
  palette?: { surface: string; border: string; text: string; muted: string; danger: string };
};
export function AppInput({
  label,
  compact = false,
  leading,
  visibilityIcon,
  palette,
  error,
  password,
  style,
  editable = true,
  ...props
}: AppInputProps) {
  const theme = useAppTheme();
  const colors = palette ?? theme.colors;
  const [visible, setVisible] = useState(false);
  return (
    <View style={[styles.group, palette && { gap: 7 }]}>
      <AppText
        variant="label"
        style={palette && { color: colors.text, fontSize: 13, lineHeight: 16, fontWeight: '500' }}
      >
        {label}
      </AppText>
      <View
        style={[
          styles.row,
          palette && { borderRadius: 12, paddingHorizontal: 15, gap: 12 },
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
            opacity: editable ? 1 : 0.5,
          },
        ]}
      >
        {leading}
        <TextInput
          {...props}
          editable={editable}
          accessibilityLabel={label}
          accessibilityHint={error}
          placeholderTextColor={colors.muted}
          secureTextEntry={password && !visible}
          style={[
            styles.input,
            { color: colors.text },
            palette && { fontSize: 14, minHeight: 50, padding: 0 },
            compact && { minHeight: 45 },
            style,
          ]}
        />
        {password && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            accessibilityState={{ selected: visible }}
            hitSlop={10}
            onPress={() => setVisible((v) => !v)}
            style={[styles.toggle, palette && { minWidth: 24 }, compact && { minHeight: 45 }]}
          >
            {visibilityIcon ?? (
              <AppText variant="label" tone="primary">
                {visible ? 'Hide' : 'Show'}
              </AppText>
            )}
          </Pressable>
        )}
      </View>
      {!!error && (
        <AppText accessibilityLiveRegion="polite" variant="caption" tone="danger">
          {error}
        </AppText>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius.sm },
  input: { ...typography.body, flex: 1, minHeight: 52, padding: spacing.md },
  toggle: { minHeight: 48, minWidth: 58, justifyContent: 'center', alignItems: 'center' },
});
