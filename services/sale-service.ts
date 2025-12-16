import api from "@/lib/axios";

export interface SaleItem {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId?: string | null;
  customerName?: string;
  userId?: string;
  date: string;
  status: "completed" | "draft" | "pending";
  paymentStatus: "paid" | "partial" | "unpaid";
  items: SaleItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: "cash" | "card" | "bank_transfer";
  notes?: string;
  createdAt?: string;
}

export const SaleService = {
  getAll: async (params?: any) => {
    const response = await api.get("/sales", { params });
    const data = response.data.data ? response.data.data : response.data;

    return data.map((item: any) => ({
      id: item.id,
      invoiceNumber: item.invoice_number,
      customerId: item.customer_id,
      customerName: item.customer?.name || "Walk-in Customer",
      userId: item.user_id,
      date: item.date,
      status: item.status,
      paymentStatus: item.payment_status,
      items:
        item.items?.map((i: any) => ({
          id: i.id,
          productId: i.product_id,
          productName: i.product?.name,
          quantity: i.quantity,
          unitPrice: i.unit_price,
          subtotal: i.subtotal,
          tax: i.tax,
          total: i.total,
        })) || [],
      subtotal: item.subtotal,
      taxTotal: item.tax_total,
      discountTotal: item.discount_total,
      grandTotal: item.grand_total,
      paidAmount: item.paid_amount,
      dueAmount: item.due_amount,
      paymentMethod: item.payment_method,
      notes: item.notes,
      createdAt: item.created_at,
    }));
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const payload = {
      customer_id: data.customerId,
      date: data.date,
      status: data.status,
      payment_status: data.paymentStatus,
      paid_amount: data.paidAmount,
      subtotal: data.subtotal,
      tax_total: data.taxTotal,
      discount_total: data.discountTotal,
      grand_total: data.grandTotal,
      payment_method: data.paymentMethod || "cash",
      notes: data.notes,
      items: data.items.map((item: any) => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        tax: item.tax,
      })),
    };
    const response = await api.post("/sales", payload);
    return response.data;
  },

  update: async (id: string | number, data: any) => {
    // Future implementation
    return {};
  },

  delete: async (id: string | number) => {
    await api.delete(`/sales/${id}`);
  },
};
