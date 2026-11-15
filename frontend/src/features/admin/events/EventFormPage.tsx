import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEvent, getEventsAdmin, updateEvent } from '@/api/events';
import { getPerformersAdmin, getTags } from '@/api/catalog';
import { Card } from '@/components/ui/Card';
import { CheckboxGroup } from '@/components/ui/CheckboxGroup';
import { buttonClass, Field, FormMessage, inputClass } from '@/components/ui/FormField';
import { eventSchema, type EventFormValues } from './eventSchema';

const defaultValues: EventFormValues = {
  title: '',
  description: '',
  day: '',
  startTime: '',
  endTime: '',
  location: '',
  status: 'draft',
  performerIds: [],
  tagIds: [],
};

export function EventFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ['events-admin'],
    queryFn: getEventsAdmin,
    enabled: isEdit,
  });

  const existing = eventsQuery.data?.find((e) => e._id === id);

  const performers = useQuery({ queryKey: ['performers-admin'], queryFn: getPerformersAdmin });
  const tags = useQuery({ queryKey: ['tags'], queryFn: getTags });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventFormValues>({ resolver: zodResolver(eventSchema), defaultValues });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        description: existing.description,
        day: existing.day.slice(0, 10),
        startTime: existing.startTime,
        endTime: existing.endTime,
        location: existing.location,
        status: existing.status === 'cancelled' ? 'draft' : existing.status,
        performerIds: existing.performerIds.map((p) => p._id),
        tagIds: existing.tagIds.map((t) => t._id),
      });
    }
  }, [existing, reset]);

  const mutation = useMutation({
    mutationFn: (payload: EventFormValues) =>
      id ? updateEvent(id, payload) : createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-admin'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/admin/program');
    },
  });

  const onSubmit = (v: EventFormValues) =>
    mutation.mutate({
      title: v.title,
      description: v.description,
      day: v.day,
      startTime: v.startTime,
      endTime: v.endTime,
      location: v.location,
      status: v.status,
      performerIds: v.performerIds,
      tagIds: v.tagIds,
    });

  const eventTags = (tags.data ?? []).filter((t) => t.type === 'event' || t.type === 'general');
  const busy = mutation.isPending || (isEdit && eventsQuery.isLoading);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEdit ? 'Upravit akci' : 'Nová akce'}</h1>
        <Link to="/admin/program" className="text-sm text-muted hover:text-text">
          Zpět na program
        </Link>
      </div>
      <Card className="max-w-2xl">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => mutation.isSuccess && mutation.reset()}
          className="flex flex-col gap-4"
        >
          <Field label="Název akce" error={errors.title?.message}>
            <input className={inputClass} disabled={busy} {...register('title')} />
          </Field>
          <Field label="Popis" error={errors.description?.message}>
            <textarea rows={4} className={inputClass} disabled={busy} {...register('description')} />
          </Field>
          <Field label="Datum" error={errors.day?.message}>
            <input type="date" className={inputClass} disabled={busy} {...register('day')} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Začátek" error={errors.startTime?.message}>
              <input type="time" className={inputClass} disabled={busy} {...register('startTime')} />
            </Field>
            <Field label="Konec" error={errors.endTime?.message}>
              <input type="time" className={inputClass} disabled={busy} {...register('endTime')} />
            </Field>
          </div>
          <Field label="Místo konání" error={errors.location?.message} hint="Např. Main stage, Workshopový sál">
            <input className={inputClass} disabled={busy} {...register('location')} />
          </Field>
          <Field label="Stav" error={errors.status?.message}>
            <select className={inputClass} disabled={busy} {...register('status')}>
              <option value="draft">Koncept (návštěvníci ho nevidí)</option>
              <option value="published">Publikováno</option>
            </select>
          </Field>
          <Controller
            control={control}
            name="performerIds"
            render={({ field }) => (
              <CheckboxGroup
                legend="Účinkující"
                options={(performers.data ?? []).map((p) => ({ id: p._id, label: p.name }))}
                value={field.value}
                onChange={field.onChange}
                disabled={busy}
                isLoading={performers.isLoading}
                error={performers.error ? 'Účinkující se nepodařilo načíst' : undefined}
                empty={
                  <>
                    Zatím nejsou vytvoření účinkující.{' '}
                    <Link to="/admin/ucinkujici/novy" className="text-accent underline">
                      Vytvořit
                    </Link>
                  </>
                }
              />
            )}
          />
          <Controller
            control={control}
            name="tagIds"
            render={({ field }) => (
              <CheckboxGroup
                legend="Tagy"
                options={eventTags.map((t) => ({ id: t._id, label: t.name }))}
                value={field.value}
                onChange={field.onChange}
                disabled={busy}
                isLoading={tags.isLoading}
                error={tags.error ? 'Tagy se nepodařilo načíst' : undefined}
                empty="Zatím nejsou vytvořené tagy."
              />
            )}
          />
          {mutation.error && <FormMessage kind="error">{mutation.error.message}</FormMessage>}
          <button type="submit" className={`${buttonClass} self-start`} disabled={busy}>
            {mutation.isPending ? 'Ukládám...' : isEdit ? 'Uložit změny' : 'Vytvořit akci'}
          </button>
        </form>
      </Card>
    </>
  );
}