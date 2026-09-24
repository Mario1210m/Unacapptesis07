const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');
const TOKEN_KEY = 'bertello.accessToken';

export interface TransitBus {
  id: string;
  plateNumber: string;
  routeId: string | null;
  status: 'on-time' | 'delayed' | 'stopped';
  occupancy: 'low' | 'medium' | 'high';
  latitude: number;
  longitude: number;
  speedKmh: number;
  etaMinutes: number;
  distanceRemainingKm: number;
  currentStop: string;
  nextStop: string;
  active: boolean;
  lastGpsAt: string;
}

export interface TransitRoute {
  id: string;
  code: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  active: boolean;
  updatedAt: string;
}

export type BusInput = Omit<TransitBus, 'id' | 'lastGpsAt'>;
export type RouteInput = Omit<TransitRoute, 'id' | 'updatedAt'>;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.message || 'No se pudo completar la operación.');
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export const transitApi = {
  listBuses: () => api<TransitBus[]>('/transit/buses'),
  createBus: (value: BusInput) =>
    api<TransitBus>('/transit/buses', { method: 'POST', body: JSON.stringify(value) }),
  updateBus: (id: string, value: BusInput) =>
    api<TransitBus>(`/transit/buses/${id}`, { method: 'PUT', body: JSON.stringify(value) }),
  deleteBus: (id: string) => api<void>(`/transit/buses/${id}`, { method: 'DELETE' }),
  listRoutes: () => api<TransitRoute[]>('/transit/routes'),
  createRoute: (value: RouteInput) =>
    api<TransitRoute>('/transit/routes', { method: 'POST', body: JSON.stringify(value) }),
  updateRoute: (id: string, value: RouteInput) =>
    api<TransitRoute>(`/transit/routes/${id}`, { method: 'PUT', body: JSON.stringify(value) }),
  deleteRoute: (id: string) => api<void>(`/transit/routes/${id}`, { method: 'DELETE' }),
};
