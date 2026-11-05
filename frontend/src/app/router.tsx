import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProgramPage } from '@/features/program/ProgramPage';
import { CatalogPage } from '@/features/catalog/CatalogPage';
import { NewsPage } from '@/features/news/NewsPage';
import { AdminLayout } from '@/features/admin/AdminLayout';
import { RequireAuth } from '@/features/admin/RequireAuth';
import { AdminLoginPage } from '@/features/admin/AdminLoginPage';
import { AdminListPage } from '@/features/admin/AdminListPage';

export const router = createBrowserRouter([
  // Veřejná část pro návštěvníky
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/program" replace /> },
      { path: 'program', element: <ProgramPage /> },
      { path: 'novinky', element: <NewsPage /> },
      { path: 'katalog', element: <CatalogPage /> },
    ],
  },

  // Administrace pro organizátory
  { path: 'admin/login', element: <AdminLoginPage /> },
  {
    path: 'admin',
    element: <RequireAuth />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/program" replace /> },
          {
            path: 'program',
            element: (
              <AdminListPage
                title="Program"
                addLabel="Přidat bod programu"
                columns={['Čas', 'Název', 'Místo', 'Účinkující']}
              />
            ),
          },
          {
            path: 'ucinkujici',
            element: (
              <AdminListPage
                title="Účinkující"
                addLabel="Přidat účinkujícího"
                columns={['Jméno', 'Popis']}
              />
            ),
          },
          {
            path: 'mista',
            element: (
              <AdminListPage
                title="Místa"
                addLabel="Přidat místo"
                columns={['Název', 'Popis', 'Patro']}
              />
            ),
          },
          {
            path: 'novinky',
            element: (
              <AdminListPage
                title="Novinky"
                addLabel="Přidat novinku"
                columns={['Nadpis', 'Publikováno']}
              />
            ),
          },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/program" replace /> },
]);
