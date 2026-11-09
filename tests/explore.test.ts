import { filterServices } from '@/features/services/presentation';
import { services } from '@/lib/mock/data';

jest.mock('@/components/ui/designAssets', () => ({
  exploreServicePhotograph: 1,
  exploreServicePhotograph1: 2,
  exploreServicePhotograph2: 3,
}));

test('explore combines search with category filters and supports empty results', () => {
  expect(
    filterServices(services, 'all', 'SIGNATURE', 'recommended').map((item) => item.id),
  ).toEqual(['wash']);
  expect(filterServices(services, 'deep', 'signature', 'recommended')).toEqual([]);
  expect(filterServices(services, 'all', '  ', 'recommended')).toHaveLength(3);
  expect(filterServices(services, 'daily', '', 'recommended').map((item) => item.id)).toEqual([
    'daily',
  ]);
});
test('price sorting does not mutate the cached catalog', () => {
  const reversed = [...services].reverse();
  const original = reversed.map((item) => item.id);
  expect(filterServices(reversed, 'all', '', 'price').map((item) => item.id)).toEqual([
    'wash',
    'daily',
    'deep',
  ]);
  expect(reversed.map((item) => item.id)).toEqual(original);
});
