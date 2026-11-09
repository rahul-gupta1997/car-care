import { mockApi } from '@/lib/mock/adapter';
export const bookingsApi = { list: mockApi.bookings, create: mockApi.book, cancel: mockApi.cancel };
