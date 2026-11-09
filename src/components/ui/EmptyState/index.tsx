import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { AppText } from '../AppText';
export function EmptyState({
  title,
  message,
  action,
  onAction,
}: {
  title: string;
  message: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <AppCard>
      <AppText variant="heading">{title}</AppText>
      <AppText tone="muted">{message}</AppText>
      {action && onAction && <AppButton title={action} onPress={onAction} />}
    </AppCard>
  );
}
