"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  Camera,
  Globe,
  Bell,
  Shield,
  Settings,
  Key,
  Save,
  Loader2,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "../../components/ui/switch";
import { Separator } from "../../components/ui/separator";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notifications, setNotifications] = useState([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    job_title: "",
    bio: "",
    current_password: "",
    password: "",
    password_confirmation: "",
    avatar: null as File | null,
    avatar_url: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [profitOpen, setProfitOpen] = useState(false);

  // Permissions Logic
  const [permissionsList, setPermissionsList] = useState([]);
  const [permissionForm, setPermissionForm] = useState({
    permission: "",
    reason: "",
  });
  const [permissionSaving, setPermissionSaving] = useState(false);

  const fetchPermissions = async () => {
    try {
      const res = await api.get("/permissions");
      setPermissionsList(res.data);
    } catch (error) {
      console.error("Error fetching permissions", error);
    }
  };

  const handlePermissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionForm.permission) return;

    try {
      setPermissionSaving(true);
      const res = await api.post("/permissions", permissionForm);

      if (res.data && Array.isArray(res.data.request)) {
        // rare case if api returns { request: [...] }
        setPermissionsList((prev): any => [...prev, ...res.data.request]);
      } else if (res.data && res.data.request) {
        setPermissionsList((prev): any => [...prev, res.data.request]);
      }

      setSuccess("تم إرسال طلب الصلاحية بنجاح");
      setPermissionForm({ permission: "", reason: "" });
    } catch (error) {
      console.error(error);
      setError("فشل إرسال الطلب");
    } finally {
      setPermissionSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPermissions();
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await api.get("/auth/user");
      const user = response.data;

      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        job_title: user.job_title || "",
        avatar_url: user.avatar_url || "",
      }));

      if (user.avatar_url) {
        setAvatarPreview(user.avatar_url);
      }
    } catch (err) {
      console.error(err);
      setError("فشل تحميل بيانات المستخدم");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    if (
      formData.password &&
      formData.password !== formData.password_confirmation
    ) {
      setError("كلمات المرور غير متطابقة");
      setSaving(false);
      return;
    }

    try {
      // Create FormData object for file upload
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);

      if (formData.phone) data.append("phone", formData.phone);
      if (formData.job_title) data.append("job_title", formData.job_title);
      if (formData.bio) data.append("bio", formData.bio);

      if (formData.password) {
        data.append("password", formData.password);
        data.append("password_confirmation", formData.password_confirmation);
      }

      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      // We need to send _method="PUT" or "POST" depending on how Laravel handles file upgrades.
      // Usually POST is safer for FormData handling in Laravel API.
      await api.post("/auth/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("تم تحديث الملف الشخصي بنجاح");

      // Clear password fields logic handled by not reloading them from state, but good to reset them
      setFormData((prev) => ({
        ...prev,
        password: "",
        password_confirmation: "",
      }));
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("حدث خطأ أثناء تحديث البيانات");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50" dir="rtl">
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenCalculator={() => setCalculatorOpen(true)}
        onOpenProfit={() => setProfitOpen(true)}
      />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                  الملف الشخصي
                </h1>
                <p className="text-gray-500 mt-1">
                  إدارة بيانات حسابك وإعدادات الأمان
                </p>
              </div>
            </div>

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
                <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
                <TabsTrigger value="security">الأمان</TabsTrigger>
                <TabsTrigger value="settings">الإعدادات</TabsTrigger>
                <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
                <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
              </TabsList>

              {/* TAB 1: PERSONAL INFO */}
              <TabsContent value="personal" className="mt-6">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>المعلومات الأساسية</CardTitle>
                    <CardDescription>
                      قم بتحديث صورتك الشخصية وبيانات التواصل الخاصة بك.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-4">
                          <div
                            className="relative group cursor-pointer"
                            onClick={triggerFileInput}
                          >
                            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                              <AvatarImage
                                src={avatarPreview}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                                {formData.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="w-8 h-8 text-white" />
                            </div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </div>
                          <p className="text-xs text-gray-500 text-center max-w-[150px]">
                            اضغط لتغيير الصورة (JPG, PNG) بحد أقصى 2MB
                          </p>
                        </div>

                        {/* Fields Section */}
                        <div className="flex-1 space-y-6">
                          {error && (
                            <Alert variant="destructive">
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}
                          {success && (
                            <Alert className="bg-green-50 text-green-700 border-green-200">
                              <AlertDescription>{success}</AlertDescription>
                            </Alert>
                          )}

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="name">الاسم بالكامل</Label>
                              <div className="relative">
                                <User className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                  id="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  className="pr-10"
                                  placeholder="الاسم الثلاثي"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="job_title">المسمى الوظيفي</Label>
                              <div className="relative">
                                <Briefcase className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                  id="job_title"
                                  value={formData.job_title}
                                  onChange={handleChange}
                                  className="pr-10"
                                  placeholder="مثال: مدير مبيعات"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">البريد الإلكتروني</Label>
                              <div className="relative">
                                <Mail className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                  id="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  dir="ltr"
                                  className={cn("pr-10 text-right")}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phone">رقم الهاتف</Label>
                              <div className="relative">
                                <Phone className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                  id="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                  placeholder="01xxxxxxxxx"
                                  dir="ltr"
                                  className={cn("pr-10 text-right")}
                                />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <Label htmlFor="bio">نبذة عني (Bio)</Label>
                              <div className="relative">
                                <textarea
                                  id="bio"
                                  value={formData.bio}
                                  onChange={(e: any) =>
                                    setFormData({
                                      ...formData,
                                      bio: e.target.value,
                                    })
                                  }
                                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder="اكتب نبذة مختصرة عنك..."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end pt-4">
                            <Button
                              type="submit"
                              disabled={saving}
                              className="min-w-[140px]"
                            >
                              {saving && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              {!saving && <Save className="mr-2 h-4 w-4" />}
                              حفظ التغييرات
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 2: SECURITY */}
              <TabsContent value="security" className="mt-6">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>تغيير كلمة المرور</CardTitle>
                    <CardDescription>
                      لضمان أمان حسابك، استخدم كلمة مرور قوية تحتوي على أرقام
                      وحروف.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleSubmit}
                      className="max-w-md space-y-4"
                    >
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                      {success && (
                        <Alert className="bg-green-50 text-green-700 border-green-200">
                          <AlertDescription>{success}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="password">كلمة المرور الجديدة</Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="pr-10"
                            placeholder="********"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password_confirmation">
                          تأكيد كلمة المرور
                        </Label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            id="password_confirmation"
                            type="password"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="pr-10"
                            placeholder="********"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          variant="destructive"
                          disabled={saving}
                        >
                          {saving && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          تحديث كلمة المرور
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 3: SETTINGS */}
              <TabsContent value="settings" className="mt-6">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>إعدادات التطبيق</CardTitle>
                    <CardDescription>
                      تخصيص تجربة الاستخدام الخاصة بك.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium dark:text-gray-200">
                            لغة التطبيق
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            اختر اللغة المفضلة للواجهة
                          </p>
                        </div>
                      </div>
                      <select className="border rounded-md px-3 py-1 text-sm bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300">
                        <option>العربية</option>
                        <option>English</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-full dark:bg-purple-900/20 dark:text-purple-400">
                          {theme === "dark" ? (
                            <Moon className="w-5 h-5" />
                          ) : (
                            <Sun className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium dark:text-gray-200">
                            المظهر
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            التبديل بين الوضع الليلي والنهاري
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Switch
                          checked={theme === "dark"}
                          onCheckedChange={(checked) =>
                            setTheme(checked ? "dark" : "light")
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-yellow-50 text-yellow-600 rounded-full">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">الإشعارات</p>
                          <p className="text-sm text-gray-500">
                            تفعيل/تعطيل التنبيهات المهمة
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-sm text-green-600 font-medium">
                          مفعل
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 5: NOTIFICATIONS */}
              <TabsContent value="notifications" className="mt-6">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>الإشعارات</CardTitle>
                    <CardDescription>
                      آخر التحديثات والتنبيهات الخاصة بحسابك.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 dark:bg-gray-800">
                          <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          لا توجد إشعارات جديدة
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notifications.map((notification: any) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                              notification.read_at
                                ? "bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700"
                                : "bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-800"
                            )}
                          >
                            <div
                              className={cn(
                                "p-2 rounded-full mt-1",
                                notification.read_at
                                  ? "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                  : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              )}
                            >
                              <Bell className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4
                                  className={cn(
                                    "font-medium",
                                    notification.read_at
                                      ? "text-gray-900 dark:text-gray-100"
                                      : "text-blue-900 dark:text-blue-100"
                                  )}
                                >
                                  {notification.data?.title || "إشعار جديد"}
                                </h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(
                                    notification.created_at
                                  ).toLocaleDateString("ar-EG")}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {notification.data?.message ||
                                  notification.data?.body ||
                                  "تفاصيل الإشعار..."}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TAB 4: PERMISSIONS */}
              <TabsContent value="permissions" className="mt-6">
                <div className="grid gap-6">
                  <Card className="border-none shadow-md">
                    <CardHeader>
                      <CardTitle>طلب صلاحية جديدة</CardTitle>
                      <CardDescription>
                        يمكنك طلب صلاحيات إضافية من مدير النظام.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={handlePermissionSubmit}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="permission">
                            اسم الصلاحية المطلوبة
                          </Label>
                          <Input
                            id="permission"
                            value={permissionForm.permission}
                            onChange={(e) =>
                              setPermissionForm({
                                ...permissionForm,
                                permission: e.target.value,
                              })
                            }
                            placeholder="مثال: حذف فواتير, إضافة منتجات"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reason">السبب</Label>
                          <Input
                            id="reason"
                            value={permissionForm.reason}
                            onChange={(e) =>
                              setPermissionForm({
                                ...permissionForm,
                                reason: e.target.value,
                              })
                            }
                            placeholder="لماذا تحتاج هذه الصلاحية؟"
                          />
                        </div>
                        <div className="pt-2">
                          <Button type="submit" disabled={permissionSaving}>
                            {permissionSaving ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            إرسال الطلب
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-md">
                    <CardHeader>
                      <CardTitle>سجل الطلبات السابقة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {permissionsList.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                          لا توجد طلبات سابقة
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {Array.isArray(permissionsList) &&
                            permissionsList.map((req: any) => (
                              <div
                                key={req.id || Math.random()}
                                className="flex items-center justify-between p-4 border rounded-lg bg-white"
                              >
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {req.permission}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {req.reason}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {/* Use a simple persistent format or handle date on client to avoid mismatch */}
                                    <span suppressHydrationWarning>
                                      {new Date(
                                        req.created_at
                                      ).toLocaleDateString("ar-EG")}
                                    </span>
                                  </p>
                                </div>
                                <div>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      req.status === "approved"
                                        ? "bg-green-100 text-green-700"
                                        : req.status === "rejected"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                  >
                                    {req.status === "approved"
                                      ? "مقبول"
                                      : req.status === "rejected"
                                      ? "مرفوض"
                                      : "قيد الانتظار"}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
