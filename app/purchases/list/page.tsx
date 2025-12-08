"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
} from "lucide-react";
import Link from "next/link";

import { usePurchaseStore } from "@/store/purchase-store";
import { Purchase } from "@/types/purchases";

export default function PurchasesListPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { purchases, fetchPurchases, isLoading } = usePurchaseStore();

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

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
            <span>المشتريات</span>
            <span>/</span>
            <span className="text-blue-600">قائمة المشتريات</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              قائمة المشتريات
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  المشتريات
                </h2>
                <p className="text-sm text-gray-500">إدارة فواتير الشراء</p>
              </div>
              <Link href="/purchases/add">
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Plus className="w-4 h-4" />
                  أضف مشتريات
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
                  <Calendar className="w-4 h-4" />
                  التاريخ
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
                    <th className="p-3 font-medium text-gray-600">التاريخ</th>
                    <th className="p-3 font-medium text-gray-600">
                      رقم المرجع
                    </th>
                    <th className="p-3 font-medium text-gray-600">المورد</th>
                    <th className="p-3 font-medium text-gray-600">
                      حالة الشراء
                    </th>
                    <th className="p-3 font-medium text-gray-600">
                      حالة الدفع
                    </th>
                    <th className="p-3 font-medium text-gray-600">
                      المجموع الكلي
                    </th>
                    <th className="p-3 font-medium text-gray-600">المدفوع</th>
                    <th className="p-3 font-medium text-gray-600">المستحق</th>
                    <th className="p-3 font-medium text-gray-600">خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-8 text-gray-400"
                      >
                        جاري التحميل...
                      </td>
                    </tr>
                  ) : purchases.length > 0 ? (
                    purchases.map((purchase: Purchase) => (
                      <tr
                        key={purchase.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 text-gray-600">{purchase.date}</td>
                        <td className="p-3 font-medium text-gray-900">
                          {purchase.referenceNumber}
                        </td>
                        <td className="p-3 text-gray-600">
                          {purchase.supplierName}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs
                             ${
                               purchase.status === "received"
                                 ? "bg-green-100 text-green-700"
                                 : purchase.status === "pending"
                                 ? "bg-yellow-100 text-yellow-700"
                                 : purchase.status === "ordered"
                                 ? "bg-blue-100 text-blue-700"
                                 : "bg-red-100 text-red-700"
                             }`}
                          >
                            {purchase.status === "received"
                              ? "تم الاستلام"
                              : purchase.status === "pending"
                              ? "قيد الانتظار"
                              : purchase.status === "ordered"
                              ? "تم الطلب"
                              : "ملغي"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs
                             ${
                               purchase.paymentStatus === "paid"
                                 ? "bg-green-100 text-green-700"
                                 : purchase.paymentStatus === "partial"
                                 ? "bg-yellow-100 text-yellow-700"
                                 : "bg-red-100 text-red-700"
                             }`}
                          >
                            {purchase.paymentStatus === "paid"
                              ? "مدفوع"
                              : purchase.paymentStatus === "partial"
                              ? "جزئي"
                              : "غير مدفوع"}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-gray-800">
                          {purchase.grandTotal.toLocaleString()}
                        </td>
                        <td className="p-3 text-green-600">
                          {purchase.paidAmount.toLocaleString()}
                        </td>
                        <td className="p-3 text-red-600">
                          {purchase.dueAmount.toLocaleString()}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                            >
                              <Printer className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-8 text-gray-400"
                      >
                        لا توجد مشتريات متاحة حاليا
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
