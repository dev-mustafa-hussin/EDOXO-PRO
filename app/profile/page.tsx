"use client";

import { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, User, Mail, Lock } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [profitOpen, setProfitOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await api.get("/auth/user");
      setFormData((prev) => ({
        ...prev,
        name: response.data.name,
        email: response.data.email,
        password: "",
        password_confirmation: "",
      }));
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
      await api.post("/auth/profile", {
        name: formData.name,
        email: formData.email,
        ...(formData.password
          ? {
              password: formData.password,
              password_confirmation: formData.password_confirmation,
            }
          : {}),
      });

      setSuccess("تم تحديث الملف الشخصي بنجاح");
      // Refresh user data (if needed, e.g. update header)
      window.location.reload();
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

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenCalculator={() => setCalculatorOpen(true)}
        onOpenProfit={() => setProfitOpen(true)}
      />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">الملف الشخصي</h1>

            <Card>
              <CardHeader>
                <CardTitle>تعديل البيانات الشخصية</CardTitle>
                <CardDescription>
                  يمكنك تعديل اسمك، بريدك الإلكتروني، وتغيير كلمة المرور من هنا.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin w-8 h-8 text-primary" />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                          <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="pr-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="pr-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6 mt-6">
                      <h3 className="text-lg font-medium mb-4 text-gray-800">
                        تغيير كلمة المرور
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        اترك الحقول فارغة إذا كنت لا تريد تغيير كلمة المرور.
                      </p>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="password">كلمة المرور الجديدة</Label>
                          <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="password"
                              type="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="pr-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password_confirmation">
                            تأكيد كلمة المرور
                          </Label>
                          <div className="relative">
                            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="password_confirmation"
                              type="password"
                              value={formData.password_confirmation}
                              onChange={handleChange}
                              className="pr-10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={saving} className="w-32">
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            حفظ...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            حفظ التعديلات
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
