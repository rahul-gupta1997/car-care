import { router } from 'expo-router';
import { useState } from 'react';
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
import { signOut } from '@/features/auth/session';
import { useBookings } from '@/features/bookings/hooks';
import { servicePresentation } from '@/features/services/presentation';
import { profileEntries } from '@/lib/mock/data';
import { selectSession, selectThemeMode } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginColors as colors } from '@/theme';
import { dateLabel, money } from '@/utils/format';

import { setTheme, ThemeMode } from '../preferencesSlice';
const options = [
  {
    title: 'Payment methods',
    icon: assets.profileCreditCard,
    detail: 'Not connected',
    body: 'No payment methods are saved. Payments are not connected in this demo.',
  },
  {
    title: 'Saved addresses',
    icon: assets.profileMapPin,
    detail: 'No addresses',
    body: 'No addresses are saved. Address management is not connected yet.',
  },
  {
    title: 'Notifications',
    icon: assets.profileBell,
    detail: '',
    body: profileEntries.notifications.body,
  },
  {
    title: 'Help & support',
    icon: assets.profileCircleHelp,
    detail: '',
    body: 'Support messaging is not connected yet. You can review and manage your bookings from My Bookings.',
  },
];
export default function ProfileScreen() {
  const session = useAppSelector(selectSession);
  const mode = useAppSelector(selectThemeMode);
  const dispatch = useAppDispatch();
  const bookings = useBookings();
  const [modal, setModal] = useState<{ title: string; body: string } | null>(null);
  const [settings, setSettings] = useState(false);
  const [error, setError] = useState<unknown>();
  const [busy, setBusy] = useState(false);
  const upcoming =
    bookings.data
      ?.filter((booking) => booking.status === 'upcoming')
      .sort((a, b) => a.date.localeCompare(b.date)) ?? [];
  const completed =
    bookings.data
      ?.filter((booking) => booking.status === 'completed')
      .sort((a, b) => b.date.localeCompare(a.date)) ?? [];
  const next = upcoming[0];
  const recent = completed[0];
  const name = session?.user.name.split(' ')[0] || 'Driver';
  const logout = async () => {
    setBusy(true);
    setError(undefined);
    try {
      await signOut();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };
  return (
    <ProductScreen
      title="Profile"
      gap={20}
      action={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Settings"
          hitSlop={6}
          style={styles.headerAction}
          onPress={() => setSettings(true)}
        >
          <DesignIcon source={assets.profileSettings} size={19} />
        </Pressable>
      }
    >
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <AppText style={styles.initial}>{name[0].toUpperCase()}</AppText>
        </View>
        <View style={styles.member}>
          <AppText style={styles.name}>{name}</AppText>
          <AppText style={styles.tagline}>Good care looks good on you.</AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            hitSlop={8}
            onPress={() =>
              setModal({
                title: 'Your profile',
                body: `${session?.user.name ?? ''}\n${session?.user.email ?? ''}\n\nProfile editing is not connected yet.`,
              })
            }
          >
            <AppText style={styles.edit}>Edit profile</AppText>
          </Pressable>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.row}>
          <AppText accessibilityRole="header" style={styles.sectionTitle}>
            My Bookings
          </AppText>
          <Pressable
            accessibilityRole="link"
            hitSlop={10}
            onPress={() => router.push('/(tabs)/bookings')}
          >
            <AppText style={styles.viewAll}>View all</AppText>
          </Pressable>
        </View>
        {bookings.isPending ? (
          <AppLoader />
        ) : bookings.isError ? (
          <ErrorState error={bookings.error} onRetry={() => void bookings.refetch()} />
        ) : (
          <>
            <View style={styles.counts}>
              <View style={[styles.count, styles.warm]}>
                <AppText style={styles.upcomingCount}>{upcoming.length} upcoming</AppText>
              </View>
              <View style={styles.count}>
                <AppText style={styles.completedCount}>{completed.length} completed</AppText>
              </View>
            </View>
            {next ? (
              <View style={styles.booking}>
                <View style={styles.row}>
                  <View style={styles.date}>
                    <DesignIcon source={assets.profileCalendarDays} size={15} />
                    <AppText style={styles.dateText}>
                      {new Date(next.date).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </AppText>
                  </View>
                  <AppText style={styles.confirmed}>Confirmed</AppText>
                </View>
                <View style={styles.bookedService}>
                  <AppImage
                    source={
                      servicePresentation[next.serviceId]?.image ??
                      assets.profileInteriorResetPhotograph
                    }
                    style={styles.bookingPhoto}
                  />
                  <View style={styles.bookedDetails}>
                    <AppText style={styles.serviceName}>
                      {servicePresentation[next.serviceId]?.title ?? next.serviceName}
                    </AppText>
                    <AppText style={styles.vehicleName}>{next.vehicleName}</AppText>
                    <AppText style={styles.serviceMeta}>Your upcoming care appointment</AppText>
                  </View>
                  <AppText style={styles.price}>{money(next.price)}</AppText>
                </View>
                <Pressable
                  accessibilityRole="button"
                  style={styles.manage}
                  onPress={() =>
                    router.push({ pathname: '/booking/[id]', params: { id: next.id } })
                  }
                >
                  <AppText style={styles.manageText}>Manage booking</AppText>
                  <DesignIcon source={assets.profileArrowRight} size={14.8107} height={14.5} />
                </Pressable>
              </View>
            ) : (
              <View style={styles.booking}>
                <AppText style={styles.serviceName}>Your next fresh start awaits.</AppText>
                <AppText style={styles.tagline}>
                  No upcoming bookings. Find the right care for your car.
                </AppText>
                <Pressable
                  accessibilityRole="button"
                  style={styles.manage}
                  onPress={() => router.push('/(tabs)/explore')}
                >
                  <AppText style={styles.manageText}>Explore services</AppText>
                  <DesignIcon source={assets.profileArrowRight} size={14.8107} height={14.5} />
                </Pressable>
              </View>
            )}
            {recent && (
              <View style={styles.recent}>
                <DesignIcon source={assets.profileCircleCheck} size={19} />
                <View style={styles.recentDetails}>
                  <AppText style={styles.recentTitle}>
                    {servicePresentation[recent.serviceId]?.title ?? recent.serviceName} ·{' '}
                    {money(recent.price)}
                  </AppText>
                  <AppText style={styles.serviceMeta}>
                    {dateLabel(recent.date)} · {recent.vehicleName} · Completed
                  </AppText>
                </View>
                <Pressable
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() =>
                    router.push({ pathname: '/services/[id]', params: { id: recent.serviceId } })
                  }
                >
                  <AppText style={styles.edit}>Book again</AppText>
                </Pressable>
              </View>
            )}
          </>
        )}
      </View>
      <View style={styles.section}>
        <AppText accessibilityRole="header" style={styles.sectionTitle}>
          Your account
        </AppText>
        <View style={styles.options}>
          {options.map((option) => (
            <Pressable
              key={option.title}
              accessibilityRole="button"
              accessibilityLabel={option.title}
              style={styles.option}
              onPress={() => setModal({ title: option.title, body: option.body })}
            >
              <DesignIcon source={option.icon} size={18} />
              <AppText style={styles.optionLabel}>{option.title}</AppText>
              {!!option.detail && <AppText style={styles.optionDetail}>{option.detail}</AppText>}
              <DesignIcon source={assets.profileChevronRight} size={15} />
            </Pressable>
          ))}
        </View>
      </View>
      {!!error && <ErrorState error={error} />}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log out"
        accessibilityState={{ disabled: busy, busy }}
        disabled={busy}
        style={styles.logout}
        onPress={() => void logout()}
      >
        <DesignIcon source={assets.profileLogOut} size={15} />
        <AppText style={styles.logoutText}>{busy ? 'Logging out…' : 'Log out'}</AppText>
      </Pressable>
      <AppModal visible={!!modal} title={modal?.title ?? ''} onClose={() => setModal(null)}>
        <AppText>{modal?.body}</AppText>
      </AppModal>
      <AppModal visible={settings} title="Settings" onClose={() => setSettings(false)}>
        <AppText variant="heading">Appearance</AppText>
        {(['system', 'light', 'dark'] as ThemeMode[]).map((theme) => (
          <AppButton
            key={theme}
            title={`${theme[0].toUpperCase()}${theme.slice(1)}${mode === theme ? ' · selected' : ''}`}
            accessibilityState={{ selected: mode === theme }}
            variant={mode === theme ? 'primary' : 'secondary'}
            onPress={() => dispatch(setTheme(theme))}
          />
        ))}
        <AppText tone="muted">
          Appearance applies to service and booking screens. AutoCare’s main tabs use the signature
          dark design.
        </AppText>
        <AppButton
          title="My subscriptions"
          onPress={() => {
            setSettings(false);
            setModal(profileEntries.subscriptions);
          }}
        />
      </AppModal>
    </ProductScreen>
  );
}
const styles = StyleSheet.create({
  headerAction: {
    width: 38,
    height: 38,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#342022',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { color: colors.link, fontSize: 25, lineHeight: 30, fontWeight: '600' },
  member: { flex: 1, gap: 6 },
  name: { color: colors.text, fontSize: 21, lineHeight: 25, fontWeight: '600' },
  tagline: { color: colors.secondary, fontSize: 11, lineHeight: 14 },
  edit: { color: colors.link, fontSize: 11, lineHeight: 14 },
  section: { gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  sectionTitle: { color: colors.text, fontSize: 18, lineHeight: 22 },
  viewAll: { color: colors.link, fontSize: 12, lineHeight: 15 },
  counts: { flexDirection: 'row', gap: 8 },
  count: {
    backgroundColor: colors.surface,
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  warm: { backgroundColor: '#342022' },
  upcomingCount: { color: colors.link, fontSize: 10, lineHeight: 12 },
  completedCount: { color: colors.secondary, fontSize: 10, lineHeight: 12 },
  booking: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 12,
  },
  date: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { color: colors.text, fontSize: 11, lineHeight: 14, fontWeight: '500' },
  confirmed: { color: colors.link, fontSize: 9, lineHeight: 11 },
  bookedService: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  bookingPhoto: { width: 57, height: 57, borderRadius: 9 },
  bookedDetails: { flex: 1, gap: 6 },
  serviceName: { color: colors.text, fontSize: 15, lineHeight: 18, fontWeight: '600' },
  vehicleName: { color: colors.secondary, fontSize: 10, lineHeight: 12 },
  serviceMeta: { color: colors.muted, fontSize: 10, lineHeight: 13 },
  price: { color: colors.text, fontSize: 18, lineHeight: 22 },
  manage: {
    minHeight: 35,
    backgroundColor: '#342022',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  manageText: { color: colors.link, fontSize: 11, fontWeight: '500' },
  recent: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recentDetails: { flex: 1, gap: 5 },
  recentTitle: { color: colors.text, fontSize: 12, lineHeight: 15 },
  options: { backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden' },
  option: {
    minHeight: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: { flex: 1, color: colors.text, fontSize: 12, lineHeight: 15 },
  optionDetail: { color: colors.muted, fontSize: 10 },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
  },
  logoutText: { color: colors.link, fontSize: 12, lineHeight: 15 },
});
