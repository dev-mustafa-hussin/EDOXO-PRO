import { create } from "zustand";
import { User, Role } from "@/types/auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  roles: Role[];
  isLoading: boolean;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  setRoles: (roles: Role[]) => void;
}

// Mock initial user for development (Change role here to test: 'admin', 'cashier', 'manager')
const mockUser: User = {
  id: "1",
  name: "مدير النظام",
  email: "admin@edoxo.pro",
  username: "admin",
  role: "admin",
  status: "active",
  createdAt: new Date().toISOString(),
  avatar: "https://github.com/shadcn.png",
};

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser, // Default to logged in for dev
  isAuthenticated: true,
  roles: [],
  isLoading: false,

  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  setRoles: (roles) => set({ roles }),

  // Helper to switch roles for testing
  switchRole: (role: User["role"]) =>
    set((state) => ({
      user: state.user ? { ...state.user, role } : null,
    })),
}));
