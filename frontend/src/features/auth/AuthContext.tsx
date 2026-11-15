import { createContext, useContext, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/client';
import { getMe, loginWithGoogle, loginWithPassword } from '@/api/auth';
import { clearToken, getToken, setToken } from '@/api/token';
import type { AuthResponse, Role, User } from '@/types/api';

interface AuthValue {
  user: User | null;
  isLoading: boolean;
  loginWithPassword: (username: string, password: string) => Promise<User>;
  loginWithGoogle: (credential: string) => Promise<User>;
  logout: () => void;
  hasRole: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // GET /api/auth/me – bez tokenu nebo s neplatným tokenem (401) = nepřihlášen
  const me = useQuery<User | null>({
    queryKey: ['me'],
    queryFn: async () => {
      if (!getToken()) return null;
      try {
        return await getMe();
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          clearToken();
          return null;
        }
        throw e;
      }
    },
    retry: false,
    staleTime: 60_000,
  });

  const finishLogin = (res: AuthResponse) => {
    setToken(res.token);
    queryClient.setQueryData(['me'], res.user);
    return res.user;
  };

  const user = me.data ?? null;

  const value: AuthValue = {
    user,
    isLoading: me.isLoading,
    loginWithPassword: async (username, password) =>
      finishLogin(await loginWithPassword(username, password)),
    loginWithGoogle: async (credential) => finishLogin(await loginWithGoogle(credential)),
    // JWT se na backendu neruší, stačí zahodit token a data z cache
    logout: () => {
      clearToken();
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== 'me' });
      queryClient.setQueryData(['me'], null);
    },
    hasRole: (...roles) => !!user && roles.includes(user.role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth musí být použit uvnitř <AuthProvider>');
  return ctx;
}
