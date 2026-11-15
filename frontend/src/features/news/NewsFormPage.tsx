import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createNews, getNewsAdmin, updateNews } from '@/api/news';
import { Card } from '@/components/ui/Card';
import { buttonClass, Field, FormMessage, inputClass } from '@/components/ui/FormField';
import type { NewsInput } from '@/types/api';

export function NewsFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const newsQuery = useQuery({
    queryKey: ['news-admin'],
    queryFn: getNewsAdmin,
    enabled: isEdit,
  });

  const existing = newsQuery.data?.find((n) => n._id === id);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsInput>({
    defaultValues: { title: '', content: '', status: 'published' },
  });

  useEffect(() => {
    if (existing) {
      reset({ title: existing.title, content: existing.content, status: existing.status });
    }
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (data: NewsInput) => (isEdit && id ? updateNews(id, data) : createNews(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-admin'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
      navigate('/admin/novinky');
    },
  });

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEdit ? 'Upravit novinku' : 'Nová novinka'}</h1>
        <Link to="/admin/novinky" className="text-sm text-muted hover:text-text">
          Zpět na novinky
        </Link>
      </div>
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="flex flex-col gap-4">
          <Field label="Nadpis" error={errors.title?.message}>
            <input className={inputClass} {...register('title', { required: 'Nadpis je povinný' })} />
          </Field>
          <Field label="Text novinky" error={errors.content?.message}>
            <textarea rows={5} className={inputClass} {...register('content', { required: 'Obsah je povinný' })} />
          </Field>
          <Field label="Stav">
            <select className={inputClass} {...register('status')}>
              <option value="published">Publikováno</option>
              <option value="draft">Koncept</option>
            </select>
          </Field>
          {mutation.error && <FormMessage kind="error">{mutation.error.message}</FormMessage>}
          <button type="submit" className={`${buttonClass} self-start`} disabled={mutation.isPending}>
            {mutation.isPending ? 'Ukládám...' : isEdit ? 'Uložit změny' : 'Vytvořit novinku'}
          </button>
        </form>
      </Card>
    </>
  );
}