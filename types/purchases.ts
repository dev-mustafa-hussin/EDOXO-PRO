import { PaymentStatus } from "./finance";

export type PurchaseStatus = "received" | "pending" | "ordered" | "canceled";

export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
  tax?: number;
  total: number;
}

export interface Purchase {
  id: string;
  referenceNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  status: PurchaseStatus;
  paymentStatus: PaymentStatus;
  items: PurchaseItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  shippingCost?: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  notes?: string;
  warehouseId: string;
  createdBy: string;
  createdAt: string;
}
