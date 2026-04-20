const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  transmission: string;
  fuel: string;
  seats: number;
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeekly: number;
  pricePerMonthly: number;
  image: string;
  features: string[];
  specifications: {
    engine: string;
    power: string;
    acceleration?: string;
  };
  location: string;
  available: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'customer';
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  carName: string;
  carImage: string;
  packageId: string;
  packageName: string;
  date: string;
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentMethod: string;
  timestamp: string;
}

export interface Package {
  id: string;
  name: string;
  multiplier: number;
  description: string;
}

export async function fetcher(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export const API = {
  cars: {
    getAll: (): Promise<Car[]> => fetcher('/cars'),
    getOne: (id: string): Promise<Car> => fetcher(`/cars/${id}`),
    create: (data: Partial<Car>) => fetcher('/cars', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Car>) => fetcher(`/cars/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetcher(`/cars/${id}`, { method: 'DELETE' }),
  },
  users: {
    getAll: (): Promise<User[]> => fetcher('/users'),
    getOne: (id: string): Promise<User> => fetcher(`/users/${id}`),
    create: (data: Partial<User>) => fetcher('/users', { method: 'POST', body: JSON.stringify(data) }),
    findByEmail: (email: string): Promise<User[]> => fetcher(`/users?email=${email}`),
  },
  bookings: {
    getAll: (): Promise<Booking[]> => fetcher('/bookings'),
    getByUser: (userId: string): Promise<Booking[]> => fetcher(`/bookings?userId=${userId}`),
    create: (data: Partial<Booking>) => fetcher('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Booking>) => fetcher(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  locations: {
    getAll: () => fetcher('/locations'),
  },
  packages: {
    getAll: (): Promise<Package[]> => fetcher('/packages'),
  }
};
