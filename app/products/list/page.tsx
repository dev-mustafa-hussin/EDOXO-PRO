"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Box,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useProductStore } from "@/store/product-store";

export default function ProductsListPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { products, fetchProducts, deleteProduct, isLoading } =
    useProductStore();

  useEffect(() => {
    // Only fetch if empty to persist added data during navigation session
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenCalculator={() => {}}
        onOpenProfit={() => {}}
      />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>الرئيسية</span>
            <span>/</span>
            <span>المنتجات</span>
            <span>/</span>
            <span className="text-blue-600">قائمة المنتجات</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Box className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              قائمة المنتجات
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  المنتجات
                </h2>
                <p className="text-sm text-gray-500">
                  إدارة جميع المنتجات ({products.length})
                </p>
              </div>
              <Link href="/products/add">
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Plus className="w-4 h-4" />
                  أضف منتجا
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  تصفية
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  تصدير
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Printer className="w-4 h-4" />
                  طباعة
                </Button>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="بحث..." className="pr-10 w-64" />
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b text-right">
                    <th className="p-3 font-medium text-gray-600">#</th>
                    <th className="p-3 font-medium text-gray-600">الاسم</th>
                    <th className="p-3 font-medium text-gray-600">
                      الكود (SKU)
                    </th>
                    <th className="p-3 font-medium text-gray-600">النوع</th>
                    <th className="p-3 font-medium text-gray-600">
                      سعر الشراء
                    </th>
                    <th className="p-3 font-medium text-gray-600">سعر البيع</th>
                    <th className="p-3 font-medium text-gray-600">الحالة</th>
                    <th className="p-3 font-medium text-gray-600">خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-8 text-gray-400"
                      >
                        جاري التحميل...
                      </td>
                    </tr>
                  ) : products.length > 0 ? (
                    products.map((product: any, index: number) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 text-gray-600">{index + 1}</td>
                        <td className="p-3 font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="p-3 text-gray-600 font-mono">
                          {product.sku}
                        </td>
                        <td className="p-3 text-gray-600">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                            {product.type}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">
                          {product.purchasePrice}
                        </td>
                        <td className="p-3 font-semibold text-green-600">
                          {product.sellingPrice}
                        </td>
                        <td className="p-3 text-gray-600">
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                            {product.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-8 text-gray-400"
                      >
                        لا توجد منتجات متاحة حاليا
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
