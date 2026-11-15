import type { User } from '@/types/api';

/** Uživatelé z Googlu mají jméno, účty vytvořené správcem jen username. */
export const displayName = (u: User) => u.name || u.email || u.username;
