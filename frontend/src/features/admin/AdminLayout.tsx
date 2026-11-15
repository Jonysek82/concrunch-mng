import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '@/features/auth/AuthContext';
import { displayName } from '@/lib/user';

const links = [
  { to: '/admin/program', label: 'Program' },
  { to: '/admin/ucinkujici', label: 'Účinkující' },
  { to: '/admin/mista', label: 'Místa' },
  { to: '/admin/novinky', label: 'Novinky' },
];

export function AdminLayout() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const allLinks = hasRole('admin')
    ? [...links, { to: '/admin/organizatori', label: 'Organizátoři' }]
    : links;

  return (
    <div className="min-h-dvh bg-bg text-text">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <span className="text-sm font-extrabold tracking-widest text-accent">
            CONCRUNCH MANAGER
          </span>
          <nav className="flex gap-4 text-sm">
            {allLinks.map((l) => (
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
          <div className="ml-auto flex items-center gap-3 text-sm text-muted">
            <span>{user ? displayName(user) : ''}</span>
            <button
              className="hover:text-text"
              onClick={() => {
                logout();
                navigate('/program');
              }}
            >
              Odhlásit se
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
