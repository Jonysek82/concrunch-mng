import { api, apiDelete, apiPost, apiPut } from './client';
import type { ApiMerchant, ApiPerformer, ApiTag, MerchantInput, PerformerInput } from '@/types/api';

export const getTags = () => api<ApiTag[]>('/tags');
export const getPerformersAdmin = () => api<ApiPerformer[]>('/performers/admin');
export const createPerformer = (input: PerformerInput) => apiPost<ApiPerformer>('/performers', input);
export const updatePerformer = (id: string, input: Partial<PerformerInput>) =>
  apiPut<ApiPerformer>(`/performers/${id}`, input);
export const deletePerformer = (id: string) => apiDelete<{ message: string }>(`/performers/${id}`);

export const getMerchantsAdmin = () => api<ApiMerchant[]>('/merchants/admin');
export const createMerchant = (input: MerchantInput) => apiPost<ApiMerchant>('/merchants', input);
export const updateMerchant = (id: string, input: Partial<MerchantInput>) =>
  apiPut<ApiMerchant>(`/merchants/${id}`, input);
export const deleteMerchant = (id: string) => apiDelete<{ message: string }>(`/merchants/${id}`);