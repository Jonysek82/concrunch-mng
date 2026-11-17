import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProgramPage } from '@/features/program/ProgramPage';
import { EventDetailPage } from '@/features/program/EventDetailPage';
import { CatalogPage } from '@/features/catalog/CatalogPage';
import { NewsPage } from '@/features/news/NewsPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { AccountPage } from '@/features/auth/AccountPage';
import { RequireAuth } from '@/features/auth/RequireAuth';
import { AdminLayout } from '@/features/admin/AdminLayout';
import { OrganizerApprovalsPage } from '@/features/admin/OrganizerApprovalsPage';
import { EventFormPage } from '@/features/admin/events/EventFormPage';
import { PerformerFormPage } from '@/features/admin/performers/PerformerFormPage';
import {
  AdminMerchantsPage,
  AdminNewsPage,
  AdminPerformersPage,
  AdminProgramPage,
} from '@/features/admin/AdminPages';
import { NewsFormPage } from '@/features/news/NewsFormPage';

export const router = createBrowserRouter([
  // Veřejná část pro návštěvníky
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/program" replace /> },
      { path: 'program', element: <ProgramPage /> },
      { path: 'program/:id', element: <EventDetailPage /> },
      { path: 'novinky', element: <NewsPage /> },
      { path: 'katalog', element: <CatalogPage /> },
      { path: 'prihlaseni', element: <LoginPage /> },
      // Účet – stačí být přihlášen (libovolná role)
      { element: <RequireAuth />, children: [{ path: 'ucet', element: <AccountPage /> }] },
    ],
  },

  // Administrace – organizátor nebo správce
  {
  path: 'admin',
  element: <RequireAuth roles={['organizer', 'admin']} />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { index: true, element: <Navigate to="/admin/program" replace /> },
        { path: 'program', element: <AdminProgramPage /> },
        { path: 'program/novy', element: <EventFormPage /> },
        { path: 'program/:id', element: <EventFormPage /> },
        { path: 'ucinkujici', element: <AdminPerformersPage /> },
        { path: 'ucinkujici/novy', element: <PerformerFormPage /> },
        { path: 'ucinkujici/:id', element: <PerformerFormPage /> },
        { path: 'mista', element: <AdminMerchantsPage /> },
        { path: 'mista/novy', element: <PerformerFormPage /> },
        { path: 'mista/:id', element: <PerformerFormPage /> },
        { path: 'novinky', element: <AdminNewsPage /> },
        { path: 'novinky/novy', element: <NewsFormPage /> },
        { path: 'novinky/:id', element: <NewsFormPage /> },
        {
          element: <RequireAuth roles={['admin']} />,
          children: [{ path: 'organizatori', element: <OrganizerApprovalsPage /> }],
        },
      ],
    },
  ],
},

  { path: '*', element: <Navigate to="/program" replace /> },
]);
