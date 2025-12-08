import { create } from "zustand";
import { Product, Category, Brand } from "@/types/products";

interface ProductState {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Async Mock Actions (simulation)
  fetchProducts: () => Promise<void>;

  // Inventory Actions
  increaseStock: (productId: string, quantity: number) => void;
  decreaseStock: (productId: string, quantity: number) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  brands: [],
  isLoading: false,
  error: null,

  setProducts: (products) => set({ products }),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  fetchProducts: async () => {
    set({ isLoading: true });
    // Simulate API call
    setTimeout(() => {
      set({
        products: [], // We will populate this later with Faker data
        isLoading: false,
      });
    }, 1000);
  },

  increaseStock: (productId, quantity) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + quantity } : p
      ),
    }));
  },

  decreaseStock: (productId, quantity) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? { ...p, stock: Math.max(0, p.stock - quantity) }
          : p
      ),
    }));
  },
}));
