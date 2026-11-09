import { Booking } from '@/features/bookings/types';
import { Vehicle } from '@/features/garage/types';
import { CarService } from '@/features/services/types';
export const services: CarService[] = [
  {
    id: 'wash',
    name: 'Car Wash',
    category: 'THE EVERYDAY ESSENTIAL',
    description:
      'A careful exterior wash, wheel clean and towel dry. A fresh start for every drive.',
    price: 499,
    duration: '45 minutes',
    icon: 'water-outline',
  },
  {
    id: 'daily',
    name: 'Daily Car Care',
    category: 'A LITTLE CARE, EVERY DAY',
    description:
      'Regular exterior dust removal and a gentle wipe-down to keep your car ready for the road.',
    price: 1499,
    duration: 'Monthly plan',
    icon: 'sunny-outline',
  },
  {
    id: 'deep',
    name: 'Deep Cleaning',
    category: 'LIKE NEW, INSIDE & OUT',
    description:
      'Detailed interior vacuuming, upholstery care and exterior cleaning for a complete refresh.',
    price: 2499,
    duration: '3 hours',
    icon: 'sparkles-outline',
  },
];
export const initialVehicles: Vehicle[] = [
  {
    id: 'vehicle-1',
    name: 'BMW 3 Series',
    plate: '8ABC123',
    details: '2022 · Silver · Sedan',
    image: 'bmw',
  },
  { id: 'vehicle-2', name: 'Tesla Model 3', plate: '9XYZ456', details: '2023 · White · Sedan' },
];
export const initialBookings: Booking[] = [
  {
    id: 'booking-demo',
    serviceId: 'wash',
    vehicleId: 'vehicle-1',
    serviceName: 'Car Wash',
    vehicleName: 'BMW 3 Series',
    date: '2026-10-20T09:00:00.000Z',
    status: 'completed',
    price: 499,
    note: 'Demo booking',
  },
];
export const offers = [
  {
    id: 'welcome',
    title: 'A little shine. A little saving.',
    description: 'Preview offer: 20% off your first wash. Backend redemption is not connected.',
    code: 'FIRSTSHINE',
  },
];
export const subscriptionPromotion = {
  title: 'Care that keeps up with you.',
  description: 'Explore daily care for a consistently clean car.',
  label: 'Explore daily care',
};
export const profileEntries = {
  subscriptions: {
    title: 'My subscriptions',
    body: 'No active subscriptions. Subscription purchase and renewal will be available when the backend is connected.',
  },
  notifications: {
    title: 'Notifications',
    body: 'You are all caught up. Push notification registration and delivery are not connected in this demo.',
  },
};
