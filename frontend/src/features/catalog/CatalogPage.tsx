import { useState } from 'react';
import { PageTitle } from '@/components/ui/PageTitle';
import { PillTabs } from '@/components/ui/PillTabs';
import { placeholderPerformers, placeholderVenues } from '@/lib/placeholders';
import { PerformerCard } from './PerformerCard';
import { VenueCard } from './VenueCard';

type Tab = 'performers' | 'venues';

const tabs: { id: Tab; label: string }[] = [
  { id: 'performers', label: 'Účinkující' },
  { id: 'venues', label: 'Místa' },
];

export function CatalogPage() {
  const [tab, setTab] = useState<Tab>('performers');

  // TODO: nahradit useQuery(getPerformers) / useQuery(getVenues)
  return (
    <>
      <PageTitle>Katalog</PageTitle>
      <PillTabs fill items={tabs} value={tab} onChange={setTab} />

      <ul className="mt-4 flex flex-col gap-3">
        {tab === 'performers'
          ? placeholderPerformers.map((p) => (
              <li key={p.id}>
                <PerformerCard performer={p} />
              </li>
            ))
          : placeholderVenues.map((v) => (
              <li key={v.id}>
                <VenueCard venue={v} />
              </li>
            ))}
      </ul>
    </>
  );
}
