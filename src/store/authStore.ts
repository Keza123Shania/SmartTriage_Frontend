import { create } from 'zustand';
import type { UserRole } from '@/types/roles';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  hospital?: string;
}

interface AuthState {
  /** Currently authenticated user (null = not logged in) */
  user: AuthUser | null;

  /** Set the authenticated user */
  setUser: (user: AuthUser) => void;

  /** Clear auth (logout) */
  logout: () => void;

  /** Quick role setter (for dev / role-switcher) */
  switchRole: (role: UserRole) => void;
}

/* ─── Default demo users per role ─── */
const DEMO_USERS: Record<UserRole, AuthUser> = {
  SUPER_ADMIN: {
    id: 'U001',
    fullName: 'Dr. Kamanzi Patrick',
    email: 'patrick.kamanzi@smarttriage.rw',
    role: 'SUPER_ADMIN',
    department: 'System Administration',
    hospital: 'SmartTriage Central',
  },
  HOSPITAL_ADMIN: {
    id: 'U002',
    fullName: 'Uwimana Marie Claire',
    email: 'marie.uwimana@kfh.rw',
    role: 'HOSPITAL_ADMIN',
    department: 'Administration',
    hospital: 'King Faisal Hospital',
  },
  DOCTOR: {
    id: 'U003',
    fullName: 'Dr. Nkurunziza Jean',
    email: 'jean.nkurunziza@kfh.rw',
    role: 'DOCTOR',
    department: 'Emergency Medicine',
    hospital: 'King Faisal Hospital',
  },
  NURSE: {
    id: 'U004',
    fullName: 'Mukiza Alice',
    email: 'alice.mukiza@kfh.rw',
    role: 'NURSE',
    department: 'Emergency Department',
    hospital: 'King Faisal Hospital',
  },
  TRIAGE_OFFICER: {
    id: 'U005',
    fullName: 'Habimana Claude',
    email: 'claude.habimana@kfh.rw',
    role: 'TRIAGE_OFFICER',
    department: 'Emergency Triage',
    hospital: 'King Faisal Hospital',
  },
  READ_ONLY: {
    id: 'U006',
    fullName: 'Ishimwe Grace',
    email: 'grace.ishimwe@kfh.rw',
    role: 'READ_ONLY',
    department: 'Quality Assurance',
    hospital: 'King Faisal Hospital',
  },
};

/** Persist selected role in localStorage so it survives refresh */
function getPersistedRole(): UserRole {
  const stored = localStorage.getItem('st-active-role');
  if (stored && stored in DEMO_USERS) return stored as UserRole;
  return 'NURSE'; // default role
}

export const useAuthStore = create<AuthState>((set) => {
  const initialRole = getPersistedRole();
  return {
    user: DEMO_USERS[initialRole],

    setUser: (user) => {
      localStorage.setItem('st-active-role', user.role);
      set({ user });
    },

    logout: () => {
      localStorage.removeItem('st-active-role');
      set({ user: null });
    },

    switchRole: (role) => {
      const user = DEMO_USERS[role];
      localStorage.setItem('st-active-role', role);
      set({ user });
    },
  };
});

export { DEMO_USERS };
