"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { ExternalLink } from "lucide-react";

export default function EcommerceViewPage() {
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
            <span>المتجر الإلكترونى</span>
            <span>/</span>
            <span className="text-blue-600">عرض المتجر</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <ExternalLink className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">عرض المتجر</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-500">صفحة عرض المتجر قيد الإنشاء...</p>
          </div>
        </main>
      </div>
    </div>
  );
}
