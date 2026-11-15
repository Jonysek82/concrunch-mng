import { api, apiDelete, apiPost, apiPut } from './client';
import type { ApiEvent, EventInput } from '@/types/api';


export const getEventsAdmin = () => api<ApiEvent[]>('/events/admin');
export const createEvent = (input: EventInput) => apiPost<ApiEvent>('/events', input);
export const updateEvent = (id: string, input: Partial<EventInput>) =>
  apiPut<ApiEvent>(`/events/${id}`, input);
export const deleteEvent = (id: string) => apiDelete<{ message: string }>(`/events/${id}`);