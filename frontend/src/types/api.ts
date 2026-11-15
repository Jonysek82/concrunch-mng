// Typy podle backendu (backend/src/models, controllers).
// Pozor: Mongoose dokumenty (event, performer, tag) mají `_id`, uživatel z auth/users má `id`.

export type Role = 'visitor' | 'organizer' | 'admin';

export interface User {
  id: string;
  username: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  role: Role;
  authProvider: 'local' | 'google';
}

/** Odpověď POST /api/auth/login i POST /api/auth/google */
export interface AuthResponse {
  token: string;
  user: User;
}

export type OrganizerRequestStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface OrganizerRequest {
  status: OrganizerRequestStatus;
  message?: string;
  requestedAt?: string;
  decidedAt?: string;
  rejectionReason?: string;
}

/** Odpověď GET/POST /api/users/me/organizer-request a položka GET /api/users/organizer-requests */
export interface OrganizerRequestInfo {
  id: string;
  username: string;
  role: Role;
  organizerRequest: OrganizerRequest;
}

export type OrganizerDecision = 'approved' | 'rejected';

export type TagType = 'event' | 'performer' | 'merchant' | 'general';

export interface ApiTag {
  _id: string;
  name: string;
  color: string;
  type: TagType;
}

export interface ApiPerformer {
  _id: string;
  name: string;
  bio: string;
  imageUrl?: string;
  published: boolean;
}

export type EventStatus = 'draft' | 'published';

/** Tělo POST /api/events (volitelně i /api/admin/events) */
export interface EventInput {
  title: string;
  description: string;
  day: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string; // volný text, backend nemá model míst
  status: EventStatus;
  performerIds: string[];
  tagIds: string[];
}

/** Tělo POST /api/performers */
export interface PerformerInput {
  name: string;
  bio: string;
  imageUrl?: string;
  tagIds: string[];
  published: boolean;
}

/** Tělo POST /api/merchants */
export interface MerchantInput {
  name: string;
  description: string;
  website?: string;
  imageUrl?: string;
  tagIds: string[];
  published: boolean;
}
export interface ApiEvent extends Omit<EventInput, 'performerIds' | 'tagIds' | 'status'> {
  _id: string;
  status: 'draft' | 'published' | 'cancelled';
  performerIds: ApiPerformer[];
  tagIds: ApiTag[];
}

export interface ApiMerchant {
  _id: string;
  name: string;
  description: string;
  website?: string;
  imageUrl?: string;
  tagIds?: ApiTag[];
  published: boolean;
}

export interface NewsInput {
  title: string;
  content: string;
  status: 'draft' | 'published';
}

export interface ApiNews extends NewsInput {
  _id: string;
  publishedAt?: string | null;
  createdAt: string;
}

export interface ApiPerformer {
  _id: string;
  name: string;
  bio: string;
  imageUrl?: string;
  tagIds?: ApiTag[];
  published: boolean;
}