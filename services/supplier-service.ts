import api from "@/lib/axios";

export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
  business_name?: string;
  balance?: number;
  created_at?: string;
}

const mapToFrontend = (data: any): Supplier => ({
  ...data,
  taxNumber: data.tax_number,
});

export const SupplierService = {
  getAll: async (params?: any) => {
    const response = await api.get("/suppliers", { params });
    const items = Array.isArray(response.data.data)
      ? response.data.data
      : response.data;
    return items.map(mapToFrontend);
  },

  getById: async (id: string) => {
    const response = await api.get(`/suppliers/${id}`);
    return mapToFrontend(response.data.data || response.data);
  },

  create: async (data: Partial<Supplier>) => {
    const payload = {
      ...data,
      tax_number: data.taxNumber,
    };
    const response = await api.post("/suppliers", payload);
    return mapToFrontend(response.data.data || response.data);
  },

  update: async (id: string, data: Partial<Supplier>) => {
    const payload = {
      ...data,
      tax_number: data.taxNumber,
    };
    const response = await api.put(`/suppliers/${id}`, payload);
    return mapToFrontend(response.data.data || response.data);
  },

  delete: async (id: string) => {
    await api.delete(`/suppliers/${id}`);
  },
};
