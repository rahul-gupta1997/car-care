import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppImage } from '@/components/ui/AppImage';
import { AppInput } from '@/components/ui/AppInput';
import { AppLoader } from '@/components/ui/AppLoader';
import { AppModal } from '@/components/ui/AppModal';
import { AppText } from '@/components/ui/AppText';
import { ErrorState } from '@/components/ui/ErrorState';
import { config } from '@/constants/config';
import { useServices } from '@/features/services/hooks';
import { selectSession } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { loginColors as colors, spacing } from '@/theme';
import { money } from '@/utils/format';

import * as assets from '../assets';

function Icon({ source, size }: { source: number; size: number }) {
  return (
    <AppImage
      source={source}
      contentFit="contain"
      transition={0}
      style={{ width: size, height: size }}
    />
  );
}
const categories = [
  { label: 'Car wash', icon: assets.carWash, id: 'wash' },
  { label: 'Car daily care', icon: assets.armchair, id: 'daily' },
  { label: 'Deep clean', icon: assets.sparkles, id: 'deep' },
  { label: 'Ceramic', icon: assets.shield, id: 'ceramic' },
];
const favorites = [
  { id: 'wash', title: 'Signature wash', description: 'Exterior + hand dry', image: assets.wash },
  {
    id: 'deep',
    title: 'Interior reset',
    description: 'Vacuum + deep clean',
    image: assets.interior,
  },
];
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAppSelector(selectSession)?.user;
  const services = useServices();
  const [location, setLocation] = useState(config.mock ? 'Los Angeles, CA' : 'Choose location');
  const [draftLocation, setDraftLocation] = useState(location);
  const [modal, setModal] = useState<'location' | 'notifications' | 'ceramic' | null>(null);
  const [unread, setUnread] = useState(true);
  const openService = (id: string) => router.push({ pathname: '/services/[id]', params: { id } });
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: Math.max(insets.top, 50) }]}>
        <View style={styles.page}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Change location, ${location}`}
              style={styles.location}
              onPress={() => {
                setDraftLocation(location);
                setModal('location');
              }}
            >
              <View style={styles.locationIcon}>
                <Icon source={assets.mapPin} size={18} />
              </View>
              <View style={styles.locationDetails}>
                <AppText style={styles.eyebrow}>YOUR LOCATION</AppText>
                <View style={styles.locationRow}>
                  <AppText numberOfLines={1} style={styles.locationText}>
                    {location}
                  </AppText>
                  <Icon source={assets.chevron} size={13} />
                </View>
              </View>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              hitSlop={6}
              style={styles.notification}
              onPress={() => {
                setUnread(false);
                setModal('notifications');
              }}
            >
              <Icon source={assets.bell} size={19} />
              {unread && <View style={styles.dot} />}
            </Pressable>
          </View>
          <View style={styles.content}>
            <View style={styles.welcome}>
              <AppText accessibilityRole="header" style={styles.title}>
                Hey {user?.name.split(' ')[0] || 'there'}, welcome in.
              </AppText>
              <AppText style={styles.subtitle}>Let’s give your car a little love.</AppText>
            </View>
            <View style={styles.hero}>
              <AppImage source={assets.hero} style={StyleSheet.absoluteFill} transition={0} />
              <View style={[StyleSheet.absoluteFill, styles.shade]} />
              <AppText style={styles.offerLabel}>FIRST WASH. FRESH START.</AppText>
              <AppText style={styles.offerTitle}>{'Your shine,\non your time.'}</AppText>
              <AppText style={styles.offerDescription}>Get 20% off your first clean.</AppText>
              <Pressable
                accessibilityRole="button"
                hitSlop={5}
                style={({ pressed }) => [styles.book, { opacity: pressed ? 0.8 : 1 }]}
                onPress={() => openService('wash')}
              >
                <AppText style={styles.bookText}>Book a wash</AppText>
                <Icon source={assets.arrow} size={14} />
              </Pressable>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AppText accessibilityRole="header" style={styles.sectionTitle}>
                  What needs a refresh?
                </AppText>
                <Pressable
                  accessibilityRole="link"
                  hitSlop={12}
                  onPress={() => router.push('/(tabs)/explore')}
                >
                  <AppText style={styles.explore}>Explore all</AppText>
                </Pressable>
              </View>
              <View style={styles.categories}>
                {categories.map((category, index) => (
                  <Pressable
                    key={category.id}
                    accessibilityRole="button"
                    accessibilityLabel={category.label}
                    style={styles.category}
                    onPress={() =>
                      category.id === 'ceramic' ? setModal('ceramic') : openService(category.id)
                    }
                  >
                    <View style={[styles.categoryIcon, index === 0 && styles.activeCategory]}>
                      <Icon source={category.icon} size={23} />
                    </View>
                    <AppText style={[styles.categoryLabel, index === 0 && styles.activeLabel]}>
                      {category.label}
                    </AppText>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.favorites}>
              <View style={styles.sectionHeader}>
                <AppText accessibilityRole="header" style={styles.sectionTitle}>
                  The crowd favorites
                </AppText>
                <View style={styles.rating}>
                  <Icon source={assets.star} size={12} />
                  <AppText style={styles.ratingText}>4.9 (2k+)</AppText>
                </View>
              </View>
              {services.isPending ? (
                <AppLoader />
              ) : services.isError ? (
                <ErrorState error={services.error} onRetry={() => void services.refetch()} />
              ) : (
                <View style={styles.cards}>
                  {favorites.map((favorite, index) => {
                    const service = services.data.find((item) => item.id === favorite.id);
                    if (!service) return null;
                    return (
                      <Pressable
                        key={favorite.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Explore ${favorite.title}, from ${money(service.price)}`}
                        style={({ pressed }) => [styles.card, { opacity: pressed ? 0.8 : 1 }]}
                        onPress={() => openService(service.id)}
                      >
                        <View style={styles.cardImage}>
                          <AppImage
                            source={favorite.image}
                            style={StyleSheet.absoluteFill}
                            transition={0}
                          />
                          {index === 0 && (
                            <View style={styles.popular}>
                              <AppText style={styles.popularText}>MOST BOOKED</AppText>
                            </View>
                          )}
                        </View>
                        <View style={styles.cardContent}>
                          <AppText style={styles.cardTitle}>{favorite.title}</AppText>
                          <AppText style={styles.cardDescription}>
                            {favorite.description} · {service.duration}
                          </AppText>
                          <View style={styles.priceRow}>
                            <AppText style={styles.price}>
                              {money(service.price)}
                              <AppText style={styles.from}> / from</AppText>
                            </AppText>
                            <View style={styles.cardAction}>
                              <Icon source={assets.arrowUp} size={14} />
                            </View>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
            <View style={styles.reassurance}>
              <Icon source={assets.badge} size={15} />
              <AppText style={styles.reassuranceText}>
                Trusted pros. At your door or at our studio.
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>
      <AppModal
        visible={modal !== null}
        title={
          modal === 'location'
            ? 'Your service location'
            : modal === 'ceramic'
              ? 'Ceramic care'
              : 'Notifications'
        }
        onClose={() => setModal(null)}
      >
        {modal === 'location' ? (
          <>
            <AppInput
              label="City or area"
              value={draftLocation}
              onChangeText={setDraftLocation}
              maxLength={80}
            />
            <AppText tone="muted">
              Choose a location for this visit. Service availability is not connected yet.
            </AppText>
            <AppButton
              title="Use this location"
              disabled={!draftLocation.trim()}
              onPress={() => {
                setLocation(draftLocation.trim());
                setModal(null);
              }}
            />
          </>
        ) : (
          <AppText>
            {modal === 'ceramic'
              ? 'Ceramic care is coming soon. Explore our wash and deep-clean services in the meantime.'
              : 'Welcome to AutoCare. The first-wash offer and ratings are preview content; offer redemption and push notifications are not connected yet.'}
          </AppText>
        )}
      </AppModal>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { alignItems: 'center' },
  page: { width: '100%', maxWidth: 480 },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  location: { flexDirection: 'row', alignItems: 'center', gap: 9, flexShrink: 1 },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDetails: { gap: 3, flexShrink: 1 },
  eyebrow: { fontSize: 10, lineHeight: 12, color: colors.muted },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.text,
    flexShrink: 1,
  },
  notification: {
    width: 38,
    height: 38,
    backgroundColor: colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 8,
    left: 23,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  content: { paddingHorizontal: spacing.xl, paddingTop: 10, paddingBottom: 18, gap: 22 },
  welcome: { gap: 6 },
  title: {
    fontSize: 27,
    lineHeight: 33,
    letterSpacing: -0.8,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: { fontSize: 13, lineHeight: 16, color: colors.secondary },
  hero: {
    height: 205,
    padding: 20,
    gap: 10,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    alignItems: 'flex-start',
  },
  shade: {
    experimental_backgroundImage:
      'linear-gradient(to right, rgba(23,26,32,0.96) 0%, rgba(23,26,32,0.8) 50%, rgba(23,26,32,0) 100%)',
  },
  offerLabel: {
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 1.4,
    fontWeight: '700',
    color: colors.link,
  },
  offerTitle: {
    fontSize: 25,
    lineHeight: 27.5,
    letterSpacing: -0.7,
    fontWeight: '700',
    color: '#ffffff',
  },
  offerDescription: { fontSize: 11, lineHeight: 13, color: colors.secondary },
  book: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 37,
    paddingHorizontal: 13,
    borderRadius: 9,
    backgroundColor: colors.primary,
  },
  bookText: { color: '#ffffff', fontSize: 11, lineHeight: 14 },
  section: { gap: 14 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  sectionTitle: { color: colors.text, fontSize: 18, lineHeight: 22, flexShrink: 1 },
  explore: { color: colors.link, fontSize: 12, lineHeight: 15 },
  categories: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 },
  category: { flex: 1, alignItems: 'center', gap: 8 },
  categoryIcon: {
    width: 54,
    height: 50,
    backgroundColor: colors.surface,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCategory: { backgroundColor: '#342022', borderWidth: 1, borderColor: colors.primary },
  categoryLabel: { color: colors.secondary, fontSize: 11, lineHeight: 14, textAlign: 'center' },
  activeLabel: { color: colors.text, fontWeight: '600' },
  favorites: { gap: 13 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: colors.secondary, fontSize: 10, lineHeight: 12 },
  cards: { flexDirection: 'row', gap: 12 },
  card: { flex: 1, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.surface },
  cardImage: { height: 94 },
  popular: {
    position: 'absolute',
    left: 9,
    top: 9,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
    backgroundColor: colors.background,
  },
  popularText: { fontSize: 8, lineHeight: 10, letterSpacing: 0.8, color: colors.text },
  cardContent: { padding: 12, gap: 6 },
  cardTitle: { color: colors.text, fontSize: 14, lineHeight: 17 },
  cardDescription: { color: colors.secondary, fontSize: 10, lineHeight: 13 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { color: colors.text, fontSize: 15, lineHeight: 19 },
  from: { color: colors.muted, fontSize: 10 },
  cardAction: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#342022',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reassurance: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  reassuranceText: { color: colors.secondary, fontSize: 11, lineHeight: 14, flexShrink: 1 },
});
