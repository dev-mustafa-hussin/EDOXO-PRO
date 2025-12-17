"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Save, ArrowRight } from "lucide-react";
import { RoleService } from "@/services/role-service";
import { toast } from "sonner";

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const roleId = Number(params.id);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [permsData, roleData] = await Promise.all([
        RoleService.getAllPermissions(),
        RoleService.getById(roleId), // Assumes this method exists or we use show logic
      ]);

      setPermissions(permsData);
      setRoleName(roleData.name);

      // Map permissions object array to string array of names
      const rolePermNames = roleData.permissions.map((p: any) => p.name);
      setSelectedPermissions(rolePermNames);
    } catch (error) {
      console.error("Failed to load data", error);
      toast.error("فشل تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  // Utility to group permissions by module
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const parts = permission.name.split(" ");
    const module = parts[1] || "general";
    if (!acc[module]) acc[module] = [];
    acc[module].push(permission);
    return acc;
  }, {} as Record<string, any[]>);

  const handleCheckboxChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId)
      );
    }
  };

  const handleSelectAllModule = (module: string, allPerms: any[]) => {
    const allIds = allPerms.map((p) => p.name);
    const allChecked = allIds.every((id) => selectedPermissions.includes(id));

    if (allChecked) {
      setSelectedPermissions(
        selectedPermissions.filter((id) => !allIds.includes(id))
      );
    } else {
      const newIds = allIds.filter((id) => !selectedPermissions.includes(id));
      setSelectedPermissions([...selectedPermissions, ...newIds]);
    }
  };

  const handleSave = async () => {
    if (!roleName) {
      toast.error("يرجى إدخال اسم الصلاحية");
      return;
    }

    try {
      setIsSaving(true);
      await RoleService.update(roleId, {
        name: roleName,
        permissions: selectedPermissions,
      });
      toast.success("تم تحديث الصلاحية بنجاح");
      router.push("/user-management/roles");
    } catch (error) {
      console.error(error);
      toast.error("فشل حفظ التغييرات");
    } finally {
      setIsSaving(false);
    }
  };

  const moduleLabels: Record<string, string> = {
    users: "المستخدمين",
    products: "المنتجات",
    sales: "المبيعات",
    purchases: "المشتريات",
    suppliers: "الموردين",
    customers: "العملاء",
    reports: "التقارير",
    settings: "الإعدادات",
  };

  const actionLabels: Record<string, string> = {
    view: "عرض",
    create: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    export: "تصدير",
  };

  const getLabel = (permName: string) => {
    const parts = permName.split(" ");
    const action = parts[0];
    const module = parts[1];
    return `${actionLabels[action] || action} ${
      moduleLabels[module] || module
    }`;
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500"
        dir="rtl"
      >
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>الرئيسية</span>
            <span>/</span>
            <span>إدارة المستخدمين</span>
            <span>/</span>
            <span>الصلاحيات</span>
            <span>/</span>
            <span className="text-blue-600">تعديل صلاحية</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-800">
                تعديل صلاحية: {roleName}
              </h1>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/user-management/roles")}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              رجوع للصلاحيات
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-8">
              <Label className="text-base font-semibold text-gray-700 mb-2 block">
                اسم الصلاحية <span className="text-red-500">*</span>
              </Label>
              <Input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="أدخل اسم الصلاحية"
                className="max-w-md"
              />
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">
                الأذونات
              </h2>
            </div>

            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(
                ([module, modulePerms]) => (
                  <div
                    key={module}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-700">
                        {moduleLabels[module] || module}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleSelectAllModule(module, modulePerms)
                        }
                        className="text-xs"
                      >
                        {modulePerms.every((p) =>
                          selectedPermissions.includes(p.name)
                        )
                          ? "إلغاء تحديد الكل"
                          : "تحديد الكل"}
                      </Button>
                    </div>

                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {modulePerms.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            id={`perm_${permission.id}`}
                            checked={selectedPermissions.includes(
                              permission.name
                            )}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(
                                permission.name,
                                checked as boolean
                              )
                            }
                          />
                          <Label
                            htmlFor={`perm_${permission.id}`}
                            className="text-sm text-gray-600 cursor-pointer"
                          >
                            {getLabel(permission.name)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 gap-2 px-8"
                disabled={!roleName || isSaving}
              >
                {isSaving ? (
                  "جاري الحفظ..."
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
