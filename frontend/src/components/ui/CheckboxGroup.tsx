import type { ReactNode } from 'react';

interface Props {
  legend: string;
  options: { id: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
  error?: string;
  /** Zobrazí se, když je seznam možností prázdný */
  empty?: ReactNode;
}

export function CheckboxGroup({
  legend,
  options,
  value,
  onChange,
  disabled,
  isLoading,
  error,
  empty,
}: Props) {
  return (
    <fieldset>
      <legend className="mb-1 text-sm font-medium">{legend}</legend>
      {isLoading && <p className="text-sm text-muted">Načítání…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!isLoading && !error && options.length === 0 && (
        <p className="text-sm text-muted">{empty ?? 'Žádné možnosti.'}</p>
      )}
      <ul className="flex flex-col gap-1">
        {options.map((o) => {
          const checked = value.includes(o.id);
          return (
            <li key={o.id}>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() =>
                    onChange(checked ? value.filter((id) => id !== o.id) : [...value, o.id])
                  }
                />
                {o.label}
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
