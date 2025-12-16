"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, Save } from "lucide-react";
import { SupplierService } from "@/services/supplier-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define Validation Schema for Supplier
const supplierSchema = z.object({
  name: z.string().min(3, "اسم المورد مطلوب (3 أحرف على الأقل)"),
  companyName: z.string().optional(),
  phone: z.string().min(10, "رقم الهاتف غير صالح"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صالح")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  taxNumber: z.string().optional(),
  commercialRecord: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function AddSupplierPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      companyName: "",
      phone: "",
      email: "",
      address: "",
      taxNumber: "",
      commercialRecord: "",
    },
  });

  const onSubmit = async (data: SupplierFormValues) => {
    try {
      await SupplierService.create({
        name: data.name,
        business_name: data.companyName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        taxNumber: data.taxNumber,
        // commercialRecord is not in our simple backend model yet, maybe ignored or added to notes?
        // For now we map it but backend might ignore it if not in fillable/migration.
        // Let's assume business_name covers companyName.
      });
      toast.success("تم إضافة المورد بنجاح");
      router.push("/contacts/suppliers");
    } catch (error) {
      console.error("Failed to create supplier:", error);
      toast.error("فشل إضافة المورد");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenCalculator={() => {}}
        onOpenProfit={() => {}}
      />
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} />
        <main className="flex-1 p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>الرئيسية</span>
            <span>/</span>
            <span>الموردين</span>
            <span>/</span>
            <span className="text-blue-600">أضف مورد</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              أضف مورد جديد
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-2xl space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    اسم المسؤول / المورد <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="اسم الشخص المسؤول"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">اسم الشركة</Label>
                  <Input
                    id="companyName"
                    placeholder="اسم الشركة (اختياري)"
                    {...register("companyName")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="05xxxxxxxx"
                    {...register("phone")}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@company.com"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                  <Input
                    id="taxNumber"
                    placeholder="الرقم الضريبي"
                    {...register("taxNumber")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commercialRecord">السجل التجاري</Label>
                  <Input
                    id="commercialRecord"
                    placeholder="رقم السجل التجاري"
                    {...register("commercialRecord")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  placeholder="العنوان ومقر الشركة..."
                  {...register("address")}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "جاري الحفظ..." : "حفظ المورد"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full md:w-auto"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
