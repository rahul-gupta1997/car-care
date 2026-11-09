import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppLoader } from '@/components/ui/AppLoader';
import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { spacing } from '@/theme';
import { dateLabel, money } from '@/utils/format';

import { useBookings } from '../hooks';
export default function BookingsScreen() {
  const query = useBookings();
  const [filter, setFilter] = useState<'upcoming' | 'history'>('upcoming');
  const bookings = query.data?.filter((b) =>
    filter === 'upcoming' ? b.status === 'upcoming' : b.status !== 'upcoming',
  );
  return (
    <ScreenWrapper scroll={false}>
      <AppHeader title="Bookings" subtitle="Every appointment, in one place." />
      <View style={styles.filters}>
        <AppButton
          title="Upcoming"
          variant={filter === 'upcoming' ? 'primary' : 'secondary'}
          onPress={() => setFilter('upcoming')}
        />
        <AppButton
          title="History"
          variant={filter === 'history' ? 'primary' : 'secondary'}
          onPress={() => setFilter('history')}
        />
      </View>
      {query.isPending ? (
        <AppLoader />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <FlashList
          data={bookings}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <EmptyState
              title="A fresh start awaits"
              message="Your bookings will appear here."
              action="Explore services"
              onAction={() => router.push('/(tabs)/home')}
            />
          }
          renderItem={({ item }) => (
            <AppCard>
              <AppText variant="label" tone="primary">
                {item.status.toUpperCase()}
              </AppText>
              <AppText variant="heading">{item.serviceName}</AppText>
              <AppText tone="muted">
                {item.vehicleName} · {dateLabel(item.date)}
              </AppText>
              <AppText>{money(item.price)}</AppText>
              <AppButton
                title="View booking"
                variant="secondary"
                onPress={() => router.push({ pathname: '/booking/[id]', params: { id: item.id } })}
              />
            </AppCard>
          )}
        />
      )}
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: spacing.md },
  separator: { height: spacing.lg },
});
