"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Download,
  FileSpreadsheet,
  Printer,
  Eye,
  Filter,
  Edit,
  Trash2,
  Search,
  Key,
  ArrowUpDown,
  Users,
} from "lucide-react"

interface User {
  id: number
  username: string
  name: string
  role: string
  email: string
}

export default function UsersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [users, setUsers] = useState<User[]>([
    { id: 1, username: "admin", name: "محمد مجدى", role: "مدير", email: "admin@edoxo.com" },
  ])
  const [entriesPerPage, setEntriesPerPage] = useState("25")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({ username: "", name: "", role: "كاشير", email: "", password: "" })

  const handleAddUser = () => {
    if (newUser.username && newUser.name && newUser.email) {
      setUsers([...users, { ...newUser, id: users.length + 1 }])
      setNewUser({ username: "", name: "", role: "كاشير", email: "", password: "" })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <span className="text-blue-600">المستخدمين</span>
          </div>

          {/* Page Title */}
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">المستخدمين</h1>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">المستخدمين</h2>
                <p className="text-sm text-gray-500">جميع المستخدمين</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>اسم المستخدم</Label>
                      <Input
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        placeholder="اسم المستخدم"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الإسم</Label>
                      <Input
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="الإسم الكامل"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>البريد الإلكتروني</Label>
                      <Input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="البريد الإلكتروني"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>كلمة المرور</Label>
                      <Input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="كلمة المرور"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الصلاحية</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="مدير">مدير</SelectItem>
                          <SelectItem value="كاشير">كاشير</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddUser} className="w-full bg-blue-600 hover:bg-blue-700">
                      إضافة المستخدم
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
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
                <Button variant="outline" size="sm" className="text-xs gap-1 bg-transparent">
                  <Filter className="w-3 h-3" />
                  فلتر العمود
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

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b text-right">
                    <th className="p-3 font-medium text-gray-600">
                      <div className="flex items-center gap-1 justify-end">
                        المستخدم
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-3 font-medium text-gray-600">
                      <div className="flex items-center gap-1 justify-end">
                        الإسم
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-3 font-medium text-gray-600">
                      <div className="flex items-center gap-1 justify-end">
                        الصلاحية
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-3 font-medium text-gray-600">
                      <div className="flex items-center gap-1 justify-end">
                        البريد الإلكتروني
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-3 font-medium text-gray-600">خيارات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{user.username}</td>
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{user.role}</span>
                        </td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-600 hover:bg-blue-50">
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-green-600 hover:bg-green-50">
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-amber-600 hover:bg-amber-50">
                              <Key className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">
                        لا توجد بيانات متاحة فى الجدول
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded hover:bg-gray-50">السابق</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-50">التالى</button>
              </div>
              <span>
                عرض 1 إلى {filteredUsers.length} من {filteredUsers.length} إدخالات
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
