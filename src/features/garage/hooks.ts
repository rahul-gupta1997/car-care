import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';
import { selectSession, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { garageApi } from './api';
import { selectVehicle } from './garageSlice';
import { Vehicle } from './types';
export function useVehicles() {
  const id = useAppSelector(selectSession)?.user.id ?? '';
  return useQuery({
    queryKey: queryKeys.vehicles(id),
    queryFn: ({ signal }) => garageApi.list(id, signal),
    enabled: !!id,
  });
}
export function useAddVehicle() {
  const id = useAppSelector(selectSession)?.user.id ?? '';
  const client = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (input: Omit<Vehicle, 'id'>) => garageApi.add(id, input),
    onSuccess: async (vehicle) => {
      if (store.getState().auth.session?.user.id !== id) return;
      dispatch(selectVehicle(vehicle.id));
      await client.invalidateQueries({ queryKey: queryKeys.vehicles(id) });
    },
  });
}

export function useUpdateVehicle() {
  const id = useAppSelector(selectSession)?.user.id ?? '';
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ vehicleId, ...input }: { vehicleId: string; name: string; plate: string }) =>
      garageApi.update(id, vehicleId, input),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.vehicles(id) }),
  });
}
