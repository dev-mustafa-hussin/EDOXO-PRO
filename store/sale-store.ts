import { create } from "zustand";
import { Sale, SaleStatus } from "@/types/sales";
import { PaymentStatus } from "@/types/finance";
import { useProductStore } from "./product-store";

interface SaleStore {
  sales: Sale[];
  isLoading: boolean;
  error: string | null;
  fetchSales: () => Promise<void>;
  addSale: (sale: Sale) => Promise<void>;
  updateSale: (id: string, updates: Partial<Sale>) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  getSaleById: (id: string) => Sale | undefined;
}

// Mock initial data
const initialSales: Sale[] = [
  {
    id: "SALE-1001",
    invoiceNumber: "INV-2023-001",
    customerId: "CUST-001",
    customerName: "عميل نقدي",
    date: "2023-11-21",
    status: "completed",
    paymentStatus: "paid",
    items: [
      {
        id: "ITEM-S1",
        productId: "PROD-001",
        productName: "آيفون 15 برو",
        quantity: 1,
        unitPrice: 45000,
        subtotal: 45000,
        tax: 0,
        total: 45000,
      },
    ],
    subtotal: 45000,
    taxTotal: 0,
    discountTotal: 0,
    grandTotal: 45000,
    paidAmount: 45000,
    dueAmount: 0,
    createdBy: "Admin",
    createdAt: "2023-11-21T14:30:00Z",
  },
];

export const useSaleStore = create<SaleStore>((set, get) => ({
  sales: [],
  isLoading: false,
  error: null,

  fetchSales: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      set({ sales: initialSales, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch sales", isLoading: false });
    }
  },

  addSale: async (sale) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update Inventory
      const { decreaseStock } = useProductStore.getState();
      sale.items.forEach((item) => {
        decreaseStock(item.productId, item.quantity);
      });

      set((state) => ({
        sales: [sale, ...state.sales],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to add sale", isLoading: false });
    }
  },

  updateSale: async (id, updates) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set((state) => ({
        sales: state.sales.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update sale", isLoading: false });
    }
  },

  deleteSale: async (id) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set((state) => ({
        sales: state.sales.filter((s) => s.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to delete sale", isLoading: false });
    }
  },

  getSaleById: (id) => {
    return get().sales.find((s) => s.id === id);
  },
}));
