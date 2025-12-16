import api from "@/lib/axios";

export interface Warehouse {
  id: number;
  name: string;
  location?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
}

export const WarehouseService = {
  getAll: async () => {
    const response = await api.get("/warehouses");
    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      location: item.location,
      contactPerson: item.contact_person,
      phone: item.phone,
      email: item.email,
    }));
  },

  create: async (data: any) => {
    const response = await api.post("/warehouses", data);
    return response.data;
  },
};
