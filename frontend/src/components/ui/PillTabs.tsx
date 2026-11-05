import clsx from 'clsx';

interface Props<T extends string> {
  items: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  /** true = záložky se roztáhnou na celou šířku (Katalog), false = kompaktní (Program) */
  fill?: boolean;
}

export function PillTabs<T extends string>({ items, value, onChange, fill }: Props<T>) {
  return (
    <div role="tablist" className={clsx('flex gap-2', !fill && 'overflow-x-auto')}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={clsx(
              'rounded-full border px-5 py-2 text-sm font-semibold whitespace-nowrap transition-colors',
              fill && 'flex-1',
              active
                ? 'border-accent bg-accent text-on-accent'
                : 'border-border bg-transparent text-muted hover:text-text',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
