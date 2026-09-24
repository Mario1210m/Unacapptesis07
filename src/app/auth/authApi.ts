export interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  roles: string[];
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthUser;
}

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api').replace(/\/$/, '');

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof body.message === 'string'
        ? body.message
        : 'No fue posible completar la solicitud.';
    throw new Error(message);
  }

  return body as T;
}

export async function loginRequest(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  return readJson<LoginResponse>(response);
}

export async function getCurrentUser(accessToken: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return readJson<AuthUser>(response);
}
