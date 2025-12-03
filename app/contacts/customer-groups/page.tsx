"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface CustomerGroup {
  id: string;
  name: string;
  discount: string;
}

export default function CustomerGroupsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample data
  const customerGroups: CustomerGroup[] = [];

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
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                مجموعات العملاء
              </h1>
              <p className="text-sm text-gray-500">إدارة مجموعات العملاء</p>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Header with Add Button */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                إضافة
              </Button>
            </div>

            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-4">
              <div className="relative w-64">
                <Input
                  type="text"
                  placeholder="بحث ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      اسم مجموعة العملاء
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      مبلغ الخصم (%)
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      خيار
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customerGroups.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        لا توجد بيانات متاحة في الجدول
                      </td>
                    </tr>
                  ) : (
                    customerGroups.map((group) => (
                      <tr
                        key={group.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {group.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {group.discount}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  السابق
                </Button>
                <Button variant="outline" size="sm" disabled>
                  التالى
                </Button>
              </div>
              <span className="text-sm text-gray-600">
                عرض 0 إلى 0 من 0 إدخالات
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Daftar | Cloud ERP, Accounting, Sales, Inventory Software -{" "}
            <span className="text-blue-600">V6.9</span> | Copyright © 2025 All
            rights reserved.
          </div>
        </main>
      </div>

      {/* Add Group Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between rounded-t-lg">
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white hover:text-gray-200"
              >
                ×
              </button>
              <h2 className="text-lg font-semibold">إضافة مجموعة عملاء</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1 text-right">
                  اسم مجموعة العملاء:*
                </label>
                <Input placeholder="اسم المجموعة" className="text-right" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 text-right">
                  مبلغ الخصم (%):*
                </label>
                <Input
                  placeholder="النسبة المئوية"
                  className="text-right"
                  type="number"
                />
              </div>
            </div>
            <div className="border-t border-gray-200 p-4 flex items-center gap-3">
              <Button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-800 hover:bg-gray-900 text-white"
              >
                إغلاق
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                حفظ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
