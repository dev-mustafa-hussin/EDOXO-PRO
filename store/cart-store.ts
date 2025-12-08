import { create } from "zustand";
import { Product } from "@/types/products";
import { SaleItem } from "@/types/sales";

interface CartState {
  items: SaleItem[];
  customer: string | null; // Customer ID
  discount: number;
  taxRate: number;
  note: string;

  // Computed
  subtotal: () => number;
  taxTotal: () => number;
  grandTotal: () => number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setCustomer: (customerId: string) => void;
  setDiscount: (amount: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  customer: null,
  discount: 0,
  taxRate: 0.15, // Default 15% VAT
  note: "",

  subtotal: () => {
    return get().items.reduce((sum, item) => sum + item.subtotal, 0);
  },

  taxTotal: () => {
    return get().subtotal() * get().taxRate;
  },

  grandTotal: () => {
    return get().subtotal() + get().taxTotal() - get().discount;
  },

  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existingItem = items.find((item) => item.productId === product.id);

    if (existingItem) {
      // Update existing item
      const newQuantity = existingItem.quantity + quantity;
      const subtotal = newQuantity * product.sellingPrice;

      set({
        items: items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: newQuantity, subtotal, total: subtotal } // simplified tax calc for item
            : item
        ),
      });
    } else {
      // Add new item
      const newItem: SaleItem = {
        id: Math.random().toString(36).substr(2, 9),
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.sellingPrice,
        subtotal: product.sellingPrice * quantity,
        total: product.sellingPrice * quantity, // + tax logic later
      };
      set({ items: [...items, newItem] });
    }
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              subtotal: item.unitPrice * quantity,
              total: item.unitPrice * quantity,
            }
          : item
      ),
    }));
  },

  setCustomer: (customerId) => set({ customer: customerId }),
  setDiscount: (discount) => set({ discount }),
  clearCart: () => set({ items: [], customer: null, discount: 0, note: "" }),
}));
