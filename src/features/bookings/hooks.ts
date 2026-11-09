import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';
import { selectSession, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { bookingsApi } from './api';
import { clearDraft } from './bookingSlice';
export function useBookings() {
  const id = useAppSelector(selectSession)?.user.id ?? '';
  return useQuery({
    queryKey: queryKeys.bookings(id),
    queryFn: ({ signal }) => bookingsApi.list(id, signal),
    enabled: !!id,
  });
}
export function useCreateBooking() {
  const id = useAppSelector(selectSession)?.user.id ?? '';
  const client = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (input: { serviceId: string; vehicleId: string; note: string }) =>
      bookingsApi.create(id, input),
    onSuccess: async () => {
      if (store.getState().auth.session?.user.id !== id) return;
      dispatch(clearDraft());
      await client.invalidateQueries({ queryKey: queryKeys.bookings(id) });
    },
  });
}
export function useCancelBooking() {
  const id = useAppSelector(selectSession)?.user.id ?? '';
  const client = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => bookingsApi.cancel(id, bookingId),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.bookings(id) }),
  });
}
