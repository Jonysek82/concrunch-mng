import { api, apiPatch } from './client';
import type { OrganizerDecision, OrganizerRequestInfo } from '@/types/api';

/** Jen správce. Výchozí jsou čekající žádosti. */
export const getOrganizerRequests = () =>
  api<OrganizerRequestInfo[]>('/users/organizer-requests?status=pending');

export const decideOrganizerRequest = (
  id: string,
  decision: OrganizerDecision,
  rejectionReason?: string,
) =>
  apiPatch<OrganizerRequestInfo>(`/users/${id}/organizer-request`, {
    decision,
    ...(decision === 'rejected' && rejectionReason ? { rejectionReason } : {}),
  });
