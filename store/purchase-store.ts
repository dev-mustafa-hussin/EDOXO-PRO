import { create } from "zustand";
import { Purchase, PurchaseStatus } from "@/types/purchases";
import { PaymentStatus } from "@/types/finance";
import { useProductStore } from "./product-store";

interface PurchaseStore {
  purchases: Purchase[];
  isLoading: boolean;
  error: string | null;
  fetchPurchases: () => Promise<void>;
  addPurchase: (purchase: Purchase) => Promise<void>;
  updatePurchase: (id: string, updates: Partial<Purchase>) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;
  getPurchaseById: (id: string) => Purchase | undefined;
}

// Mock initial data
const initialPurchases: Purchase[] = [
  {
    id: "PUR-1001",
    referenceNumber: "PO-2023-001",
    supplierId: "SUP-001",
    supplierName: "شركة التوريدات العالمية",
    date: "2023-11-20",
    status: "received",
    paymentStatus: "paid",
    items: [
      {
        id: "ITEM-1",
        productId: "PROD-001",
        productName: "آيفون 15 برو",
        quantity: 10,
        unitCost: 42000,
        subtotal: 420000,
        tax: 0,
        total: 420000,
      },
    ],
    subtotal: 420000,
    taxTotal: 0,
    discountTotal: 0,
    grandTotal: 420000,
    paidAmount: 420000,
    dueAmount: 0,
    warehouseId: "WH-001",
    createdBy: "Admin",
    createdAt: "2023-11-20T10:00:00Z",
  },
];

export const usePurchaseStore = create<PurchaseStore>((set, get) => ({
  purchases: [],
  isLoading: false,
  error: null,

  fetchPurchases: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      set({ purchases: initialPurchases, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch purchases", isLoading: false });
    }
  },

  addPurchase: async (purchase) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update Inventory
      const { increaseStock } = useProductStore.getState();
      purchase.items.forEach((item) => {
        increaseStock(item.productId, item.quantity);
      });

      set((state) => ({
        purchases: [purchase, ...state.purchases],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to add purchase", isLoading: false });
    }
  },

  updatePurchase: async (id, updates) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set((state) => ({
        purchases: state.purchases.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update purchase", isLoading: false });
    }
  },

  deletePurchase: async (id) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set((state) => ({
        purchases: state.purchases.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete purchase", isLoading: false });
    }
  },

  getPurchaseById: (id) => {
    return get().purchases.find((p) => p.id === id);
  },
}));
