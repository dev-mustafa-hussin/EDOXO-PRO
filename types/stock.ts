export interface StockTransfer {
  id: string;
  referenceNumber: string;
  date: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  status: "completed" | "pending" | "sent";
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  notes?: string;
  shippingCost?: number;
  createdBy: string;
}

export interface DamagedStock {
  id: string;
  date: string;
  warehouseId: string;
  items: Array<{
    productId: string;
    quantity: number;
    reason?: string;
  }>;
  notes?: string;
  createdBy: string;
}

export enum AdjustmentType {
  ADD = "add",
  SUBTRACT = "subtract",
}

export interface InventoryAdjustment {
  id: string;
  date: string;
  warehouseId: string;
  productId: string;
  quantity: number;
  type: AdjustmentType;
  reason: string;
  createdBy: string;
}
