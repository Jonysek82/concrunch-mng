import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, MapPin } from 'lucide-react';
import { ApiError } from '@/api/client';
import { getProgramEvent } from '@/api/events';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { FormMessage } from '@/components/ui/FormField';
import { EventTypeLabel } from './EventTypeLabel';
import { longDayLabel, toProgramItem } from './mapEvent';

const isNotFound = (err: unknown) => err instanceof ApiError && (err.status === 404 || err.status === 400);

function BackToProgram() {
  return (
    <Link
      to="/program"
      className="mb-4 mt-2 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text"
    >
      <ArrowLeft size={16} aria-hidden />
      Zpět na program
    </Link>
  );
}

export function EventDetailPage() {
  const { id = '' } = useParams();
  const event = useQuery({
    queryKey: ['events', id],
    queryFn: () => getProgramEvent(id),
    select: toProgramItem,
    retry: (count, err) => !isNotFound(err) && count < 1,
  });

  return (
    <>
      <BackToProgram />

      {event.isLoading && (
        <p role="status" className="mt-5 text-center text-muted">
          Načítání...
        </p>
      )}

      {event.isError &&
        (isNotFound(event.error) ? (
          <Card className="py-8 text-center text-muted">Tato akce nebyla nalezena.</Card>
        ) : (
          <FormMessage kind="error">Akci se nepodařilo načíst. {event.error.message}</FormMessage>
        ))}

      {event.isSuccess && (
        <article>
          <EventTypeLabel type={event.data.type} />
          <h1 className="mt-1 text-2xl font-bold">{event.data.title}</h1>

          <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
            <li className="flex items-center gap-1.5">
              <Clock size={14} aria-hidden />
              <span className="first-letter:uppercase">{longDayLabel(event.data.dayId)}</span>
              <span>
                · {event.data.startTime}–{event.data.endTime}
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin size={14} aria-hidden />
              {event.data.venueName}
            </li>
          </ul>

          <section className="mt-6">
            <h2 className="mb-2 font-bold">O akci</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed">{event.data.description}</p>
          </section>

          {event.data.performers.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-2 font-bold">Účinkující</h2>
              <ul className="flex flex-col gap-3">
                {event.data.performers.map((p) => (
                  <li key={p.id}>
                    <Card className="flex items-center gap-3 !p-3">
                      <Avatar name={p.name} src={p.avatarUrl} />
                      <div className="min-w-0">
                        <h3 className="font-bold">{p.name}</h3>
                        <p className="text-sm text-muted">{p.description}</p>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      )}
    </>
  );
}
