import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { decideOrganizerRequest, getOrganizerRequests } from '@/api/users';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { FormMessage } from '@/components/ui/FormField';
import type { OrganizerDecision } from '@/types/api';

interface Decision {
  id: string;
  decision: OrganizerDecision;
  rejectionReason?: string;
}

export function OrganizerApprovalsPage() {
  const queryClient = useQueryClient();
  const requests = useQuery({ queryKey: ['organizer-requests'], queryFn: getOrganizerRequests });

  const decide = useMutation({
    mutationFn: ({ id, decision, rejectionReason }: Decision) =>
      decideOrganizerRequest(id, decision, rejectionReason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organizer-requests'] }),
  });

  const reject = (id: string) => {
    const reason = window.prompt('Důvod zamítnutí (nepovinné):');
    if (reason === null) return; // uživatel akci zrušil
    decide.mutate({ id, decision: 'rejected', rejectionReason: reason.trim() });
  };

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Schvalování organizátorů</h1>

      {requests.isLoading && <p className="text-muted">Načítání…</p>}
      {requests.error && <FormMessage kind="error">{requests.error.message}</FormMessage>}
      {decide.error && <FormMessage kind="error">{decide.error.message}</FormMessage>}

      {requests.data?.length === 0 && <p className="text-muted">Žádné čekající žádosti.</p>}

      <ul className="mt-3 flex flex-col gap-3">
        {requests.data?.map((u) => {
          const busy = decide.isPending && decide.variables?.id === u.id;
          const { message, requestedAt } = u.organizerRequest;
          return (
            <li key={u.id}>
              <Card className="flex flex-wrap items-center gap-3">
                <Avatar name={u.username} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{u.username}</p>
                  {requestedAt && (
                    <p className="text-xs text-muted">
                      Odesláno {new Date(requestedAt).toLocaleString('cs-CZ')}
                    </p>
                  )}
                  {message && <p className="mt-1 text-sm text-muted">„{message}“</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={busy}
                    onClick={() => decide.mutate({ id: u.id, decision: 'approved' })}
                    className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-on-accent disabled:opacity-50"
                  >
                    Schválit
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => reject(u.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-muted hover:text-text disabled:opacity-50"
                  >
                    Zamítnout
                  </button>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </>
  );
}
