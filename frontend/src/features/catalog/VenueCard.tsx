import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Venue } from '@/types';

export function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Card className="flex items-center gap-3 !p-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-border/50 text-accent">
        <MapPin size={20} />
      </span>
      <div className="min-w-0">
        <h3 className="font-bold">{venue.name}</h3>
        <p className="truncate text-sm text-muted">{venue.description}</p>
      </div>
    </Card>
  );
}
