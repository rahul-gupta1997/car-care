import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ProductScreen } from '@/components/layout/ProductScreen';
import { AppButton } from '@/components/ui/AppButton';
import { AppImage } from '@/components/ui/AppImage';
import { AppLoader } from '@/components/ui/AppLoader';
import { AppModal } from '@/components/ui/AppModal';
import { AppText } from '@/components/ui/AppText';
import * as assets from '@/components/ui/designAssets';
import { DesignIcon } from '@/components/ui/DesignIcon';
import { ErrorState } from '@/components/ui/ErrorState';
import { loginColors as colors } from '@/theme';
import { money } from '@/utils/format';

import { useServices } from '../hooks';
import { filterServices, servicePresentation } from '../presentation';
const filters = [
  { id: 'all', label: 'All' },
  { id: 'wash', label: 'Car wash' },
  { id: 'daily', label: 'Car daily care' },
  { id: 'deep', label: 'Deep clean' },
];
export default function ExploreScreen() {
  const query = useServices();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('recommended');
  const [open, setOpen] = useState(false);
  const services = filterServices(query.data ?? [], category, search, sort);
  return (
    <ProductScreen
      title="Explore"
      scroll={false}
      gap={14}
      action={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Service filters"
          hitSlop={6}
          style={styles.headerAction}
          onPress={() => setOpen(true)}
        >
          <DesignIcon source={assets.exploreSlidersHorizontal} size={19} />
        </Pressable>
      }
    >
      <AppText style={styles.subtitle}>A little refresh. A whole new feeling.</AppText>
      <View style={styles.search}>
        <DesignIcon source={assets.exploreSearch} size={18} />
        <TextInput
          accessibilityLabel="Search services"
          placeholder="Search washes, daily care & more"
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          autoCorrect={false}
        />
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {filters.map((filter) => (
            <Pressable
              key={filter.id}
              accessibilityRole="button"
              accessibilityState={{ selected: category === filter.id }}
              onPress={() => setCategory(filter.id)}
              hitSlop={{ top: 6, bottom: 6 }}
              style={[styles.chip, category === filter.id && styles.activeChip]}
            >
              <AppText style={[styles.chipText, category === filter.id && styles.activeText]}>
                {filter.label}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <View style={styles.heading}>
        <AppText style={styles.sectionTitle}>Find your fresh start</AppText>
        <AppText accessibilityLiveRegion="polite" style={styles.count}>
          {services.length} {services.length === 1 ? 'service' : 'services'}
        </AppText>
      </View>
      {query.isPending ? (
        <AppLoader />
      ) : query.isError ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <FlashList
          data={services}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <AppText style={styles.subtitle}>No services match your search.</AppText>
              <AppButton
                title="Clear filters"
                onPress={() => {
                  setSearch('');
                  setCategory('all');
                }}
              />
            </View>
          }
          ListFooterComponent={
            <View style={styles.reassurance}>
              <DesignIcon source={assets.exploreBadgeCheck} size={14} />
              <AppText style={styles.reassuranceText}>
                Trusted pros. At your door or at our studio.
              </AppText>
            </View>
          }
          renderItem={({ item }) => {
            const display = servicePresentation[item.id];
            return (
              <View style={styles.card}>
                {display && <AppImage source={display.image} style={styles.photo} transition={0} />}
                <View style={styles.details}>
                  <View style={styles.description}>
                    <AppText style={styles.category}>{display?.category ?? item.category}</AppText>
                    <AppText style={styles.name}>{display?.title ?? item.name}</AppText>
                    <AppText style={styles.descriptionText}>
                      {display?.description ?? item.description}
                    </AppText>
                    <AppText style={styles.duration}>
                      {item.duration} · At your door or studio
                    </AppText>
                  </View>
                  <View style={styles.priceRow}>
                    <AppText style={styles.price}>
                      {money(item.price)}
                      <AppText style={styles.from}> / from</AppText>
                    </AppText>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Book ${display?.title ?? item.name}`}
                      hitSlop={5}
                      style={styles.book}
                      onPress={() =>
                        router.push({ pathname: '/services/[id]', params: { id: item.id } })
                      }
                    >
                      <AppText style={styles.bookText}>Book</AppText>
                      <DesignIcon source={assets.exploreArrowRight} size={15.8107} height={15.5} />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}
      <AppModal title="Sort services" visible={open} onClose={() => setOpen(false)}>
        {[
          { id: 'recommended', label: 'Recommended' },
          { id: 'price', label: 'Price: low to high' },
        ].map((option) => (
          <AppButton
            key={option.id}
            title={option.label}
            accessibilityState={{ selected: sort === option.id }}
            onPress={() => {
              setSort(option.id);
              setOpen(false);
            }}
          />
        ))}
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
  subtitle: { color: colors.secondary, fontSize: 13, lineHeight: 16 },
  search: {
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: { flex: 1, height: 44, color: colors.text, fontSize: 12, padding: 0 },
  filters: { gap: 7 },
  chip: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  activeChip: { backgroundColor: '#342022', borderWidth: 1, borderColor: colors.primary },
  chipText: { fontSize: 10, lineHeight: 12, color: colors.secondary },
  activeText: { color: colors.link },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, lineHeight: 22, color: colors.text },
  count: { color: colors.link, fontSize: 12 },
  card: {
    flexDirection: 'row',
    minHeight: 148,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  photo: { width: 106, alignSelf: 'stretch' },
  details: { flex: 1, padding: 12, gap: 12, justifyContent: 'space-between' },
  description: { gap: 5 },
  category: {
    color: colors.link,
    fontSize: 8,
    lineHeight: 10,
    letterSpacing: 1,
    fontWeight: '600',
  },
  name: { color: colors.text, fontSize: 16, lineHeight: 19, fontWeight: '600' },
  descriptionText: { color: colors.secondary, fontSize: 10, lineHeight: 12 },
  duration: { color: colors.muted, fontSize: 10, lineHeight: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  price: { color: colors.text, fontSize: 17, lineHeight: 21 },
  from: { color: colors.muted, fontSize: 9 },
  book: {
    height: 34,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 9,
  },
  bookText: { color: '#ffffff', fontSize: 11, fontWeight: '500' },
  reassurance: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 12,
  },
  reassuranceText: { color: colors.secondary, fontSize: 10, lineHeight: 14 },
  empty: { gap: 14, paddingVertical: 24 },
});
