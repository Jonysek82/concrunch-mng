import { CalendarOff } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function EmptyDayInfo({
  children = 'Pro tento den zatím není nic naplánováno',
}: {
  children?: string;
}) {
  return (
    <Card className="mt-5 flex flex-col items-center gap-2 py-8 text-center text-muted">
      <CalendarOff size={28} aria-hidden />
      <p>{children}</p>
    </Card>
  );
}
