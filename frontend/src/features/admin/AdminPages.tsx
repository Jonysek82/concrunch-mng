import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteEvent, getEventsAdmin } from '@/api/events';
import {
  deleteMerchant,
  deletePerformer,
  getMerchantsAdmin,
  getPerformersAdmin,
} from '@/api/catalog';
import { deleteNews, getNewsAdmin } from '@/api/news';
import { AdminListPage } from './AdminListPage';

export function AdminProgramPage() {
  const queryClient = useQueryClient();
  const events = useQuery({ queryKey: ['events-admin'], queryFn: getEventsAdmin });
  const remove = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events-admin'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const rows = (events.data ?? []).map((e) => ({
    id: e._id,
    editTo: `/admin/program/${e._id}`,
    cells: [
      `${e.day.slice(0, 10)} ${e.startTime}–${e.endTime}`,
      e.title,
      e.location,
      e.performerIds.map((p) => p.name).join(', ') || '—',
    ],
  }));

  return (
    <AdminListPage
      title="Program"
      addLabel="Přidat akci"
      addTo="/admin/program/novy"
      columns={['Čas', 'Název', 'Místo', 'Účinkující']}
      rows={rows}
      isLoading={events.isLoading}
      error={events.error?.message || remove.error?.message}
      onDelete={(id) => remove.mutate(id)}
      deletingId={remove.isPending ? (remove.variables ?? null) : null}
    />
  );
}

export function AdminPerformersPage() {
  const queryClient = useQueryClient();
  const performers = useQuery({ queryKey: ['performers-admin'], queryFn: getPerformersAdmin });
  const remove = useMutation({
    mutationFn: deletePerformer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['performers-admin'] }),
  });

  const rows = (performers.data ?? []).map((p) => ({
    id: p._id,
    editTo: `/admin/ucinkujici/${p._id}`,
    cells: [p.name, p.bio],
  }));

  return (
    <AdminListPage
      title="Účinkující"
      addLabel="Přidat účinkujícího"
      addTo="/admin/ucinkujici/novy"
      columns={['Jméno', 'Popis']}
      rows={rows}
      isLoading={performers.isLoading}
      error={performers.error?.message || remove.error?.message}
      onDelete={(id) => remove.mutate(id)}
      deletingId={remove.isPending ? (remove.variables ?? null) : null}
    />
  );
}

export function AdminMerchantsPage() {
  const queryClient = useQueryClient();
  const merchants = useQuery({ queryKey: ['merchants'], queryFn: getMerchantsAdmin });
  const remove = useMutation({
    mutationFn: deleteMerchant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['merchants'] }),
  });

  const rows = (merchants.data ?? []).map((m) => ({
    id: m._id,
    editTo: `/admin/mista/${m._id}`,
    cells: [m.name, m.description, m.website || '—'],
  }));

  return (
    <AdminListPage
      title="Místa a prodejci"
      addLabel="Přidat místo / vendora"
      addTo="/admin/mista/novy"
      columns={['Název', 'Popis', 'Web']}
      rows={rows}
      isLoading={merchants.isLoading}
      error={merchants.error?.message || remove.error?.message}
      onDelete={(id) => remove.mutate(id)}
      deletingId={remove.isPending ? (remove.variables ?? null) : null}
    />
  );
}
export function AdminNewsPage() {
  const queryClient = useQueryClient();
  const news = useQuery({ queryKey: ['news-admin'], queryFn: getNewsAdmin });
  const remove = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-admin'] });
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });

  const rows = (news.data ?? []).map((n) => ({
    id: n._id,
    editTo: `/admin/novinky/${n._id}`,
    cells: [
      n.title,
      n.status === 'published'
        ? n.publishedAt
          ? new Date(n.publishedAt).toLocaleDateString('cs-CZ')
          : 'Publikováno'
        : 'Koncept',
    ],
  }));

  return (
    <AdminListPage
      title="Novinky"
      addLabel="Přidat novinku"
      addTo="/admin/novinky/novy"
      columns={['Nadpis', 'Publikováno']}
      rows={rows}
      isLoading={news.isLoading}
      error={news.error?.message || remove.error?.message}
      onDelete={(id) => remove.mutate(id)}
      deletingId={remove.isPending ? (remove.variables ?? null) : null}
    />
  );
}