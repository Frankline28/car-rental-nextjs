const BASE_URL = 'http://localhost:3001';

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
    getAll: () => fetcher('/cars'),
    getOne: (id: string) => fetcher(`/cars/${id}`),
    create: (data: any) => fetcher('/cars', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetcher(`/cars/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetcher(`/cars/${id}`, { method: 'DELETE' }),
  },
  users: {
    getAll: () => fetcher('/users'),
    getOne: (id: string) => fetcher(`/users/${id}`),
    create: (data: any) => fetcher('/users', { method: 'POST', body: JSON.stringify(data) }),
    findByEmail: (email: string) => fetcher(`/users?email=${email}`),
  },
  bookings: {
    getAll: () => fetcher('/bookings'),
    getByUser: (userId: string) => fetcher(`/bookings?userId=${userId}`),
    create: (data: any) => fetcher('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetcher(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  locations: {
    getAll: () => fetcher('/locations'),
  },
  packages: {
    getAll: () => fetcher('/packages'),
  }
};
