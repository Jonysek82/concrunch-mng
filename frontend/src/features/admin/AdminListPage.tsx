import { Plus } from 'lucide-react';

interface Props {
  title: string;
  addLabel: string;
  columns: string[];
}

/** Obecná kostra pro správu seznamu (program, účinkující, místa, novinky). */
export function AdminListPage({ title, addLabel, columns }: Props) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        {/* TODO: otevřít formulář / dialog pro vytvoření záznamu */}
        <button className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-on-accent">
          <Plus size={16} />
          {addLabel}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              {columns.map((c) => (
                <th key={c} className="px-4 py-3 font-medium">
                  {c}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-medium">Akce</th>
            </tr>
          </thead>
          <tbody>
            {/* TODO: řádky z API; tady jen zástupné řádky */}
            {[0, 1, 2].map((row) => (
              <tr key={row} className="border-b border-border last:border-0">
                {columns.map((c) => (
                  <td key={c} className="px-4 py-3 text-muted">
                    …
                  </td>
                ))}
                <td className="px-4 py-3 text-right text-muted">Upravit · Smazat</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
