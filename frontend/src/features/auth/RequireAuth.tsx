import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import type { Role } from '@/types/api';
import { useAuth } from './AuthContext';

/**
 * Ochrana rout. Bez `roles` stačí být přihlášen; s `roles` musí mít uživatel jednu z rolí.
 * Jde jen o UX – oprávnění vždy znovu kontroluje backend.
 */
export function RequireAuth({ roles }: { roles?: Role[] }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <p className="p-6 text-muted">Načítání…</p>;

  if (!user) {
    return <Navigate to="/prihlaseni" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="p-6">
        <h1 className="mb-2 text-xl font-bold">Nemáte oprávnění</h1>
        <p className="mb-4 text-muted">Tato stránka je dostupná jen pro vybrané role.</p>
        <Link to="/program" className="text-accent underline">
          Zpět na program
        </Link>
      </div>
    );
  }

  return <Outlet />;
}
