import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyOrganizerRequest, requestOrganizerRole } from '@/api/auth';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { PageTitle } from '@/components/ui/PageTitle';
import { buttonClass, FormMessage, inputClass } from '@/components/ui/FormField';
import { displayName } from '@/lib/user';
import { useAuth } from './AuthContext';

const roleLabel = { visitor: 'Návštěvník', organizer: 'Organizátor', admin: 'Správce' } as const;

export function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');

  // Role se mohla změnit (správce žádost schválil), proto při otevření stránky načteme /me znovu
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['me'] });
  }, [queryClient]);

  const isVisitor = user?.role === 'visitor';

  const organizerRequest = useQuery({
    queryKey: ['organizer-request'],
    queryFn: getMyOrganizerRequest,
    enabled: isVisitor,
  });

  const request = useMutation({
    mutationFn: () => requestOrganizerRole(message.trim() || undefined),
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['organizer-request'] });
    },
  });

  if (!user) return null; // route je chráněná RequireAuth

  const info = organizerRequest.data?.organizerRequest;
  const status = info?.status ?? 'none';
  const canRequest = isVisitor && !organizerRequest.isLoading && status !== 'pending';
  const name = displayName(user);

  return (
    <>
      <PageTitle>Účet</PageTitle>
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={name} src={user.avatarUrl || undefined} />
          <div>
            <p className="font-bold">{name}</p>
            {user.email && user.email !== name && (
              <p className="text-sm text-muted">{user.email}</p>
            )}
            <p className="text-xs text-accent">{roleLabel[user.role]}</p>
          </div>
        </div>

        {isVisitor && status === 'pending' && (
          <FormMessage kind="success">Žádost o roli organizátora čeká na schválení správcem.</FormMessage>
        )}
        {isVisitor && status === 'rejected' && (
          <FormMessage kind="error">
            Žádost o roli organizátora byla zamítnuta.
            {info?.rejectionReason ? ` Důvod: ${info.rejectionReason}` : ''}
          </FormMessage>
        )}

        {canRequest && (
          <div className="flex flex-col gap-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Zpráva správci (nepovinné)</span>
              <textarea
                rows={3}
                maxLength={500}
                className={inputClass}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={request.isPending}
              />
            </label>
            <button
              className={`${buttonClass} self-start`}
              disabled={request.isPending}
              onClick={() => request.mutate()}
            >
              {request.isPending
                ? 'Odesílám…'
                : status === 'rejected'
                  ? 'Požádat znovu o roli organizátora'
                  : 'Požádat o roli organizátora'}
            </button>
          </div>
        )}
        {request.error && <FormMessage kind="error">{request.error.message}</FormMessage>}

        {user.role !== 'visitor' && (
          <Link to="/admin" className="text-accent underline">
            Přejít do administrace
          </Link>
        )}

        <button
          className="self-start text-sm text-muted underline"
          onClick={() => {
            logout();
            navigate('/program');
          }}
        >
          Odhlásit se
        </button>
      </Card>
    </>
  );
}
