import api from "@/lib/axios";

export interface PurchaseItem {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface Purchase {
  id: string;
  referenceNumber: string;
  supplierId: string;
  supplierName?: string;
  date: string;
  status: "received" | "pending" | "ordered" | "canceled";
  paymentStatus: "paid" | "partial" | "unpaid";
  items: PurchaseItem[];
  subtotal: number;
  taxTotal: number;
  shippingCost: number;
  discountTotal: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  notes?: string;
  createdAt?: string;
}

export const PurchaseService = {
  getAll: async (params?: any) => {
    const response = await api.get("/purchases", { params });
    const data = response.data.data ? response.data.data : response.data;
    // Handle both paginated and non-paginated responses if needed.
    // Assuming Standard Laravel Resource response or simple array.

    return data.map((item: any) => ({
      id: item.id,
      referenceNumber: item.reference_number,
      supplierId: item.supplier_id,
      supplierName: item.supplier?.name || "Unknown",
      date: item.date,
      status: item.status,
      paymentStatus: item.payment_status,
      items:
        item.items?.map((i: any) => ({
          id: i.id,
          productId: i.product_id,
          productName: i.product?.name,
          quantity: i.quantity,
          unitCost: i.unit_cost,
          subtotal: i.subtotal,
          tax: i.tax,
          total: i.total,
        })) || [],
      subtotal: item.subtotal,
      taxTotal: item.tax_total,
      shippingCost: item.shipping_cost,
      discountTotal: item.discount_total,
      grandTotal: item.grand_total,
      paidAmount: item.paid_amount,
      dueAmount: item.due_amount,
      notes: item.notes,
      createdAt: item.created_at,
    }));
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/purchases/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    // Map frontend camelCase to backend snake_case
    const payload = {
      supplier_id: data.supplierId,
      date: data.date,
      status: data.status,
      payment_status: data.paymentStatus,
      paid_amount: data.paidAmount,
      shipping_cost: data.shippingCost,
      discount_total: data.discountTotal,
      notes: data.notes,
      items: data.items.map((item: any) => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_cost: item.unitCost,
        tax: item.tax,
      })),
    };
    const response = await api.post("/purchases", payload);
    return response.data;
  },

  update: async (id: string | number, data: any) => {
    const payload = {
      supplier_id: data.supplierId,
      date: data.date,
      status: data.status,
      payment_status: data.paymentStatus,
      paid_amount: data.paidAmount,
      shipping_cost: data.shippingCost,
      discount_total: data.discountTotal,
      notes: data.notes,
      items: data.items.map((item: any) => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_cost: item.unitCost,
        tax: item.tax,
      })),
    };
    const response = await api.put(`/purchases/${id}`, payload);
    return response.data;
  },

  delete: async (id: string | number) => {
    await api.delete(`/purchases/${id}`);
  },
};
