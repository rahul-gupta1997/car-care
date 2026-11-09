import { zodResolver } from '@hookform/resolvers/zod';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { ProductScreen } from '@/components/layout/ProductScreen';
import { AppButton } from '@/components/ui/AppButton';
import { AppImage } from '@/components/ui/AppImage';
import { AppLoader } from '@/components/ui/AppLoader';
import { AppModal } from '@/components/ui/AppModal';
import { AppText } from '@/components/ui/AppText';
import * as assets from '@/components/ui/designAssets';
import { DesignIcon } from '@/components/ui/DesignIcon';
import { ErrorState } from '@/components/ui/ErrorState';
import { FormInput } from '@/components/ui/FormInput';
import { useBookings } from '@/features/bookings/hooks';
import { selectVehicleId } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginColors as colors } from '@/theme';
import { dateLabel } from '@/utils/format';

import { selectVehicle } from '../garageSlice';
import { useAddVehicle, useUpdateVehicle, useVehicles } from '../hooks';
import { vehicleSchema } from '../schemas';
import { Vehicle } from '../types';
export default function GarageScreen() {
  const query = useVehicles();
  const bookings = useBookings();
  const add = useAddVehicle();
  const update = useUpdateVehicle();
  const selected = useAppSelector(selectVehicleId);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const { control, handleSubmit, reset } = useForm<{ name: string; plate: string }>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { name: '', plate: '' },
  });
  const busy = add.isPending || update.isPending;
  const showForm = (vehicle?: Vehicle) => {
    add.reset();
    update.reset();
    setEditing(vehicle?.id ?? null);
    reset({ name: vehicle?.name ?? '', plate: vehicle?.plate ?? '' });
    setOpen(true);
  };
  const submit = handleSubmit(async (values) => {
    try {
      if (editing) await update.mutateAsync({ vehicleId: editing, ...values });
      else await add.mutateAsync(values);
      reset();
      setOpen(false);
    } catch {
      /* Mutation error is rendered below. */
    }
  });
  const vehicles = query.data ?? [];
  const primary = vehicles.find((vehicle) => vehicle.id === selected) ?? vehicles[0];
  const others = vehicles.filter((vehicle) => vehicle.id !== primary?.id);
  const lastWash = bookings.data
    ?.filter((booking) => booking.vehicleId === primary?.id && booking.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const footer = (
    <View style={styles.footer}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add a vehicle"
        style={styles.add}
        onPress={() => showForm()}
      >
        <DesignIcon source={assets.garagePlus1} size={20} />
        <View style={styles.addCopy}>
          <AppText style={styles.addTitle}>Add a vehicle</AppText>
          <AppText style={styles.muted}>Keep every car looking its best.</AppText>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Explore daily care"
        style={styles.reminder}
        onPress={() => router.push({ pathname: '/services/[id]', params: { id: 'daily' } })}
      >
        <DesignIcon source={assets.garageSparkles} size={20} />
        <View style={styles.reminderCopy}>
          <AppText style={styles.reminderTitle}>A little care goes a long way.</AppText>
          <AppText style={styles.reminderBody}>
            Explore Car daily care for a quick refresh between washes.
          </AppText>
        </View>
      </Pressable>
    </View>
  );
  return (
    <ProductScreen
      title="My Garage"
      scroll={false}
      action={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add vehicle"
          hitSlop={6}
          style={styles.headerAction}
          onPress={() => showForm()}
        >
          <DesignIcon source={assets.garagePlus} size={19} />
        </Pressable>
      }
    >
      {query.isPending ? (
        <AppLoader />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <FlashList
          data={others}
          keyExtractor={(item) => item.id}
          extraData={selected}
          ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.introduction}>
                <AppText style={styles.subtitle}>Your cars. Our kind of care.</AppText>
                <AppText style={styles.count}>
                  {vehicles.length} {vehicles.length === 1 ? 'VEHICLE' : 'VEHICLES'} IN YOUR GARAGE
                </AppText>
              </View>
              {primary ? (
                <View style={styles.primary}>
                  <View style={styles.photo}>
                    {primary.image === 'bmw' ? (
                      <AppImage
                        source={assets.garageBmwSedan}
                        style={StyleSheet.absoluteFill}
                        transition={0}
                      />
                    ) : (
                      <DesignIcon source={assets.garageVehicleIcon} size={54} height={62} />
                    )}
                    <View style={styles.badge}>
                      <DesignIcon source={assets.garageCheck} size={11} />
                      <AppText style={styles.badgeText}>DEFAULT VEHICLE</AppText>
                    </View>
                  </View>
                  <View style={styles.details}>
                    <View style={styles.row}>
                      <View style={styles.identity}>
                        <AppText style={styles.name}>{primary.name}</AppText>
                        <AppText style={styles.metadata}>
                          {primary.details ?? 'Ready for your next refresh'}
                        </AppText>
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Edit ${primary.name}`}
                        hitSlop={8}
                        style={styles.edit}
                        onPress={() => showForm(primary)}
                      >
                        <DesignIcon source={assets.garagePencil} size={15} />
                      </Pressable>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.plate}>
                        <AppText style={styles.plateText}>{primary.plate}</AppText>
                      </View>
                      <AppText style={styles.muted}>
                        {lastWash ? `Last wash · ${dateLabel(lastWash.date)}` : 'No washes yet'}
                      </AppText>
                    </View>
                    <AppButton
                      title="Book care for this car"
                      style={styles.book}
                      labelStyle={styles.bookText}
                      icon={
                        <DesignIcon source={assets.garageArrowRight} size={15.8107} height={15.5} />
                      }
                      onPress={() => {
                        dispatch(selectVehicle(primary.id));
                        router.push('/(tabs)/explore');
                      }}
                    />
                  </View>
                </View>
              ) : (
                <AppText style={styles.subtitle}>Add your first vehicle to book a service.</AppText>
              )}
            </View>
          }
          ListFooterComponent={footer}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Select ${item.name}`}
              onPress={() => dispatch(selectVehicle(item.id))}
              style={styles.vehicle}
            >
              <DesignIcon source={assets.garageVehicleIcon} size={54} height={62} />
              <View style={styles.otherDetails}>
                <AppText style={styles.otherName}>{item.name}</AppText>
                <AppText style={styles.metadata}>{item.details ?? 'Ready for care'}</AppText>
                <AppText style={styles.muted}>{item.plate}</AppText>
              </View>
              <DesignIcon source={assets.garageChevronRight} size={17} />
            </Pressable>
          )}
        />
      )}
      <AppModal
        visible={open}
        title={editing ? 'Edit vehicle' : 'Add a vehicle'}
        onClose={() => {
          if (!busy) setOpen(false);
        }}
      >
        <FormInput
          control={control}
          name="name"
          label="Make and model"
          placeholder="e.g. BMW 3 Series"
          editable={!busy}
        />
        <FormInput
          control={control}
          name="plate"
          label="Registration number"
          autoCapitalize="characters"
          editable={!busy}
        />
        {(add.isError || update.isError) && (
          <ErrorState error={editing ? update.error : add.error} />
        )}
        <AppButton title="Save vehicle" loading={busy} onPress={() => void submit()} />
      </AppModal>
    </ProductScreen>
  );
}
const styles = StyleSheet.create({
  headerAction: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: { gap: 18, paddingBottom: 18 },
  introduction: { gap: 7 },
  subtitle: { fontSize: 13, lineHeight: 16, color: colors.secondary },
  count: { fontSize: 10, lineHeight: 12, letterSpacing: 1, color: colors.muted },
  primary: { borderRadius: 18, overflow: 'hidden', backgroundColor: colors.surface },
  photo: { height: 150, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  badgeText: {
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '600',
    letterSpacing: 0.7,
    color: colors.text,
  },
  details: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  identity: { flex: 1, gap: 5 },
  name: { fontSize: 18, lineHeight: 22, fontWeight: '600', color: colors.text },
  metadata: { fontSize: 11, lineHeight: 14, color: colors.secondary },
  edit: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#22262d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plate: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  plateText: { fontSize: 10, lineHeight: 12, letterSpacing: 1, color: colors.text },
  muted: { color: colors.muted, fontSize: 10, lineHeight: 13 },
  book: { minHeight: 46, paddingVertical: 0, borderRadius: 12, backgroundColor: colors.primary },
  bookText: { color: '#ffffff', fontSize: 13, fontWeight: '500' },
  vehicle: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  otherDetails: { flex: 1, gap: 6 },
  otherName: { fontSize: 15, lineHeight: 18, fontWeight: '600', color: colors.text },
  footer: { gap: 18, paddingTop: 18, paddingBottom: 8 },
  add: {
    minHeight: 66,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addCopy: { gap: 4 },
  addTitle: { color: colors.link, fontSize: 13, lineHeight: 16, fontWeight: '500' },
  reminder: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#342022',
    flexDirection: 'row',
    gap: 11,
  },
  reminderCopy: { flex: 1, gap: 5 },
  reminderTitle: { fontSize: 12, lineHeight: 15, fontWeight: '600', color: colors.text },
  reminderBody: { color: colors.secondary, fontSize: 11, lineHeight: 16.5 },
});
