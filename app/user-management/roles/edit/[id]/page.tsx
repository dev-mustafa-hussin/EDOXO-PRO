"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Save, ArrowRight } from "lucide-react"

interface PermissionSection {
  id: string
  title: string
  permissions: {
    id: string
    label: string
    checked: boolean
  }[]
}

// Mock data for roles
const mockRoles: { [key: number]: { name: string; permissions: string[] } } = {
  1: {
    name: "المدير",
    permissions: [
      "user_view",
      "user_add",
      "user_edit",
      "user_delete",
      "roles_view",
      "roles_add",
      "roles_edit",
      "roles_delete",
      "supplier_view_all",
      "supplier_add",
      "supplier_edit",
      "supplier_delete",
      "customer_view_all",
      "customer_add",
      "customer_edit",
      "customer_delete",
      "product_view",
      "product_add",
      "product_edit",
      "product_delete",
      "purchases_view_all",
      "purchases_add",
      "purchases_edit",
      "purchases_delete",
      "sales_view_all",
      "sales_add",
      "sales_update",
      "sales_delete",
      "pos_view",
      "pos_add",
      "pos_edit",
      "pos_delete",
      "reports_purchase_sales",
      "reports_profit_loss",
      "reports_stock",
      "settings_business",
      "settings_invoice",
      "home_view",
      "others_export",
    ],
  },
  2: {
    name: "الكاشير",
    permissions: [
      "pos_view",
      "pos_add",
      "pos_print_invoice",
      "sales_view_own",
      "sales_add",
      "customer_view_all",
      "product_view",
    ],
  },
}

export default function EditRolePage() {
  const router = useRouter()
  const params = useParams()
  const roleId = Number(params.id)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [roleName, setRoleName] = useState("")
  const [loading, setLoading] = useState(true)

  const [permissionSections, setPermissionSections] = useState<PermissionSection[]>([
    {
      id: "others",
      title: "آخرون",
      permissions: [
        {
          id: "others_export",
          label: "عرض التصدير إلى الأزرار (csv / excel / print / pdf) على الجداول",
          checked: false,
        },
      ],
    },
    {
      id: "user",
      title: "المستخدم",
      permissions: [
        { id: "user_view", label: "عرض المستخدم", checked: false },
        { id: "user_add", label: "إضافة مستخدم", checked: false },
        { id: "user_edit", label: "تعديل المستخدم", checked: false },
        { id: "user_delete", label: "حذف المستخدم", checked: false },
      ],
    },
    {
      id: "roles",
      title: "الصلاحيات",
      permissions: [
        { id: "roles_view", label: "عرض الصلاحية", checked: false },
        { id: "roles_add", label: "إضافة دور", checked: false },
        { id: "roles_edit", label: "تعديل الدور", checked: false },
        { id: "roles_delete", label: "حذف الصلاحية", checked: false },
      ],
    },
    {
      id: "supplier",
      title: "المورد",
      permissions: [
        { id: "supplier_view_all", label: "عرض كل الموردين", checked: false },
        { id: "supplier_view_own", label: "عرض المورد الخاص", checked: false },
        { id: "supplier_add", label: "إضافة مورد", checked: false },
        { id: "supplier_edit", label: "تعديل المورد", checked: false },
        { id: "supplier_delete", label: "حذف المورد", checked: false },
      ],
    },
    {
      id: "customer",
      title: "العميل",
      permissions: [
        { id: "customer_view_all", label: "عرض كل العملاء", checked: false },
        { id: "customer_view_own", label: "عرض العميل الخاص", checked: false },
        { id: "customer_add", label: "إضافة عميل", checked: false },
        { id: "customer_edit", label: "تعديل العميل", checked: false },
        { id: "customer_delete", label: "حذف العميل", checked: false },
      ],
    },
    {
      id: "product",
      title: "المنتج",
      permissions: [
        { id: "product_view", label: "عرض المنتج", checked: false },
        { id: "product_add", label: "إضافة منتج", checked: false },
        { id: "product_edit", label: "تعديل المنتج", checked: false },
        { id: "product_delete", label: "حذف المنتج", checked: false },
        { id: "product_opening_stock", label: "أضف مخزون الإفتتاح", checked: false },
        { id: "product_view_purchase_price", label: "عرض سعر الشراء", checked: false },
      ],
    },
    {
      id: "purchases",
      title: "المشتريات",
      permissions: [
        { id: "purchases_view_all", label: "عرض كل عمليات الشراء", checked: false },
        { id: "purchases_view_own", label: "عرض الشراء الخاص فقط", checked: false },
        { id: "purchases_add", label: "إضافة عملية شراء", checked: false },
        { id: "purchases_edit", label: "تعديل عملية شراء", checked: false },
        { id: "purchases_delete", label: "حذف عملية شراء", checked: false },
      ],
    },
    {
      id: "sales",
      title: "المبيعات",
      permissions: [
        { id: "sales_view_all", label: "عرض كل عمليات البيع", checked: false },
        { id: "sales_view_own", label: "عرض بيع الخاصة فقط", checked: false },
        { id: "sales_add", label: "إضافة بيع", checked: false },
        { id: "sales_update", label: "تحديث البيع", checked: false },
        { id: "sales_delete", label: "حذف البيع", checked: false },
      ],
    },
    {
      id: "pos",
      title: "نقطة بيع",
      permissions: [
        { id: "pos_view", label: "عرض المبيعات عبر نقطة البيع", checked: false },
        { id: "pos_add", label: "إضافة عملية بيع عبر نقطة البيع", checked: false },
        { id: "pos_edit", label: "تعديل عملية بيع عبر نقطة البيع", checked: false },
        { id: "pos_delete", label: "حذف عملية بيع عبر نقطة البيع", checked: false },
        { id: "pos_print_invoice", label: "طباعة الفاتورة", checked: false },
      ],
    },
    {
      id: "reports",
      title: "التقارير",
      permissions: [
        { id: "reports_purchase_sales", label: "عرض تقرير المشتريات والمبيعات", checked: false },
        { id: "reports_profit_loss", label: "عرض تقرير الأرباح والخسائر", checked: false },
        { id: "reports_stock", label: "عرض تقرير المخزون", checked: false },
      ],
    },
    {
      id: "settings",
      title: "الإعدادات",
      permissions: [
        { id: "settings_business", label: "الوصول إلى إعدادات النشاط التجاري", checked: false },
        { id: "settings_invoice", label: "الوصول إلى إعدادات الفواتير", checked: false },
      ],
    },
    {
      id: "home",
      title: "الصفحة الرئيسية",
      permissions: [{ id: "home_view", label: "عرض بيانات الصفحة الرئيسية", checked: false }],
    },
  ])

  // Load role data
  useEffect(() => {
    const roleData = mockRoles[roleId]
    if (roleData) {
      setRoleName(roleData.name)
      setPermissionSections((prev) =>
        prev.map((section) => ({
          ...section,
          permissions: section.permissions.map((perm) => ({
            ...perm,
            checked: roleData.permissions.includes(perm.id),
          })),
        })),
      )
    }
    setLoading(false)
  }, [roleId])

  const handlePermissionChange = (sectionId: string, permissionId: string, checked: boolean) => {
    setPermissionSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              permissions: section.permissions.map((perm) => (perm.id === permissionId ? { ...perm, checked } : perm)),
            }
          : section,
      ),
    )
  }

  const handleSelectAll = (sectionId: string) => {
    setPermissionSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              permissions: section.permissions.map((perm) => ({ ...perm, checked: true })),
            }
          : section,
      ),
    )
  }

  const handleSave = () => {
    const selectedPermissions = permissionSections.flatMap((section) =>
      section.permissions.filter((perm) => perm.checked).map((perm) => perm.id),
    )
    console.log("Updated role:", { id: roleId, name: roleName, permissions: selectedPermissions })
    router.push("/user-management/roles")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-gray-500">جاري التحميل...</div>
      </div>
    )
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
            <span>الصلاحيات</span>
            <span>/</span>
            <span className="text-blue-600">تعديل صلاحية</span>
          </div>

          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-800">تعديل صلاحية: {roleName}</h1>
            </div>
            <Button variant="outline" onClick={() => router.push("/user-management/roles")} className="gap-2">
              <ArrowRight className="w-4 h-4" />
              رجوع للصلاحيات
            </Button>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Role Name */}
            <div className="mb-6">
              <Label htmlFor="roleName" className="text-sm font-medium text-gray-700 mb-2 block">
                اسم الصلاحية <span className="text-red-500">*</span>
              </Label>
              <Input
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="أدخل اسم الصلاحية"
                className="max-w-md"
              />
            </div>

            {/* Permissions */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">الصلاحيات</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {permissionSections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-800">{section.title}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectAll(section.id)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        تحديد الكل
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {section.permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center gap-2">
                          <Checkbox
                            id={permission.id}
                            checked={permission.checked}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(section.id, permission.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={permission.id} className="text-sm text-gray-600 cursor-pointer">
                            {permission.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
