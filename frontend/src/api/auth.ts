import { api, apiPost } from './client';
import type { AuthResponse, OrganizerRequestInfo, User } from '@/types/api';

export const getMe = () => api<User>('/auth/me');

export const loginWithPassword = (username: string, password: string) =>
  apiPost<AuthResponse>('/auth/login', { username, password });

export const loginWithGoogle = (credential: string) =>
  apiPost<AuthResponse>('/auth/google', { credential });

export const getMyOrganizerRequest = () => api<OrganizerRequestInfo>('/users/me/organizer-request');

export const requestOrganizerRole = (message?: string) =>
  apiPost<OrganizerRequestInfo>('/users/me/organizer-request', message ? { message } : {});
