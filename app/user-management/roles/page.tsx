"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Download, FileSpreadsheet, Printer, Edit, Trash2, Search, ArrowUpDown, Shield } from "lucide-react"

interface Role {
  id: number
  name: string
  description: string
}

export default function RolesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: "المدير", description: "صلاحيات كاملة للنظام" },
    { id: 2, name: "الكاشير", description: "صلاحيات نقطة البيع فقط" },
  ])
  const [entriesPerPage, setEntriesPerPage] = useState("25")
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const router = useRouter()

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (roleToDelete) {
      setRoles(roles.filter((role) => role.id !== roleToDelete.id))
      setRoleToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleEditRole = (roleId: number) => {
    router.push(`/user-management/roles/edit/${roleId}`)
  }

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const exportToCSV = () => {
    const headers = ["الصلاحيات", "الخيار"]
    const csvContent = [headers.join(","), ...filteredRoles.map((role) => `"${role.name}","${role.description}"`)].join(
      "\n",
    )

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "roles.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    const headers = ["الصلاحيات", "الخيار"]
    const tableContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>الصلاحيات</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>
      <body>
        <table dir="rtl">
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>
            ${filteredRoles.map((role) => `<tr><td>${role.name}</td><td>${role.description}</td></tr>`).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `

    const blob = new Blob([tableContent], { type: "application/vnd.ms-excel;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "roles.xls")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>الصلاحيات</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; direction: rtl; }
          h1 { text-align: center; color: #1e40af; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: right; }
          th { background-color: #f3f4f6; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .print-date { text-align: center; color: #666; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>الصلاحيات</h1>
        <p class="print-date">تاريخ الطباعة: ${new Date().toLocaleDateString("ar-EG")}</p>
        <table>
          <thead>
            <tr>
              <th>الصلاحيات</th>
              <th>الخيار</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRoles.map((role) => `<tr><td>${role.name}</td><td>${role.description}</td></tr>`).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>الرئيسية</span>
            <span>/</span>
            <span>إدارة المستخدمين</span>
            <span>/</span>
            <span className="text-blue-600">الصلاحيات</span>
          </div>

          {/* Page Title */}
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">الصلاحيات</h1>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">الصلاحيات</h2>
                <p className="text-sm text-gray-500">إدارة صلاحيات المستخدمين</p>
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 gap-2"
                onClick={() => router.push("/user-management/roles/add")}
              >
                <Plus className="w-4 h-4" />
                إضافة صلاحية
              </Button>
            </div>

            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1 bg-transparent" onClick={exportToCSV}>
                  <Download className="w-3 h-3" />
                  تصدير إلى CSV
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1 bg-transparent" onClick={exportToExcel}>
                  <FileSpreadsheet className="w-3 h-3" />
                  تصدير إلى Excel
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1 bg-transparent" onClick={handlePrint}>
                  <Printer className="w-3 h-3" />
                  طباعة
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">عرض</span>
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
                <span className="text-sm text-gray-600">إدخالات</span>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 mb-4 justify-end">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 w-64"
                />
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b text-right">
                    <th className="p-3 font-medium text-gray-600">
                      <div className="flex items-center gap-1 justify-end">
                        الصلاحيات
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-3 font-medium text-gray-600">
                      <div className="flex items-center gap-1 justify-end">
                        الخيار
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-3 font-medium text-gray-600">الخيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => (
                      <tr key={role.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{role.name}</span>
                        </td>
                        <td className="p-3 text-gray-700">{role.description}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                              onClick={() => handleEditRole(role.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteClick(role)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-gray-400">
                        لا توجد بيانات متاحة فى الجدول
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded hover:bg-gray-50">السابق</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-50">التالى</button>
              </div>
              <span>
                عرض 1 إلى {filteredRoles.length} من {filteredRoles.length} إدخالات
              </span>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تأكيد الحذف</DialogTitle>
            <DialogDescription className="text-right">
              هل أنت متأكد من حذف صلاحية "{roleToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button variant="destructive" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="w-4 h-4 ml-2" />
              نعم، احذف
            </Button>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
