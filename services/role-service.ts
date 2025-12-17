import axios from "@/lib/axios";

// Permission Constants (Optional)
export const PERMISSIONS = {
  VIEW_USERS: "view users",
  CREATE_USERS: "create users",
  EDIT_USERS: "edit users",
  DELETE_USERS: "delete users",

  VIEW_ROLES: "view roles",
  CREATE_ROLES: "create roles",
  EDIT_ROLES: "edit roles",
  DELETE_ROLES: "delete roles",
};

export interface Permission {
  id: number;
  name: string;
  created_at: string;
}

export interface Permission {
  id: number;
  name: string;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  created_at: string;
}

export const RoleService = {
  getAll: async () => {
    const response = await axios.get("/roles");
    return response.data;
  },

  getAllPermissions: async () => {
    const response = await axios.get("/permissions");
    return response.data;
  },

  create: async (data: { name: string; permissions: string[] }) => {
    const response = await axios.post("/roles", data);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axios.get(`/roles/${id}`);
    return response.data;
  },

  update: async (id: number, data: { name: string; permissions: string[] }) => {
    const response = await axios.put(`/roles/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(`/roles/${id}`);
    return response.data;
  },
};
