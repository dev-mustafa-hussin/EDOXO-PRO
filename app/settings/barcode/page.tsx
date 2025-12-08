"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ScanBarcode } from "lucide-react";

export default function BarcodeSettingsPage() {
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
            <span>الإعدادات</span>
            <span>/</span>
            <span className="text-blue-600">إعدادات الباركود</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <ScanBarcode className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              إعدادات الباركود
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-500">
              صفحة إعدادات الباركود قيد الإنشاء...
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
