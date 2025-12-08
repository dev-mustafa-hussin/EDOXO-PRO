export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Expense {
  id: string;
  date: string;
  referenceNumber?: string;
  categoryId: string;
  categoryName: string;
  warehouseId?: string;
  amount: number;
  notes?: string;
  attachment?: string;
  createdBy: string;
}

export type PaymentStatus = "paid" | "partial" | "unpaid";

export type CheckStatus = "pending" | "cleared" | "bounced" | "canceled";
export type CheckType = "incoming" | "outgoing";

export interface Check {
  id: string;
  checkNumber: string;
  bankName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  payee: string; // name of person/company
  type: CheckType;
  status: CheckStatus;
  notes?: string;
  contactId?: string; // Link to supplier or customer
  transactionId?: string; // Link to sale or purchase
  description?: string;
  createdAt: string;
  updatedAt: string;
}
