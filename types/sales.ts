import { PaymentStatus } from "./finance";

export type SaleStatus = "completed" | "pending" | "draft" | "canceled";

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  status: SaleStatus;
  paymentStatus: PaymentStatus;
  items: SaleItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  shippingCost?: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface Quote extends Sale {
  expiryDate?: string;
}
