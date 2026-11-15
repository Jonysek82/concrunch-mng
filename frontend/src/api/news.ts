import { api, apiDelete, apiPost, apiPut } from './client';
import type { ApiNews, NewsInput } from '@/types/api';

export const getNewsAdmin = () => api<ApiNews[]>('/news/admin');
export const createNews = (input: NewsInput) => apiPost<ApiNews>('/news', input);
export const updateNews = (id: string, input: Partial<NewsInput>) =>
  apiPut<ApiNews>(`/news/${id}`, input);
export const deleteNews = (id: string) => apiDelete<{ message: string }>(`/news/${id}`);