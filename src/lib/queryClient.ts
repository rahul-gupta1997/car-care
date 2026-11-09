import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/services/errors';

import { reportError } from './monitoring';
export const queryKeys = {
  services: ['services'] as const,
  vehicles: (userId: string) => ['vehicles', userId] as const,
  bookings: (userId: string) => ['bookings', userId] as const,
};
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: (error) => reportError(error, 'query') }),
  mutationCache: new MutationCache({ onError: (error) => reportError(error, 'mutation') }),
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 300_000,
      retry: (count, error) =>
        !(
          error instanceof ApiError &&
          (error.code === 'configuration' ||
            error.code === 'cancelled' ||
            (error.status && error.status < 500))
        ) && count < 2,
    },
    mutations: { retry: false },
  },
});
