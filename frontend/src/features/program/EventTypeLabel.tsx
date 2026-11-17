import type { EventType } from '@/types';

export function EventTypeLabel({ type }: { type: EventType }) {
  return (
    <p
      className="text-xs font-bold uppercase text-muted"
      style={type.color ? { color: type.color } : undefined}
    >
      {type.label}
    </p>
  );
}
