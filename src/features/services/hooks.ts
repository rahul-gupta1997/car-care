import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';

import { servicesApi } from './api';
export const useServices = () =>
  useQuery({ queryKey: queryKeys.services, queryFn: ({ signal }) => servicesApi.list(signal) });
