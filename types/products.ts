export interface Category {
  id: string;
  name: string;
  image?: string;
  parentId?: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  image?: string;
  description?: string;
}

export interface Unit {
  id: string;
  name: string;
  shortName: string; // e.g., 'kg', 'pcs'
  allowDecimal: boolean;
}

export interface Variant {
  id: string;
  name: string;
  options: string[]; // e.g., ['Red', 'Blue'] for Color
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // { Color: 'Red', Size: 'L' }
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  type: "standard" | "service" | "digital";
  categoryId: string;
  brandId?: string;
  unitId: string;
  purchasePrice: number;
  sellingPrice: number;
  minSellingPrice?: number;
  taxRate: number;
  alertQuantity: number;
  currentStock: number;
  image?: string;
  description?: string;
  status: "active" | "archived";
  hasVariants: boolean;
  variants?: ProductVariant[];
  createdAt: string;
}
