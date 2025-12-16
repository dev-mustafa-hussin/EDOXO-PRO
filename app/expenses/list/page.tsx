"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  Loader2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { ExpenseService, Expense } from "@/services/expense-service";
import { toast } from "sonner";

export default function ExpensesListPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      const data = await ExpenseService.getAll();
      setExpenses(data);
    } catch (error) {
      console.error("Failed to load expenses", error);
      toast.error("فشل تحميل المصاريف");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المصروف؟")) {
      try {
        await ExpenseService.delete(id);
        toast.success("تم حذف المصروف بنجاح");
        loadExpenses();
      } catch (error) {
        toast.error("فشل حذف المصروف");
      }
    }
  };

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
            <span>المصاريف</span>
            <span>/</span>
            <span className="text-blue-600">قائمة المصاريف</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              قائمة المصاريف
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  المصاريف
                </h2>
                <p className="text-sm text-gray-500">
                  سجل المصروفات والأعباء المالية
                </p>
              </div>
              <Link href="/expenses/add">
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Plus className="w-4 h-4" />
                  أضف مصروف
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
                    <th className="p-3 font-medium text-gray-600">المرجع</th>
                    <th className="p-3 font-medium text-gray-600">
                      فئة المصروف
                    </th>
                    <th className="p-3 font-medium text-gray-600">المستودع</th>
                    <th className="p-3 font-medium text-gray-600">المبلغ</th>
                    <th className="p-3 font-medium text-gray-600">ملاحظات</th>
                    <th className="p-3 font-medium text-gray-600">خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <div className="flex justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        </div>
                      </td>
                    </tr>
                  ) : expenses.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-gray-400"
                      >
                        لا توجد مصاريف مسجلة
                      </td>
                    </tr>
                  ) : (
                    expenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">{expense.date}</td>
                        <td className="p-3 font-medium">{expense.refNo}</td>
                        <td className="p-3">{expense.categoryName || "-"}</td>
                        <td className="p-3">{expense.warehouseName || "-"}</td>
                        <td className="p-3 font-bold text-red-600">
                          {Number(expense.amount).toLocaleString()}
                        </td>
                        <td className="p-3 text-gray-500">{expense.notes}</td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(expense.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
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
