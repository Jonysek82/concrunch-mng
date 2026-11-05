import { NavLink } from 'react-router-dom';
import { CalendarDays, Newspaper, Users } from 'lucide-react';
import clsx from 'clsx';

const items = [
  { to: '/program', label: 'Program', icon: CalendarDays },
  { to: '/novinky', label: 'Novinky', icon: Newspaper },
  { to: '/katalog', label: 'Katalog', icon: Users },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Hlavní navigace"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto flex max-w-2xl">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-1 py-3 text-xs font-medium',
                  isActive ? 'text-accent' : 'text-muted',
                )
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
