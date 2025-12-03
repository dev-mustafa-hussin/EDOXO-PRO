"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Printer, FileSpreadsheet, Eye, CreditCard } from "lucide-react"

export function PaymentTables() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* Sales Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
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
            <CardTitle className="text-sm">مستحقات مدفوعات المبيعات</CardTitle>
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-end gap-2 mb-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-32 text-xs">
                <SelectValue placeholder="كل الموقع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الموقع</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-right">
                <th className="p-2 font-medium text-gray-600">عميل</th>
                <th className="p-2 font-medium text-gray-600">الفاتورة رقم</th>
                <th className="p-2 font-medium text-gray-600">المبلغ المستحق</th>
                <th className="p-2 font-medium text-gray-600">خيار</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  لا توجد بيانات متاحة فى الجدول
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <div className="flex gap-2">
              <button className="hover:text-blue-600">السابق</button>
              <button className="hover:text-blue-600">التالى</button>
            </div>
            <span>عرض 0 إلى 0 من 0 إدخالات</span>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Payments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
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
            <span className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center text-xs">⚠️</span>
            <CardTitle className="text-sm">مستحقات مدفوعات المشتريات</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-right">
                <th className="p-2 font-medium text-gray-600">المورد</th>
                <th className="p-2 font-medium text-gray-600">الرقم المرجعى</th>
                <th className="p-2 font-medium text-gray-600">المبلغ المستحق</th>
                <th className="p-2 font-medium text-gray-600">خيار</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  لا توجد بيانات متاحة فى الجدول
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <div className="flex gap-2">
              <button className="hover:text-blue-600">السابق</button>
              <button className="hover:text-blue-600">التالى</button>
            </div>
            <span>عرض 0 إلى 0 من 0 إدخالات</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
