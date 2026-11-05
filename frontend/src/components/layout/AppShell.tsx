import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col">
      <Header />
      <main className="flex-1 px-4 pb-28">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
