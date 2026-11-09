import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppInput } from '@/components/ui/AppInput';
import { AppLoader } from '@/components/ui/AppLoader';
import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { updateDraft } from '@/features/bookings/bookingSlice';
import { useCreateBooking } from '@/features/bookings/hooks';
import { useVehicles } from '@/features/garage/hooks';
import { selectVehicleId } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { money } from '@/utils/format';

import { useServices } from '../hooks';
export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const query = useServices();
  const vehicles = useVehicles();
  const booking = useCreateBooking();
  const selectedId = useAppSelector(selectVehicleId);
  const note = useAppSelector((state) => state.bookingDraft.note);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(updateDraft({ serviceId: id, vehicleId: selectedId }));
  }, [dispatch, id, selectedId]);
  const service = query.data?.find((s) => s.id === id);
  const vehicle = vehicles.data?.find((v) => v.id === selectedId);
  if (query.isPending) return <AppLoader />;
  if (query.isError)
    return (
      <ScreenWrapper>
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      </ScreenWrapper>
    );
  if (!service)
    return (
      <ScreenWrapper>
        <AppHeader title="Service" back />
        <EmptyState title="Service not found" message="Choose another service from Explore." />
      </ScreenWrapper>
    );
  const book = async () => {
    if (!vehicle) return;
    try {
      const result = await booking.mutateAsync({
        serviceId: service.id,
        vehicleId: vehicle.id,
        note,
      });
      router.push({ pathname: '/booking/[id]', params: { id: result.id } });
    } catch {
      /* Render mutation error below. */
    }
  };
  return (
    <ScreenWrapper>
      <AppHeader title={service.name} subtitle={service.category} back />
      <AppCard>
        <AppText>{service.description}</AppText>
        <AppText variant="heading">{money(service.price)}</AppText>
        <AppText tone="muted">{service.duration}</AppText>
        <AppText variant="caption">Demo pricing only. No payment will be collected.</AppText>
      </AppCard>
      <AppText variant="heading">Your vehicle</AppText>
      {vehicles.isError ? (
        <ErrorState error={vehicles.error} onRetry={() => void vehicles.refetch()} />
      ) : (
        <AppText>
          {vehicle
            ? `${vehicle.name} · ${vehicle.plate}`
            : 'Select or add a vehicle in My Garage first.'}
        </AppText>
      )}
      <AppButton
        title="Choose vehicle"
        variant="secondary"
        onPress={() => router.push('/(tabs)/garage')}
      />
      <AppInput
        label="Care notes (optional)"
        value={note}
        maxLength={300}
        multiline
        onChangeText={(value) => dispatch(updateDraft({ note: value }))}
      />
      {service.id === 'daily' ? (
        <EmptyState
          title="Subscriptions are coming"
          message="Plan checkout and recurring billing require backend integration. You can preview the service here."
        />
      ) : (
        <>
          <AppText tone="muted">
            Demo appointment: tomorrow. Real availability and time selection are not connected.
          </AppText>
          {booking.isError && <ErrorState error={booking.error} />}
          <AppButton
            title="Create demo booking"
            disabled={!vehicle}
            loading={booking.isPending}
            onPress={() => void book()}
          />
        </>
      )}
    </ScreenWrapper>
  );
}
