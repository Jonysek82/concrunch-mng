import { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { PillTabs } from '@/components/ui/PillTabs';
import { placeholderDays, placeholderProgram } from '@/lib/placeholders';
import { ProgramItemCard } from './ProgramItemCard';

export function ProgramPage() {
  // TODO: nahradit useQuery(getProgram) a dny odvodit z API
  const days = placeholderDays;
  const [dayId, setDayId] = useState(days[0].id);
  const items = placeholderProgram.filter((i) => i.dayId === dayId);

  return (
    <>
      <PageTitle>Program</PageTitle>
      <PillTabs items={days} value={dayId} onChange={setDayId} />

      <ol className="mt-5">
        {items.map((item) => (
          <ProgramItemCard key={item.id} item={item} />
        ))}
      </ol>
      {/* TODO: prázdný stav ("Pro tento den zatím není nic naplánováno") a načítání */}
    </>
  );
}
