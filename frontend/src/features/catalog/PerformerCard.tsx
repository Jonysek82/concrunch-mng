import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import type { Performer } from '@/types';

export function PerformerCard({ performer }: { performer: Performer }) {
  return (
    <Card className="flex items-center gap-3 !p-3">
      <Avatar name={performer.name} src={performer.avatarUrl} />
      <div className="min-w-0">
        <h3 className="font-bold">{performer.name}</h3>
        <p className="truncate text-sm text-muted">{performer.description}</p>
      </div>
    </Card>
  );
}
