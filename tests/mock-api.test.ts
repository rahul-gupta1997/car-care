import { mockApi } from '@/lib/mock/adapter';
test('mock mutations are account-scoped and cancellations update status', async () => {
  const vehicle = await mockApi.addVehicle('alice', { name: 'City', plate: 'KA 01 AB 9999' });
  expect((await mockApi.vehicles('bob')).some((v) => v.id === vehicle.id)).toBe(false);
  const booking = await mockApi.book('alice', {
    serviceId: 'wash',
    vehicleId: vehicle.id,
    note: '',
  });
  expect(booking.status).toBe('upcoming');
  expect((await mockApi.cancel('alice', booking.id)).status).toBe('cancelled');
});
test('cancelled reads reject promptly', async () => {
  const controller = new AbortController();
  const request = mockApi.services(controller.signal);
  controller.abort();
  await expect(request).rejects.toMatchObject({ code: 'cancelled' });
});

test('vehicle edits preserve identity and reject duplicate plates across one garage', async () => {
  const vehicle = await mockApi.addVehicle('edit-owner', { name: 'City', plate: 'EDIT1234' });
  const updated = await mockApi.updateVehicle('edit-owner', vehicle.id, {
    name: 'Civic',
    plate: 'EDIT5678',
  });
  expect(updated).toMatchObject({ id: vehicle.id, name: 'Civic', plate: 'EDIT5678' });
  expect((await mockApi.vehicles('edit-owner')).find((item) => item.id === vehicle.id)?.name).toBe(
    'Civic',
  );
  await expect(
    mockApi.updateVehicle('another-owner', vehicle.id, {
      name: 'Wrong account',
      plate: 'EDIT9999',
    }),
  ).rejects.toMatchObject({ status: 404 });
  await expect(
    mockApi.updateVehicle('edit-owner', vehicle.id, { name: 'Civic', plate: '8ABC123' }),
  ).rejects.toMatchObject({ status: 409 });
});
