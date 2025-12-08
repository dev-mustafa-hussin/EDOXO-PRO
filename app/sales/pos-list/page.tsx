"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Monitor } from "lucide-react";

export default function POSListPage() {
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
            <span>المبيعات</span>
            <span>/</span>
            <span className="text-blue-600">قائمة نقطة البيع</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Monitor className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              قائمة مبيعات نقاط البيع (POS)
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-500">
              صفحة قائمة نقاط البيع قيد الإنشاء...
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
