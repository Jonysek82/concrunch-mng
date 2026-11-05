import type { ReactNode } from 'react';

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="mb-4 mt-2 text-2xl font-bold">{children}</h1>;
}
