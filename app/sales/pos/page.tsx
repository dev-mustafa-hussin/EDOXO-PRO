"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useProductStore } from "@/store/product-store";
import { useContactStore } from "@/store/contact-store";
import { Product } from "@/types/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  User,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { SaleService } from "@/services/sale-service";

export default function POSPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Stores
  const cart = useCartStore();
  const {
    products,
    fetchProducts,
    isLoading: productsLoading,
  } = useProductStore();
  const { contacts, fetchContacts } = useContactStore();

  // Local State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial Fetch
  useEffect(() => {
    fetchProducts();
    fetchContacts();
  }, [fetchProducts, fetchContacts]);

  // Filter Products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Checkout
  const handleCheckout = async () => {
    if (cart.items.length === 0) return;

    setIsProcessing(true);

    try {
      const saleData = {
        customerId: cart.customer || null, // null for Walk-in
        date: new Date().toISOString().split("T")[0],
        status: "completed",
        paymentStatus: "paid", // POS is usually immediate payment
        paymentMethod: "cash", // Could add a selector for Card/Cash
        subtotal: cart.subtotal(),
        taxTotal: cart.taxTotal(),
        discountTotal: cart.discount,
        grandTotal: cart.grandTotal(),
        paidAmount: cart.grandTotal(),
        notes: "POS Transaction",
        items: cart.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price, // Selling Price
          tax: 0, // Explicit tax per item if needed
        })),
      };

      const response = await SaleService.create(saleData);

      cart.clearCart();

      toast({
        title: "تمت العملية بنجاح",
        description: `تم حفظ الفاتورة رقم ${response.invoice_number}`,
        variant: "default",
        className: "bg-green-600 text-white",
      });

      // Refresh products to update stock
      fetchProducts();

      // Redirect to invoice page for printing (optional, or show modal)
      // router.push(`/sales/invoice/${response.id}`);
    } catch (error: any) {
      console.error("Sale Error:", error);
      toast({
        title: "خطأ",
        description:
          error.response?.data?.message || "حدث خطأ أثناء حفظ الفاتورة",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden" dir="rtl">
      {/* LEFT: Product Grid */}
      <div className="flex-1 flex flex-col p-4 mr-96">
        {" "}
        {/* mr-96 to make room for fixed cart */}
        {/* Header / Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="بحث عن منتج..."
              className="pr-10 h-12 bg-gray-50 border-gray-200 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
            >
              الكل
            </Button>
            {/* Mock Categories - In real app, fetch from store */}
            <Button variant="outline" disabled>
              إلكترونيات
            </Button>
            <Button variant="outline" disabled>
              ملابس
            </Button>
          </div>
        </div>
        {/* Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start pb-20">
          {productsLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>جاري تحميل المنتجات...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-gray-500">
              لا توجد منتجات مطابقة
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => cart.addItem(product)}
              />
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Cart Sidebar (Fixed) */}
      <div className="w-96 bg-white border-r fixed right-0 top-0 h-full flex flex-col shadow-xl z-10">
        {/* Cart Header */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              السلة
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={cart.clearCart}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 ml-1" />
              إفراغ
            </Button>
          </div>

          {/* Customer Select */}
          <div className="flex items-center gap-2 bg-white border rounded-lg p-2">
            <User className="w-5 h-5 text-gray-400" />
            <select
              className="flex-1 bg-transparent border-none outline-none text-sm"
              value={cart.customer || ""}
              onChange={(e) => cart.setCustomer(e.target.value)}
            >
              <option value="">عميل نقدي (Walk-in)</option>
              {contacts
                .filter((c) => c.type === "customer")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.items.length === 0 ? (
            <div className="text-center text-gray-400 py-20 flex flex-col items-center">
              <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
              <p>السلة فارغة</p>
              <p className="text-sm">اضغط على المنتجات لإضافتها</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-800 line-clamp-1">
                    {item.productName}
                  </span>
                  <span className="font-bold text-blue-600">
                    {item.total.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-white rounded-md border shadow-sm">
                    <button
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600"
                      onClick={() =>
                        cart.updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">
                      {item.quantity}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-red-500"
                      onClick={() =>
                        cart.updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => cart.removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary & Pay */}
        <div className="p-4 border-t bg-gray-50 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>المجموع الفرعي:</span>
            <span>{cart.subtotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>الضريبة (15%):</span>
            <span>{cart.taxTotal().toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>الإجمالي:</span>
            <span>{cart.grandTotal().toLocaleString()}</span>
          </div>

          <Button
            size="lg"
            className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 mt-4 shadow-lg shadow-green-200"
            onClick={handleCheckout}
            disabled={cart.items.length === 0 || isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                دفع (Pay)
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Simple Product Card Component
function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 p-3 cursor-pointer 
        transition-all hover:shadow-md hover:border-blue-300 active:scale-95
        flex flex-col h-full
        ${product.stock <= 0 ? "opacity-50 pointer-events-none grayscale" : ""}
      `}
    >
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl">
        {/* Placeholder for Product Image */}
        📦
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="font-bold text-blue-600 text-lg">
          {product.sellingPrice.toLocaleString()}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            product.stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {product.stock > 0 ? `${product.stock} متوفر` : "نفذ"}
        </span>
      </div>
    </div>
  );
}
