import { Card } from '@/components/ui/Card';

export function AdminLoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-4">
      <Card className="w-full max-w-sm">
        <h1 className="mb-4 text-xl font-bold">Přihlášení organizátora</h1>
        {/* TODO: onSubmit → přihlášení přes API */}
        <div className="flex flex-col gap-3">
          <label className="text-sm text-muted">
            E-mail
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
            />
          </label>
          <label className="text-sm text-muted">
            Heslo
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-text"
            />
          </label>
          <button className="mt-2 rounded-lg bg-accent px-4 py-2 font-semibold text-on-accent">
            Přihlásit se
          </button>
        </div>
      </Card>
    </div>
  );
}
