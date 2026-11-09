import { Text, TextProps } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { typography } from '@/theme';
export type AppTextProps = TextProps & {
  variant?: keyof typeof typography;
  tone?: 'text' | 'muted' | 'primary' | 'danger';
};
export function AppText({ variant = 'body', tone = 'text', style, ...props }: AppTextProps) {
  const { colors } = useAppTheme();
  return <Text {...props} style={[typography[variant], { color: colors[tone] }, style]} />;
}
