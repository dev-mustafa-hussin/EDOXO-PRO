import api from "@/lib/axios";

export interface DamagedStock {
  id: number;
  refNo: string;
  productId: number;
  productName?: string;
  warehouseId: number;
  warehouseName?: string;
  quantity: number;
  date: string;
  reason?: string;
  createdBy?: string;
}

export const DamagedStockService = {
  getAll: async () => {
    const response = await api.get("/damaged-stocks");
    const data = response.data.data ? response.data.data : response.data;

    return data.map((item: any) => ({
      id: item.id,
      refNo: item.ref_no,
      productId: item.product_id,
      productName: item.product?.name,
      warehouseId: item.warehouse_id,
      warehouseName: item.warehouse?.name,
      quantity: item.quantity,
      date: item.date,
      reason: item.reason,
      createdBy: item.created_by,
    }));
  },

  create: async (data: any) => {
    const payload = {
      product_id: data.productId,
      warehouse_id: data.warehouseId,
      quantity: data.quantity,
      date: data.date,
      reason: data.reason,
    };
    const response = await api.post("/damaged-stocks", payload);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/damaged-stocks/${id}`);
  },
};
