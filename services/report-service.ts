import api from "@/lib/axios";

export const ReportService = {
  getSales: async (params?: { start_date?: string; end_date?: string }) => {
    const response = await api.get("/reports/sales", { params });
    return response.data;
  },

  getPurchases: async (params?: { start_date?: string; end_date?: string }) => {
    const response = await api.get("/reports/purchases", { params });
    return response.data;
  },

  getStock: async () => {
    const response = await api.get("/reports/stock");
    return response.data;
  },

  getProfitLoss: async (params?: {
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await api.get("/reports/profit-loss", { params });
    return response.data;
  },
};
