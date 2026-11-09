import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppLoader } from '@/components/ui/AppLoader';
import { AppModal } from '@/components/ui/AppModal';
import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { dateLabel, money } from '@/utils/format';

import { useBookings, useCancelBooking } from '../hooks';
export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useBookings();
  const cancel = useCancelBooking();
  const [confirm, setConfirm] = useState(false);
  const booking = query.data?.find((b) => b.id === id);
  if (query.isPending) return <AppLoader />;
  return (
    <ScreenWrapper>
      <AppHeader title="Booking details" back />
      {query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : !booking ? (
        <EmptyState
          title="Booking not found"
          message="Demo bookings reset when the app restarts."
        />
      ) : (
        <>
          <AppCard>
            <AppText variant="label" tone="primary">
              {booking.status.toUpperCase()}
            </AppText>
            <AppText variant="heading">{booking.serviceName}</AppText>
            <AppText>{booking.vehicleName}</AppText>
            <AppText>{dateLabel(booking.date)}</AppText>
            <AppText>{money(booking.price)}</AppText>
            {!!booking.note && <AppText tone="muted">{booking.note}</AppText>}
            <AppText variant="caption">
              Demo appointment · no real service has been scheduled.
            </AppText>
          </AppCard>
          {booking.status === 'upcoming' && (
            <AppButton
              title="Cancel booking"
              variant="secondary"
              onPress={() => setConfirm(true)}
            />
          )}
        </>
      )}
      <AppModal
        visible={confirm}
        title="Cancel this booking?"
        onClose={() => {
          if (!cancel.isPending) setConfirm(false);
        }}
      >
        <AppText>This will cancel the demo appointment.</AppText>
        {cancel.isError && <ErrorState error={cancel.error} />}
        <AppButton
          title="Confirm cancellation"
          variant="danger"
          loading={cancel.isPending}
          onPress={() => cancel.mutate(id, { onSuccess: () => setConfirm(false) })}
        />
      </AppModal>
    </ScreenWrapper>
  );
}
