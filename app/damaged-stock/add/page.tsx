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
import { Trash2 } from "lucide-react";

export default function AddDamagedStockPage() {
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
            <span>المخزون التالف</span>
            <span>/</span>
            <span className="text-blue-600">أضف تالف</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              تسجيل مخزون تالف
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>تاريخ التسجيل</Label>
                  <Input type="date" />
                </div>

                <div className="space-y-2">
                  <Label>المستودع</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستودع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wh1">مستودع 1</SelectItem>
                      <SelectItem value="wh2">مستودع 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border p-4 rounded-md bg-gray-50 text-center text-gray-500">
                منطقة تحديد المنتج والكمية التالفة (قيد التطوير)
              </div>

              <div className="space-y-2">
                <Label>سبب التلف / ملاحظات</Label>
                <Input
                  as="textarea"
                  className="h-20"
                  placeholder="وصف السبب..."
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto px-8">
                  حفظ
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
