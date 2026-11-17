import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProgram } from '@/api/events';
import type { ApiEvent } from '@/types/api';
import { FormMessage } from '@/components/ui/FormField';
import { PageTitle } from '@/components/ui/PageTitle';
import { PillTabs } from '@/components/ui/PillTabs';
import { EmptyDayInfo } from './EmptyDayInfo';
import { ProgramItemCard } from './ProgramItemCard';
import { defaultDayId, getFestivalDays, toProgramItem } from './mapEvent';

const selectItems = (events: ApiEvent[]) => events.map(toProgramItem);

export function ProgramPage() {
  const program = useQuery({ queryKey: ['events'], queryFn: getProgram, select: selectItems });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const days = useMemo(() => getFestivalDays(program.data ?? []), [program.data]);
  const dayId = days.some((d) => d.id === selectedDay) ? selectedDay! : defaultDayId(days);
  const items = (program.data ?? []).filter((i) => i.dayId === dayId);

  return (
    <>
      <PageTitle>Program</PageTitle>

      {program.isLoading && (
        <p role="status" className="mt-5 text-center text-muted">
          Načítání programu...
        </p>
      )}

      {program.isError && (
        <FormMessage kind="error">
          Program se nepodařilo načíst. {program.error.message}
        </FormMessage>
      )}

      {program.isSuccess && days.length === 0 && (
        <EmptyDayInfo>Program festivalu zatím nebyl zveřejněn</EmptyDayInfo>
      )}

      {program.isSuccess && dayId && (
        <>
          <PillTabs items={days} value={dayId} onChange={setSelectedDay} />
          {items.length === 0 ? (
            <EmptyDayInfo />
          ) : (
            <ol className="mt-5">
              {items.map((item) => (
                <ProgramItemCard key={item.id} item={item} />
              ))}
            </ol>
          )}
        </>
      )}
    </>
  );
}
