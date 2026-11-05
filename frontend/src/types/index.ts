export type CategoryId = 'other' | 'workshop' | 'lecture';

export interface FestivalDay {
  id: string;
  label: string; // např. "Pá 28.8."
}

export interface Performer {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
}

export interface ProgramItem {
  id: string;
  dayId: string;
  startTime: string; // "HH:mm"
  category: CategoryId;
  title: string;
  venueName: string;
  performersLabel: string;
  performers: Performer[];
}

export interface NewsPost {
  id: string;
  title: string;
  body: string;
  publishedAt: string; // ISO datum
}
