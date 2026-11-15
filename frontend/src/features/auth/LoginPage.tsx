import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { ApiError } from '@/api/client';
import { PageTitle } from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { buttonClass, Field, FormMessage, inputClass } from '@/components/ui/FormField';
import { GOOGLE_CLIENT_ID } from '@/lib/config';
import { useAuth } from './AuthContext';

export function LoginPage() {
  const { user, loginWithPassword, loginWithGoogle } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? '/ucet';
  if (user) return <Navigate to={from} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await loginWithPassword(username.trim(), password);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? 'Nesprávné uživatelské jméno nebo heslo.'
          : err instanceof Error
            ? err.message
            : 'Přihlášení se nezdařilo.',
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <PageTitle>Přihlášení</PageTitle>
      <Card className="flex flex-col gap-4">
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <Field label="Uživatelské jméno">
            <input
              className={inputClass}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={pending}
            />
          </Field>
          <Field label="Heslo">
            <input
              type="password"
              className={inputClass}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={pending}
            />
          </Field>
          <button
            type="submit"
            className={`${buttonClass} self-start`}
            disabled={pending || !username || !password}
          >
            {pending ? 'Přihlašuji…' : 'Přihlásit se'}
          </button>
        </form>

        {GOOGLE_CLIENT_ID ? (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <p className="text-sm text-muted">
              Noví návštěvníci se registrují přihlášením přes Google. Účet se při prvním přihlášení
              vytvoří automaticky.
            </p>
            <GoogleLogin
              onSuccess={async ({ credential }) => {
                if (!credential) {
                  setError('Google nevrátil přihlašovací údaje. Zkuste to prosím znovu.');
                  return;
                }
                setError(null);
                try {
                  await loginWithGoogle(credential);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Přihlášení přes Google se nezdařilo.');
                }
              }}
              onError={() => setError('Přihlášení přes Google se nezdařilo.')}
            />
          </div>
        ) : (
          <p className="border-t border-border pt-4 text-xs text-muted">
            Přihlášení přes Google je momentálně nedostupné.
          </p>
        )}

        {error && <FormMessage kind="error">{error}</FormMessage>}
      </Card>
    </>
  );
}
