import { normalizeError } from '@/services/errors';

import { EmptyState } from '../EmptyState';
export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <EmptyState
      title="Something needs another try"
      message={normalizeError(error).message}
      action={onRetry ? 'Try again' : undefined}
      onAction={onRetry}
    />
  );
}
