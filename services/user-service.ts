import api from "@/lib/axios";

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
}

export const UserService = {
  getAll: async () => {
    const response = await api.get("/users");
    // Ensure we return an array
    const data = response.data.data ? response.data.data : response.data;
    if (Array.isArray(data)) {
      return data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "مسجل", // Default role if null
        created_at: user.created_at,
      }));
    }
    return [];
  },

  create: async (data: any) => {
    const response = await api.post("/users", data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};
