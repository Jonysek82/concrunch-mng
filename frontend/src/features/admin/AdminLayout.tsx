import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';

const links = [
  { to: '/admin/program', label: 'Program' },
  { to: '/admin/ucinkujici', label: 'Účinkující' },
  { to: '/admin/mista', label: 'Místa' },
  { to: '/admin/novinky', label: 'Novinky' },
];

export function AdminLayout() {
  return (
    <div className="min-h-dvh bg-bg text-text">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
          <span className="text-sm font-extrabold tracking-widest text-accent">
            CONCRUNCH MANAGER
          </span>
          <nav className="flex gap-4 text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  clsx('font-medium', isActive ? 'text-accent' : 'text-muted hover:text-text')
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          {/* TODO: odhlášení */}
          <button className="ml-auto text-sm text-muted hover:text-text">Odhlásit se</button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
