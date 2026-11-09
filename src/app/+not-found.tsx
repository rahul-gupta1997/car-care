import { router } from 'expo-router';

import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { EmptyState } from '@/components/ui/EmptyState';
export default function NotFound() {
  return (
    <ScreenWrapper>
      <EmptyState
        title="You took a detour"
        message="This page does not exist."
        action="Go home"
        onAction={() => router.replace('/')}
      />
    </ScreenWrapper>
  );
}
