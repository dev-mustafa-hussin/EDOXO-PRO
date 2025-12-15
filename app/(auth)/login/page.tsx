"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Helper to render input with icon (RTL supported)
  const InputWithIcon = ({ icon: Icon, ...props }: any) => (
    <div className="relative">
      <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Icon className="w-4 h-4" />
      </div>
      <Input {...props} className={cn("pr-10 text-right", props.className)} />
    </div>
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        remember_me: rememberMe,
      });

      const token = response.data.access_token || response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        router.push("/"); // Redirect to dashboard
      } else {
        setError("فشل في استرداد رمز الدخول من الخادم.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("بيانات الدخول غير صحيحة أو حدث خطأ في الخادم.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4"
      dir="rtl"
    >
      {/* Brand Header */}
      <div className="absolute top-8 left-0 right-0 text-center">
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          EDOXO PRO
        </h1>
        <p className="text-gray-500 mt-2">نظام إدارة موارد المؤسسات المتكامل</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-none mt-16">
        <CardHeader className="space-y-4 text-center bg-white border-b pb-6">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              تسجيل الدخول
            </CardTitle>
            <p className="mt-2 text-sm text-gray-500">
              مرحباً بعودتك! الرجاء إدخال بيانات حسابك
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none">
                  {email.includes("@") ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <Input
                  id="email"
                  type="text"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 pr-10 text-right"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
              </div>
              <div className="relative">
                <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 pr-10 pl-10 text-right"
                />
                <button
                  type="button"
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(c) => setRememberMe(c as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  تذكرني
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline hover:text-primary/80"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium shadow-md transition-transform active:scale-95 bg-primary hover:bg-primary/90 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              دخول
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t p-6 bg-gray-50/50">
          <p className="text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              سجل الآن
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
