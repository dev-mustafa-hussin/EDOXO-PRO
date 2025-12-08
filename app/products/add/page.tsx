"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Box } from "lucide-react";

export default function AddProductPage() {
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
            <span>المنتجات</span>
            <span>/</span>
            <span className="text-blue-600">أضف منتجا</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Box className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              أضف منتجا جديدا
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <form className="max-w-2xl space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم المنتج</Label>
                  <Input placeholder="اسم المنتج" />
                </div>
                <div className="space-y-2">
                  <Label>كود المنتج (SKU)</Label>
                  <Input placeholder="Code / SKU" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>سعر الشراء</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>سعر البيع</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input className="h-20" placeholder="وصف المنتج..." />
              </div>

              <div className="pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                  حفظ المنتج
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
