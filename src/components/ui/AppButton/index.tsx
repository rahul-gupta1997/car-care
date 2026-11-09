import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleSheet } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { radius, spacing } from '@/theme';

import { AppText } from '../AppText';
export type AppButtonProps = PressableProps & {
  title: string;
  icon?: ReactNode;
  labelStyle?: import('react-native').TextStyle;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};
export function AppButton({
  title,
  icon,
  labelStyle,
  loading = false,
  disabled,
  variant = 'primary',
  style,
  ...props
}: AppButtonProps) {
  const { colors } = useAppTheme();
  const inactive = disabled || loading;
  const foreground =
    variant === 'secondary'
      ? colors.primary
      : variant === 'danger'
        ? colors.surface
        : colors.onPrimary;
  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel ?? title}
      accessibilityState={{ ...props.accessibilityState, disabled: !!inactive, busy: loading }}
      disabled={inactive}
      style={(state) => [
        styles.button,
        {
          backgroundColor:
            variant === 'secondary'
              ? colors.accent
              : variant === 'danger'
                ? colors.danger
                : colors.primary,
          opacity: inactive ? 0.5 : state.pressed ? 0.8 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <>
          <AppText variant="label" style={[{ color: foreground }, labelStyle]}>
            {title}
          </AppText>
          {icon}
        </>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 50,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
