import { getToken } from './token';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      // backend čte JWT z hlavičky Authorization: Bearer <token>
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    let message = res.statusText || `Chyba ${res.status}`;
    try {
      const body = await res.json();
      // validace: { message: 'Validation failed', errors: [{ field, message }] }
      const detail = Array.isArray(body.errors)
        ? body.errors.map((e: { message: string }) => e.message).join(' ')
        : '';
      message = detail || body.message || body.error || message;
    } catch {
      /* odpověď není JSON */
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const withBody = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});

export const apiPost = <T>(path: string, body?: unknown) => api<T>(path, withBody('POST', body));
export const apiPatch = <T>(path: string, body?: unknown) => api<T>(path, withBody('PATCH', body));
export const apiPut = <T>(path: string, body?: unknown) => api<T>(path, withBody('PUT', body));
export const apiDelete = <T>(path: string) => api<T>(path, { method: 'DELETE' });
