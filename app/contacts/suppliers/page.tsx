"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Plus,
  FileSpreadsheet,
  FileText,
  Printer,
  Columns,
  ChevronUp,
  ChevronDown,
  Filter,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react"

interface Supplier {
  id: string
  contactId: string
  name: string
  businessName: string
  email: string
  taxNumber: string
  paymentPeriod: string
  openingBalance: string
  previousBalance: string
  addedOn: string
  address: string
  mobile: string
  unpaidPurchases: string
  purchaseReturnsTotal: string
  customField1: string
  customField2: string
  customField3: string
  customField4: string
  customField5: string
  customField6: string
  customField7: string
  customField8: string
  customField9: string
  customField10: string
}

const columns = [
  { key: "action", label: "خيار", sortable: false },
  { key: "contactId", label: "معرف الاتصال", sortable: true },
  { key: "name", label: "الإسم", sortable: true },
  { key: "businessName", label: "اسم النشاط", sortable: true },
  { key: "email", label: "البريد الإلكتروني", sortable: true },
  { key: "taxNumber", label: "الرقم الضريبي", sortable: true },
  { key: "paymentPeriod", label: "فترة الدفع", sortable: true },
  { key: "openingBalance", label: "الرصيد الافتتاحي", sortable: true },
  { key: "previousBalance", label: "الرصيد المسبق", sortable: true },
  { key: "addedOn", label: "وأضاف في", sortable: true },
  { key: "address", label: "العنوان", sortable: true },
  { key: "mobile", label: "الموبايل", sortable: true },
  { key: "unpaidPurchases", label: "مجموع المشتريات غير المدفوعة", sortable: true },
  { key: "purchaseReturnsTotal", label: "اجمالى مستحق مرتجع المشتريات", sortable: true },
  { key: "customField1", label: "حقل مخصص 1", sortable: true },
  { key: "customField2", label: "حقل مخصص", sortable: true },
  { key: "customField3", label: "حقل مخصص 3", sortable: true },
  { key: "customField4", label: "حقل مخصص 4", sortable: true },
  { key: "customField5", label: "حقل مخصص 5", sortable: true },
  { key: "customField6", label: "حقل مخصص 6", sortable: true },
  { key: "customField7", label: "حقل مخصص 7", sortable: true },
  { key: "customField8", label: "حقل مخصص 8", sortable: true },
  { key: "customField9", label: "حقل مخصص 9", sortable: true },
  { key: "customField10", label: "حقل مخصص 10", sortable: true },
]

export default function SuppliersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState(25)
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    Object.fromEntries(columns.map((col) => [col.key, true])),
  )
  const [showColumnVisibility, setShowColumnVisibility] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Filter states
  const [filterPaymentDue, setFilterPaymentDue] = useState(false)
  const [filterPurchaseReturns, setFilterPurchaseReturns] = useState(false)
  const [filterPreviousBalance, setFilterPreviousBalance] = useState(false)
  const [filterOpeningBalance, setFilterOpeningBalance] = useState(false)
  const [filterStatus, setFilterStatus] = useState("لا احد")
  const [filterAssignedTo, setFilterAssignedTo] = useState("لا احد")

  // Sample data - empty for now
  const suppliers: Supplier[] = []

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const exportToCSV = () => {
    const headers = columns.filter((col) => visibleColumns[col.key] && col.key !== "action").map((col) => col.label)
    const csvContent = "\uFEFF" + headers.join(",") + "\n"
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "suppliers.csv"
    link.click()
  }

  const exportToExcel = () => {
    const headers = columns.filter((col) => visibleColumns[col.key] && col.key !== "action").map((col) => col.label)
    let tableHtml =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>الموردين</x:Name><x:WorksheetOptions><x:DisplayRightToLeft/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table dir="rtl">'
    tableHtml += "<tr>" + headers.map((h) => `<th>${h}</th>`).join("") + "</tr>"
    tableHtml += "</table></body></html>"
    const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "suppliers.xls"
    link.click()
  }

  const handlePrint = () => {
    const headers = columns.filter((col) => visibleColumns[col.key] && col.key !== "action").map((col) => col.label)
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>الموردين</title>
            <style>
              body { font-family: 'Noto Sans Arabic', Arial, sans-serif; direction: rtl; padding: 20px; }
              h1 { text-align: center; color: #1e3a5f; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
              th { background-color: #f8f9fa; font-weight: bold; }
              .print-date { text-align: left; color: #666; font-size: 12px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="print-date">تاريخ الطباعة: ${new Date().toLocaleDateString("ar-EG")}</div>
            <h1>الموردين</h1>
            <table>
              <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
              <tbody><tr><td colspan="${headers.length}" style="text-align: center;">لا توجد بيانات متاحة في الجدول</td></tr></tbody>
            </table>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex">
        <main className="flex-1 p-6">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">الموردين</h1>
              <p className="text-sm text-gray-500">إدارة contacts: الخاص بك</p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-lg border border-gray-200 mb-4">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="w-full flex items-center justify-end gap-2 p-4 text-blue-600 hover:bg-gray-50"
            >
              <span className="font-medium">التصفية</span>
              <Filter className="w-5 h-5" />
            </button>

            {filterOpen && (
              <div className="border-t border-gray-200 p-6">
                {/* Checkboxes Row */}
                <div className="flex flex-wrap gap-8 mb-6 justify-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-gray-700">الرصيد الافتتاحي</span>
                    <input
                      type="checkbox"
                      checked={filterOpeningBalance}
                      onChange={(e) => setFilterOpeningBalance(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-gray-700">الرصيد المسبق</span>
                    <input
                      type="checkbox"
                      checked={filterPreviousBalance}
                      onChange={(e) => setFilterPreviousBalance(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-gray-700">مرتجع مشتريات</span>
                    <input
                      type="checkbox"
                      checked={filterPurchaseReturns}
                      onChange={(e) => setFilterPurchaseReturns(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-gray-700">مستحق دفع المشتريات</span>
                    <input
                      type="checkbox"
                      checked={filterPaymentDue}
                      onChange={(e) => setFilterPaymentDue(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </label>
                </div>

                {/* Dropdowns Row */}
                <div className="flex flex-wrap gap-8 justify-end">
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-sm">الحالة:</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-gray-300 rounded-md px-4 py-2 min-w-[200px] text-right"
                    >
                      <option value="لا احد">لا احد</option>
                      <option value="نشط">نشط</option>
                      <option value="غير نشط">غير نشط</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-sm">Assigned to:</label>
                    <select
                      value={filterAssignedTo}
                      onChange={(e) => setFilterAssignedTo(e.target.value)}
                      className="border border-gray-300 rounded-md px-4 py-2 min-w-[200px] text-right"
                    >
                      <option value="لا احد">لا احد</option>
                      <option value="محمد مجدى محمد مجدى محمد مجدى">محمد مجدى محمد مجدى محمد مجدى</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
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
              <span className="text-gray-600 text-sm">كل contacts: الخاص بك</span>
            </div>

            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
              {/* Left side - Search */}
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="بحث ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 text-right"
                />
              </div>

              {/* Right side - Action buttons and entries */}
              <div className="flex items-center gap-3">
                {/* Column Visibility */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowColumnVisibility(!showColumnVisibility)}
                    className="flex items-center gap-1"
                  >
                    <Columns className="w-4 h-4" />
                    رؤية العمود
                  </Button>
                  {showColumnVisibility && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 min-w-[200px] max-h-[300px] overflow-y-auto">
                      {columns.map((col) => (
                        <label key={col.key} className="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={visibleColumns[col.key]}
                            onChange={() => toggleColumnVisibility(col.key)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <span className="text-sm text-gray-700">{col.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <Printer className="w-4 h-4" />
                  طباعة
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToExcel}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  تصدير إلى Excel
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  className="flex items-center gap-1 bg-transparent"
                >
                  <FileText className="w-4 h-4" />
                  تصدير إلى CSV
                </Button>

                {/* Entries per page */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">إدخالات</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={500}>500</option>
                    <option value={1000}>1000</option>
                    <option value={-1}>الكل</option>
                  </select>
                  <span className="text-sm text-gray-600">عرض</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {columns
                      .filter((col) => visibleColumns[col.key])
                      .map((col) => (
                        <th
                          key={col.key}
                          className="px-4 py-3 text-right text-sm font-medium text-gray-700 whitespace-nowrap"
                        >
                          <div className="flex items-center justify-end gap-1">
                            {col.label}
                            {col.sortable && (
                              <div className="flex flex-col">
                                <ChevronUp className="w-3 h-3 text-gray-400" />
                                <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {suppliers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={columns.filter((col) => visibleColumns[col.key]).length}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        لا توجد بيانات متاحة في الجدول
                      </td>
                    </tr>
                  ) : (
                    suppliers.map((supplier) => (
                      <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50">
                        {visibleColumns.action && (
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                        {/* Add other columns as needed */}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-200">
              <div className="h-full bg-gradient-to-l from-gray-400 to-green-500 w-3/4"></div>
            </div>

            {/* Totals Row */}
            <div className="overflow-x-auto bg-gray-100">
              <table className="w-full min-w-max">
                <tbody>
                  <tr>
                    {columns
                      .filter((col) => visibleColumns[col.key])
                      .map((col, index) => (
                        <td key={col.key} className="px-4 py-3 text-right text-sm whitespace-nowrap">
                          {col.key === "unpaidPurchases" || col.key === "purchaseReturnsTotal" ? (
                            <span className="font-medium">L.E 0.00</span>
                          ) : col.key === "address" ? (
                            <span className="font-medium">المجموع:</span>
                          ) : (
                            ""
                          )}
                        </td>
                      ))}
                  </tr>
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
              <span className="text-sm text-gray-600">عرض 0 إلى 0 من 0 إدخالات</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Daftar | Cloud ERP, Accounting, Sales, Inventory Software - <span className="text-blue-600">V6.9</span> |
            Copyright © 2025 All rights reserved.
          </div>
        </main>

        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Add Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-red-500 text-white p-4 flex items-center justify-between rounded-t-lg">
              <button onClick={() => setShowAddModal(false)} className="text-white hover:text-gray-200">
                ×
              </button>
              <h2 className="text-lg font-semibold">إضافة مورد</h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Row 1: Title, Name, Second Name */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1 text-right">الإسم الثانى:</label>
                  <Input placeholder="الإسم الثانى" className="text-right" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1 text-right">الاسم:*</label>
                  <Input placeholder="الاسم" className="text-right" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1 text-right">اللقب:</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-right">
                    <option value="السيد ال">السيد ال</option>
                    <option value="السيدة">السيدة</option>
                    <option value="الآنسة">الآنسة</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Email, Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1 text-right">رقم الاتصال:</label>
                  <Input placeholder="رقم الاتصال" className="text-right" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1 text-right">البريد الإلكتروني:</label>
                  <Input placeholder="البريد الإلكتروني" className="text-right" type="email" />
                </div>
              </div>

              {/* Row 3: Tax Number */}
              <div>
                <label className="block text-sm text-gray-700 mb-1 text-right">الرقم الضريبي:</label>
                <Input placeholder="الرقم الضريبي" className="text-right" />
              </div>

              {/* Row 4: Opening Balance */}
              <div>
                <label className="block text-sm text-gray-700 mb-1 text-right">الرصيد الافتتاحي:</label>
                <Input placeholder="الرصيد الافتتاحي" className="text-right" type="number" />
              </div>

              {/* Row 5: Payment Period */}
              <div>
                <label className="block text-sm text-gray-700 mb-1 text-right">فترة الدفع:</label>
                <Input placeholder="فترة الدفع (بالأيام)" className="text-right" type="number" />
              </div>

              {/* Row 6: Address */}
              <div>
                <label className="block text-sm text-gray-700 mb-1 text-right">العنوان:</label>
                <textarea
                  placeholder="العنوان"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-right min-h-[80px] resize-y"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 flex items-center gap-3">
              <Button onClick={() => setShowAddModal(false)} className="bg-gray-800 hover:bg-gray-900 text-white">
                إغلاق
              </Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white">حفظ</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
