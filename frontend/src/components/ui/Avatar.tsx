import clsx from 'clsx';

interface Props {
  name: string;
  src?: string;
  size?: 'sm' | 'md';
}

export function Avatar({ name, src, size = 'md' }: Props) {
  const dim = size === 'sm' ? 'size-7 text-[10px]' : 'size-11 text-xs';
  if (src) {
    return <img src={src} alt={name} className={clsx('rounded-full object-cover', dim)} />;
  }
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-label={name}
      className={clsx(
        'grid shrink-0 place-items-center rounded-full bg-accent font-bold text-on-accent',
        dim,
      )}
    >
      {initials}
    </span>
  );
}
