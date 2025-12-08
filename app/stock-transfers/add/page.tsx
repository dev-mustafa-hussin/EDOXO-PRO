"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Warehouse } from "lucide-react";

export default function AddStockTransferPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>الرئيسية</span>
            <span>/</span>
            <span>تحويلات المخزون</span>
            <span>/</span>
            <span className="text-blue-600">إضافة تحويل</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Warehouse className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              إضافة تحويل مخزون جديد
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>من مستودع</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المصدر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wh1">مستودع 1</SelectItem>
                      <SelectItem value="wh2">مستودع 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>إلى مستودع</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الوجهة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wh1">مستودع 1</SelectItem>
                      <SelectItem value="wh2">مستودع 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>تاريخ التحويل</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>حالة التحويل</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="sent">تم الإرسال</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border p-4 rounded-md bg-gray-50 text-center text-gray-500">
                منطقة إضافة المنتجات المراد تحويلها (قيد التطوير)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>تكلفة الشحن</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>ملاحظات</Label>
                  <Input
                    as="textarea"
                    className="h-20"
                    placeholder="ملاحظات..."
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto px-8">
                  حفظ التحويل
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
