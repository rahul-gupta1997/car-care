export type Booking = {
  id: string;
  serviceId: string;
  vehicleId: string;
  serviceName: string;
  vehicleName: string;
  date: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
  note: string;
};
