import api from "@/lib/axios";

export interface ExpenseCategory {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface Expense {
  id: number;
  refNo: string;
  categoryId: number;
  categoryName?: string;
  warehouseId?: number;
  warehouseName?: string;
  amount: number;
  date: string;
  notes?: string;
  createdBy?: string;
}

export const ExpenseService = {
  getAll: async () => {
    const response = await api.get("/expenses");
    const data = response.data.data ? response.data.data : response.data;

    return data.map((item: any) => ({
      id: item.id,
      refNo: item.ref_no,
      categoryId: item.category_id,
      categoryName: item.category?.name,
      warehouseId: item.warehouse_id,
      warehouseName: item.warehouse?.name,
      amount: item.amount,
      date: item.date,
      notes: item.notes,
      createdBy: item.created_by,
    }));
  },

  create: async (data: any) => {
    const payload = {
      category_id: data.categoryId,
      warehouse_id: data.warehouseId,
      amount: data.amount,
      date: data.date,
      notes: data.notes,
    };
    const response = await api.post("/expenses", payload);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/expenses/${id}`);
  },

  // Categories
  getCategories: async () => {
    const response = await api.get("/expense-categories");
    return response.data;
  },

  createCategory: async (data: { name: string; description?: string }) => {
    const response = await api.post("/expense-categories", data);
    return response.data;
  },
};
