import api from "@/lib/axios";

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  business_name?: string;
  taxNumber?: string;
  balance?: number; // Backend usually calculates this or defaults to 0
  created_at?: string;
}

// Map Backend (tax_number) to Frontend (taxNumber)
const mapToFrontend = (data: any): Customer => ({
  ...data,
  taxNumber: data.tax_number,
});

export const CustomerService = {
  getAll: async (params?: any) => {
    const response = await api.get("/customers", { params });
    const items = Array.isArray(response.data.data)
      ? response.data.data
      : response.data;
    return items.map(mapToFrontend);
  },

  getById: async (id: string) => {
    const response = await api.get(`/customers/${id}`);
    return mapToFrontend(response.data.data || response.data);
  },

  create: async (data: Partial<Customer>) => {
    // Map Frontend -> Backend
    const payload = {
      ...data,
      tax_number: data.taxNumber,
    };
    const response = await api.post("/customers", payload);
    return mapToFrontend(response.data.data || response.data);
  },

  update: async (id: string, data: Partial<Customer>) => {
    const payload = {
      ...data,
      tax_number: data.taxNumber,
    };
    const response = await api.put(`/customers/${id}`, payload);
    return mapToFrontend(response.data.data || response.data);
  },

  delete: async (id: string) => {
    await api.delete(`/customers/${id}`);
  },
};
