"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Printer, FileSpreadsheet, Eye, FileText, ArrowUpDown } from "lucide-react"
import { useState } from "react"

export function SalesOrders() {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const columns = [
    { key: "option", label: "خيار" },
    { key: "date", label: "التاريخ" },
    { key: "orderNumber", label: "رقم الطلب" },
    { key: "customerName", label: "اسم العميل" },
    { key: "contactNumber", label: "رقم الاتصال" }, // Fixed from رقم التواصل
    { key: "branch", label: "الفرع" },
    { key: "status", label: "الحالة" },
    { key: "shippingStatus", label: "حالة الشحن" },
    { key: "remainingQuantity", label: "الكمية المتبقية" }, // Fixed from الخميلة المتبقية
    { key: "addedBy", label: "أضيفت بواسطة" },
  ]

  return (
    <Card className="mb-6 border-t-4 border-t-yellow-400">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Input placeholder="بحث..." className="w-32 h-8 text-xs" />
          <Select defaultValue="25">
            <SelectTrigger className="w-20 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
              <SelectItem value="500">500</SelectItem>
              <SelectItem value="1000">1000</SelectItem>
              <SelectItem value="all">الكل</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-gray-500">إدخالات</span>
          <span className="text-xs text-gray-500">عرض</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1 bg-transparent">
            <Download className="w-3 h-3" />
            تصدير إلى CSV
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1 bg-transparent">
            <FileSpreadsheet className="w-3 h-3" />
            تصدير إلى Excel
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1 bg-transparent">
            <Printer className="w-3 h-3" />
            طباعة
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1 bg-transparent">
            <Eye className="w-3 h-3" />
            رؤية العمود
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">طلب المبيعات</CardTitle>
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-right">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-2 font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1 justify-end">
                    <ArrowUpDown className={`w-3 h-3 ${sortColumn === col.key ? "text-blue-600" : "text-gray-400"}`} />
                    {col.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={10} className="text-center py-8 text-gray-400">
                لا توجد بيانات متاحة فى الجدول
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <div className="flex gap-2">
            <button className="hover:text-blue-600 px-2 py-1 rounded border">السابق</button>
            <button className="hover:text-blue-600 px-2 py-1 rounded border">التالى</button>
          </div>
          <span>عرض 0 إلى 0 من 0 إدخالات</span>
        </div>
      </CardContent>
    </Card>
  )
}
