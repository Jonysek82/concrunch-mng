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

/** Typ akce (štítek nad názvem) – odvozený z tagu akce, barva přichází z API. */
export interface EventType {
  label: string;
  color?: string; // hex z tagu; bez barvy se použije barva textu "muted"
}

export interface ProgramItem {
  id: string;
  dayId: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  type: EventType;
  title: string;
  description: string;
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
