import api from "@/lib/axios";

export interface StockTransferItem {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  unitCost?: number;
  subtotal?: number;
}

export interface StockTransfer {
  id: number;
  refNo: string;
  fromWarehouseId: number;
  fromWarehouseName?: string;
  toWarehouseId: number;
  toWarehouseName?: string;
  date: string;
  status: "pending" | "sent" | "completed";
  items: StockTransferItem[];
  shippingCost: number;
  grandTotal: number;
  notes?: string;
  createdBy?: number;
}

export const StockTransferService = {
  getAll: async () => {
    const response = await api.get("/stock-transfers");
    const data = response.data.data ? response.data.data : response.data;

    return data.map((item: any) => ({
      id: item.id,
      refNo: item.ref_no,
      fromWarehouseId: item.from_warehouse_id,
      fromWarehouseName: item.from_warehouse?.name,
      toWarehouseId: item.to_warehouse_id,
      toWarehouseName: item.to_warehouse?.name,
      date: item.date,
      status: item.status,
      items:
        item.items?.map((i: any) => ({
          id: i.id,
          productId: i.product_id,
          productName: i.product?.name,
          quantity: i.quantity,
        })) || [],
      shippingCost: item.shipping_cost,
      grandTotal: item.grand_total,
      notes: item.notes,
    }));
  },

  create: async (data: any) => {
    const payload = {
      from_warehouse_id: data.fromWarehouseId,
      to_warehouse_id: data.toWarehouseId,
      date: data.date,
      status: data.status,
      shipping_cost: data.shippingCost,
      notes: data.notes,
      items: data.items.map((item: any) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
    };
    const response = await api.post("/stock-transfers", payload);
    return response.data;
  },
};
