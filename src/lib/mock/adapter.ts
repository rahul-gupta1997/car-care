import { config } from '@/constants/config';
import { Booking } from '@/features/bookings/types';
import { Vehicle } from '@/features/garage/types';
import { ApiError } from '@/services/errors';

import { initialBookings, initialVehicles, services } from './data';
export function requireMock() {
  if (!config.mock)
    throw new ApiError(
      'Backend integration is not configured. Use a development build for the demo.',
      undefined,
      'configuration',
    );
}
export function delay(signal?: AbortSignal): Promise<void> {
  requireMock();
  return new Promise((resolve, reject) => {
    const cancel = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', cancel);
      reject(new ApiError('Request cancelled.', undefined, 'cancelled'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', cancel);
      resolve();
    }, 250);
    if (signal?.aborted) cancel();
    else signal?.addEventListener('abort', cancel, { once: true });
  });
}
const accounts = new Map<string, { vehicles: Vehicle[]; bookings: Booking[] }>();
function account(userId: string) {
  let data = accounts.get(userId);
  if (!data) {
    data = {
      vehicles: initialVehicles.map((v) => ({ ...v })),
      bookings: initialBookings.map((b) => ({ ...b })),
    };
    accounts.set(userId, data);
  }
  return data;
}
let sequence = 0;
export const mockApi = {
  services: async (signal?: AbortSignal) => {
    await delay(signal);
    return services.map((s) => ({ ...s }));
  },
  vehicles: async (userId: string, signal?: AbortSignal) => {
    await delay(signal);
    return [...account(userId).vehicles];
  },
  addVehicle: async (userId: string, input: Omit<Vehicle, 'id'>) => {
    await delay();
    const data = account(userId);
    if (data.vehicles.some((v) => v.plate === input.plate))
      throw new ApiError('This registration is already in your garage.', 409);
    const vehicle = { ...input, id: `vehicle-${Date.now()}-${++sequence}` };
    data.vehicles.push(vehicle);
    return vehicle;
  },
  updateVehicle: async (userId: string, id: string, input: Pick<Vehicle, 'name' | 'plate'>) => {
    await delay();
    const data = account(userId);
    const index = data.vehicles.findIndex((vehicle) => vehicle.id === id);
    if (index < 0) throw new ApiError('Vehicle not found.', 404);
    if (data.vehicles.some((vehicle) => vehicle.id !== id && vehicle.plate === input.plate))
      throw new ApiError('This registration is already in your garage.', 409);
    const previous = data.vehicles[index];
    const vehicle = {
      ...previous,
      ...input,
      ...(previous.name !== input.name ? { image: undefined, details: undefined } : {}),
    };
    data.vehicles[index] = vehicle;
    return vehicle;
  },
  bookings: async (userId: string, signal?: AbortSignal) => {
    await delay(signal);
    return [...account(userId).bookings];
  },
  book: async (userId: string, input: { serviceId: string; vehicleId: string; note: string }) => {
    await delay();
    const data = account(userId);
    const service = services.find((s) => s.id === input.serviceId);
    const vehicle = data.vehicles.find((v) => v.id === input.vehicleId);
    if (!service || !vehicle) throw new ApiError('Choose a valid service and vehicle.', 400);
    const booking: Booking = {
      id: `booking-${Date.now()}-${++sequence}`,
      ...input,
      serviceName: service.name,
      vehicleName: vehicle.name,
      price: service.price,
      date: new Date(Date.now() + 86400000).toISOString(),
      status: 'upcoming',
    };
    data.bookings.unshift(booking);
    return booking;
  },
  cancel: async (userId: string, id: string) => {
    await delay();
    const booking = account(userId).bookings.find((b) => b.id === id);
    if (!booking || booking.status !== 'upcoming')
      throw new ApiError('This booking cannot be cancelled.', 409);
    booking.status = 'cancelled';
    return { ...booking };
  },
};
