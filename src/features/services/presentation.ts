import * as assets from '@/components/ui/designAssets';

import { CarService } from './types';
export const servicePresentation: Record<
  string,
  { title: string; category: string; description: string; image: number }
> = {
  wash: {
    title: 'Signature wash',
    category: 'CAR WASH',
    description: 'Exterior wash + hand dry',
    image: assets.exploreServicePhotograph,
  },
  daily: {
    title: 'Everyday refresh',
    category: 'CAR DAILY CARE',
    description: 'Dust-off, glass + tire shine',
    image: assets.exploreServicePhotograph1,
  },
  deep: {
    title: 'Interior reset',
    category: 'DEEP CLEAN',
    description: 'Vacuum + deep clean',
    image: assets.exploreServicePhotograph2,
  },
};
export function filterServices(
  services: CarService[],
  category: string,
  search: string,
  sort: string,
) {
  const term = search.trim().toLowerCase();
  const result = services.filter((service) => {
    const display = servicePresentation[service.id];
    return (
      (category === 'all' || category === service.id) &&
      `${service.name} ${service.description} ${display?.title ?? ''} ${display?.category ?? ''}`
        .toLowerCase()
        .includes(term)
    );
  });
  return sort === 'price' ? result.sort((a, b) => a.price - b.price) : result;
}
