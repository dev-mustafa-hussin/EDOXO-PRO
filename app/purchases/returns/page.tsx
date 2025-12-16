"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Undo2,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import {
  PurchaseReturnService,
  PurchaseReturn,
} from "@/services/purchase-return-service";
import { useToast } from "@/components/ui/use-toast";

export default function PurchaseReturnsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [returns, setReturns] = useState<PurchaseReturn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchReturns = async () => {
    try {
      setIsLoading(true);
      const data = await PurchaseReturnService.getAll();
      setReturns(data);
    } catch (error) {
      console.error("Failed to fetch returns:", error);
      toast({
        title: "خطأ",
        description: "فشل تحديث قائمة المرتجعات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>الرئيسية</span>
            <span>/</span>
            <span>المشتريات</span>
            <span>/</span>
            <span className="text-blue-600">قائمة مرتجع المشتريات</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Undo2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              قائمة مرتجع المشتريات
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  مرتجع المشتريات
                </h2>
                <p className="text-sm text-gray-500">
                  إدارة المرتجعات للموردين
                </p>
              </div>
              <Link href="/purchases/returns/add">
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Plus className="w-4 h-4" />
                  أضف مرتجع
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
                      حالة المرتجع
                    </th>
                    <th className="p-3 font-medium text-gray-600">
                      حالة الاسترداد
                    </th>
                    <th className="p-3 font-medium text-gray-600">
                      المجموع الكلي
                    </th>
                    <th className="p-3 font-medium text-gray-600">المسترد</th>
                    <th className="p-3 font-medium text-gray-600">المتبقي</th>
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
                  ) : returns.length > 0 ? (
                    returns.map((ret) => (
                      <tr
                        key={ret.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 text-gray-600">{ret.date}</td>
                        <td className="p-3 font-medium text-gray-900">
                          {ret.referenceNumber}
                        </td>
                        <td className="p-3 text-gray-600">
                          {ret.supplierName}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs
                             ${
                               ret.status === "completed"
                                 ? "bg-green-100 text-green-700"
                                 : "bg-yellow-100 text-yellow-700"
                             }`}
                          >
                            {ret.status === "completed"
                              ? "مكتمل"
                              : "قيد المعالجة"}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs
                             ${
                               ret.paymentStatus === "paid"
                                 ? "bg-green-100 text-green-700"
                                 : ret.paymentStatus === "partial"
                                 ? "bg-yellow-100 text-yellow-700"
                                 : "bg-red-100 text-red-700"
                             }`}
                          >
                            {ret.paymentStatus === "paid"
                              ? "تم الاسترداد"
                              : ret.paymentStatus === "partial"
                              ? "جزئي"
                              : "غير مسترد"}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-gray-800">
                          {ret.grandTotal.toLocaleString()}
                        </td>
                        <td className="p-3 text-green-600">
                          {ret.paidAmount.toLocaleString()}
                        </td>
                        <td className="p-3 text-red-600">
                          {ret.dueAmount.toLocaleString()}
                        </td>
                        <td className="p-3">{/* Actions */}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-8 text-gray-400"
                      >
                        لا توجد مرتجعات متاحة حاليا
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
