import type { CategoryId } from '@/types';

// Barevné odlišení typu programu (štítek nad názvem)
export const categoryMeta: Record<CategoryId, { label: string; className: string }> = {
  other: { label: 'Ostatní', className: 'text-orange-400' },
  workshop: { label: 'Workshop', className: 'text-emerald-400' },
  lecture: { label: 'Přednáška', className: 'text-violet-400' },
};
