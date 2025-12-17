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
  // Update Profile
  updateProfile: async (data: any) => {
    const response = await api.post<User>("/auth/profile", data);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  // Login
  login: async (credentials: LoginCredentials) => {
    // Backend expects 'email' and 'password'
    const response = await api.post<AuthResponse & { permissions: string[] }>(
      "/auth/login",
      credentials
    );
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // Store permissions
      if (response.data.permissions) {
        localStorage.setItem(
          "permissions",
          JSON.stringify(response.data.permissions)
        );
      }
    }
    return response.data;
  },

  // Register
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
    }
  },

  // Get Current User (from API or LocalStorage)
  getCurrentUser: async () => {
    // If we need to verify token validity or get fresh data
    const response = await api.get<User>("/auth/user");
    return response.data;
  },

  // Helper to check if logged in (client-side only)
  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  },
};
