import { Link } from 'react-router-dom';
import { LogIn, Moon, Sun, User } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/AuthContext';

export function Header() {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 pb-2 pt-5">
      <span className="text-sm font-extrabold tracking-widest text-accent">CONCRUNCH</span>
      <div className="flex items-center gap-3 text-sm text-muted">
        {/* TODO: termín festivalu z konfigurace / API */}
        <span>DD.–DD. M.</span>
        <Link
          to={user ? '/ucet' : '/prihlaseni'}
          aria-label={user ? 'Můj účet' : 'Přihlásit se'}
          className="rounded-full p-1.5 hover:text-text"
        >
          {user ? <User size={18} /> : <LogIn size={18} />}
        </Link>
        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
          className="rounded-full p-1.5 hover:text-text"
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}
