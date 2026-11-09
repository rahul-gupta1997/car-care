import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing } from '@/theme';
import { money } from '@/utils/format';

import { CarService } from '../types';
export function ServiceCard({ service }: { service: CarService }) {
  const { colors } = useAppTheme();
  return (
    <AppCard>
      <View style={styles.row}>
        <Ionicons name={service.icon} size={32} color={colors.primary} />
        <AppText variant="caption" tone="muted">
          {service.duration}
        </AppText>
      </View>
      <AppText variant="heading">{service.name}</AppText>
      <AppText tone="muted">{service.description}</AppText>
      <AppText variant="label">From {money(service.price)}</AppText>
      <AppButton
        title={`Explore ${service.name}`}
        variant="secondary"
        onPress={() => router.push({ pathname: '/services/[id]', params: { id: service.id } })}
      />
    </AppCard>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
