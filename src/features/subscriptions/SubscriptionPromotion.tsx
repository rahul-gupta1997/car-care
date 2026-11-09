import { router } from 'expo-router';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { subscriptionPromotion } from '@/lib/mock/data';
export function SubscriptionPromotion() {
  return (
    <AppCard>
      <AppText variant="heading">{subscriptionPromotion.title}</AppText>
      <AppText tone="muted">{subscriptionPromotion.description}</AppText>
      <AppButton
        title={subscriptionPromotion.label}
        variant="secondary"
        onPress={() => router.push({ pathname: '/services/[id]', params: { id: 'daily' } })}
      />
    </AppCard>
  );
}
