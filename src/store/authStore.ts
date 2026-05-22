import { create } from 'zustand';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STORE_KEEPER = 'STORE_KEEPER',
  SALES_PERSON = 'SALES_PERSON',
  BILLER = 'BILLER',
  WARRANTY_TEAM = 'WARRANTY_TEAM',
  SERVICE_TEAM = 'SERVICE_TEAM',
  PLANT_SERVICE_ENGINEER = 'PLANT_SERVICE_ENGINEER',
  PRODUCTION_TEAM = 'PRODUCTION_TEAM',
  QUALITY_TEAM = 'QUALITY_TEAM'
}

interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
}

interface AuthState {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (role) => set({ 
    user: { 
      id: '1', 
      name: role.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' '), 
      role,
      department: role.includes('PRODUCTION') ? 'Manufacturing' : (role.includes('SALES') ? 'CRM' : 'Core')
    } 
  }),
  logout: () => set({ user: null }),
}));
