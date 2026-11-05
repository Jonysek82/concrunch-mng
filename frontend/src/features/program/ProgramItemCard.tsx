import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import type { ProgramItem } from '@/types';
import { categoryMeta } from './categories';

export function ProgramItemCard({ item }: { item: ProgramItem }) {
  const category = categoryMeta[item.category];
  return (
    <li className="grid grid-cols-[3rem_1rem_1fr] gap-x-2">
      <time className="pt-4 text-sm text-muted">{item.startTime}</time>

      {/* časová osa: tečka + svislá čára */}
      <div className="relative">
        <span className="absolute left-1/2 top-5 size-2.5 -translate-x-1/2 rounded-full bg-border" />
        <span className="absolute bottom-0 left-1/2 top-5 w-px -translate-x-1/2 bg-border" />
      </div>

      <Card className="mb-4">
        <p className={`text-xs font-bold uppercase ${category.className}`}>{category.label}</p>
        <h3 className="mt-1 font-bold">{item.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <MapPin size={14} />
          {item.venueName}
        </p>
        <p className="mt-1 text-sm text-muted">{item.performersLabel}</p>
        {item.performers.length > 0 && (
          <div className="mt-3 flex gap-2">
            {item.performers.map((p) => (
              <Avatar key={p.id} name={p.name} src={p.avatarUrl} />
            ))}
          </div>
        )}
      </Card>
    </li>
  );
}
