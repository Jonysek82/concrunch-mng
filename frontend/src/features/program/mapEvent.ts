import type { ApiEvent } from '@/types/api';
import type { EventType, FestivalDay, ProgramItem } from '@/types';

const WEEKDAYS = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];
const DAY_MS = 86_400_000;
/** Souvislý rozsah dnů se zobrazí jen do této délky (ochrana proti překlepu v datu akce). */
const MAX_CONTIGUOUS_DAYS = 14;

// Den chodí z API jako ISO datum (Date v Mongu) – pracujeme s ním v UTC, stejně jako admin (slice(0, 10)).
const parseDay = (dayId: string) => {
  const [y, m, d] = dayId.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

/** "Pá 28.8." – popisek záložky dne */
export const dayLabel = (dayId: string) => {
  const date = new Date(parseDay(dayId));
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()}.${date.getUTCMonth() + 1}.`;
};

/** "pátek 28. srpna" – datum v detailu akce */
export const longDayLabel = (dayId: string) =>
  new Date(parseDay(dayId)).toLocaleDateString('cs-CZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });

/** Typ akce = první tag typu "event" (jinak první tag, jinak "Ostatní"). */
const eventType = (event: ApiEvent): EventType => {
  const tag = event.tagIds.find((t) => t.type === 'event') ?? event.tagIds[0];
  return tag ? { label: tag.name, color: tag.color } : { label: 'Ostatní' };
};

export function toProgramItem(event: ApiEvent): ProgramItem {
  // populate nefiltruje nezveřejněné účinkující, takže je schováme tady
  const performers = event.performerIds
    .filter((p) => p.published)
    .map((p) => ({ id: p._id, name: p.name, description: p.bio, avatarUrl: p.imageUrl || undefined }));

  return {
    id: event._id,
    dayId: event.day.slice(0, 10),
    startTime: event.startTime,
    endTime: event.endTime,
    type: eventType(event),
    title: event.title,
    description: event.description,
    venueName: event.location,
    performersLabel: performers.map((p) => p.name).join(', '),
    performers,
  };
}

/**
 * Dny festivalu = souvislý rozsah od nejdřívější po nejpozdější zveřejněnou akci,
 * takže den uprostřed bez akcí se zobrazí jako prázdný (EmptyDayInfo).
 */
export function getFestivalDays(items: ProgramItem[]): FestivalDay[] {
  const ids = [...new Set(items.map((i) => i.dayId))].sort();
  if (ids.length === 0) return [];

  const first = parseDay(ids[0]);
  const last = parseDay(ids[ids.length - 1]);
  const span = Math.round((last - first) / DAY_MS) + 1;

  const dayIds =
    span > MAX_CONTIGUOUS_DAYS
      ? ids
      : Array.from({ length: span }, (_, i) => new Date(first + i * DAY_MS).toISOString().slice(0, 10));

  return dayIds.map((id) => ({ id, label: dayLabel(id) }));
}

/** Při otevření programu vybereme dnešek, pokud je mezi dny festivalu, jinak první den. */
export function defaultDayId(days: FestivalDay[]): string | undefined {
  const now = new Date();
  const today = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((n, i) => (i === 0 ? String(n) : String(n).padStart(2, '0')))
    .join('-');
  return days.find((d) => d.id === today)?.id ?? days[0]?.id;
}
