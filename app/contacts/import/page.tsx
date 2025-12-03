"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

export default function ImportContactsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const availableFields = [
    { name: "اسم جهة الاتصال", instruction: "(مطلوب)" },
    {
      name: "اسم النشاط",
      instruction: "(مطلوب) (إذا كان فارغًا، فسيتم استخدام اسم جهة الاتصال)",
    },
    { name: "البريد الإلكتروني", instruction: "(مطلوب)" },
    { name: "رقم الاتصال", instruction: "(مطلوب)" },
    { name: "العنوان", instruction: "" },
    { name: "المدينة", instruction: "" },
    { name: "الولاية", instruction: "" },
    { name: "البلد", instruction: "" },
    { name: "الرمز البريدي", instruction: "" },
    { name: "الرقم الضريبي", instruction: "" },
    { name: "الرصيد الافتتاحي", instruction: "" },
    { name: "فترة الدفع", instruction: "" },
  ];

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
                استيراد جهات الاتصال
              </h1>
              <p className="text-sm text-gray-500">
                إدارة استيراد جهات الاتصال
              </p>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            {/* Download Template Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                1. تنزيل ملف القالب
              </h3>
              <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                <Download className="w-4 h-4" />
                تنزيل ملف القالب
              </Button>
            </div>

            {/* Instructions Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                2. تعليمات
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
                <li>قم بتنزيل ملف القالب أعلاه.</li>
                <li>املأ البيانات في الملف مع مراعاة الحقول المطلوبة.</li>
                <li>لا تغير ترتيب الأعمدة في ملف CSV.</li>
                <li>تأكد من أن البريد الإلكتروني فريد لكل جهة اتصال.</li>
              </ul>
            </div>

            {/* Upload Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                3. رفع ملف CSV
              </h3>
              <div className="flex items-end gap-4">
                <div className="flex-1 max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اختر ملف CSV
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      border border-gray-300 rounded-md p-1"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  إرسال
                </Button>
              </div>
            </div>

            {/* Available Fields Table */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                حقول ملف CSV المتاحة
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full min-w-max">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                        اسم الحقل
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                        تعليمات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableFields.map((field, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 last:border-0"
                      >
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                          {field.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {field.instruction}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
    </div>
  );
}
