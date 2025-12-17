"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Key,
  ArrowUpDown,
  Users,
  Loader2,
  ShieldCheck,
  Store,
  Mail,
  User as UserIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { UserService, User } from "@/services/user-service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Components ---

const RoleBadge = ({ role }: { role: string }) => {
  const styles: Record<string, string> = {
    مدير: "bg-rose-100 text-rose-700 border-rose-200",
    كاشير: "bg-emerald-100 text-emerald-700 border-emerald-200",
    user: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const icons: Record<string, any> = {
    مدير: ShieldCheck,
    كاشير: Store,
    user: UserIcon,
  };

  const Icon = icons[role] || UserIcon;
  const style = styles[role] || styles["user"];

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium w-fit",
        style
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{role}</span>
    </div>
  );
};

export default function UsersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog States
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await UserService.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
      toast.error("فشل تحميل قائمة المستخدمين");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (data: any) => {
    try {
      setIsSubmitting(true);
      await UserService.create(data);
      toast.success("تم إضافة المستخدم بنجاح", {
        icon: <CheckCircle2 className="text-green-500" />,
      });
      setIsAddDialogOpen(false);
      loadUsers();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "فشل إضافة المستخدم";
      toast.error(msg, { icon: <XCircle className="text-red-500" /> });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (data: any) => {
    if (!editingUser) return;
    try {
      setIsSubmitting(true);
      await UserService.update(editingUser.id, data);
      toast.success("تم تحديث بيانات المستخدم بنجاح", {
        icon: <CheckCircle2 className="text-green-500" />,
      });
      setIsEditDialogOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.message ||
        "فشل تحديث البيانات، تأكد من صحة المدخلات";
      toast.error(msg, { icon: <XCircle className="text-red-500" /> });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (
      confirm("هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن تراجع عن هذا الإجراء.")
    ) {
      try {
        await UserService.delete(id);
        toast.success("تم حذف المستخدم");
        loadUsers();
      } catch (error) {
        toast.error("فشل حذف المستخدم");
      }
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50" dir="rtl">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>الرئيسية</span>
                <span className="text-gray-300">/</span>
                <span>إدارة المستخدمين</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Users className="w-7 h-7 text-indigo-600" />
                المستخدمين
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                إدارة حسابات المستخدمين وصلاحياتهم
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  placeholder="بحث عن مستخدم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-9 w-64 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-100 transition-all font-normal text-sm shadow-sm"
                />
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all active:scale-95">
                    <Plus className="w-4 h-4 ml-2" />
                    مستخدم جديد
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-none shadow-2xl"
                  dir="rtl"
                >
                  <div className="bg-gradient-to-l from-indigo-500 to-indigo-600 p-6 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl flex items-center gap-2 text-white">
                        <Plus className="w-5 h-5" />
                        إضافة مستخدم جديد
                      </DialogTitle>
                      <p className="text-indigo-100 text-sm opacity-90">
                        املأ البيانات التالية لإنشاء حساب جديد
                      </p>
                    </DialogHeader>
                  </div>
                  <div className="p-6">
                    <UserForm
                      onSubmit={handleAddUser}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-600">
                  <tr>
                    <th className="p-4 font-semibold w-16 text-center">#</th>
                    <th className="p-4 font-semibold">المستخدم</th>
                    <th className="p-4 font-semibold">البريد الإلكتروني</th>
                    <th className="p-4 font-semibold">الصلاحية</th>

                    <th className="p-4 font-semibold text-left pl-6">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                          <span>جاري تحميل البيانات...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-indigo-50/30 transition-colors group"
                      >
                        <td className="p-4 text-center font-mono text-gray-400">
                          #{user.id}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-400 hidden sm:block md:hidden">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 font-medium font-mono text-xs md:text-sm">
                          {user.email}
                        </td>
                        <td className="p-4">
                          <RoleBadge role={user.role || "user"} />
                        </td>

                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full"
                              onClick={() => openEditDialog(user)}
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-full"
                              title="تغيير كلمة المرور"
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                              onClick={() => handleDeleteUser(user.id)}
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-12 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="w-6 h-6 text-gray-300" />
                          </div>
                          <p>لا توجد نتائج مطابقة للبحث</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400 px-2">
            <span>إجمالي السجلات: {filteredUsers.length}</span>
            <span>آخر تحديث: {new Date().toLocaleTimeString("ar-EG")}</span>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent
              className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-none shadow-2xl"
              dir="rtl"
            >
              <div className="bg-gradient-to-l from-indigo-600 to-violet-600 p-6 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl flex items-center gap-2 text-white">
                    <Edit className="w-5 h-5" />
                    تعديل بيانات المستخدم
                  </DialogTitle>
                  <p className="text-indigo-100 text-sm opacity-90">
                    تحديث المعلومات الشخصية والصلاحيات
                  </p>
                </DialogHeader>
              </div>
              <div className="p-6">
                <UserForm
                  initialData={editingUser}
                  onSubmit={handleUpdateUser}
                  isSubmitting={isSubmitting}
                  isEdit
                />
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}

// Sub-component for form to keep main clean
function UserForm({
  initialData,
  onSubmit,
  isSubmitting,
  isEdit = false,
}: any) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    role: initialData?.role || "كاشير",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast.error("يرجى ملء كافة الحقول الأساسية");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-500">
            الإسم الكامل
          </Label>
          <div className="relative">
            <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="مثال: أحمد محمد"
              className="pr-10 focus:border-indigo-500 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-500">
            البريد الإلكتروني
          </Label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="example@domain.com"
              className="pr-10 focus:border-indigo-500 focus:ring-indigo-100"
              dir="ltr"
              style={{ textAlign: "right" }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-500">
            كلمة المرور
            {isEdit && (
              <span className="text-amber-500 text-[10px] mr-2 font-normal">
                (اتركها فارغة للإبقاء على الحالية)
              </span>
            )}
          </Label>
          <div className="relative">
            <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              className="pr-10 focus:border-indigo-500 focus:ring-indigo-100"
              dir="ltr"
              style={{ textAlign: "right" }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-gray-500">
            نوع الصلاحية
          </Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger className="focus:ring-indigo-100 focus:border-indigo-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="مدير">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  <span>مدير النظام</span>
                  <span className="text-xs text-gray-400 mr-auto">
                    (كامل الصلاحيات)
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="كاشير">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-500" />
                  <span>كاشير / بائع</span>
                  <span className="text-xs text-gray-400 mr-auto">
                    (مبيعات فقط)
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-2">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn(
            "w-full h-11 text-base font-medium transition-all",
            isEdit
              ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
          )}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin ml-2" />
          ) : isEdit ? (
            "حفظ التغييرات"
          ) : (
            "إضافة المستخدم"
          )}
        </Button>
      </div>
    </div>
  );
}
