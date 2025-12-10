export type UserRole = "admin" | "manager" | "cashier" | "staff";

export interface Permission {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  avatar?: string;
  avatar_url?: string;
  phone?: string;
  job_title?: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastLogin?: string;
}

export interface Delegate {
  id: string;
  name: string;
  phone: string;
  email?: string;
  area?: string;
  status: "active" | "inactive";
}
