import { api, ApiError, apiDelete, apiPost, apiPut } from './client';
import type { ApiEvent, EventInput } from '@/types/api';

/**
 * Veřejný program. Backend (GET /api/events) vrací akce ve stavu published i cancelled,
 * v programu pro návštěvníky se ale zobrazují jen zveřejněné – koncepty backend nevrací
 * a zrušené odfiltrujeme tady, aby pravidlo bylo na jednom místě.
 */
export const getProgram = async () =>
  (await api<ApiEvent[]>('/events')).filter((e) => e.status === 'published');

/** Detail akce pro návštěvníka (GET /api/events/:id); nezveřejněná akce se chová jako neexistující. */
export const getProgramEvent = async (id: string) => {
  const event = await api<ApiEvent>(`/events/${id}`);
  if (event.status !== 'published') throw new ApiError(404, 'Akce nebyla nalezena');
  return event;
};

export const getEventsAdmin = () => api<ApiEvent[]>('/events/admin');
export const createEvent = (input: EventInput) => apiPost<ApiEvent>('/events', input);
export const updateEvent = (id: string, input: Partial<EventInput>) =>
  apiPut<ApiEvent>(`/events/${id}`, input);
export const deleteEvent = (id: string) => apiDelete<{ message: string }>(`/events/${id}`);
