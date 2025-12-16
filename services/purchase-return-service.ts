import api from "@/lib/axios";

export interface PurchaseReturnItem {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface PurchaseReturn {
  id: string;
  referenceNumber: string;
  purchaseId?: string; // If returned from a specific purchase
  supplierId: string;
  supplierName?: string;
  date: string;
  status: "completed" | "pending";
  paymentStatus: "paid" | "partial" | "unpaid";
  items: PurchaseReturnItem[];
  subtotal: number;
  taxTotal: number;
  shippingCost: number;
  discountTotal: number;
  grandTotal: number;
  paidAmount: number; // Refunded Amount
  dueAmount: number;
  notes?: string;
  createdAt?: string;
}

export const PurchaseReturnService = {
  getAll: async (params?: any) => {
    const response = await api.get("/purchase-returns", { params });
    const data = response.data.data ? response.data.data : response.data;

    return data.map((item: any) => ({
      id: item.id,
      referenceNumber: item.reference_number,
      purchaseId: item.purchase_id,
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
    const response = await api.get(`/purchase-returns/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const payload = {
      purchase_id: data.purchaseId,
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
    const response = await api.post("/purchase-returns", payload);
    return response.data;
  },

  update: async (id: string | number, data: any) => {
    // Similar logic to create
    const payload = {
      /* ... */
    };
    // Not fully implemented as focus is on Create/List first
    return {};
  },

  delete: async (id: string | number) => {
    await api.delete(`/purchase-returns/${id}`);
  },
};
