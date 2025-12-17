"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/auth-service";
import { toast } from "sonner";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("رابط إعادة التعيين غير صالح أو منتهي الصلاحية");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      toast.success("تم تغيير كلمة المرور بنجاح");
      router.push("/auth/login");
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.email ||
        error.response?.data?.message ||
        "فشل تغيير كلمة المرور";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          تعيين كلمة مرور جديدة
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          أدخل كلمة المرور الجديدة لحسابك
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!token && (
              <div
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative text-sm mb-4"
                role="alert"
              >
                <strong className="font-bold ml-1">تنبيه!</strong>
                <span className="block sm:inline">
                  رابط إعادة التعيين مفقود. يرجى التأكد من استخدام الرابط المرسل
                  لبريدك الإلكتروني.
                </span>
              </div>
            )}

            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!!emailParam}
                className={emailParam ? "bg-gray-100 cursor-not-allowed" : ""}
              />
            </div>

            <div>
              <Label htmlFor="password">كلمة المرور الجديدة</Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="password_confirmation">تأكيد كلمة المرور</Label>
              <div className="mt-1 relative">
                <Input
                  id="password_confirmation"
                  type="password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading || !token}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? "جاري التغيير..." : "تغيير كلمة المرور"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
