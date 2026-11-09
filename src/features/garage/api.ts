import { mockApi } from '@/lib/mock/adapter';
export const garageApi = {
  list: mockApi.vehicles,
  add: mockApi.addVehicle,
  update: mockApi.updateVehicle,
};
