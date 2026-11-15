import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { FormMessage } from '@/components/ui/FormField';

export interface AdminRow {
  id: string;
  cells: string[];
  editTo?: string;
}

interface Props {
  title: string;
  addLabel: string;
  addTo: string;
  columns: string[];
  rows: AdminRow[];
  isLoading?: boolean;
  error?: string;
  onDelete?: (id: string) => void;
  deletingId?: string | null;
}

const addClass =
  'flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-on-accent';

export function AdminListPage({
  title,
  addLabel,
  addTo,
  columns,
  rows,
  isLoading,
  error,
  onDelete,
  deletingId,
}: Props) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link to={addTo} className={addClass}>
          <Plus size={16} />
          {addLabel}
        </Link>
      </div>

      {error && <div className="mb-4"><FormMessage kind="error">{error}</FormMessage></div>}

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
            {isLoading && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-muted">
                  Načítání...
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center text-muted">
                  Zatím nejsou žádné záznamy.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                {row.cells.map((cell, idx) => (
                  <td key={idx} className="px-4 py-3">
                    {cell}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-3">
                    {row.editTo && (
                      <Link to={row.editTo} className="text-accent hover:underline">
                        Upravit
                      </Link>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        disabled={deletingId === row.id}
                        onClick={() => {
                          if (window.confirm('Opravdu chcete tento záznam smazat?')) {
                            onDelete(row.id);
                          }
                        }}
                        className="text-red-400 hover:underline disabled:opacity-50"
                      >
                        {deletingId === row.id ? 'Mažu...' : 'Smazat'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}