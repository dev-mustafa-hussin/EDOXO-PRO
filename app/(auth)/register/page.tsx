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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Step 1: Business Details
    businessName: "",
    startDate: new Date().toISOString().split("T")[0],
    currency: "EGP",
    website: "",
    mobile: "",
    country: "Egypt",
    city: "",
    state: "",
    zipCode: "",

    // Step 2: Tax & Settings
    taxName1: "",
    taxNumber1: "",
    taxName2: "",
    taxNumber2: "",
    fyStartDate: new Date().getFullYear() + "-01-01",
    accountingMethod: "fifo",

    // Step 3: Owner Details
    prefix: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string, id: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, terms: checked });
  };

  const validateStep = (currentStep: number) => {
    setError("");
    if (currentStep === 1) {
      if (!formData.businessName) return "اسم النشاط مطلوب";
      if (!formData.currency) return "العملة مطلوبة";
    }
    if (currentStep === 2) {
      if (!formData.fyStartDate) return "تاريخ بداية السنة المالية مطلوب";
    }
    if (currentStep === 3) {
      if (!formData.firstName || !formData.lastName)
        return "الاسم بالكامل مطلوب";
      if (!formData.username) return "اسم المستخدم مطلوب";
      if (!formData.email) return "البريد الإلكتروني مطلوب";
      if (!formData.password) return "كلمة المرور مطلوبة";
      if (formData.password !== formData.password_confirmation) {
        return "كلمات المرور غير متطابقة";
      }
      if (!formData.terms) return "يجب الموافقة على الشروط والأحكام";
    }
    return null;
  };

  const nextStep = () => {
    const errorMsg = validateStep(step);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleRegister = async () => {
    const errorMsg = validateStep(3);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        // The backend currently might not accept extra fields, but we send them for completeness based on request
        // Ideally backend should be updated to handle tenants/business setup
        business_name: formData.businessName,
      };

      await api.post("/auth/register", payload);
      router.push("/login?registered=true");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("فشل التسجيل. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
      dir="rtl"
    >
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          EDOXO PRO
        </h1>
        <p className="text-gray-500 mt-2">نظام إدارة موارد المؤسسات المتكامل</p>
      </div>

      <Card className="w-full max-w-4xl shadow-xl border-none">
        <CardHeader className="bg-white border-b pb-6">
          <div className="flex items-center justify-between px-4">
            <CardTitle className="text-2xl font-bold text-gray-800">
              تسجيل نشاط جديد
            </CardTitle>
            <div className="text-sm text-gray-500">خطوة {step} من 3</div>
          </div>

          {/* Stepper */}
          <div className="mt-8 flex items-center justify-center w-full">
            <div className="flex items-center w-full max-w-2xl px-4 relative">
              {/* Progress Bar Background */}
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-0" />
              {/* Active Progress Bar */}
              <div
                className="absolute top-5 right-0 h-1 bg-primary transition-all duration-300 z-0"
                style={{
                  width: step === 1 ? "16%" : step === 2 ? "50%" : "100%",
                }} // Approximation for RTL
              />

              {/* Step 1 */}
              <div className="flex-1 flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all bg-white",
                    step >= 1
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-400",
                    step > 1 && "bg-primary text-white border-primary"
                  )}
                >
                  {step > 1 ? <CheckCircle2 className="w-6 h-6" /> : "1"}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium mt-2",
                    step >= 1 ? "text-primary" : "text-gray-400"
                  )}
                >
                  تفاصيل النشاط
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex-1 flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all bg-white",
                    step >= 2
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-400",
                    step > 2 && "bg-primary text-white border-primary"
                  )}
                >
                  {step > 2 ? <CheckCircle2 className="w-6 h-6" /> : "2"}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium mt-2",
                    step >= 2 ? "text-primary" : "text-gray-400"
                  )}
                >
                  الضرائب والإعدادات
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex-1 flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all bg-white",
                    step >= 3
                      ? "border-primary text-primary"
                      : "border-gray-300 text-gray-400"
                  )}
                >
                  3
                </div>
                <span
                  className={cn(
                    "text-xs font-medium mt-2",
                    step >= 3 ? "text-primary" : "text-gray-400"
                  )}
                >
                  بيانات المالك
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 pt-10 min-h-[400px]">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* STEP 1: BUSINESS DETAILS */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="businessName">
                  اسم النشاط <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="مثال: شركة النور للتجارة"
                />
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="startDate">تاريخ البدء</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>
                  العملة <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(val) => handleSelectChange(val, "currency")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EGP">جنيه مصري (EGP)</SelectItem>
                    <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                    <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label htmlFor="logo">شعار النشاط</Label>
                <Input
                  id="logo"
                  type="file"
                  className="cursor-pointer file:text-primary file:bg-primary/10 file:rounded-md file:border-0 file:px-2 file:py-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">موقع الكتروني</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">رقم الموبايل</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">الدولة</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">المدينة</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* STEP 2: TAX & SETTINGS */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="col-span-2">
                <h3 className="text-lg font-semibold mb-2 border-b pb-2 text-primary">
                  البيانات الضريبية
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxName1">الاسم الضريبي 1</Label>
                <Input
                  id="taxName1"
                  value={formData.taxName1}
                  onChange={handleChange}
                  placeholder="مثل: ضريبة القيمة المضافة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxNumber1">الرقم الضريبي 1</Label>
                <Input
                  id="taxNumber1"
                  value={formData.taxNumber1}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxName2">الاسم الضريبي 2</Label>
                <Input
                  id="taxName2"
                  value={formData.taxName2}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxNumber2">الرقم الضريبي 2</Label>
                <Input
                  id="taxNumber2"
                  value={formData.taxNumber2}
                  onChange={handleChange}
                />
              </div>

              <div className="col-span-2 mt-4">
                <h3 className="text-lg font-semibold mb-2 border-b pb-2 text-primary">
                  إعدادات النظام
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fyStartDate">
                  تاريخ بداية السنة المالية{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fyStartDate"
                  type="date"
                  value={formData.fyStartDate}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  طريقة المحاسبة للمخزون <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.accountingMethod}
                  onValueChange={(val) =>
                    handleSelectChange(val, "accountingMethod")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fifo">
                      FIFO (ما يدخل أولاً يخرج أولاً)
                    </SelectItem>
                    <SelectItem value="lifo">
                      LIFO (ما يدخل آخراً يخرج أولاً)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* STEP 3: OWNER DETAILS */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="space-y-2 md:col-span-1 col-span-2">
                <Label htmlFor="prefix">اللقب</Label>
                <Select
                  value={formData.prefix}
                  onValueChange={(val) => handleSelectChange(val, "prefix")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="السيد / السيدة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mr">السيد</SelectItem>
                    <SelectItem value="mrs">السيدة</SelectItem>
                    <SelectItem value="dr">دكتور</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">
                  الاسم الأول <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  الاسم الأخير <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">
                  اسم المستخدم <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="يستخدم في تسجيل الدخول"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  كلمة المرور <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">
                  تأكيد كلمة المرور <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-span-2 pt-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={(c) => handleCheckboxChange(c as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    أوافق على{" "}
                    <Link href="#" className="text-primary underline">
                      الشروط والأحكام
                    </Link>
                  </label>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-gray-50/50">
          <div className="w-full flex justify-between gap-4">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={loading}
                className="w-32"
              >
                <ArrowRight className="ml-2 w-4 h-4" />
                السابق
              </Button>
            ) : (
              <div /> /* Spacer */
            )}

            {step < 3 ? (
              <Button
                onClick={nextStep}
                className="w-32 bg-primary hover:bg-primary/90 text-white shadow-md transition-transform active:scale-95"
              >
                التالي
                <ArrowLeft className="mr-2 w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleRegister}
                className="w-40 bg-green-600 hover:bg-green-700 text-white shadow-md transition-transform active:scale-95"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4 ml-2" />
                ) : null}
                تسجيل النشاط
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center text-sm text-gray-500">
        لديك حساب بالفعل؟{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          تسجيل الدخول
        </Link>
      </div>
    </div>
  );
}
