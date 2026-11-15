import type { ReactNode } from 'react';

export const inputClass =
  'w-full rounded-lg border border-border bg-bg px-3 py-2 text-text placeholder:text-muted disabled:opacity-60';

export const buttonClass =
  'rounded-lg bg-accent px-4 py-2 font-semibold text-on-accent disabled:cursor-not-allowed disabled:opacity-50';

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/** Popisek + vstup + chybová hláška. Obaluje jeden input / select / textarea. */
export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && (
        <span role="alert" className="mt-1 block text-xs text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}

export function FormMessage({ kind, children }: { kind: 'success' | 'error'; children: ReactNode }) {
  const color =
    kind === 'success'
      ? 'border-emerald-500/50 text-emerald-400'
      : 'border-red-500/50 text-red-400';
  return (
    <p role={kind === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-3 py-2 text-sm ${color}`}>
      {children}
    </p>
  );
}
