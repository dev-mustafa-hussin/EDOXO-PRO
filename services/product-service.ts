import api from "@/lib/axios";
import { Product } from "@/types/products";

export interface ProductResponse {
  data: Product[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

// Helper to map backend data to frontend interface
const mapToFrontend = (data: any): Product => ({
  ...data,
  id: data.id,
  name: data.name,
  sku: data.sku,
  purchasePrice: Number(data.cost || 0), // Map cost -> purchasePrice
  sellingPrice: Number(data.price || 0), // Map price -> sellingPrice
  currentStock: Number(data.stock || 0), // Map stock -> currentStock
  categoryId: data.category_id, // Map category_id -> categoryId
  // Map other fields as needed or pass through
  description: data.description,
  type: data.type || "standard",
  status: data.status || "active",
  createdAt: data.created_at || new Date().toISOString(),
});

export const ProductService = {
  // Get all products with optional filters
  getAll: async (params?: any) => {
    const response = await api.get<ProductResponse>("/products", { params });
    // Assuming response.data.data is the array if using Laravel Resource Collection
    // Or response.data if simple array.
    // Based on Controller: ProductResource::collection($products), it returns { data: [...] }
    const items = Array.isArray(response.data.data)
      ? response.data.data
      : (response.data as any);
    return items.map(mapToFrontend);
  },

  // Get single product
  getById: async (id: string) => {
    const response = await api.get<{ data: any }>(`/products/${id}`);
    return mapToFrontend(response.data.data);
  },

  // Create new product
  create: async (data: Partial<Product>) => {
    // We already send mapped payload from component, receiving backend format back
    const response = await api.post<{ data: any }>("/products", data);
    return mapToFrontend(response.data.data);
  },

  // Update product
  update: async (id: string, data: Partial<Product>) => {
    const response = await api.put<{ data: any }>(`/products/${id}`, data);
    return mapToFrontend(response.data.data);
  },

  // Delete product
  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
};
