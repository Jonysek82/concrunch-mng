import { Navigate, Outlet } from 'react-router-dom';

export function RequireAuth() {
  // TODO: napojit na skutečné přihlášení (token / session z backendu)
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
