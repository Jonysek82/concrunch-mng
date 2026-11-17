// Pouze zástupná data pro kostru. Po napojení na API tento soubor smazat.
import type { NewsPost, Performer, Venue } from '@/types';

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

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

export const placeholderNews: NewsPost[] = range(3).map((i) => ({
  id: `news-${i}`,
  title: 'Nadpis novinky',
  body: 'Text novinky. Tady bude krátké shrnutí aktuality z festivalu.',
  publishedAt: '',
}));
