"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Download, FileSpreadsheet, Printer, Eye, Edit, Trash2, ArrowUpDown, X } from "lucide-react"

interface Delegate {
  id: number
  name: string
  email: string
  phone: string
  address: string
  commission: number
}

export default function DelegatesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [delegates, setDelegates] = useState<Delegate[]>([])
  const [entriesPerPage, setEntriesPerPage] = useState("25")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newDelegate, setNewDelegate] = useState({
    title: "السيد",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    commission: 0,
  })
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
    phone: true,
    address: true,
    commission: true,
    options: true,
  })
  const [showColumnVisibility, setShowColumnVisibility] = useState(false)

  const handleAddDelegate = () => {
    if (newDelegate.firstName) {
      const fullName = `${newDelegate.title} ${newDelegate.firstName} ${newDelegate.lastName}`.trim()
      setDelegates([
        ...delegates,
        {
          id: delegates.length + 1,
          name: fullName,
          email: newDelegate.email,
          phone: newDelegate.phone,
          address: newDelegate.address,
          commission: newDelegate.commission,
        },
      ])
      setNewDelegate({ title: "السيد", firstName: "", lastName: "", email: "", phone: "", address: "", commission: 0 })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteDelegate = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المندوب؟")) {
      setDelegates(delegates.filter((delegate) => delegate.id !== id))
    }
  }

  const filteredDelegates = delegates.filter(
    (delegate) =>
      delegate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delegate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delegate.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delegate.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const exportToCSV = () => {
    const headers = ["الإسم", "البريد الإلكتروني", "رقم الاتصال", "العنوان", "نسبة عمولة المبيعات (%)"]
    const csvContent = [
      headers.join(","),
      ...filteredDelegates.map((d) => [d.name, d.email, d.phone, d.address, d.commission].join(",")),
    ].join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "delegates.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportToExcel = () => {
    const headers = ["الإسم", "البريد الإلكتروني", "رقم الاتصال", "العنوان", "نسبة عمولة المبيعات (%)"]
    let tableHtml = `<html dir="rtl"><head><meta charset="utf-8"></head><body><table border="1">`
    tableHtml += `<tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>`
    filteredDelegates.forEach((d) => {
      tableHtml += `<tr><td>${d.name}</td><td>${d.email}</td><td>${d.phone}</td><td>${d.address}</td><td>${d.commission}%</td></tr>`
    })
    tableHtml += `</table></body></html>`

    const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "delegates.xls"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    const headers = ["الإسم", "البريد الإلكتروني", "رقم الاتصال", "العنوان", "نسبة عمولة المبيعات (%)"]
    const printContent = `
      <html dir="rtl">
      <head>
        <title>المندوبين</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; color: #1e40af; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
          th { background-color: #f3f4f6; }
          .date { text-align: left; color: #666; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>المندوبين</h1>
        <div class="date">تاريخ الطباعة: ${new Date().toLocaleDateString("ar-EG")}</div>
        <table>
          <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
          ${filteredDelegates
            .map(
              (d) => `
            <tr>
              <td>${d.name}</td>
              <td>${d.email}</td>
              <td>${d.phone}</td>
              <td>${d.address}</td>
              <td>${d.commission}%</td>
            </tr>
          `,
            )
            .join("")}
        </table>
      </body>
      </html>
    `
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          {/* Page Title */}
          <h1 className="text-xl font-semibold text-gray-800 mb-6 text-right">المندوبين</h1>

          {/* Content Card */}
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 overflow-hidden">
            {/* Blue top bar */}
            <div className="h-1 bg-blue-500"></div>

            <div className="p-6">
              {/* Add Button */}
              <div className="flex justify-start mb-4">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                      <Plus className="w-4 h-4" />
                      إضافة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl p-0" dir="rtl">
                    {/* Red header bar */}
                    <div className="bg-red-600 text-white p-4 flex items-center justify-between">
                      <DialogTitle className="text-lg font-medium">إضافة مندوب</DialogTitle>
                      <button onClick={() => setIsAddDialogOpen(false)} className="text-white hover:text-gray-200">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Row 1: اللقب, الاسم, الإسم الثانى */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-700">اللقب:</Label>
                          <Select
                            value={newDelegate.title}
                            onValueChange={(value) => setNewDelegate({ ...newDelegate, title: value })}
                          >
                            <SelectTrigger className="text-right">
                              <SelectValue placeholder="السيد ال" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="السيد">السيد</SelectItem>
                              <SelectItem value="السيدة">السيدة</SelectItem>
                              <SelectItem value="الأستاذ">الأستاذ</SelectItem>
                              <SelectItem value="الأستاذة">الأستاذة</SelectItem>
                              <SelectItem value="الدكتور">الدكتور</SelectItem>
                              <SelectItem value="الدكتورة">الدكتورة</SelectItem>
                              <SelectItem value="المهندس">المهندس</SelectItem>
                              <SelectItem value="المهندسة">المهندسة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">الاسم:*</Label>
                          <Input
                            value={newDelegate.firstName}
                            onChange={(e) => setNewDelegate({ ...newDelegate, firstName: e.target.value })}
                            placeholder="الاسم"
                            className="text-right"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">الإسم الثانى:</Label>
                          <Input
                            value={newDelegate.lastName}
                            onChange={(e) => setNewDelegate({ ...newDelegate, lastName: e.target.value })}
                            placeholder="الإسم الثانى"
                            className="text-right"
                          />
                        </div>
                      </div>

                      {/* Row 2: البريد الإلكتروني, رقم الاتصال */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-700">البريد الإلكتروني:</Label>
                          <Input
                            type="email"
                            value={newDelegate.email}
                            onChange={(e) => setNewDelegate({ ...newDelegate, email: e.target.value })}
                            placeholder="البريد الإلكتروني"
                            className="text-right"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">رقم الاتصال:</Label>
                          <Input
                            value={newDelegate.phone}
                            onChange={(e) => setNewDelegate({ ...newDelegate, phone: e.target.value })}
                            placeholder="رقم الاتصال"
                            className="text-right"
                          />
                        </div>
                      </div>

                      {/* Row 3: العنوان (textarea) */}
                      <div className="space-y-2">
                        <Label className="text-gray-700">العنوان:</Label>
                        <Textarea
                          value={newDelegate.address}
                          onChange={(e) => setNewDelegate({ ...newDelegate, address: e.target.value })}
                          placeholder="العنوان"
                          className="text-right min-h-24 resize-y"
                        />
                      </div>

                      {/* Row 4: نسبة عمولة المبيعات */}
                      <div className="space-y-2">
                        <Label className="text-gray-700">نسبة عمولة المبيعات (%):</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={newDelegate.commission || ""}
                          onChange={(e) => setNewDelegate({ ...newDelegate, commission: Number(e.target.value) })}
                          placeholder="نسبة عمولة المبيعات (%)"
                          className="text-right"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-4">
                        <Button onClick={handleAddDelegate} className="bg-red-600 hover:bg-red-700 text-white px-6">
                          حفظ
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                          className="bg-gray-800 hover:bg-gray-900 text-white border-gray-800 px-6"
                        >
                          إغلاق
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                {/* Right side - Search */}
                <div className="relative">
                  <Input
                    placeholder="بحث ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48 text-sm"
                  />
                </div>

                {/* Left side - Action buttons and entries */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Column Visibility */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1 bg-transparent"
                      onClick={() => setShowColumnVisibility(!showColumnVisibility)}
                    >
                      <Eye className="w-3 h-3" />
                      رؤية العمود
                    </Button>
                    {showColumnVisibility && (
                      <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-40">
                        {Object.entries(visibleColumns).map(([key, value]) => (
                          <label
                            key={key}
                            className="flex items-center gap-2 p-1 hover:bg-gray-50 cursor-pointer text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => setVisibleColumns({ ...visibleColumns, [key]: e.target.checked })}
                              className="rounded"
                            />
                            {key === "name" && "الإسم"}
                            {key === "email" && "البريد الإلكتروني"}
                            {key === "phone" && "رقم الاتصال"}
                            {key === "address" && "العنوان"}
                            {key === "commission" && "نسبة عمولة المبيعات"}
                            {key === "options" && "خيار"}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="text-xs gap-1 bg-transparent" onClick={handlePrint}>
                    <Printer className="w-3 h-3" />
                    طباعة
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1 bg-transparent" onClick={exportToExcel}>
                    <FileSpreadsheet className="w-3 h-3" />
                    تصدير إلى Excel
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1 bg-transparent" onClick={exportToCSV}>
                    <Download className="w-3 h-3" />
                    تصدير إلى CSV
                  </Button>
                  <div className="flex items-center gap-2">
                    <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                      <SelectTrigger className="w-20 text-xs">
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
                    <span className="text-sm text-gray-600">عرض</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-right">
                      {visibleColumns.name && (
                        <th className="p-3 font-medium text-gray-600">
                          <div className="flex items-center gap-1 justify-start">
                            <ArrowUpDown className="w-3 h-3 text-gray-400" />
                            الإسم
                          </div>
                        </th>
                      )}
                      {visibleColumns.email && (
                        <th className="p-3 font-medium text-gray-600">
                          <div className="flex items-center gap-1 justify-start">
                            <ArrowUpDown className="w-3 h-3 text-gray-400" />
                            البريد الإلكتروني
                          </div>
                        </th>
                      )}
                      {visibleColumns.phone && <th className="p-3 font-medium text-gray-600">رقم الاتصال</th>}
                      {visibleColumns.address && (
                        <th className="p-3 font-medium text-gray-600">
                          <div className="flex items-center gap-1 justify-start">
                            <ArrowUpDown className="w-3 h-3 text-gray-400" />
                            العنوان
                          </div>
                        </th>
                      )}
                      {visibleColumns.commission && (
                        <th className="p-3 font-medium text-gray-600">
                          <div className="flex items-center gap-1 justify-start">
                            <ArrowUpDown className="w-3 h-3 text-gray-400" />
                            نسبة عمولة المبيعات (%)
                          </div>
                        </th>
                      )}
                      {visibleColumns.options && (
                        <th className="p-3 font-medium text-gray-600">
                          <div className="flex items-center gap-1 justify-start">
                            <ArrowUpDown className="w-3 h-3 text-gray-400" />
                            خيار
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDelegates.length > 0 ? (
                      filteredDelegates.map((delegate) => (
                        <tr key={delegate.id} className="border-b hover:bg-gray-50">
                          {visibleColumns.name && <td className="p-3">{delegate.name}</td>}
                          {visibleColumns.email && <td className="p-3">{delegate.email}</td>}
                          {visibleColumns.phone && <td className="p-3">{delegate.phone}</td>}
                          {visibleColumns.address && <td className="p-3">{delegate.address}</td>}
                          {visibleColumns.commission && <td className="p-3">{delegate.commission}%</td>}
                          {visibleColumns.options && (
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteDelegate(delegate.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500 bg-blue-50/30">
                          لا توجد بيانات متاحة في الجدول
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <div className="flex gap-1">
                  <button className="px-4 py-1.5 border rounded hover:bg-gray-50">السابق</button>
                  <button className="px-4 py-1.5 border rounded hover:bg-gray-50">التالى</button>
                </div>
                <span>
                  عرض {filteredDelegates.length > 0 ? 1 : 0} إلى {filteredDelegates.length} من{" "}
                  {filteredDelegates.length} إدخالات
                </span>
              </div>

              {/* Bottom progress bar */}
              <div className="mt-4 h-2 bg-gradient-to-l from-yellow-400 via-green-400 to-green-500 rounded-full"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
