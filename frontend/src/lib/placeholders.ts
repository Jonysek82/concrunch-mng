// Pouze zástupná data pro kostru. Po napojení na API tento soubor smazat.
import type { FestivalDay, NewsPost, Performer, ProgramItem, Venue } from '@/types';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export const placeholderDays: FestivalDay[] = range(3).map((i) => ({
  id: `day-${i + 1}`,
  label: `Den ${i + 1}`,
}));

export const placeholderPerformers: Performer[] = range(6).map((i) => ({
  id: `performer-${i}`,
  name: 'Jméno účinkujícího',
  description: 'Krátký popis účinkujícího.',
}));

export const placeholderVenues: Venue[] = range(6).map((i) => ({
  id: `venue-${i}`,
  name: 'Název místa',
  description: 'Krátký popis místa a patro.',
}));

const categories = ['other', 'workshop', 'lecture'] as const;

export const placeholderProgram: ProgramItem[] = range(5).map((i) => ({
  id: `item-${i}`,
  dayId: 'day-1',
  startTime: '00:00',
  category: categories[i % categories.length],
  title: 'Název bodu programu',
  venueName: 'Místo konání',
  performersLabel: 'Jméno účinkujícího',
  performers: [placeholderPerformers[0]],
}));

export const placeholderNews: NewsPost[] = range(3).map((i) => ({
  id: `news-${i}`,
  title: 'Nadpis novinky',
  body: 'Text novinky. Tady bude krátké shrnutí aktuality z festivalu.',
  publishedAt: '',
}));
