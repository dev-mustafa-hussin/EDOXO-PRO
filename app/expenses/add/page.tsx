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
import { DollarSign } from "lucide-react";

export default function AddExpensePage() {
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
            <span>المصاريف</span>
            <span>/</span>
            <span className="text-blue-600">أضف مصروف</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              إضافة مصروف جديد
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>التاريخ</Label>
                  <Input type="date" />
                </div>

                <div className="space-y-2">
                  <Label>فئة المصروف</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cat1">كهرباء</SelectItem>
                      <SelectItem value="cat2">مياه</SelectItem>
                      <SelectItem value="cat3">رواتب</SelectItem>
                      <SelectItem value="cat4">إيجارات</SelectItem>
                      <SelectItem value="cat5">نثريات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>للمستودع / الفرع</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفرع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="branch1">الفرع الرئيسي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>المبلغ</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>ملاحظات</Label>
                <Input
                  as="textarea"
                  className="h-20"
                  placeholder="تفاصيل المصروف..."
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
