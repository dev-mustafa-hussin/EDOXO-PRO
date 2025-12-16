import api from "@/lib/axios";

// Types based on Backend Response
export interface User {
  id: number;
  name: string;
  email: string;
  business_name?: string;
  avatar?: string;
  // Add other fields as needed
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  business_name?: string;
}

export const AuthService = {
  // Login
  login: async (credentials: LoginCredentials) => {
    // Backend expects 'email' and 'password'
    const response = await api.post<AuthResponse>("/login", credentials);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>("/register", data);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // Get Current User (from API or LocalStorage)
  getCurrentUser: async () => {
    // If we need to verify token validity or get fresh data
    const response = await api.get<User>("/user");
    return response.data;
  },

  // Helper to check if logged in (client-side only)
  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  },
};
