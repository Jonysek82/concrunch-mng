const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

// TODO: endpointy a query hooky (useQuery) doplnit podle backendu, např.:
// export const getProgram = () => api<ProgramItem[]>('/program');
// export const getPerformers = () => api<Performer[]>('/performers');
// export const getVenues = () => api<Venue[]>('/venues');
// export const getNews = () => api<NewsPost[]>('/news');
